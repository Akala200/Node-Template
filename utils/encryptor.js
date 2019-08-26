import crypto from 'crypto';

export default (encryptString, type) => {
  const hasher = crypto.createHash(type);
  hasher.update(encryptString, 'utf-8');
  encryptString = hasher.digest('hex');
  return encryptString;
};
