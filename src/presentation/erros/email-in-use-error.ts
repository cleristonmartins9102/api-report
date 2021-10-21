export class EmailInUseError extends Error {
  constructor (email: string) {
    super(`The email ${email} is already in use`)
    this.name = 'Email in use'
  }
}
