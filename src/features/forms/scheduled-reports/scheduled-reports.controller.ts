import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import { scheduledReportsService } from "./scheduled-reports.service";
import { Response } from 'express';
import { RequestWithUser } from '@/src/lib/models/models';

const createScheduledReport = async (req: RequestWithUser, res: Response) => {
  const scheduledReport = await scheduledReportsService.createScheduledReport(req.body, req.user?.id!);
  res.status(201).json(scheduledReport);
};

const getReportByFormId = async (req: RequestWithUser, res: Response) => {
  const { form_id } = req.params;
  const scheduledReport = await scheduledReportsService.getReportByFormId(form_id, req.user?.id!);
  res.status(200).json(scheduledReport);
};

export default {
  createScheduledReport: asyncWrapper(createScheduledReport),
  getReportByFormId: asyncWrapper(getReportByFormId),
};
