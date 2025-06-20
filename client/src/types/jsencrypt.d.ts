declare module 'jsencrypt' {
  export class JSEncrypt {
    constructor();
    setPublicKey(key: string): void;
    encrypt(text: string): string | false;
  }
}
