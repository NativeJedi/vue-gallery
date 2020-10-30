import Vue from 'vue';
import VueZoomer from 'vue-zoomer';
import '@/assets/global.scss';
import App from './App.vue';
import router from './router';

Vue.use(VueZoomer);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
