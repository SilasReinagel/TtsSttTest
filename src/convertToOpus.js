// @ts-check
import ffmpeg from 'fluent-ffmpeg';

export const convertWavToOpus = (inputFilePath, outputFilePath) => {
  ffmpeg(inputFilePath)
    .output(outputFilePath)
    .audioCodec('libopus')
    .on('end', function() {
      console.log('Conversion finished: ', outputFilePath);
    })
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .run();
};

export default convertWavToOpus;
