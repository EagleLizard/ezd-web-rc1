import { EzdError } from './ezd-error';
import { ezdErrorCodes } from './ezd-error-codes';

export class ResponseError extends EzdError {
  resp: Response;
  constructor(resp: Response, message?: string, options?: ErrorOptions) {
    super(message, ezdErrorCodes.response_error, options);
    this.name = 'ResponseError';
    Object.setPrototypeOf(this, ResponseError.prototype);
    this.resp = resp;
    this.message = `${this.code}: ${this.resp.status} ${this.resp.statusText}`;
    if(message !== undefined) {
      this.message = `${this.message} - ${message}`;
    }
  }
}
