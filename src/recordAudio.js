// @ts-check
import fs from 'fs';
import mic from 'mic';

export class AudioFileRecorder {
  constructor(fileDir) {
    this.fileDir = fileDir;
    this.micInstance = null;
    this.micInputStream = null;
  }

  start() {
    const timeStamp = new Date().toISOString().replace(/:/g, '_').replace(/\./g, '_');
    this.filePath = `${this.fileDir}/${timeStamp}.wav`;
    this.micInstance = mic({
      rate: '44100',
      channels: '2',
      debug: false,
      fileType: 'wav',
    });
    this.micInputStream = this.micInstance.getAudioStream();
    const outputFileStream = fs.createWriteStream(this.filePath);
    this.micInputStream.pipe(outputFileStream);
    this.micInstance.start();
    console.log('Recording started');
  }

  stop() {
    if (this.micInstance) {
      this.micInstance.stop();
      console.log('Recording stopped and saved to ' + this.filePath);
      return this.filePath
    } else {
      console.log('Recording has not been started');
      throw new Error('Recording has not been started');
    }
  }
}
