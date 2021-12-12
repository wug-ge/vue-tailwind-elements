import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('../views/Index.vue')
    },
    {
      path: '/accordion',
      name: 'Accordion',
      component: () => import('../views/Accordion.vue')
    },
    {
      path: '/alert',
      name: 'Alert',
      component: () => import('../views/Alert.vue')
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/Badge.vue')
    },
    {
      path: '/buttons',
      name: 'Button',
      component: () => import('../views/Button.vue')
    },
    {
      path: '/buttongroup',
      name: 'ButtonGroup',
      component: () => import('../views/ButtonGroup.vue')
    }
  ]
});

export default router;