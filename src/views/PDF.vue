<template>
  <div class="pa-4">
    <h3 class="text-center mb-6">PDF作成テスト</h3>
    <v-form @submit.prevent="submit" ref="form">
      <!-- お名前 -->
      <v-row class="custom-color justify-center" v-for="(field, index) in nameFields" :key="index">
        <v-col cols="12" md="3">
          <label class="font-weight-bold">
            {{ field.label }}
            <span class="bg-red-darken-4 rounded text-subtitle-2 pa-1 ml-3">必須</span>
          </label>
        </v-col>
        <v-col cols="12" md="8">
          <div class="d-flex justify-space-between">
            <v-text-field
              variant="outlined"
              v-model="field.firstNameModel.value"
              :placeholder="field.firstNamePlaceholder"
              bg-color="white"
              class="mx-2"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="field.lastNameModel.value"
              :placeholder="field.lastNamePlaceholder"
              bg-color="white"
              class="mx-2"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
      <!-- 生年月日 -->
      <v-row class="custom-color justify-center">
        <v-col cols="12" md="3">
          <label class="font-weight-bold">
            生年月日
            <span class="bg-red-darken-4 rounded text-subtitle-2 pa-1 ml-3">必須</span>
          </label>
        </v-col>
        <v-col cols="12" md="8">
          <div class="d-flex">
            <v-select
              :items="years"
              v-model="birthYear"
              label="年"
              variant="outlined"
              bg-color="white"
              class="mx-2"
            ></v-select>
            <v-select
              :items="months"
              v-model="birthMonth"
              label="月"
              variant="outlined"
              bg-color="white"
              class="mx-2"
            ></v-select>
            <v-select
              :items="days"
              v-model="birthDay"
              label="日"
              variant="outlined"
              bg-color="white"
              class="mx-2"
            ></v-select>
            <v-select
              :items="ages"
              v-model="age"
              label="年齢"
              variant="outlined"
              bg-color="white"
              class="mx-2"
            ></v-select>
          </div>
        </v-col>
      </v-row>
      <!-- 事業所名 -->
      <v-row class="custom-color justify-center">
        <v-col cols="12" md="3">
          <label class="font-weight-bold">
            事業所名
            <span class="bg-red-darken-4 rounded text-subtitle-2 pa-1 ml-3">必須</span>
          </label>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="officeName"
            variant="outlined"
            placeholder="和文"
            bg-color="white"
            class="mx-2"
          ></v-text-field>
          <v-text-field
            v-model="officeNameRoman"
            variant="outlined"
            placeholder="英文名"
            bg-color="white"
            class="mx-2"
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- 住所 -->
      <v-row class="custom-color justify-center">
        <v-col cols="12" md="3">
          <label class="font-weight-bold">
            住所
            <span class="bg-red-darken-4 rounded text-subtitle-2 pa-1 ml-3">必須</span>
          </label>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            v-model="zipCode"
            variant="outlined"
            placeholder="123-4567"
            bg-color="white"
            class="mx-2"
          ></v-text-field>
          <v-text-field
            v-model="address"
            variant="outlined"
            placeholder="住所"
            bg-color="white"
            class="mx-2"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="text-center">
        <v-col cols="12">
          <v-btn
            color="primary"
            type="submit"
            class="px-12 mb-6"
            size="large"
            flat
          >送信</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
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
    </v-form>
    <div class="text-center">
      <a
        class="text-decoration-none text-primary font-weight-medium d-inline-flex align-center my-4"
        :href="url"
        target="_blank"
        rel="noopener"
        >
        PDF編集内容確認
        <v-icon
          color="primary"
          icon="mdi-open-in-new"
          size="x-small"
        ></v-icon>
      </a>
      <p class="text-caption">
        ※一度リロードしてください
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const firstName = ref('');
const lastName = ref('');
const firstNameKana = ref('');
const lastNameKana = ref('');
const firstNameRoman = ref('');
const lastNameRoman = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const birthDay = ref('');
const age = ref('');
const officeName = ref('');
const officeNameRoman = ref('');
const zipCode = ref('');
const address = ref('');

const form = ref(null); // form全体
const url = ref('');
const message = ref('');
const errorMessage = ref('');

const nameFields = [
  {
    label: 'お名前',
    firstNameModel: firstName,
    firstNamePlaceholder: '山田',
    lastNameModel: lastName,
    lastNamePlaceholder: '花子'
  },
  {
    label: 'フリガナ',
    firstNameModel: firstNameKana,
    firstNamePlaceholder: 'ヤマダ',
    lastNameModel: lastNameKana,
    lastNamePlaceholder: 'ハナコ'
  },
  {
    label: 'ローマ字',
    firstNameModel: firstNameRoman,
    firstNamePlaceholder: 'Yamada',
    lastNameModel: lastNameRoman,
    lastNamePlaceholder: 'Hanako'
  }
];

// firebase
import { getOneLevelData } from '@/firebase/v1/firestore';

onMounted(async () => {
  try {
    const pdfDoc = await getOneLevelData('writePdf', 'pdfs');

    console.log(pdfDoc)

    if (pdfDoc) {
      url.value = pdfDoc.url;
    }

  } catch (error) {
    errorMessage.value = error;
    console.error('ユーザーデータ取得エラー', error);
  }
});

// 選択できる年,月,日
const years = ref([]);
onMounted(() => {
  const currentYear = new Date().getFullYear();
  for (let year = 1923; year <= currentYear; year++) {
    years.value.push(year);
  }
});
const months = Array.from({length: 12}, (_, i) => i + 1);
const days = Array.from({length: 31}, (_, i) => i + 1);
const ages = Array.from({length: 100}, (_, i) => i + 1);

const reset = () => {
  form.value.resetValidation(); // 機能しなかった
  form.value.reset(); // 機能した
};

import { writePDF } from "@/firebase/firebase";

const submit = async () => {
  try {
    const sendData = {
      firstName: firstName.value,
      lastName: lastName.value,
      firstNameKana: firstNameKana.value,
      lastNameKana: lastNameKana.value,
      firstNameRoman: firstNameRoman.value,
      lastNameRoman: lastNameRoman.value,
      birthYear: birthYear.value,
      birthMonth: birthMonth.value,
      birthDay: birthDay.value,
      age: age.value,
      officeName: officeName.value,
      officeNameRoman: officeNameRoman.value,
      zipCode: zipCode.value,
      address: address.value,
    };

    await writePDF(sendData);

    message.value = '送信が完了しました';

    reset();
  } catch (error) {
    console.log('送信失敗しました', error)
    errorMessage.value = '送信失敗しました', error;
  }
}



</script>
<style>
.custom-color > div {
  border: 2px solid white;
}
/* 1番目の子要素の色 */
.custom-color > div:first-child {
  background-color: #E0E0E0;
}

/* 2番目の子要素の色 */
.custom-color > div:nth-child(2) {
  background-color: #F5F5F5;
}
</style>
