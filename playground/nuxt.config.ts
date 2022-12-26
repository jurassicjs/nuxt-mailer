import { defineNuxtConfig } from 'nuxt/config'
import NuxtMailer from '..'

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
    mailerLog: '',
    mailerDriver: '',
    mailerHost: '',
    mailerPort: '',
    mailerSmtpTls: '',
    mailerFromAddress: '',
    mailerToAddress: ''
  }
})
