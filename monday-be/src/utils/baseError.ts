export class BaseError extends Error {
    public code: string;
    public statusCode: number;
    public details?: unknown;
  
    constructor(
      message: string,
      code: string,
      statusCode: number,
      details?: unknown
    ) {
      super(message);
  
      Object.setPrototypeOf(this, new.target.prototype); 
  
      this.name = this.constructor.name;
      this.code = code;
      this.statusCode = statusCode;
      this.details = details;
  
      // Maintain proper stack trace (especially useful in transpiled code)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  