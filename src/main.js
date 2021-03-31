import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueCompositionAPI from '@vue/composition-api';
import router from './routes';
Vue.use(VueCompositionAPI);
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');
