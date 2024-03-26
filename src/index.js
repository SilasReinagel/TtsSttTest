// @ts-check
import convertWavToMp3 from './convertToMp3.js';
import { getWebResearch } from './getWebResearch.js';
import startKeyListener from './keyListenerApp.js';
import { getCompletionMessageContent } from './openai.js';
import playStt from './playStt.js';
import { AudioFileRecorder } from './recordAudio.js';
import textToSpeech from './tts.js';
import fs from 'fs';

const recorder = new AudioFileRecorder('./_output/audio/');
const modes = ['athena', 'apollo']
let selectedMode = 'apollo';

if (!process.env.DEEPGRAM_API_KEY) {
  console.error('DEEPGRAM_API_KEY is not set. Please set it in your environment variables.');
  process.exit(1);
}

let isRecording = false;
startKeyListener(key => {
  if (isRecording) {
    const recordingStoppedTime = Date.now();
    console.log('Stopping recording...');
    const filePath = recorder.stop();
    isRecording = false;
    if (!filePath) return;
    
    const mp3FilePath = filePath.replace(/\.wav$/, '.mp3');
    console.log({ filePath, mp3FilePath })
    const transcriptionFilePath = `./_output/transcription/${filePath.split('/').at(-1)}.json`;
    convertWavToMp3(filePath, mp3FilePath).then(() => {
      console.log(`${Date.now() - recordingStoppedTime}ms - Recording Stopped. Transcribing audio...`);
      textToSpeech(mp3FilePath)
        .then(transcriptionResult => {
          console.log(`Transcription ${Date.now() - recordingStoppedTime}ms:`, transcriptionResult);
          fs.writeFile(transcriptionFilePath, JSON.stringify(transcriptionResult, null, 2), err => {
            if (err) {
              console.error('Error writing transcription to file:', err);
            } else {
              console.log('Transcription saved to ./_output/transcriptions/transcription.txt');
            }
          });
        modes.forEach(mode => {
          if (transcriptionResult.toLowerCase().includes(mode)) {
            selectedMode = mode;
          }
        });
        console.log({ selectedMode })

        const sttFilePath = mp3FilePath.replace(/\.mp3$/, '.response.mp3');
        if (selectedMode === 'athena') {
          console.log(`Starting web research on... ${transcriptionResult}`);
          getWebResearch(transcriptionResult)
            .then(data => {
              console.log(`${Date.now() - recordingStoppedTime}ms -Athena - Finished web research: `, { data });
              playStt(data.answer, sttFilePath)
              
            })
        } else if (selectedMode === 'apollo') {
          console.log(`Starting llm thoughts on... ${transcriptionResult}`);
          getCompletionMessageContent([
            {
              role: 'system',
              content: 'You are a helpful assistant, a wise old english man by the name of Apollo. Keep your answer brief! No explanations. Chat exclusively as Apollo. Provide creative, intelligent, coherent, and descriptive answers.',
            },
            {
              role: 'user',
              content: transcriptionResult,
            }
          ])
            .then(data => {
              console.log(`${Date.now() - recordingStoppedTime}ms - Apollo - Finished thinking`, { data });
              playStt(data, sttFilePath, { model: 'aura-helios-en' })
            }).catch(err => {
              console.error('Error during completion:', err);
            })
        } else {
          playStt('I don\'t understand your instruction. Please choose echo, athena, or apollo and try again', sttFilePath)
        }
      }).catch(err => {
        console.error('Error during transcription:', err);
      });
    }).catch(err => {
      console.error('Error during conversion:', err);
    });
  } else if (key.toLowerCase() === 't') {
    console.log('Starting recording...');
    recorder.start();
    isRecording = true;

    console.log('Press any key to stop recording...');
  }
})
console.log('Press "T" to start recording. Press "Ctrl+C" to exit.');

process.on('SIGINT', () => {
  console.log('Exiting...');
  process.exit();
});
