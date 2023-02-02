import bcrypt, { hash } from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed_password"))
  }
}))

describe("Bcrypt Adapter", () => {
  it("Should call bcrypt with correct value", async () => {
    // given
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    // when
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt("valid_password");

    // then
    expect(hashSpy).toHaveBeenCalledWith("valid_password", salt)
  })

  it("Should return a hash on success", async () => {
    // given
    const salt = 12;
    const sut = new BcryptAdapter(salt);

    // when
    const hash = await sut.encrypt("valid_password");

    // then
    expect(hash).toBe("hashed_password")
  })
})