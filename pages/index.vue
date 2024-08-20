<script setup lang="ts">
import type { Employee } from '~/interfaces/Employee';
import { fetchEmployees } from '~/services/fetchEmployees';
import type { ServerResponse } from '~/interfaces/ServerResponse';
import type { Tree } from '~/interfaces/Tree';

definePageMeta({
    middleware: ['auth']
});

const orgid = ref('');
const loading = ref(true);

const { data } = useAuth();
orgid.value = data.value?.user?.orgid || '';

const empID = ref('');
empID.value = data.value?.user?.employeeid || '';

const totalTenure = ref(0);
const totalSalary = ref(0);
const newEmployees = ref(0);

const toast = useToast();

const employees = ref<any>([]);

try {
    employees.value = await fetchEmployees(orgid.value);
} catch (error) {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch employees',
        life: 3000
    });
}

// get current user
console.log(empID.value);
const currentUser = employees.value.find((employee: Employee) => employee.employeeid === empID.value);
console.log(currentUser);

// calculate total tenure using employees' joined date
employees.value.forEach((employee: Employee) => {
    const joinedDate = new Date(employee.joiningdate);
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
    const joinedDate = new Date(employee.joiningdate);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - joinedDate.getFullYear();
    if (years === 0) {
        newEmployees.value += 1;
    }
});

// try Tree fetch
const treeData = ref<any>([]);
try {
    const {statusCode, body} : ServerResponse = await $fetch('/api/read/tree', {
        method: 'POST',
        body: {
            orgid: orgid.value
        }
    });
    if (statusCode == 200) {
        treeData.value = body;
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch tree',
            life: 3000
        });
    }
} catch (error) {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch tree',
        life: 3000
    });
}

// select all employees that are not the current user, and under the current user's supervision
// TODO: traverse the Tree
let travTree = (tree: Tree) => {
    let arr = [];
    if (tree.children.length > 0) {
        tree.children.forEach((child: Tree) => {
            arr.push(child);
            arr.push(...travTree(child));
        });
    }
    return arr;
};

const tree = travTree(treeData.value[0]);
// select all ids of employees under the current user
const empIDs = tree.map((emp: Tree) => emp.id);

// filter employees that are under the current user
let otherEmployees = (currentUser.manager === null) ? employees.value : employees.value.filter((employee: Employee) => empIDs.includes(employee.id));

// also filter out the current user if manager is not null
if (currentUser.manager !== null) {
    otherEmployees = otherEmployees.filter((employee: Employee) => employee.employeeid !== currentUser.employeeid);
}

if (currentUser.manager !== null) {
    otherEmployees = otherEmployees.filter((employee: Employee) => employee.manager !== currentUser.manager);
}

console.log(otherEmployees);


onMounted(() => {
    loading.value = false;
});

</script>

<template>
    <div class="text-white bg-slate-900 h-full">
        <Toast/>
        <div class="absolute top-0 left-0 w-screen h-screen bg-slate-900 z-50" v-if="loading">
            <div class="flex items-center justify-center w-full h-full">
                <div class="flex flex-col items-center space-y-4">
                    <p class="pi pi-spin pi-spinner text-blue-500 text-xl"></p>
                </div>
            </div>
        </div>
        <div v-else class="h-full pb-8">
            <!-- <Navbar class="z-20"/> -->
            <div class="2xl:px-40 xl:px-32 px-2">
                <p class="text-xl">Organisation Statistics</p>
                <div class="grid lg:grid-cols-4 gap-4 py-4">
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
                            {{ "R" + totalSalary }}
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
                <EmployeeSection class="xl:col-span-2 2xl:col-span-1" :employees="otherEmployees" :employee="currentUser"/>
                <OrgView class="xl:col-span-3 2xl:col-span-1" :tree="treeData" :authData="data"/>
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
  