import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols';
import { badRequest, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from "../errors";

export class SignUpController implements Controller {
  constructor(private emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredsFields = ["name", "email", "password", "passwordConfirmation"]
      for (const field of requiredsFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }
    } catch (error) {
      return serverError();
    }
  }
}
