<template>
  <v-app>
    <!-- Must have the app property -->
    <v-app-bar dense absolute color="blue" dark app>
      <v-container>
        <v-row align="center">
          <v-toolbar-title>
            <router-link
              class="text-decoration-none white--text text-h4"
              :to="{ name: 'pointers' }"
            >
              Pointers
            </router-link>
          </v-toolbar-title>

          <v-spacer />
          <v-toolbar-items class="hidden-sm-and-down align-self-stretch">
            <v-btn
              v-for="(item, idx) in menuLinks"
              :key="idx"
              :to="item.link"
              :disabled="item.disabled"
              text
            >
              {{ item.text }}
            </v-btn>
          </v-toolbar-items>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view />
      <!-- <Pointers /> -->
    </v-main>
  </v-app>
</template>

<script>
// import Pointers from './components/Pointers.vue';
import { reactive } from '@vue/composition-api';

export default {
  name: 'App',
  setup() {
    const menuLinks = reactive([
      {
        link: '/',
        text: 'Base pointers',
        icon: '',
        disabled: false,
      },
      {
        link: '/translate',
        text: 'Translate pointers',
        icon: '',
        disabled: false,
      },
    ]);
    return { menuLinks };
  },

  // components: {
  //   Pointers,
  // },

  data: () => ({
    //
  }),
};
</script>
