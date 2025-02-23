import CryptoJS from "crypto-js";

export const encrypt = async (data, secret) => {
    const encryptedData = CryptoJS.AES.encrypt(data, secret).toString();
    return encryptedData;
}


export const decrypt = async (data, secret) => {
    const decryptedData = CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
    return decryptedData;
}