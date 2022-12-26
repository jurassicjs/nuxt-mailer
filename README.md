# Nuxt Mailer

> nuxt-mailer is a module for integrating node mailer into your nuxt application. If you need any information not found in this readme, check the node mailer docs. 

## Usage

### Install
```bash
npm install nuxt-mailer
```
```bash
yarn add nuxt-mailer
```

Add `'nuxt-mailer'` to nuxt.config modules array

```js
export default defineNuxtConfig({
  modules: ['nuxt-mailer']
  })
```

### .env


> Note: which environment variables you need will depend on your email provider. I've added a few examples for your convenience. Keep in mind, you are free to add a custom transporter and add whatever is needed.

Here's a list of possible environment variables

```env
NUXT_MAILER_LOG
NUXT_MAILER_DRIVER=
NUXT_MAILER_HOST=
NUXT_MAILER_PORT=
NUXT_MAILER_USER=
NUXT_MAILER_PASS=
NUXT_MAILER_SMTP_TLS=
NUXT_MAILER_ENCRYPTION=
NUXT_MAILER_FROM_ADDRESS=
NUXT_MAILER_FROM_NAME=
NUXT_MAILER_TO_ADDRESS=
NUXT_MAILER_TO_NAME=
```

> .env (gmail example)
```
NUXT_MAILER_LOG=yes
NUXT_MAILER_USER=exmaple@yourwebsite.com
NUXT_MAILER_PASS=yourGmailAppPassword
```

> .env (testing with mailhog example)
```
NUXT_MAILER_LOG=yes
NUXT_MAILER_DRIVER=smtp
NUXT_MAILER_HOST=localhost
NUXT_MAILER_PORT=1025
NUXT_MAILER_USER=null
NUXT_MAILER_PASS=null
NUXT_MAILER_SMTP_TLS=no
NUXT_MAILER_ENCRYPTION=null
NUXT_MAILER_FROM_ADDRESS="me@example.dev"
NUXT_MAILER_FROM_NAME="Example User"
NUXT_MAILER_TO_ADDRESS="nuxt-mailer@fullstackjack.dev"
NUXT_MAILER_TO_NAME="nuxt-mailer"
```


## Example Usage:
> Gmail

If you use gmail you need to set up an app password. Just using your normal password won't work. You can google for more info on that topic. 


Firstly as mentioned before, we'll have to add our info to the .env

> .env
```
NUXT_MAILER_USER=exmople@yourwebsite.com
NUXT_MAILER_PASS=yourGmailAppPassword
```

Now let's add the necessary config
> nuxt.config.ts

> Note: setting the runtimeConfig values to blank strings is intentional. 
> Nuxt will replace those blank strings with environment variables. 

```ts
export default defineNuxtConfig({
  modules: [
    NuxtMailer
  ],
  mailer: {
    addPlugin: true
  },
  runtimeConfig: {
    mailerUser: '',
    mailerPass: '',
    mailerLog: '',  }
})
```

You can send the email however you like, but for the sake of simplicity, 
I'll use an end point that sends the email directly

> ~/server/api/gmail.ts  (note: the endpoint is arbitrary)
```ts
import sendVerificationGmail from '../app/email/verifyGmail'

export default defineEventHandler(async (event) => {
  try {
    return await sendVerificationGmail('nuxt-mailer@fullstackjack.dev')
  } catch (error) {
    return sendError(event, createError(error as string))
  }
})
```

> ~/server/email/verifyGmail.ts
```ts
import verifyEmailTemplate from './templates/verifyEmailTemplate'
import { sendGmail } from './gmailSender'

export default async function sendVerificationGmail (email: string) {
  const template = verifyEmailTemplate('example-otp', 'nuxt-mailer', 'Nuxt Mailer Support', 'Nuxt Mailer')
  return await sendGmail({ template, to: email, from: 'nuxt-mailer@fullstackjack.dev', subject: 'Nuxt Mailer email verification' })
}
```

> ~/server/app/email/sendGmail.ts
```ts
import { EmailTemplate } from './types/emailTypes'
import { useMailer } from '#mailer'

type SendMail = {template: EmailTemplate, to: string, from: string, subject: string}

export async function sendGmail (request: SendMail) {
  const mailService = useMailer()
  const gmailTransporter = mailService.gmailTransporter()

  return await mailService.sendMail({
    requestId: 'test-key',
    options: {
      to: request.to,
      subject: request.subject,
      text: request.template.text,
      html: request.template.html
    },
    transporter: gmailTransporter
  })
}
```

