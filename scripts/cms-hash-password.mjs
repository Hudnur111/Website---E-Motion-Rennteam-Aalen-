import crypto from 'node:crypto';

if (process.argv.length < 3) {
  console.error('Usage: node cms-hash-password.mjs <password>');
  process.exit(1);
}

const password = process.argv[2];

// Simple PBKDF2 hash (compatible with Node.js built-in)
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
const result = `${salt}:${hash}`;

console.log(result);
