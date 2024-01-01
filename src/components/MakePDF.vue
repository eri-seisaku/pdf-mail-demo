<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="8">
          <v-alert
            type="success"
            :text="message"
            v-if="message"
            class="my-2"
          ></v-alert>
          <v-alert
            type="error"
            :text="errorMessage"
            v-if="errorMessage"
            class="my-2"
          ></v-alert>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="8" class="bg-green-lighten-4 pa-4 my-6">
          <h3 class="my-4">既存PDF編集</h3>
          <form @submit.prevent="edit">
            <v-text-field
              v-model="firstName"
              label="firstName"
              variant="outlined"
              bg-color="white"
            ></v-text-field>
            <v-text-field
              v-model="lastName"
              label="lastName"
              variant="outlined"
              bg-color="white"
            ></v-text-field>
            <v-btn
              color="green"
              type="submit"
              class="px-12"
              size="large"
              flat
            >送信</v-btn>
          </form>
        </v-col>
        <v-col cols="12">
          <a
            class="text-decoration-none text-primary font-weight-medium d-inline-flex align-center"
            :href="oldUrl"
            target="_blank"
            rel="noopener"
            >
            既存PDF編集内容確認
            <v-icon
              color="primary"
              icon="mdi-open-in-new"
              size="x-small"
            ></v-icon>
          </a>
          <p class="text-caption">
            ※一度リロードしてください
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="8" class="bg-blue-lighten-4 pa-4">
          <h3 class="my-4">新規で作成</h3>
          <form @submit.prevent="create">
            <v-text-field
              v-model="comment"
              label="Comment"
              variant="outlined"
              bg-color="white"
            ></v-text-field>
            <v-btn
              color="primary"
              type="submit"
              class="px-12"
              size="large"
              flat
            >送信</v-btn>
          </form>
        </v-col>
        <v-col cols="12">
          <a
            class="text-decoration-none text-primary font-weight-medium d-inline-flex align-center"
            :href="url"
            target="_blank"
            rel="noopener"
            >
            新規PDF編集内容確認
            <v-icon
              color="primary"
              icon="mdi-open-in-new"
              size="x-small"
            ></v-icon>
          </a>
          <p class="text-caption">
            ※一度リロードしてください
          </p>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
<script setup>
import { ref, onMounted } from 'vue';
const comment = ref('');
const firstName = ref('');
const lastName = ref('');
const url = ref('');
const oldUrl = ref('');
const message = ref('');
const errorMessage = ref('');

const resetForm = () => {
  comment.value = "";
  firstName.value = "";
  lastName.value = "";
}

import { editPDF } from "@/firebase/firebase";
import { createPDF } from "@/firebase/firebase";

const create = async () => {
  try {
    const sendData = {
      comment: comment.value,
    };

    console.log(sendData);

    await createPDF(sendData);

    console.log('送信が完了しました')
    message.value = '送信が完了しました';
    resetForm();

  } catch (error) {
    console.log('送信失敗しました', error)
    message.value = '送信失敗しました', error;
  }
}
const edit = async () => {
  try {
    const sendData = {
      firstName: firstName.value,
      lastName: lastName.value,
    };

    console.log(sendData);

    await editPDF(sendData);

    console.log('送信が完了しました')
    message.value = '送信が完了しました';
    resetForm();

  } catch (error) {
    console.log('送信失敗しました', error)
    errorMessage.value = '送信失敗しました', error;
  }
}

// firebase
import { getOneLevelData } from '@/firebase/v1/firestore';


onMounted(async () => {
  try {
    const oldPdfDoc = await getOneLevelData('editPdf', 'pdfs');
    oldUrl.value = oldPdfDoc.url;
    console.log(oldPdfDoc);

    const pdfDoc = await getOneLevelData('createPdf', 'pdfs');
    if (pdfDoc) {
      url.value = pdfDoc.url;
    }

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザーデータ取得エラー', error);
  }
});
</script>
