<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
});

const orgID = ref('');
const loading = ref(true);

const orgData = ref<any>();

const { data } = useAuth();
orgID.value = data.value?.user?.orgId || '';

console.log(orgID.value);

const totalTenure = ref(0);
const totalSalary = ref(0);
const newEmployees = ref(0);

const toast = useToast();

const employees = ref();

try {
    const response = await useFetch('/api/read/employees', {
        method: 'POST',
        body: JSON.stringify({ orgId: orgID.value }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.error.value) {
        throw new Error('Error fetching data');
    } else {
        console.log(response.data.value);
        orgData.value = response.data.value;
        console.log(orgData.value);
    }

    // calculate average tenure from orgData.value.body
    orgData.value.body.forEach((employee) => {
        totalTenure.value += new Date().getFullYear() - new Date(employee.joiningDate).getFullYear();
        totalSalary.value += employee.salary;
    });

    newEmployees.value = orgData.value.body.filter((employee) => new Date(employee.joiningDate).getFullYear() === new Date().getFullYear()).length;

    // monthly salary expenditure
    totalSalary.value = totalSalary.value * orgData.value.body.length;
} catch (error) {
    toast.add({ severity: 'error', summary: 'Error fetching data', detail: 'Please try again later', life: 3000 });
} finally {
    loading.value = false;

    employees.value = orgData.value.body.map((employee) => {
        return {
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            birthDate: employee.birthDate,
            employeeId: employee.employeeId,
            salary: employee.salary,
            role: employee.role,
            manager: employee.manager,
            joiningDate: employee.joiningDate,
            leaveDays: employee.leaveDays,
            linkedIn: employee.linkedIn,
            email: employee.email,
            bio: employee.bio,
            gravatarUrl: employee.gravatarURL
        }
    });

    console.log(employees.value);
}

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
                            {{ orgData.body.length }}
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
                            {{ totalTenure / orgData.body.length }}
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
                            New employees this year that joined the organisation
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
  