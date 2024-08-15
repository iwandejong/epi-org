<template>
    <div class="bg-slate-900 border border-slate-700 rounded-md p-6 w-full h-full hover:border-blue-500 cursor-pointer duration-300" @click="toggle">
        <div ref="wrapper" class="grid grid-cols-5 items-center w-full h-full _transition-all duration-1000 ease-in-out">
            <div ref="profile" class="flex _flex-col _justify-end col-span-4 items-center space-x-4 _space-y-4 _bg-gradient-to-t from-purple-700 to-pink-600 _p-6 _rounded-md h-full bg-opacity-0">
                <div class="h-12 w-12 bg-white text-black rounded-full shrink-0 flex items-center justify-center">
                    <p>
                        PD
                    </p>
                </div>
                <div class="space-y-2">
                    <p class="text-lg">John Doe</p>
                    <p class="text-slate-400 text-sm">Senior Software Engineer</p>
                </div>
            </div>
            <div ref="info" class="hidden col-span-3 pl-8 space-y-8 _transition-all duration-1000 ease-in-out"> 
                <div>
                    <p class="text-lg">Bio</p>
                    <p class="text-slate-400 text-sm">
                        Aspiring software engineer with 15 years of experience in cloud engineering.
                    </p>
                </div>
                <div class="flex w-full justify-between">
                    <div>
                        <p class="">Salary</p>
                        <p class="text-slate-400">
                            R15k/mo
                        </p>
                    </div>
                    <div>
                        <p class="">Weekly Hours</p>
                        <p class="text-amber-400">
                            32.5hrs
                        </p>
                    </div>
                    <div>
                        <p class="">Satisfaction</p>
                        <p class="text-green-400">
                            8.9
                        </p>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <div class="bg-blue-500 flex rounded-md items-center justify-center px-4 hover:opacity-70 cursor-pointer flex-nowrap flex-shrink-0">
                        <p>Manage Employee</p>
                    </div>
                    <div class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 flex-shrink-0">
                        <i class="pi pi-chevron-up text-xl"></i>
                    </div>
                </div>
            </div>
            <div ref="dropdown" class="h-full flex items-center col-span-1 justify-end _transition-all duration-1000 ease-in-out">
                <div class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700">
                    <i class="pi pi-chevron-down text-xl"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

// TODO: add tabNo to allow only one tab to be open at a time

const active = ref(false);

const wrapper = ref();
const profile = ref();
const info = ref();
const dropdown = ref();

const toggle = () => {
    active.value = !active.value;
    if (active.value) { // show
        profile.value.classList.add('flex-col');
        profile.value.classList.add('justify-end');
        profile.value.classList.add('space-y-4');
        profile.value.classList.add('bg-gradient-to-t');
        profile.value.classList.add('p-6');
        profile.value.classList.add('rounded-md');
        profile.value.classList.add('col-span-2');
        profile.value.classList.remove('items-center');
        profile.value.classList.remove('space-x-4');
        profile.value.classList.remove('bg-opacity-0');
        profile.value.classList.remove('col-span-4');
        
        info.value.classList.remove('hidden');

        dropdown.value.classList.add('hidden');
    } else { // hide
        profile.value.classList.remove('flex-col');
        profile.value.classList.remove('justify-end');
        profile.value.classList.remove('space-y-4');
        profile.value.classList.remove('bg-gradient-to-t');
        profile.value.classList.remove('p-6');
        profile.value.classList.remove('col-span-2');
        profile.value.classList.remove('rounded-md');
        profile.value.classList.add('items-center');
        profile.value.classList.add('col-span-4');
        profile.value.classList.add('space-x-4');

        info.value.classList.add('hidden');

        dropdown.value.classList.remove('hidden');
    }
}
</script>