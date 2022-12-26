import sendVerificationGmail from '../app/email/verifyGmail'

export default defineEventHandler(async (event) => {
  try {
    return await sendVerificationGmail('jack@fullstackjack.dev')
  } catch (error) {
    return sendError(event, createError(error as string))
  }
})
