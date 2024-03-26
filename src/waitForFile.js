// @ts-check
import fs from 'fs';

export const waitForFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const checkFile = () => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // File does not exist yet, wait and try again
            setTimeout(checkFile, 100);
          } else {
            // Some other error occurred
            reject(err);
          }
        } else if (stats.size > 0) {
          // File exists and has content
          resolve(undefined);
        } else {
          // File exists but is empty, wait and try again
          setTimeout(checkFile, 100);
        }
      });
    };
    checkFile();
  });
};

export default waitForFile;
