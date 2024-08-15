<template>
  <div class="text-white bg-slate-900 overflow-hidden h-screen">
    <div class="h-full">
        <Navbar/>
        <div class="px-40">
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
        <div class="grid w-full grid-cols-2 px-40 p-4 gap-8">
            <EmployeeSection/>
            <OrgView/>
            <!-- <TableView/> -->
        </div>
    </div>

    <div class="absolute right-0 bottom-0 z-10 p-8">
        <div class="bg-blue-500 border border-blue-700 p-2 px-4 rounded-full flex space-x-2 cursor-pointer hover:bg-opacity-70 duration-300">
            <i class="pi pi-table text-2xl"></i>
            <p class="text-center text-white">Switch to Table View</p>
        </div>
    </div>
  </div>
</template>
