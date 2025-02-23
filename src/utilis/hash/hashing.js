import bcrypt from "bcrypt";

export const hash = async ({plainText, salt})=> {
  return await bcrypt.hash(plainText, salt);
}


export const compare = async ({plainText, hashPassword})=> {
  return await bcrypt.compare(plainText, hashPassword);
}