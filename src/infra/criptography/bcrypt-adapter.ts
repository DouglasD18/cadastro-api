import { Encrypter } from "@/data/protocols/encrypter";
import bcrypt from 'bcrypt';

export class BcryptAdapter implements Encrypter {
  constructor(private salt: number) {}

  async encrypt(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash;
  }
}