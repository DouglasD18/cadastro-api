import { Encrypter } from "@/data/protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
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

  it("Should throw if Encrypter throws", async () => {
    // given
    const { sut, encrypterStub } = makeSut();
    
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password"
    }

    // when
    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(new Promise((_r, reject) => reject(new Error())));
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  })
})