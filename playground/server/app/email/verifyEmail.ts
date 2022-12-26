import verifyEmailTemplate from './templates/verifyEmailTemplate'
import { sendEmail } from './emailSender'

export default async function sendVerificationEmail (email: string) {
  const template = verifyEmailTemplate('coolbeans', 'nuxt-mailer', 'Nuxt Mailer Support', 'Nuxt Mailer')
  return await sendEmail({ template, to: email, fromEmail: 'nuxt-mailer@fullstackjack.dev', fromName: 'Nuxt Mailer', subject: 'Nuxt Mailer email verification' })
}
