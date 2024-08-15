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
                <p class="text-3xl text-white">Welcome to EPI-Hub</p>
                <p class="text-gray-400">Sign up or login to continue</p>
            </div>
        
            <form class="flex flex-col space-y-6 w-full" @submit="">
                <div class="flex flex-col space-y-1">
                    <label for="email" class="text-white">Email</label>
                    <input type="email" id="email" class="bg-slate-700 p-2 rounded-md text-white" placeholder="Email"/>
                </div>

                <div class="flex flex-col space-y-1">
                    <label for="password" class="text-white">Password</label>
                    <input type="password" id="password" class="bg-slate-700 p-2 rounded-md text-white" placeholder="Password"/>
                </div>
        
                <div class="flex flex-col items-center space-y-2 w-full">
                    <div class="flex w-full">
                        <input type="submit" class="bg-blue-500 flex rounded-md items-center justify-center px-4 hover:opacity-70 cursor-pointer flex-nowrap flex-shrink-0 h-12 w-full" value="Login"/>
                    </div>
                    <!-- <div class="flex justify-center space-x-2">
                        <a href="" class="flex items-center space-x-1 bg-blue-500 rounded-md px-4 h-12">
                            <i class="pi pi-github"></i>
                            <p>Sign in with GitHub</p>
                        </a>
                        <a href="" class="flex items-center space-x-1 bg-blue-500 rounded-md px-4 h-12">
                            <i class="pi pi-google"></i>
                            <p>Sign in with Google</p>
                        </a>
                    </div> -->
                </div>

                <div class="flex justify-center space-x-2">
                    <p class="text-gray-400">Don't have an account?</p>
                    <RouterLink to="/register" class="text-blue-500">Sign up</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>
