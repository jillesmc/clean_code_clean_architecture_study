export default class MailerGateway {
  constructor() {

  }

  async send(email: string, subject: string, message: string): Promise<void> {
    console.log(email, subject, message);
  }
}