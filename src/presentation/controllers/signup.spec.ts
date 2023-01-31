import { SignUpController } from "./signup";
import { EmailValidator } from "../protocols";
import { MissingParamError, InvalidParamError, ServerError } from "../errors";

interface ControllerTypes {
  controller: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }

  return new EmailValidatorStub();
}

const makeController = (): ControllerTypes => {
  const emailValidatorStub = makeEmailValidator();
  const controller = new SignUpController(emailValidatorStub);

  return {
    controller,
    emailValidatorStub
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
    const emailValidatorStub = makeEmailValidatorWithError();
    const controller = new SignUpController(emailValidatorStub);
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }
    
    // when
    const httpResponse = controller.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  })
})
