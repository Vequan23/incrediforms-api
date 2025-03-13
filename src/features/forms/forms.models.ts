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
  webhook_url?: string;
  theme_color?: string;
  page_color?: string;
  submit_button_color?: string;
  submit_button_text_color?: string;
}

interface UpdateFormResponse {
  id: string;
  name: string;
  description: string;
  prompt: string;
  file: string;
  webhook_url: string;
}

interface CreatePromptFileDto {
  title: string;
  base64_content: string;
}



export { CreateFormDto, CreateFormResponse, UpdateFormDto, UpdateFormResponse, CreatePromptFileDto };
