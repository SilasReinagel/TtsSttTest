// @ts-check
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY || '' });

/**
 * 
 * @param {OpenAI.Chat.Completions.ChatCompletionMessageParam[]} messages 
 * @param {Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming>} options 
 * @returns {Promise<OpenAI.Chat.Completions.ChatCompletionMessage>}
 */

export const getCompletionMessage = async (messages, options = {}) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: false,
    temperature: 0,
    messages,
    ...options,
  });
  return response.choices[0].message;
}

/**
 * 
 * @param {OpenAI.Chat.Completions.ChatCompletionMessageParam[]} messages 
 * @param {Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming>} options 
 * @returns {Promise<string>}
 */

export const getCompletionMessageContent = async (messages, options = {}) => {
  const msg = await getCompletionMessage(messages, options);
  return msg.content ?? '';
}
