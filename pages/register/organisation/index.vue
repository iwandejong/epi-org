<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

const checked = ref(false)
const isLoading = ref(false)

const form = ref({
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '2000-01-01',
    linkedIn: 'https://linkedin.com/in/johndoe',
    email: 'john.doe@example.com',
    password: 'uI61+g6£+X%=',
    orgName: 'EPI-Org',
});

async function submitForm() {
    try {
        isLoading.value = true;
        console.log(form.value);
        const result = await useFetch('/api/auth/register', {
            method: 'POST',
            body: form.value
        });

        return result;
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="flex w-full h-screen bg-slate-900 justify-center items-center">
        <div class="flex flex-col items-center p-12 rounded-lg shadow-lg space-y-6 w-1/2 h-full justify-center">
            <div class="flex flex-col items-center space-y-4">
                <i class="pi pi-sitemap text-5xl text-[3rem] rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p class="text-3xl ">Welcome to EPI-Org</p>
                <p class="text-gray-400">Create an account to continue</p>
            </div>
        
            <form class="flex flex-col space-y-6 w-full" @submit.prevent="submitForm">
                <div class="space-y-2">
                    <p class="text-lg">Personal Information</p>
                    <hr class="border-gray-600 opacity-30"/>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col space-y-1">
                            <label for="name" class="">
                                <span>
                                    First Name
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="name" class="bg-slate-700 p-2 rounded-md" required v-model="form.firstName"/>
                        </div>
    
                        <div class="flex flex-col space-y-1">
                            <label for="surname" class="">
                                <span>
                                    Last Name
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="surname" class="bg-slate-700 p-2 rounded-md" required v-model="form.lastName"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="birthdate" class="">
                                <span>
                                    Birth Date
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="date" id="birthdate" class="bg-slate-700 p-2 rounded-md" required v-model="form.birthDate"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="picture" class="">
                                <span>
                                    Profile Picture
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="file" id="picture" class="bg-slate-700 p-2 rounded-md" required />
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="linkedin" class="">
                                <span>
                                    LinkedIn Profile
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="url" id="linkedin" class="bg-slate-700 p-2 rounded-md" required v-model="form.linkedIn"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="bio" class="">
                                <span>
                                    Short Bio
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="bio" class="bg-slate-700 p-2 rounded-md" required />
                        </div>
                    </div>

                    <div class="text-lg pt-4">
                        <p class="text-lg">
                            Account Information
                        </p>
                        <p class="text-sm text-gray-400">
                            Please provide your email and password to create an account
                        </p>
                    </div>
                    <hr class="border-gray-600 opacity-30"/>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col space-y-1">
                            <label for="email" class="">
                                <span>
                                    Email Address
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="email" id="email" class="bg-slate-700 p-2 rounded-md" required v-model="form.email"/>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label for="password" class="">
                                <span>
                                    Password
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="password" id="password" class="bg-slate-700 p-2 rounded-md" required v-model="form.password"/>
                        </div>
                    </div>
                    
                    <div class="text-lg pt-4">
                        <p class="text-lg">
                            Organisation Information
                        </p>
                        <p class="text-sm text-gray-400">
                            Please provide your new organisation's Information
                        </p>
                    </div>
                    <hr class="border-gray-600 opacity-30"/>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col space-y-1">
                            <label for="name" class="">
                                <span>
                                    Organisation Name
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="name" class="bg-slate-700 p-2 rounded-md" required v-model="form.orgName"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="avatar" class="">
                                <span>
                                    Organisation Logo
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="file" id="avatar" class="bg-slate-700 p-2 rounded-md" required />
                        </div>
                    </div>
                </div>
        
                <button type="submit" class="bg-blue-500 rounded-md flex items-center justify-center px-4 hover:opacity-70 cursor-pointer h-12 w-full" :disabled="isLoading">
                    <span v-if="isLoading">
                        <span>
                            <i class="pi pi-spin animate-spin text-white"></i>
                            <span class="ml-2">Registering...</span>
                        </span>
                    </span>
                    <span v-else>
                        Register
                    </span>
                </button>

                <div class="flex justify-center space-x-2">
                    <div class="flex justify-center space-x-2">
                        <p class="text-gray-400">Already have an account?</p>
                        <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
                    </div>
                    <div>
                        <span class="text-gray-400">|</span>
                    </div>
                    <div class="flex justify-center space-x-2">
                        <p class="text-gray-400">Want to join an organisation?</p>
                        <RouterLink to="/register" class="text-blue-500">Join Organisation</RouterLink>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

