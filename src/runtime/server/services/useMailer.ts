import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import consola from 'consola'
import { useRuntimeConfig } from '#imports'

const runtimeConfig = useRuntimeConfig()
// todo: add error handling

const defaultTransporter = createTransport({
  host: runtimeConfig.mailerHost,
  port: runtimeConfig.mailerPort,
  secure: runtimeConfig.SMTP_TLS === 'yes',
  auth: {
    user: runtimeConfig.mailerUser,
    pass: runtimeConfig.mailerPass
  },
  attachments: null
} as unknown as TransporterOptions)

const gmailTransporter = () => {
  return createTransport({
    service: 'gmail',
    auth: {
      user: runtimeConfig.mailerUser,
      pass: runtimeConfig.mailerPass
    }
  })
}

export type TransporterOptions = {
  service?: string,
  host?: string,
  port?: number,
  secure?: boolean,
  auth?: { user: string, pass: string }
  attachments?: []
}

const customTransporter = (options: TransporterOptions) => {
  return createTransport({
    service: options.service,
    host: options.host,
    port: options.port,
    secure: options.secure,
    auth: options.auth,
    attachments: options.attachments
  })
}

interface MailInterface {
  fromEmail?: string;
  fromName?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
  attachments?: {
    filename: string,
    path: string,
    contentType: string
  }[];
}

export type SendMailProps = {
  requestId: string | number | string[],
  options: MailInterface
  transporter?: Transporter<SMTPTransport.SentMessageInfo> | null
}

export const sendMail = async (
  props: SendMailProps
) => {
  const options = props.options
  const requestId = props.requestId
  const customTrasporter = props.transporter
  const transporter = () => customTrasporter ?? defaultTransporter

  return await transporter()
    .sendMail({
      from: `${options.fromName} ${options.fromEmail}`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    })
    .then((info) => {
      if (runtimeConfig.mailerLog === 'yes') {
        consola.info(`${requestId} - Mail sent successfully!!`)
        consola.info(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`)
        consola.info(`${requestId} - Nodemailer ethereal URL: ${getTestMessageUrl(
          info
        )}`)
      }
      return info
    }).catch((err) => {
      consola.error('Error sending email from nuxt-mailer: ' + err)

      if(err.message.includes('getaddrinfo ENOTFOUND')){
        consola.error(`Error Hint: could not connect to host
        NUXT_MAILER_HOST is set to ${runtimeConfig.mailerHost} `)
      }

      return err
    })
}

export const useMailer = () => {
  return {
    sendMail,
    gmailTransporter,
    customTransporter,
    defaultTransporter
  }
}
