import { Encrypter } from "@/data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): any => {
  class EncrypterStub {
    async encrypt(password: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub
  }
}

describe("DbAddAccount Usecase", () => {
  it("Should call Encrypter with correct password", async () => {
    // given
    const { sut, encrypterStub } = makeSut();
    
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