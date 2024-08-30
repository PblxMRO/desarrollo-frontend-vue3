import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Importaciones bootstrap-vue-next
import {createBootstrap, BButton, BModal, BListGroup, BListGroupItem, BContainer, BRow, BCol, BTableSimple,BTr, BTh, BThead, BTbody,BTd, BBadge, BForm, BFormInput, BFormGroup, BFormSelect, BFormCheckbox} from 'bootstrap-vue-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// Importaciones axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// Toast
import toasts from './toasts';
import './assets/styles/styles.scss'


const app = createApp(App)

app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.use(toasts)
app.use(createBootstrap({components: true, directives: true}))
app.component('BButton', BButton)
app.component('BModal', BModal)
app.component('BListGroup', BListGroup)
app.component('BListGroupItem', BListGroupItem)
app.component('BContainer', BContainer)
app.component('BBadge', BBadge)
app.component('BForm', BForm)
app.component('BFormGroup', BFormGroup)
app.component('BFormInput', BFormInput)
app.component('BFormSelect', BFormSelect)
app.component('BFormCheckbox', BFormCheckbox)
app.component('BTableSimple', BTableSimple)
app.component('BThead', BThead)
app.component('BTbody', BTbody)
app.component('BTr', BTr)
app.component('BTh', BTh)
app.component('BTd', BTd)
app.component('BRow', BRow)
app.component('BCol', BCol)
app.mount('#app')