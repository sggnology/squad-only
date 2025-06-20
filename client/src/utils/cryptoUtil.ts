import CryptoJS from 'crypto-js';
import axiosInstance from './axiosInstance';

// 공개키 응답 타입
interface PublicKeyResponse {
  publicKey: string;
}

// RSA 공개키로 비밀번호 암호화
export const encryptPassword = async (password: string, publicKey: string): Promise<string> => {
  try {
    // JSEncrypt 라이브러리를 사용한 RSA 암호화
    const JSEncrypt = (await import('jsencrypt')).JSEncrypt;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    
    const encrypted = encrypt.encrypt(password);
    if (!encrypted) {
      throw new Error('암호화 실패');
    }
    
    return encrypted;
  } catch (error) {
    console.error('비밀번호 암호화 중 오류:', error);
    throw new Error('비밀번호 암호화에 실패했습니다.');
  }
};

// AES 대칭키 암호화 (대안)
export const encryptPasswordAES = (password: string, secretKey: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();
    return encrypted;
  } catch (error) {
    console.error('AES 암호화 중 오류:', error);
    throw new Error('비밀번호 암호화에 실패했습니다.');
  }
};

// 서버에서 공개키 가져오기
export const fetchPublicKey = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get<PublicKeyResponse>('/auth/public-key');
    return response.data.publicKey;
  } catch (error) {
    console.error('공개키 조회 중 오류:', error);
    throw new Error('공개키를 가져올 수 없습니다.');
  }
};
