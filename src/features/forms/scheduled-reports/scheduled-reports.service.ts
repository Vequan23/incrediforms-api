import { Submission } from './../../../../node_modules/.prisma/client/index.d';
import prisma from "@/src/lib/services/db";
const cron = require('node-cron');
import { Resend } from 'resend';
import submissionsService from "../submissions/submissions.service";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SCHEDULED_REPORT_SYSTEM_PROMPT } from './scheduled-reports.prompts';

const resend = new Resend(process.env.RESEND_API_KEY);
const scheduledTasks = new Map<string, any>();

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
      return '0 8 * * *'; // 8am every day
    case Frequency.WEEKLY:
      return '0 8 * * 1'; // 8am every Monday
    case Frequency.MONTHLY:
      return '0 8 1 * *'; // 8am on the first day of every month
    case Frequency.EVERY_2_MINUTES:
      return '*/2 * * * *'; // every 2 minutes
  }
}

const createScheduledReport = async (scheduledReport: CreateScheduledReportRequest, user_id: string) => {
  const dataToInsert: ScheduledReport = {
    ...scheduledReport,
    cron_expression: getCronExpression(scheduledReport.frequency),
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

    const fromEmail = process.env.NODE_ENV === 'production'
      ? 'reports@incrediforms.com'
      : 'reports@resend.dev';

    await resend.emails.send({
      from: fromEmail,
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
    const task = cron.schedule(cronExpression, async () => {
      await sendScheduledReport(scheduledReport);
    });
    scheduledTasks.set(scheduledReport.form_id, task);
  });
};

const addScheduledReportToCron = async (scheduledReport: ScheduledReport) => {
  const cronExpression = scheduledReport.cron_expression;
  const task = cron.schedule(cronExpression, async () => {
    await sendScheduledReport(scheduledReport);
  });
  scheduledTasks.set(scheduledReport.form_id, task);
}


const removeScheduledReportFromCron = async (scheduledReport: ScheduledReport) => {
  const task = scheduledTasks.get(scheduledReport.form_id);
  if (task) {
    task.stop();
    scheduledTasks.delete(scheduledReport.form_id);
  }
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

const deleteScheduledReport = async (form_id: string,) => {
  const deletedScheduledReport = await prisma.scheduledReport.delete({
    where: { form_id },
  });

  removeScheduledReportFromCron(deletedScheduledReport);

  return deletedScheduledReport;
}

const resetAllCronJobs = async () => {
  console.log('Stopping all cron jobs...');
  const allRunningJobs = cron.getTasks();
  console.log(`Found ${allRunningJobs.size} running jobs`);

  allRunningJobs.forEach((task: any) => {
    task.stop();
  });

  scheduledTasks.clear();
  console.log('All cron jobs stopped');

  console.log('Reinitializing cron jobs from database...');
  await addAllScheduledReportsToCron();
  console.log(`Reinitialized with ${scheduledTasks.size} jobs`);

  return {
    stoppedJobs: allRunningJobs.size,
    newJobs: scheduledTasks.size
  };
}

export const scheduledReportsService = {
  createScheduledReport,
  getReportByFormId,
  getAllScheduledReports,
  addAllScheduledReportsToCron,
  deleteScheduledReport,
  resetAllCronJobs,
};
