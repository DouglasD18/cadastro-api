import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols';
import { badRequest, serverError, ok } from '../../helpers/http-helper';
import { MissingParamError, InvalidParamError } from "../../errors";

export class SignUpController implements Controller {
  constructor(private emailValidator: EmailValidator, private addAccount: AddAccount) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredsFields = ["name", "email", "password", "passwordConfirmation"]
      for (const field of requiredsFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"))
      }

      const account = this.addAccount.add({ name, email, password });

      return ok(account);
    } catch (error) {
      return serverError();
    }
  }
}
