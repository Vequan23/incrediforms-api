
import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import { Request, Response } from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ApiError } from '@/src/lib/utils/apiError';


interface FormGenerationDto {
  submission: Record<string, any>
  form_prompt: string
  document_id: string

}

const SYSTEM_PROMPT = `
[Base Prompt]
I analyze form submissions and provide personalized responses based on the given instructions. All responses will be formatted in Markdown, with:

1. Read and process the submitted form data
2. Follow the provided response instructions carefully, which include:
   - The role I should adopt (e.g., "Act as an expert in...")
   - The specific goal of the response (e.g., "recommend the most suitable plan")
   - Any additional context or information provided
   - The desired tone and style of communication

3. Generate a response that:
   - Uses proper Markdown formatting including:
     * Headers with a single space after #
     * Code blocks with triple backticks when needed
     * Proper line spacing before and after lists
     * Consistent emphasis using asterisks
   - Directly addresses the form submitter
   - References their specific submission details
   - Maintains the specified expertise and perspective
   - Provides relevant, actionable recommendations
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
      form_prompt: formGenerationBody.form_prompt,
      document_id: formGenerationBody.document_id
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

