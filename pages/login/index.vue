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
const registeredMessage = ref(false);

const { signIn } = useAuth();

const toast = useToast();

async function login() {
    try {
        isLoading.value = true;
        const result = await signIn('credentials', {
            email: email.value,
            password: password.value,
            redirect: false
        });

        // get session
        const { data } = useAuth();

        // get user.body from data
        const user = data.value?.user?.id || '';

        if (user) {
            toast.add({ severity: 'success', summary: 'Login Successful', detail: 'Redirecting...', life: 3000 });
            await new Promise(resolve => setTimeout(resolve, 3000));
            navigateTo('/');
        } else {
            toast.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password', life: 3000 });
        }
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Login Failed', detail: 'Invalid email or password', life: 3000 }); 
    } finally {
        isLoading.value = false;
    }
}

onMounted(() => {
    const route = useRoute();
    const queryParams = route.query.registered;
    
    if (queryParams) {
        registeredMessage.value = true;
        toast.add({ severity: 'success', summary: 'Registration Complete', detail: 'You can now sign in with your account details', life: 3000 });
    }
});
</script>

<template>
    <div class="flex w-full h-full bg-slate-900 justify-center items-center py-8">
        <Toast></Toast>

        <div class="flex flex-col items-center p-6 lg:p-12 rounded-lg shadow-lg space-y-6 lg:w-1/2 h-full justify-center">
            <div class="flex flex-col items-center space-y-4">
                <img src="/favi.png" alt="EPI-Org" class="w-14 h-auto"/>
                <p class="text-3xl text-white">Welcome to EPI-Org</p>
                <p class="text-gray-400">Sign up or login to continue</p>
            </div>
        
            <form class="flex flex-col space-y-6 lg:w-1/2" @submit.prevent="login">
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
            <div class="grid gap-3 text-sm lg:text-base">
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
