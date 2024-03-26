// @ts-check
import ffmpeg from 'fluent-ffmpeg';
import waitForFile from './waitForFile.js';

/**
 * Converts a WAV file to MP3 format using ffmpeg.
 * @param {string} inputFilePath - The path to the input WAV file.
 * @param {string} outputFilePath - The path where the output MP3 file will be saved.
 * @returns {Promise<void>} - A Promise that resolves when the file is ready.
 */
export const convertWavToMp3 = (inputFilePath, outputFilePath) => {
  ffmpeg(inputFilePath)
    .output(outputFilePath)
    .audioCodec('libmp3lame')
    .on('end', function() {
      console.log('Conversion to MP3 finished: ', outputFilePath);
    })
    .on('error', function(err) {
      console.log('An error occurred during the conversion to MP3: ' + err.message);
    })
    .run();

  return waitForFile(outputFilePath);
};

export default convertWavToMp3;
