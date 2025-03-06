import { Submission } from './../../../../node_modules/.prisma/client/index.d';
import prisma from "@/src/lib/services/db";
const cron = require('node-cron');
import { Resend } from 'resend';
import submissionsService from "../submissions/submissions.service";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SCHEDULED_REPORT_SYSTEM_PROMPT } from './scheduled-reports.prompts';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CreateScheduledReportRequest {
  form_id: string;
  prompt: string;
  email_address: string;
  name: string;
  frequency: Frequency;
  date_range: DateRange;
}

interface ScheduledReport {
  form_id: string;
  prompt: string;
  cron_expression: string;
  user_id: string;
  email_address: string;
  name: string;
  frequency: string;
  date_range: string;
}

enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  EVERY_2_MINUTES = 'every_2_minutes',
}

export enum DateRange {
  LAST_24_HOURS = 'last_24_hours',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
}

const getCronExpression = (frequency: Frequency) => {
  switch (frequency) {
    case Frequency.DAILY:
      return '0 0 * * *';
    case Frequency.WEEKLY:
      return '0 8 * * 1';
    case Frequency.MONTHLY:
      return '0 8 1 * *';
    case Frequency.EVERY_2_MINUTES:
      return '*/2 * * * *';
  }
}

const createScheduledReport = async (scheduledReport: CreateScheduledReportRequest, user_id: string) => {
  const dataToInsert: ScheduledReport = {
    ...scheduledReport,
    cron_expression: getCronExpression(Frequency.EVERY_2_MINUTES),
    user_id: user_id,
  }

  const createdScheduledReport = await prisma.scheduledReport.create({
    data: dataToInsert,
  });

  addScheduledReportToCron(createdScheduledReport);
  return createdScheduledReport;
};

const getReportByFormId = async (formId: string, user_id: string) => {
  const scheduledReport = await prisma.scheduledReport.findFirst({
    where: { form_id: formId, user_id: user_id },
  });
  return scheduledReport;
};

const getAllScheduledReports = async () => {
  const scheduledReports = await prisma.scheduledReport.findMany();
  return scheduledReports;
};

const sendScheduledReport = async (scheduledReport: ScheduledReport) => {
  try {
    console.log('Sending scheduled report');

    const dateRange = scheduledReport.date_range as DateRange;
    const prompt = scheduledReport.prompt;
    const formId = scheduledReport.form_id;

    const submissionsToSend = await submissionsService.listSubmissions(formId, dateRange);

    const response = await sendReportPromptToLLM(prompt, submissionsToSend);

    await resend.emails.send({
      from: 'reports@incrediforms.com',
      to: [scheduledReport.email_address],
      subject: `IncrediForms Report - ${scheduledReport.name}`,
      html: response.content as string
    });

    console.log('Scheduled report sent', {
      LLM_RESPONSE: response.content as string
    });
  } catch (error) {
    console.error('Error sending scheduled report:', {
      error,
      scheduledReport: {
        id: scheduledReport.form_id,
        name: scheduledReport.name,
        email: scheduledReport.email_address
      }
    });
  }
};

const addAllScheduledReportsToCron = async () => {
  const scheduledReports = await getAllScheduledReports();

  scheduledReports.forEach((scheduledReport) => {
    const cronExpression = scheduledReport.cron_expression;
    cron.schedule(cronExpression, async () => {
      await sendScheduledReport(scheduledReport);
    });
  });
};

const addScheduledReportToCron = async (scheduledReport: ScheduledReport) => {
  const cronExpression = scheduledReport.cron_expression;
  cron.schedule(cronExpression, async () => {
    await sendScheduledReport(scheduledReport);
  });
}

const sendReportPromptToLLM = async (prompt: string, submissions: Submission[]) => {
  const openai = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", SCHEDULED_REPORT_SYSTEM_PROMPT],
    ["user", `
      Here are the submissions: {submissions}
      Here is the user prompt: {prompt}
      `],
  ]);


  const promptValue = await promptTemplate.invoke({
    submissions: submissions,
    prompt: prompt
  });


  const response = await openai.invoke(promptValue);
  return response;
}


export const scheduledReportsService = {
  createScheduledReport,
  getReportByFormId,
  getAllScheduledReports,
  addAllScheduledReportsToCron,
};
