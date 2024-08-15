import path from 'path';

export default defineNuxtConfig({
    modules: [
        '@primevue/nuxt-module',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        "@sidebase/nuxt-auth",
    ],
    auth: { 
        baseURL: process.env.AUTH_BASE_URL,
        provider: {
            type: 'authjs',
        },
    },
    primevue: {
		importPT: { from: path.resolve(__dirname, './assets/lara/') },
    },
    devtools: { enabled: false },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    components: {
		global: true,
		dirs: ['`/components'],
	},
    css: [
        '~/assets/css/main.css',
        'primeicons/primeicons.css'
    ],
    vite: {
        vue: {
            customElement: true
        },
        vueJsx: {
            mergeProps: true
        }
    },
    typescript: {
        strict: false
    },
    runtimeConfig: {
        auth: {
            secret: process.env.AUTH_SECRET
        }
    },
})