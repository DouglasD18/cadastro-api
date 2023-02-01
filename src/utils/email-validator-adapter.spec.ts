import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  }
}))

describe("EmailValidator Adapter", () => {
  it("Should return false if validator return false", () => {
    // given
    const sut = new EmailValidatorAdapter();

    // when
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@mail.com");

    // then
    expect(isValid).toBe(false);
  })

  it("Should return true if validator return true", () => {
    // given
    const sut = new EmailValidatorAdapter();

    // when
    const isValid = sut.isValid("invalid_email@mail.com");

    // then
    expect(isValid).toBe(true);
  })

  it("Should call validator with correct email", () => {
    // given
    const sut = new EmailValidatorAdapter();

    // when
    const emailSpy = jest.spyOn(validator, "isEmail")
    sut.isValid("invalid_email@mail.com");

    // then
    expect(emailSpy).toHaveBeenCalledWith("invalid_email@mail.com");
  })
});