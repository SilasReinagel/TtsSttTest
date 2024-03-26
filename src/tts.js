// @ts-check
import { createClient } from "@deepgram/sdk";
import fs from "fs";

export const textToSpeech = async (filePath) => {
  // STEP 1: Create a Deepgram client using the API key
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

  // STEP 2: Call the transcribeFile method with the audio payload and options
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync(filePath),
    {
      model: "nova-2",
      smart_format: true,
    }
  );

  if (error) 
    throw error;
  return result.results.channels[0].alternatives[0].transcript
};

export default textToSpeech
