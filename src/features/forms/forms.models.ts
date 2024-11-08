interface CreateFormDto {
  name: string;
  description: string;
  prompt: string;
  file: string;
}

interface CreateFormResponse {
  id: string;
  name: string;
  description: string;
  prompt: string;
  file: string;
  createdAt: Date;
}

interface UpdateFormDto {
  name?: string;
  description?: string;
  prompt?: string;
  file?: string;
}

interface UpdateFormResponse {
  id: string;
  name: string;
  description: string;
  prompt: string;
  file: string;
}

export { CreateFormDto, CreateFormResponse, UpdateFormDto, UpdateFormResponse };
