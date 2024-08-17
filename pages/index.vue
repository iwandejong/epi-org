<script setup lang="ts">
import type { Employee } from '~/interfaces/Employee';
import { fetchEmployees } from '~/services/fetchEmployees';

definePageMeta({
    middleware: ['auth']
});

const orgID = ref('');
const loading = ref(true);

const { data } = useAuth();
orgID.value = data.value?.user?.orgId || '';

const totalTenure = ref(0);
const totalSalary = ref(0);
const newEmployees = ref(0);

const toast = useToast();

const employees = ref<any>([]);

try {
    employees.value = await fetchEmployees(orgID.value);
} catch (error) {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch employees',
        life: 3000
    });
} finally {
    loading.value = false;
}

// calculate total tenure using employees' joined date
employees.value.forEach((employee: Employee) => {
    const joinedDate = new Date(employee.joiningDate);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - joinedDate.getFullYear();
    totalTenure.value += years;
});

// calculate total salary expenditure
employees.value.forEach((employee: Employee) => {
    totalSalary.value += employee.salary;
});

// calculate new employees
employees.value.forEach((employee: Employee) => {
    const joinedDate = new Date(employee.joiningDate);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - joinedDate.getFullYear();
    if (years === 0) {
        newEmployees.value += 1;
    }
});

</script>

<template>
    <div class="text-white bg-slate-900 h-full">
        <Toast/>
        <div class="absolute top-0 left-0 w-screen h-screen bg-slate-900 z-50" v-if="loading">
            <div class="flex items-center justify-center w-full h-full">
                <div class="flex flex-col items-center space-y-4">
                    <p class="pi pi-spin pi-spinner text-blue-500"></p>
                </div>
            </div>
        </div>
        <div v-else class="h-full pb-8">
            <!-- <Navbar class="z-20"/> -->
            <div class="2xl:px-40 xl:px-32">
                <p class="text-xl">Organisation Statistics</p>
                <div class="grid grid-cols-4 gap-4 py-4">
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Total Employees</p>
                            <p class="pi pi-user text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">
                            {{ employees.length }}
                        </p>
                        <p class="text-xs text-slate-400 flex items-center space-x-1">
                            Total number of employees in the organisation
                        </p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Average Tenure</p>
                            <p class="pi pi-sitemap text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">
                            {{ totalTenure / employees.length }} years
                        </p>
                        <p class="text-xs text-slate-400">
                            Average years employees worked in the organisation
                        </p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">Monthly Salary Expenditure</p>
                            <p class="pi pi-dollar text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">
                            {{ "R" + totalSalary + ".00" }}
                        </p>
                        <p class="text-xs text-slate-400">
                            Total monthly salary expenditure
                        </p>
                    </div>
                    <div class="border border-slate-600 p-6 rounded-lg space-y-1">
                        <div class="flex justify-between items-center">
                            <p class="text-blue-500">New Employees</p>
                            <p class="pi pi-user-plus text-blue-500"></p>
                        </div>
                        <p class="text-2xl font-bold">
                            +{{ newEmployees }}
                        </p>
                        <p class="text-xs text-slate-400">
                            New employees that joined the organisation this year
                        </p>
                    </div>
                </div>
            </div>
            <div class="grid w-full 2xl:grid-cols-2 xl:grid-cols-5 2xl:px-40 xl:px-32 p-4 gap-8">
                <EmployeeSection class="xl:col-span-2 2xl:col-span-1" :employees="employees"/>
                <OrgView class="xl:col-span-3 2xl:col-span-1"/>
            </div>
    
            <div class="fixed right-0 bottom-0 z-10 p-8">
                <NuxtLink to="/table">
                    <div class="bg-blue-500 border border-blue-700 p-2 px-4 rounded-full flex space-x-2 cursor-pointer hover:bg-opacity-70 duration-300">
                        <i class="pi pi-table text-2xl"></i>
                        <p class="text-center text-white">Switch to Table View</p>
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
  