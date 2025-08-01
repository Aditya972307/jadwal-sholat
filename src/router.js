// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router' 
import Utama from './Layout/Utama.vue'
import Beranda from './Menu/Beranda.vue'

const routes = [
    {
        path: "/",
        name: "Utama",
        component: Utama,
        children: [
          {
            path: "beranda",
            name: "Beranda",
            component: Beranda,
          },
        ],
    },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
