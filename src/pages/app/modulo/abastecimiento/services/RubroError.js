export class RubroError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "RubroError";
    this.code = code;
  }
}
