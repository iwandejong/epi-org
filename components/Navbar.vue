<template>
    <div class="w-full grid grid-cols-2 justify-between py-4 px-40 sticky top-0 bg-slate-900 bg-opacity-40 backdrop-blur-lg">
        <div class="flex items-center space-x-2 text-xl">
            <i class="pi pi-sitemap text-2xl rotate-180"></i>
            <p>EPI-Hub</p>
        </div>
        <div class="flex items-center space-x-6 justify-end flex-shrink-0">
            <div class="w-full">
                <input type="text" class="w-full h-10 rounded-lg bg-slate-800 p-2 pl-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" placeholder="Search Employees..."/>
            </div>
            <div class="flex items-center space-x-6 hover:*:bg-slate-700 *:rounded-full *:duration-300 *:cursor-pointer">
                <div class="h-12 w-12 flex items-center justify-center">
                    <i class="pi pi-question-circle text-xl"></i>
                </div>
                <div class="h-12 w-12 flex items-center justify-center">
                    <i class="pi pi-bell text-xl"></i>
                </div>
                <div class="h-12 w-12 flex items-center justify-center">
                    <!-- <i class="pi pi-moon text-xl"></i> -->
                    <i class="pi pi-sun text-xl"></i>
                </div>
            </div>
            <div class="h-12 w-12 block bg-white rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300" @click="toggle"></div>
            <Popover ref="op">
                <div class="flex flex-col w-56">
                    <div class="hover:bg-slate-800 p-4 cursor-pointer">
                        Sign out
                    </div>
                </div>
            </Popover>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const op = ref();
const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event) => {
    op.value.toggle(event);
}
</script>
