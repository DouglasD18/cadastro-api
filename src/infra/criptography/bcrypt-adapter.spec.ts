import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock("bcrypt", () => ({
  async hash(_value: any): Promise<string> {
    return new Promise(resolve => resolve("hashed_password"))
  }
}))

const salt = 12;

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    // given
    const sut = makeSut();

    // when
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt("valid_password");

    // then
    expect(hashSpy).toHaveBeenCalledWith("valid_password", salt)
  })

  it("Should return a hash on success", async () => {
    // given
    const sut = makeSut();

    // when
    const hash = await sut.encrypt("valid_password");

    // then
    expect(hash).toBe("hashed_password")
  })
})