import { DbAddAccount } from "./db-add-account";

describe("DbAddAccount Usecase", () => {
  it("Should call Encrypter with correct password", async () => {
    // given
    class EncrypterStub {
      async encrypt(password: string): Promise<string> {
        return new Promise(resolve => resolve("hashed_password"))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub);
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password"
    }

    // when
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    sut.add(accountData);

    // then
    expect(encryptSpy).toHaveBeenCalledWith("valid_password")
  })
})