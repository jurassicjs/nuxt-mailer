import verifyEmailTemplate from './templates/verifyEmailTemplate'
import { sendGmail } from './gmailSender'

export default async function sendVerificationGmail (email: string) {
  const template = verifyEmailTemplate('dude', 'nuxt-mailer', 'Nuxt Mailer Support', 'Nuxt Mailer')
  return await sendGmail({ template, to: email, from: 'nuxt-mailer@fullstackjack.dev', subject: 'Nuxt Mailer email verification' })
}
