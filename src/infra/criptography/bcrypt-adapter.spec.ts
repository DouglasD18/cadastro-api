import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

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
})