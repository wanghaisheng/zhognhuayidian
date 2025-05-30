const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Path to the key file
const keyFilePath = path.resolve(__dirname, 'indexnow_key.txt');
console.log(__dirname); // Check where the script is running

// Function to generate a 32-byte hexadecimal key
const generateHexKey = () => {
  return crypto.randomBytes(16).toString('hex'); // 16 bytes = 32 hex chars
};

// Check if the key file exists
if (!fs.existsSync(keyFilePath)) {
  // If the file does not exist, generate a new key
  const newKey = generateHexKey();

  // Save the generated key to the file
  fs.writeFileSync(keyFilePath, newKey, 'utf8');

  console.log('Generated and saved new key:', newKey);
} else {
  // If the file exists, read the key from the file
  const savedKey = fs.readFileSync(keyFilePath, 'utf8');
  console.log('Using saved key:', savedKey);
}
console.log(`Key will be saved to: ${keyFilePath}`);


