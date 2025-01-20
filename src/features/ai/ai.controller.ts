
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import { Request, Response } from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ApiError } from '@/src/lib/utils/apiError';


interface FormGenerationDto {
  submission: Record<string, any>
  formPrompt: string
  documentText: string

}

const SYSTEM_PROMPT = `
You are an expert at following instructions and providing personalized, concise responses in markdown. 
Always respond with clear and user-friendly formatting, and ensure output remains detailed and valuable to end users.
You will be evaluating form submission values and responding according to user submitted prompt
`

const generate = async (req: Request, res: Response) => {
  const formGenerationBody = req.body as FormGenerationDto;

  const model = new ChatOpenAI({ model: "gpt-4o" });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    ["user", `
      Here are some additional prompt instructions: {formPrompt}
      Here are the form submission values: {submission}
      Here is additional prompt text extracted from a file (if any): {documentText}
      `],
  ]);


  const promptValue = await promptTemplate.invoke(
    {
      submission: formGenerationBody.submission,
      formPrompt: formGenerationBody.formPrompt,
      documentText: formGenerationBody.documentText
    }
  );

  try {
    const response = await model.invoke(promptValue)

    res.status(STATUS_CODES.OK).json({
      generative_response: response.content
    });

  } catch (error) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, error.message)
  }
}

export const aiController = {
  generate: asyncWrapper(generate)
}

