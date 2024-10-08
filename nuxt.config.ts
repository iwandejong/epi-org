import path from 'path';
import Lara from './assets/lara';

export default defineNuxtConfig({
 modules: [
     '@primevue/nuxt-module',
     "@sidebase/nuxt-auth"
 ],

 auth: {
     baseURL: process.env.AUTH_BASE_URL,
     provider: {
         type: 'authjs'
     },
 },

 primevue: {
     options: {
         theme: {
             preset: Lara
         }
     }
 },

 devtools: { enabled: true },

 postcss: {
     plugins: {
         tailwindcss: {},
         autoprefixer: {},
     },
 },

 components: {
     global: true,
     dirs: ['./components'],
	},

 css: [
     '~/assets/css/main.css',
     'primeicons/primeicons.css'
 ],

 typescript: {
     strict: false,
 },

 compatibilityDate: '2024-08-16',
})