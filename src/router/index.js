import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AreaView from '../views/area/AreaView'
import MedicoView from '../views/medico/MedicoView'
import PacienteView from '../views/paciente/PacienteView'
import CitaView from '../views/cita/CitaView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/area',
    name: 'area',
    component: AreaView
  },
   {
    path: '/medico',
    name: 'medico',
    component: MedicoView
  },
  {
    path: '/paciente',
    name: 'paciente',
    component: PacienteView
  },
  {
    path: '/cita',
    name: 'cita',
    component: CitaView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
