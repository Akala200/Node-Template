import crypto from 'crypto';

export default (decryptString) => {
  const hasher = crypto.createHash('md5');
  hasher.update(decryptString, 'hex');
  decryptString = hasher.digest('utf-8');
  return decryptString;
};
