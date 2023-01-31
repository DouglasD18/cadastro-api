import { SignUpController } from "./signup";
import { MissingParamError } from "../errors/missing-param-error";

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      body: {
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  })

  it('Should return 400 if no email is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      body: {
        name: "John Doe",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  })

  it('Should return 400 if no password is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  })

  it('Should return 400 if no passwordConfirmation is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      body: {
        name: "John Doe",
        email: "doe@mail.com",
        password: "my_password",
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  })
})
