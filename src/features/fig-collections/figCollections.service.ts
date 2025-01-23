import db from "@/src/lib/services/db";
import { CreateFigCollectionDto, CreateFigCollectionFileDto, UpdateFigCollectionDto } from "./figCollections.types";
import { extractTextFromBase64Pdf } from "../forms/extractTextFromBase64Pdf";
import { STATUS_CODES } from "@/src/lib/constants/statusCodes.constants";
import { ApiError } from "@/src/lib/utils/apiError";

const createFigCollection = async (userId: string, figCollection: CreateFigCollectionDto) => {
  return db.figCollection.create({
    data: { ...figCollection, user_id: userId },
  });
};

const listFigCollections = async (userId: string) => {
  const figCollections = await db.figCollection.findMany({
    where: { user_id: userId },
    include: {
      fig_collection_file: true
    }
  });

  return figCollections.map((figCollection) => {
    return {
      ...figCollection,
      fig_collection_file_id: undefined
    }
  });
};

const getCollectionById = async (figCollectionId: string) => {
  return db.figCollection.findUnique({
    where: { id: figCollectionId },
    include: {
      fig_collection_file: true
    }
  });
};

const deleteFigCollection = async (userId: string, figCollectionId: string) => {
  return db.figCollection.delete({
    where: { id: figCollectionId, user_id: userId },
  });
};

const updateFigCollection = async (userId: string, figCollectionId: string, figCollection: UpdateFigCollectionDto) => {
  return db.figCollection.update({
    where: { id: figCollectionId, user_id: userId },
    data: figCollection,
  });
};

const createFigCollectionFile = async (figCollectionId: string, figCollectionFile: CreateFigCollectionFileDto) => {
  const extractedText = await extractTextFromBase64Pdf(figCollectionFile.base64);

  const dataToInsert = {
    title: figCollectionFile.title,
    fig_collection_id: figCollectionId,
    extracted_text: extractedText
  };

  return db.figCollectionFile.create({
    data: dataToInsert,
  });
};

const deleteFigCollectionFile = async (figCollectionId: string, figCollectionFileId: string) => {
  const deletedFigCollectionFile = await db.figCollectionFile.delete({
    where: { id: figCollectionFileId, fig_collection_id: figCollectionId },
  });

  if (!deletedFigCollectionFile) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Fig collection file not found');
  }

  await db.figCollection.update({
    where: { id: figCollectionId },
    data: {
      fig_collection_file_id: null
    }
  });

  return deletedFigCollectionFile;
};

export default {
  createFigCollection,
  listFigCollections,
  deleteFigCollection,
  updateFigCollection,
  createFigCollectionFile,
  deleteFigCollectionFile,
  getCollectionById
};  