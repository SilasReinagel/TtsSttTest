// @ts-check
import playAudio from "./playAudio.js";
import speechToText from "./stt.js";

export const playStt = (text, filePath, options) => {
  console.log('playStt', { text, filePath, options });
  speechToText(text, filePath, options)
    .then(filePath => {
      console.log('Playing AI Speech', { filePath });
      playAudio(filePath);
    }).catch(err => {
      console.error('Error during STT:', err);
    })
}

export default playStt;
