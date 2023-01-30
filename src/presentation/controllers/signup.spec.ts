import { SignUpController } from "./signup";

describe('SignUp Controller', () => {
  it('Should return 400 if no name is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      bode: {
        email: "doe@mail.com",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  })

  it('Should return 400 if no name is provided.', () => {
    // given
    const signUpController = new SignUpController();
    const httpRequest = {
      bode: {
        name: "John Doe",
        password: "my_password",
        passwordConfirmation: "my_password"
      }
    }

    // when
    const httpResponse = signUpController.handle(httpRequest);

    // then
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: email'));
  })
})
