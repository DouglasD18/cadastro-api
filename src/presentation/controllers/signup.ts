import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols';
import { badRequest, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from "../errors";
import { AddAccount } from '@/domain/useCases/add-account';

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

      this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError();
    }
  }
}
