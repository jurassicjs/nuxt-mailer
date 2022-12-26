import sendVerificationEmail from '../app/email/verifyEmail'

export default defineEventHandler(async () => {
  return await sendVerificationEmail('jack@fullstackjack.dev')
})
