// @ts-check
import convertWavToMp3 from './convertToMp3.js';
import startKeyListener from './keyListenerApp.js';
import { AudioFileRecorder } from './recordAudio.js';
import textToSpeech from './tts.js';
import fs from 'fs';

const recorder = new AudioFileRecorder('./_output/audio/');
let isRecording = false;
startKeyListener(key => {
  if (isRecording) {
      console.log('Stopping recording...');
      const filePath = recorder.stop();
      isRecording = false;
      if (!filePath) return;
      
      //const opusFilePath = filePath.replace(/\.wav$/, '.opus');
      const mp3FilePath = filePath.replace(/\.wav$/, '.mp3');
      console.log({ filePath, mp3FilePath })
      const transcriptionFilePath = `./_output/transcription/${filePath.split('/').at(-1)}.json`;
      //convertWavToOpus(filePath, opusFilePath);
      convertWavToMp3(filePath, mp3FilePath).then(() => {
        console.log('Recording stopped. Transcribing audio...');
        textToSpeech(mp3FilePath).then(transcriptionResult => {
          console.log('Transcription:', transcriptionResult);
          fs.writeFile(transcriptionFilePath, JSON.stringify(transcriptionResult, null, 2), err => {
            if (err) {
              console.error('Error writing transcription to file:', err);
            } else {
              console.log('Transcription saved to ./_output/transcriptions/transcription.txt');
            }
          });
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
