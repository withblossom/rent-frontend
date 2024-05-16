import { createApp } from 'vue'
import pinia from '@/store'
import router from './router'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import gloalComponent from '@/components'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(gloalComponent)
app.use(router)
app.use(elementPlus)

app.mount('#app')
