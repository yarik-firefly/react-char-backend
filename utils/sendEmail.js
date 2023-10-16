import { options as mailer } from "../core/mailer.js";

export const sendEmail = ({ emailFrom, emailTo, subject, html }) =>
  mailer.sendMail({
    from: emailFrom,
    to: emailTo,
    subject: subject,
    html: html,
  });
