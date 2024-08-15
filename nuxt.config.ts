import path from 'path';

export default defineNuxtConfig({
    modules: [
        '@primevue/nuxt-module',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/color-mode',
    ],
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
    }
})
