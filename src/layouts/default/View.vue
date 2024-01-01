<template>
  <v-app id="inspire">
    <v-app-bar
      class="px-3"
      flat
      density="compact"
    >
      <v-spacer></v-spacer>

      <v-tabs
        centered
        color="grey-darken-2"
      >
        <v-tab
          v-for="menu in navMenus"
          :key="menu.title"
          :text="menu.title"
          :to="menu.to"
        ></v-tab>
      </v-tabs>

      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- <v-main class="bg-grey-lighten-3"> -->
    <v-main>
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            md="10"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <router-view />
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  const navMenus = [
  {
    title: 'HOME',
    to: '/'
  },
  {
    title: 'PDF',
    to: '/pdf'
  },
  {
    title: 'MAIL',
    to: '/mail'
  },
];
</script>
