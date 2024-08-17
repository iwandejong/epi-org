<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
    layout: 'auth'
})

const checked = ref(false)

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const { signIn } = useAuth();

async function login() {
    try {
        await signIn('credentials', {
            email: email.value,
            password: password.value,
            callbackUrl: '/'
        });
    } catch (err) {
        error.value = err.message;
        alert(error.value);
    }
}
</script>

<template>
    <div class="flex w-full h-screen bg-slate-900 justify-center items-center py-8">
        <div class="flex flex-col items-center p-12 rounded-lg shadow-lg space-y-6 w-1/2 h-full justify-center">
            <div class="flex flex-col items-center space-y-4">
                <i class="pi pi-sitemap text-5xl text-[3rem] rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p class="text-3xl text-white">Welcome to EPI-Org</p>
                <p class="text-gray-400">Sign up or login to continue</p>
            </div>
        
            <form class="flex flex-col space-y-6 w-1/2" @submit.prevent="login">
                <div class="flex flex-col space-y-1">
                    <label for="email" class="text-white">Email</label>
                    <input type="email" id="email" class="bg-slate-700 p-2 rounded-md text-white" placeholder="Email" v-model="email"/>
                </div>

                <div class="flex flex-col space-y-1">
                    <label for="password" class="text-white">Password</label>
                    <input type="password" id="password" class="bg-slate-700 p-2 rounded-md text-white" placeholder="Password" v-model="password"/>
                </div>
        
                <button type="submit" class="bg-blue-500 rounded-md flex items-center justify-center px-4 hover:opacity-70 cursor-pointer h-12 w-full" :disabled="isLoading">
                    <span v-if="isLoading">
                        <span>
                            <i class="pi pi-spin animate-spin text-white"></i>
                            <span class="ml-2">Logging in...</span>
                        </span>
                    </span>
                    <span v-else>
                        Login
                    </span>
                </button>

            </form>
            <div class="grid gap-3">
                <div class="flex justify-center space-x-2">
                    <p class="text-gray-400">Join an organisation?</p>
                    <RouterLink to="/register" class="text-blue-500">Join Organisation</RouterLink>
                </div>
                <div class="flex justify-center space-x-2">
                    <p class="text-gray-400">Want to create an organisation?</p>
                    <RouterLink to="/register/organisation" class="text-blue-500">Create Organisation</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
