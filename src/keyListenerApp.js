// @ts-check
import readline from 'readline';

export const startKeyListener = (onKeyPressed) => {
  // Set stdin to raw mode
  process.stdin.setRawMode(true);
  // Resume stdin in the paused state
  process.stdin.resume();
  // Set encoding
  process.stdin.setEncoding('utf8');

  console.log('Press any key or CTRL+C to exit.');

  process.stdin.on('data', (key) => {
    // Convert the key to a string and check for special characters
    const strKey = key.toString();

    if (strKey === '\u0003') { // This is the unicode for CTRL+C
      process.exit(); // Exit the program
    } else {
      onKeyPressed(strKey);
    }
  });

  // To prevent the program from closing instantly, keep the process running
  // until it is killed with CTRL+C
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
}

export default startKeyListener;