> ~/server/app/email/templates/verifyEmailTemplate.ts
```ts
import { EmailTemplate } from '../types/emailTypes'

const verifyEmailTemplate = function (
  otp: string,
  supportEmail: string,
  supportName: string,
  accountName: string
): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <title>Reset your Password</title>
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700"
        rel="stylesheet" media="screen">
      <style>
        .hover-underline:hover {
          text-decoration: underline !important;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping {

          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes pulse {
          50% {
            opacity: .5;
          }
        }

        @keyframes bounce {

          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }

          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @media (max-width: 600px) {
          .sm-px-24 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }

          .sm-py-32 {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
          }

          .sm-w-full {
            width: 100% !important;
          }
        }
      </style>
    </head>

    <body
      style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #eceff1;">
      <div style="display: none;">A request to create your ${accountName} account was received.
Use this link to confirm your account and log in</div>
      <div role="article" aria-roledescription="email" aria-label="Reset your Password" lang="en">
        <table style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%"
          cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center"
              style="--bg-opacity: 1; background-color: #eceff1; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
              <table class="sm-w-full" style="font-family: 'Montserrat',Arial,sans-serif; width: 600px;" width="600"
                cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="sm-py-32 sm-px-24"
                    style="font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; padding: 48px; text-align: center;"
                    align="center">
                    <a href=""
                        style="border: 0; max-width: 100%; line-height: 100%; vertical-align: middle;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-24" style="font-family: 'Montserrat',Arial,sans-serif;">
                    <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0"
                      cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-24"
                          style="--bg-opacity: 1; background-color: #ffffff;  border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif; font-size: 14px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #626262;"
                           align="left">
                          <p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hey there,</p>

                          <p style="margin: 0 0 24px;">
                            A request to create your ${accountName} account was received.
                            Use this OTP to verify your email
                          </p>

                          <lable style="display: block; font-size: 24px; line-height: 100%; margin-bottom: 24px; --text-opacity: 1; color: #000000; text-decoration: none;">${otp}</lable>
                          <table style="font-family: 'Montserrat',Arial,sans-serif;" cellpadding="0" cellspacing="0"
                            role="presentation">
                            <tr>
                              <td
                                style="mso-padding-alt: 16px 24px; --bg-opacity: 1; background-color: #7367f0;  border-radius: 4px; font-family: Montserrat, -apple-system, 'Segoe UI', sans-serif;">
                                
                              </td>
                            </tr>
                          </table>

                          <table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%"
                            cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td
                                style="font-family: 'Montserrat',Arial,sans-serif; padding-top: 32px; padding-bottom: 32px;">
                                <div
                                  style="--bg-opacity: 1; background-color: #eceff1; height: 1px; line-height: 1px;">
                                  &zwnj;</div>
                              </td>
                            </tr>
                          </table>
                          <p style="margin: 0 0 16px;">
                            Needing some additional support? Please contact us at
                            <a href="mailto:${supportEmail}" class="hover-underline"
                              style="--text-opacity: 1; color: #7367f0;  text-decoration: none;">${supportEmail}</a>.
                          </p>
                          <p style="margin: 0 0 16px;">Thanks, <br>${supportName}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 20px;" height="20"></td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Montserrat',Arial,sans-serif; height: 16px;" height="16"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>

    </html>`
  const text = `
        Verify Email, A request to create your ${accountName} account was received.
        Use this OTP to confirm your account and log in`
  return {
    html,
    text
  }
}

export default verifyEmailTemplate
```

## Smtp Example
If you're using a non gmail smtp email service, you can omit creating a transporter all together. You can create one, but it's only necessary if you have some special need not covered by the default transporter. 
> The default transporter will use the runtimeConfig values set in the nuxt.config.ts


> .env (mailhog example)
```env
NUXT_MAILER_LOG=yes
NUXT_MAILER_DRIVER=smtp
NUXT_MAILER_HOST=localhost
NUXT_MAILER_PORT=1025
NUXT_MAILER_USER=null
NUXT_MAILER_PASS=null
NUXT_MAILER_SMTP_TLS=no
NUXT_MAILER_ENCRYPTION=null
NUXT_MAILER_FROM_ADDRESS="you@yoursite.dev"
NUXT_MAILER_FROM_NAME="your name"
NUXT_MAILER_TO_ADDRESS="nuxt-mailer@fullstackjack.dev"
NUXT_MAILER_TO_NAME="nuxt-mailer"
```

> nuxt.config.ts
```ts
import { defineNuxtConfig } from 'nuxt/config'
import NuxtMailer from '..'

export default defineNuxtConfig({
  modules: ['nuxt-mailer'],
  runtimeConfig: {
    mailerUser: '',
    mailerPass: '',
    mailerLog: '',
    mailerDriver: '',
    mailerHost: '',
    mailerPort: '',
    mailerSmtpTls: '',
    mailerFromAddress: '',
    mailerToAddress: ''
  }
})
```

> ~/service/app/email/emailSender.ts
```ts
import { EmailTemplate } from './types/emailTypes'
import { useMailer } from '#mailer'

type SendMail = {template: EmailTemplate, to: string, fromEmail: string, fromName: string, subject: string}

export async function sendEmail (request: SendMail) {
  const mailService = useMailer()

  return await mailService.sendMail({
    requestId: 'test-key',
    options: {
      fromEmail: request.fromEmail,
      fromName: request.fromName,
      to: request.to,
      subject: request.subject,
      text: request.template.text,
      html: request.template.html
    }
  })
}
```

I omitted all the stuff that's the same as the gmail example. 

### Custom Transporter
> Note: see the node-mailer docs for more information

```ts
  const customTransporter = mailService.customTransporter(...)

  return await mailService.sendMail({
    requestId: 'test-key',
    options: {
      to: request.to,
      subject: request.subject,
      text: request.template.text,
      html: request.template.html
    },
    transporter: customTransporter
  })
}
```

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
- To start Mailhog `docker-compose up -d` (must have docker installed)

> you can send emails via the buttons on the homepage. 