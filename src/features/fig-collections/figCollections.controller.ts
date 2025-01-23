
import { Response } from 'express';
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { RequestWithUser } from '@/src/lib/models/models';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import figCollectionsService from './figCollections.service';


const createFigCollection = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const figCollection = await figCollectionsService.createFigCollection(userId, req.body);

  res.status(STATUS_CODES.OK).json(figCollection);
};

const listFigCollections = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const figCollections = await figCollectionsService.listFigCollections(userId);

  res.status(STATUS_CODES.OK).json(figCollections);
};

const deleteFigCollection = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const figCollection = await figCollectionsService.deleteFigCollection(userId, req.params.id);

  res.status(STATUS_CODES.OK).json(figCollection);
};

const updateFigCollection = async (req: RequestWithUser, res: Response) => {
  const userId = req.user!.id;
  const figCollection = await figCollectionsService.updateFigCollection(userId, req.params.id, req.body);
  res.status(STATUS_CODES.OK).json(figCollection);
};

const createFigCollectionFile = async (req: RequestWithUser, res: Response) => {
  const figCollectionFile = await figCollectionsService.createFigCollectionFile(req.params.id, req.body);
  res.status(STATUS_CODES.OK).json(figCollectionFile);
};

const deleteFigCollectionFile = async (req: RequestWithUser, res: Response) => {
  const figCollectionFile = await figCollectionsService.deleteFigCollectionFile(req.params.id, req.params.fileId);
  res.status(STATUS_CODES.OK).json(figCollectionFile);
};


export const figCollectionsController = {
  create: asyncWrapper(createFigCollection),
  list: asyncWrapper(listFigCollections),
  delete: asyncWrapper(deleteFigCollection),
  update: asyncWrapper(updateFigCollection),
  createFile: asyncWrapper(createFigCollectionFile),
  deleteFile: asyncWrapper(deleteFigCollectionFile)
}

