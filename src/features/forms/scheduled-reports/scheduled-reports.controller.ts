import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import { scheduledReportsService } from "./scheduled-reports.service";
import { Response } from 'express';
import { RequestWithUser } from '@/src/lib/models/models';

const createScheduledReport = async (req: RequestWithUser, res: Response) => {
  const scheduledReport = await scheduledReportsService.createScheduledReport(req.body, req.user?.id!);
  res.status(201).json(scheduledReport);
};

const getReportByFormId = async (req: RequestWithUser, res: Response) => {
  const { id: form_id } = req.params;
  const scheduledReport = await scheduledReportsService.getReportByFormId(form_id, req.user?.id!);
  res.status(200).json(scheduledReport);
};

const deleteScheduledReport = async (req: RequestWithUser, res: Response) => {
  const { id: form_id } = req.params;
  await scheduledReportsService.deleteScheduledReport(form_id);
  res.status(200).json({ message: 'Scheduled report deleted' });
};

const resetAllCronJobs = async (req: RequestWithUser, res: Response) => {
  const result = await scheduledReportsService.resetAllCronJobs();
  res.status(200).json(result);
};

export default {
  createScheduledReport: asyncWrapper(createScheduledReport),
  getReportByFormId: asyncWrapper(getReportByFormId),
  deleteScheduledReport: asyncWrapper(deleteScheduledReport),
  resetAllCronJobs: asyncWrapper(resetAllCronJobs),
};
