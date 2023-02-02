import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from "./db-add-account-protocols";


export class DbAddAccount implements AddAccount {
  constructor(
    private encrypter: Encrypter,
    private addAccountRepository: AddAccountRepository
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassord = await this.encrypter.encrypt(accountData.password)
    console.log(Object.assign({}, accountData, { password: hashedPassord }));
    
    const account = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassord })
    );

    return account;
  }
}