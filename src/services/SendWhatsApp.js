
import fs from 'fs';

class SendWhatsApp {
  readFile() {
    
    const fs = require("fs");

    // Calling the readFileSync() method
    // to read 'input.txt' file
    const data = fs.readFileSync("./input.txt", {
      encoding: "utf8",
      flag: "r",
    });

    // Display the file data
    console.log(data);
  }
}

export default SendWhatsApp