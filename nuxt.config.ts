import path from 'path';

export default defineNuxtConfig({
    modules: [
        '@primevue/nuxt-module',
        '@nuxtjs/tailwindcss',
        "@sidebase/nuxt-auth",
    ],
    auth: { 
        baseURL: process.env.AUTH_BASE_URL,
        provider: {
            type: 'authjs',
        },
    },
    primevue: {
        usePrimeVue: true,
        // options: {
        //     theme: {
        //         preset: '
        //     }
        // }
        // options: {
        //     unstyled: true
        // },
		// importPT: { from: path.resolve(__dirname, './presets/lara/') },
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
		dirs: ['./components'],
	},
    css: [
        '~/assets/css/main.css',
        'primeicons/primeicons.css'
    ],
    typescript: {
        strict: false
    },
    runtimeConfig: {
        auth: {
            secret: process.env.AUTH_SECRET
        }
    },
})