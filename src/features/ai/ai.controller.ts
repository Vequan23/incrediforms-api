import { STATUS_CODES } from '@/src/lib/constants/statusCodes.constants';
import { asyncWrapper } from '@/src/lib/utils/asyncWrapper';
import { Response } from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ApiError } from '@/src/lib/utils/apiError';
import { RequestWithApiKey } from '@/src/lib/models/models';
import figCollectionsService from '../fig-collections/figCollections.service';

interface FormGenerationDto {
  submission: Record<string, any>
  fig_collection_id: string
  stream?: boolean
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

const generate = async (req: RequestWithApiKey, res: Response) => {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
  const formGenerationBody = req.body as FormGenerationDto;
  const stream = formGenerationBody.stream;
  const collectionId = formGenerationBody.fig_collection_id;
  const collection = await figCollectionsService.getCollectionById(collectionId);

  if (!collection) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Fig collection not found');
  }

  if (stream) {
    // Set proper headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  }

  const model = new ChatOpenAI({
    streaming: stream,
    model: "deepseek-chat",
    configuration: {
      apiKey: DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    },
    callbacks: [{
      handleLLMNewToken(token: string) {
        if (stream) {
          res.write(`data: ${JSON.stringify({ token })}\n\n`);
        }
      },
    }],
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    ["user", `
      Here are some additional prompt instructions: {collection_prompt}
      Here are the form submission values: {submission}
      Here is additional prompt text extracted from a file (if any): {extracted_document_text}
      `],
  ]);

  const promptValue = await promptTemplate.invoke({
    submission: formGenerationBody.submission,
    collection_prompt: collection?.prompt,
    extracted_document_text: collection?.fig_collection_file?.extracted_text
  });

  try {
    if (stream) {
      await model.invoke(promptValue);
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const response = await model.invoke(promptValue);

      res.status(STATUS_CODES.OK).json({
        model: response.response_metadata.model_name,
        generative_response: response.content,
        usage_metadata: response.usage_metadata
      });
    }
  } catch (error) {
    if (stream) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const aiController = {
  generate: asyncWrapper(generate)
}

