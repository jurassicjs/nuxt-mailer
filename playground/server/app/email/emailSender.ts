import { EmailTemplate } from './types/emailTypes'
import { useMailer } from '#mailer'
import { resolvePath } from '@nuxt/kit'

type SendMail = { template: EmailTemplate, to: string, fromEmail: string, fromName: string, subject: string }

export async function sendEmail(request: SendMail) {
  const mailService = useMailer()

  const filePath = await resolvePath('playground/server/app/email/test.pdf')

  return await mailService.sendMail({
    requestId: 'test-key',
    options: {
      fromEmail: request.fromEmail,
      fromName: request.fromName,
      to: request.to,
      subject: request.subject,
      text: request.template.text,
      html: request.template.html,
      attachments: [{
        filename: 'file.pdf',
        path: filePath,
        contentType: 'application/pdf'
      }],
    }
  })
}
