<template>
  <div>
    <div class="container">
      <div class="center">
        <div>
          Welcome to nuxt-mailer.
        </div>
        <div class="mt-10">
          <span>ensure you have an .env in the playground directory. (an example is provided)</span>
        </div>
        <div class="mt-10">
          <button class="btn" @click="sendEmail">
            send email
          </button>
          <button class="btn" @click="sendGmail">
            send gmail
          </button>
        </div>
        <div v-if="emailRes" class="mini">
          Email Respose:
          <div class="mini">
            {{ emailRes }}
          </div>
        </div>
        <div v-if="gmailRes" class="min">
          Gmail Respose:
          <div>
            {{ gmailRes }}
          </div>
        </div>
        <div v-if="errors" class="min">
          Error:
          <div>
            {{ errors }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emailRes = ref()
const gmailRes = ref()
const errors = ref()

async function sendEmail () {
  emailRes.value = await $fetch('/api/mail').catch((err) => {
    errors.value = err
  })
}

async function sendGmail () {
  gmailRes.value = await $fetch('/api/gmail').catch((err) => {
    errors.value = err
  })
}
</script>

<style>
.container {
  height: 1000px;
  position: relative;
  background-color: #18181B;
  color: white
}

.btn {
  background-color: #00DC82;
  padding: 5px;
  margin: 3px;
}

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.mt-10 {
  margin-top: 30px;
}
</style>
