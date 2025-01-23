type CreateFigCollectionDto = {
  name: string;
}

type UpdateFigCollectionDto = {
  name?: string;
  prompt?: string;
}

type CreateFigCollectionFileDto = {
  title: string;
  base64: string;
}

export { CreateFigCollectionDto, UpdateFigCollectionDto, CreateFigCollectionFileDto };