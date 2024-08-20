<script setup lang="ts">
definePageMeta({
    layout: 'auth'
})

const checked = ref(false)
const isLoading = ref(false)

const form = ref({
    firstname: '',
    lastname: '',
    birthdate: '',
    linkedin: '',
    bio: '',
    gravatarurl: '',

    email: '',
    password: '',
    
    orgName: '',
});

const toast = useToast();

async function submitForm() {
    if (isLoading.value) return;

    const result = await Promise.all(
        Object.keys(form.value).map(async key => {
            if (!form.value[key]) {
                toast.add({ severity: 'error', summary: 'Validation Error', detail: `${key} is required`, life: 3000 });
                return false;
            }
            return true;
        })
    );
    
    try {
        isLoading.value = true;
        // console.log(form.value);
        const result = await $fetch('/api/auth/register/org', {
            method: 'POST',
            body: form.value
        });

        let data : any = await result;

        if (data.statusCode > 400) {
            toast.add({ severity: 'error', summary: 'Registration Failed', detail: data.body.message, life: 3000 });
            isLoading.value = false;
            return;
        } else {
            toast.add({ severity: 'success', summary: 'Registration Complete', detail: data.body.message, life: 3000 });
            // delay the navigation to allow the user to see the success message
            await new Promise(resolve => setTimeout(resolve, 3000));
            navigateTo('/login?registered=true');
        }
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Registration Failed', detail: err.body.message, life: 3000 });
        return;
    } finally {
        isLoading.value = false;
        return;
    }
}

</script>

<template>
    <div class="flex w-full bg-slate-900 justify-center items-center">
        <Toast></Toast>

        <div class="flex flex-col items-center p-12 rounded-lg shadow-lg space-y-6 lg:w-1/2 h-full justify-center">
            <div class="flex flex-col items-center space-y-4">
                <div class="flex items-center space-x-2">
                    <img src="/favi.png" alt="EPI-Org" class="w-14 h-auto"/>
                    <p class="text-3xl ">EPI-Org</p>
                </div>
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
                            <input type="text" id="name" class="bg-slate-700 p-2 rounded-md" required v-model="form.firstname" :disabled="isLoading"/>
                        </div>
    
                        <div class="flex flex-col space-y-1">
                            <label for="surname" class="">
                                <span>
                                    Last Name
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="surname" class="bg-slate-700 p-2 rounded-md" required v-model="form.lastname" :disabled="isLoading"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="birthdate" class="">
                                <span>
                                    Birth Date
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="date" id="birthdate" class="bg-slate-700 p-2 rounded-md" required v-model="form.birthdate" :disabled="isLoading"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="picture" class="">
                                <span>
                                    Gravatar URL
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="url" id="picture" class="bg-slate-700 p-2 rounded-md" required v-model="form.gravatarurl" :disabled="isLoading" placeholder="https://gravatar.com/johndoe"/>
                            <div class="flex space-x-1">
                                <p>Don't have a Gravatar Profile?</p>
                                <a href="https://gravatar.com/profile" target="_blank" rel="noopener noreferrer" class="text-blue-500">Create one</a>
                            </div>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="linkedin" class="">
                                <span>
                                    linkedin Profile
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="url" id="linkedin" class="bg-slate-700 p-2 rounded-md" required v-model="form.linkedin" :disabled="isLoading" placeholder="https://linkedin.com/in/johndoe"/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="bio" class="">
                                <span>
                                    Short Bio
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="bio" class="bg-slate-700 p-2 rounded-md" required v-model="form.bio" :disabled="isLoading"/>
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
                            <input type="email" id="email" class="bg-slate-700 p-2 rounded-md" required v-model="form.email" :disabled="isLoading"/>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label for="password" class="">
                                <span>
                                    Password
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="password" id="password" class="bg-slate-700 p-2 rounded-md" required v-model="form.password" :disabled="isLoading"/>
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
                            <input type="text" id="name" class="bg-slate-700 p-2 rounded-md" required v-model="form.orgName" :disabled="isLoading"/>
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

                <div class="lg:flex lg:justify-center lg:space-x-2 text-sm lg:text-base">
                    <div class="flex justify-center space-x-2">
                        <p class="text-gray-400">Already have an account?</p>
                        <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
                    </div>
                    <div class="hidden lg:block">
                        <span class="text-gray-400">|</span>
                    </div>
                    <div class="flex justify-center space-x-2">
                        <p class="text-gray-400">Join an organisation?</p>
                        <RouterLink to="/register" class="text-blue-500">Join Organisation</RouterLink>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

