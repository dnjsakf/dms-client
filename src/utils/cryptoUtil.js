import crypto from 'crypto';

// 환경변수에서 SECRET_KEY 가져오기
const ALGORITHM = 'aes-256-cbc'; // 'aes-256-cbc';
const KEY_LENGTH = ALGORITHM === 'aes-256-cbc' ? 32 : 16;
const SECRET_KEY = Buffer.from(process.env.NEXT_PUBLIC_SECRET_KEY.padEnd(KEY_LENGTH, ' '));

// 암호화 함수
export const encrypt = ( text ) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// 복호화 함수
export const decrypt = ( encryptedText ) => {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encrypted = textParts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 확인 함수
export const equalsEncrypt = ( plainText, encryptedText ) => {
  const decryptedText = decrypt(encryptedText);
  return ( plainText === decryptedText );
}

const cryptoUtil = {
  encrypt,
  decrypt,
  equalsEncrypt,
}

export default cryptoUtil;
