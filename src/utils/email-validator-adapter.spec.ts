import { EmailValidatorAdapter } from "./email-validator";

describe("EmailValidator Adapter", () => {
  it("Should return false if validator return false", () => {
    // given
    const sut = new EmailValidatorAdapter();

    // when
    const isValid = sut.isValid("invalid_email@mail.com");

    // then
    expect(isValid).toBe(false);
  })
});