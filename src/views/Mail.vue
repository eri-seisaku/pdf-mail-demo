<template>
  <div class="pa-4">
    <v-form @submit.prevent="submit" ref="form">
      <v-row class="justify-center">
        <v-col cols="12">
          <h3 class="text-center mb-6">メール送信テスト</h3>
          <v-text-field
            v-model="name"
            label="お名前"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="メールアドレス"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="content"
            label="コメント"
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col>
          <div class="d-flex justify-center">
            <v-btn
              color="primary"
              type="submit"
              class="px-12 mb-6"
              size="large"
              flat
            >送信</v-btn>
            <v-alert
              type="success"
              :text="message"
              v-if="message"
            ></v-alert>
            <v-alert
              type="error"
              :text="errorMessage"
              v-if="errorMessage"
            ></v-alert>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const name = ref('');
const email = ref('');
const content = ref('');

const form = ref(null); // form全体
const message = ref('');
const errorMessage = ref('');

const reset = () => {
  form.value.reset(); // 機能した
};

import { sendMail } from "@/firebase/firebase";
import { setOneLevelData } from '@/firebase/v1/firestore';

const submit = async () => {
  if (!name.value && !email.value && !content.value) {
    message.value = '入力してください';
    return;
  }
  try {
    const sendData = {
      name: name.value,
      email: email.value,
      content: content.value
    };

    console.log(sendData);

    await setOneLevelData('data', "members", sendData);
    await sendMail(sendData);

    message.value = '送信が完了しました';
    reset();

  } catch (error) {
    console.log('送信失敗しました', error)
    errorMessage.value = '送信失敗しました', error;
  }
}
</script>
