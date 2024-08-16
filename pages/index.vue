<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
});
</script>

<template>
    <div class="text-white bg-slate-900 overflow-hidden">
        <div class="">
            <!-- <Navbar class="z-20"/> -->
            <div class="2xl:px-40 xl:px-32">
                <p class="text-xl">Organisation Statistics</p>
                <div class="grid grid-cols-4 gap-4 py-4">
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Total Employees</p>
                            <p class="pi pi-user text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">100</p>
                        <p class="text-xs text-slate-400">+10% from last month</p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Total Departments</p>
                            <p class="pi pi-sitemap text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">3</p>
                        <p class="text-xs text-slate-400">+0% from last month</p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Total Salary Expenditure</p>
                            <p class="pi pi-dollar text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">100</p>
                        <p class="text-xs text-slate-400">+10% from last month</p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">New Employees</p>
                            <p class="pi pi-user-plus text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">+4</p>
                        <p class="text-xs text-slate-400">+10% from last year</p>
                    </div>
                </div>
            </div>
            <div class="grid w-full 2xl:grid-cols-2 xl:grid-cols-5 2xl:px-40 xl:px-32 p-4 gap-8">
                <EmployeeSection class="xl:col-span-2 2xl:col-span-1"/>
                <OrgView class="xl:col-span-3 2xl:col-span-1"/>
            </div>
        </div>
  
        <div class="fixed right-0 bottom-0 z-10 p-8">
            <RouterLink to="/table">
                <div class="bg-blue-500 border border-blue-700 p-2 px-4 rounded-full flex space-x-2 cursor-pointer hover:bg-opacity-70 duration-300">
                    <i class="pi pi-table text-2xl"></i>
                    <p class="text-center text-white">Switch to Table View</p>
                </div>
            </RouterLink>
        </div>
    </div>
</template>
  