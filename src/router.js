import Vue from 'vue';
import Router from 'vue-router';
import HistoryAnalisys from './views/HistoryAnalisys';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/historyAnalisys',
    },
    {
      path: '/historyAnalisys',
      name: 'history-analisys',
      component: HistoryAnalisys,
    },
  ],
});
