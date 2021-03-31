import Vue from 'vue';
import VueRouter from 'vue-router';
const Pointers = () => import('@/components/Pointers');

const WordTranslate = () => import('@/components/WordTranslate');

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'pointers',
      component: Pointers,
    },
    {
      path: '/translate',
      name: 'translate',
      component: WordTranslate,
    },
  ],
});

export default router;
