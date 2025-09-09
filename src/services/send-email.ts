import nodemailer from 'nodemailer'
import { env } from '../env.ts'

type SendEmailParams = {
  from: string
  to: string
  subject: string
  content: string
}

export async function sendEmail({ from, to, subject, content }: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  
  return await transporter.sendMail({
    from,
    to,
    subject,
    text: content,
  }) 
}