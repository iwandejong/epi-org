<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const checked = ref(false)
</script>

<template>
    <div class="flex w-full h-screen bg-slate-900 justify-center items-center">
        <div class="flex flex-col items-center bg-slate-800 p-12 rounded-lg shadow-lg space-y-6">
            <div class="flex flex-col items-center space-y-4">
                <i class="pi pi-sitemap text-5xl text-[3rem] rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p class="text-3xl ">Welcome to EPI-Hub</p>
                <p class="text-gray-400">Create an account to continue</p>
            </div>
        
            <form class="flex flex-col space-y-6 w-full" @submit="">
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
                            <input type="text" id="name" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>
    
                        <div class="flex flex-col space-y-1">
                            <label for="surname" class="">
                                <span>
                                    Last Name
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="surname" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="birthdate" class="">
                                <span>
                                    Birth Date
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="date" id="birthdate" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>

                        <div class="flex flex-col space-y-1">
                            <label for="linkedin" class="">
                                <span>
                                    LinkedIn Profile
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="linkedin" class="bg-slate-700 p-2 rounded-md" required/>
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
                            <label for="linkedin" class="">
                                <span>
                                    Email Address
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="linkedin" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label for="linkedin" class="">
                                <span>
                                    Password
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="password" id="linkedin" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>
                    </div>
                    
                    <div class="text-lg pt-4">
                        <p class="text-lg">
                            Organisation Information
                        </p>
                        <p class="text-sm text-gray-400">
                            Please provide your organisation ID and your employee ID to join an organisation
                        </p>
                    </div>
                    <hr class="border-gray-600 opacity-30"/>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col space-y-1">
                            <label for="organisation" class="">
                                <span>
                                    Organisation ID
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="organisation" class="bg-slate-700 p-2 rounded-md" required/>
                            <div class="flex space-x-1">
                                <p>Don't have an Organisation ID?</p>
                                <RouterLink to="/register/organisation" class="text-blue-500">Create Organisation</RouterLink>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-1">
                            <label for="organisation" class="">
                                <span>
                                    Your Employee ID
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <input type="text" id="organisation" class="bg-slate-700 p-2 rounded-md" required/>
                        </div>
                    </div>
                </div>
        
                <div class="flex w-full">
                    <input type="submit" class="bg-blue-500 flex rounded-md items-center justify-center px-4 hover:opacity-70 cursor-pointer flex-nowrap flex-shrink-0 h-12 w-full" value="Request to join"/>
                </div>

                <div class="flex justify-center space-x-2">
                    <p class="text-gray-400">Already have an account?</p>
                    <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>
