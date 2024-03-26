// @ts-check
import playSound from 'play-sound';

const player = playSound();

/**
 * Plays a sound file from the given path.
 * @param {string} filePath - The path to the audio file to play.
 */
export const playAudio = (filePath) => {
  player.play(filePath, function(err) {
    if (err) {
      console.error('Error playing sound:', err);
      return;
    }
    console.log('Sound playback successful.');
  });
}

export default playAudio;

