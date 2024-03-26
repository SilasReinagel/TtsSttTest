// @ts-check
import { createClient } from "@deepgram/sdk";
import fs from "fs";

// STEP 1: Create a Deepgram client with your API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const speechToText = async (text, fileName, options) => {
  // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-athena-en",
      ...options
    }
  );
  // STEP 3: Get the audio stream and headers from the response
  const stream = await response.getStream();

  if (stream) {
    // STEP 4: Convert the stream to an audio buffer
    const buffer = await getAudioBuffer(stream);
    // STEP 5: Write the audio buffer to a file
    fs.writeFile(fileName, buffer, (err) => {
      if (err) {
        console.error("Error writing audio to file:", err);
      } else {
        console.log(`Audio file written to: ${fileName}`);
      }
    });
    return fileName;
  } else {
    console.error("Error generating audio:", stream);
  }
};

const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

export default speechToText;
