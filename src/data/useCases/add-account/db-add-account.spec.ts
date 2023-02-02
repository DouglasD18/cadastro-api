import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols"


interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid@mail.com",
        password: "hashed_password"
      }

      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountRepositoryStub()
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
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
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

  it("Should call AddAccountRepository with correct values", async () => {
    // given
    const { sut, addAccountRepositoryStub } = makeSut();
    
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password"
    }

    // when
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    sut.add(accountData);

    // then
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid@mail.com",
      password: "hashed_password"
    })
  })

  it("Should throw if AddAccountRepository throws", async () => {
    // given
    const { sut, addAccountRepositoryStub } = makeSut();
    
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password"
    }

    // when
    jest.spyOn(addAccountRepositoryStub, "add").mockReturnValueOnce(new Promise((_r, reject) => reject(new Error())));
    const promise = sut.add(accountData);

    // then
    expect(promise).rejects.toThrow();
  })

  it("Should return an account on sucess", async () => {
    // given
    const { sut } = makeSut();
    
    const accountData = {
      name: "valid_name",
      email: "valid@mail.com",
      password: "valid_password"
    }

    // when
    const account = await sut.add(accountData);

    // then
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid@mail.com",
      password: "hashed_password"
    })
  })
})