import { SignUpController } from "./signup";
import { AccountModel, AddAccount, AddAccountModel, EmailValidator } from "./signup-protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../../errors";

interface ControllerTypes {
  controller: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid@mail.com",
        password: "valid_password"
      }

      return fakeAccount;
    }
  }

  return new AddAccountStub();
}

const makeController = (): ControllerTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const controller = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    controller,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  })

  it('Should return 400 if no email is provided.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  })

  it('Should return 400 if no password is provided.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  })

  it('Should return 400 if no passwordConfirmation is provided.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
      }
    }

    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  })

  it('Should return 400 if no passwordConfirmation fails.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "password"
      }
    }

    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
  })

  it('Should return 400 if invalid email is provided.', () => {
    // given
    const { controller, emailValidatorStub } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  })

  it('Should call EmailValidator with correct email.', () => {
    // given
    const { controller, emailValidatorStub } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    controller.handle(httpRequest);

    // then
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  })

  it('Should return 500 if EmailValidator throws', () => {
    // given
    const { controller, emailValidatorStub } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    })
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  it('Should call AddAccount with correct values.', () => {
    // given
    const { controller, addAccountStub } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    const addSpy = jest.spyOn(addAccountStub, "add");
    controller.handle(httpRequest);

    // then
    expect(addSpy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "doe@mail.com",
      password: "my_password"
    });
  })

  it('Should return 500 if AddAccount throws', () => {
    // given
    const { controller, addAccountStub } = makeController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    })
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })

  it('Should return 200 if valid values is provided.', () => {
    // given
    const { controller } = makeController();
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      }
    }
    
    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
        email: "valid@mail.com",
        password: "valid_password"
    });
  })
})
