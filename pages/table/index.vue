<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
    layout: 'auth',
});

const orgID = ref('');

const { data } = useAuth();
orgID.value = data.value?.user?.orgId || '';

console.log(orgID.value);
import { FilterMatchMode } from '@primevue/core/api';

const toast = useToast();

const employees = ref();
// const filters = ref({
//     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//     'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//     representative: { value: null, matchMode: FilterMatchMode.IN },
//     status: { value: null, matchMode: FilterMatchMode.EQUALS },
//     verified: { value: null, matchMode: FilterMatchMode.EQUALS }
// });
// const representatives = ref([
//     { name: 'Amy Elsner', image: 'amyelsner.png' },
//     { name: 'Anna Fali', image: 'annafali.png' },
//     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//     { name: 'Onyama Limba', image: 'onyamalimba.png' },
//     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//     { name: 'XuXue Feng', image: 'xuxuefeng.png' }
// ]);
// const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);

// statusCode	200
// body	[ {…} ]
// 0	Object { "$node_id_17B86C10366B4F8CB9CF5109D20B67C0": '{"type":"node","schema":"dbo","table":"employee","id":72}', id: 73, firstName: "John", … }
// $node_id_17B86C10366B4F8CB9CF5109D20B67C0	'{"type":"node","schema":"dbo","table":"employee","id":72}'
// id	73
// firstName	"John"
// lastName	"Doe"
// birthDate	"2000-01-01T00:00:00.000Z"
// employeeId	"FAC12BF1-FD56-4FE9-89B7-46406F6AC8AD"
// salary	0
// role	"unassigned"
// manager	null
// joiningDate	"2024-08-17T00:00:00.000Z"
// leaveDays	0
// linkedIn	"https://linkedin.com/in/johndoe"
// orgId	"91277E47-0D9D-4441-BA0C-86D4FB4CB160"
// email	"john.doe@example.com"
// password	"$2b$10$K28eDM2AsdkIe8ZBzrE2T.14wydbiqNhqHZl1PBvdfhyg3eTOrEjy"
// hierarchyId	null
// bio	null
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    birthDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    employeeId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    salary: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    manager: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    joiningDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    leaveDays: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    linkedIn: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    gravatarUrl: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const loading = ref(true);

const orgData = ref<any>();

try {
    const response = await useFetch('/api/data/employees', {
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
    employees.value = orgData.value.body;
} catch (error) {
    toast.add({ severity: 'error', summary: 'Error fetching data', detail: 'Please try again later', life: 3000 });
} finally {
    loading.value = false;
    console.log(employees.value);

    // convert employee data to PrimeVue DataTable format
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
            gravatarUrl: employee.gravatarUrl
        }
    });

    console.log(employees.value);
}

const formatDate = (value) => {
    if (!value) return '';

    return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }).format(new Date(value));
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZAR',
    }).format(value);
};

const expandedRows = ref({});

const sizeOptions = ref([
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'null' },
    { label: 'Large', value: 'large' }
]);

const initFilters = () => {
    Object.keys(filters.value).forEach((key) => {
        filters.value[key].value = null;
    });
};

initFilters();

const clearFilter = () => {
    initFilters();
};

</script>


<template>
    <div class="">
        <div class="w-full grid grid-cols-2 justify-between py-4 px-40 sticky top-0 bg-slate-900 bg-opacity-40 backdrop-blur-lg">
            <div class="flex items-center space-x-2 text-xl cursor-pointer hover:opacity-80 duration-300" @click="navigateTo('/')">
                <i class="pi pi-sitemap text-2xl rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p>EPI-Org</p>
            </div>
            <div class="flex items-center space-x-6 justify-end flex-shrink-0">
                <div class="flex justify-end w-full space-x-2">
                    <IconField class="w-full">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Filter Keyword Search" class="w-full" />
                    </IconField>
                    <Button type="button" icon="pi pi-times" severity="danger" @click="clearFilter()" v-if="Object.values(filters).some((filter) => filter.value)"/>
                </div>
                <div class="flex items-center space-x-6 hover:*:bg-slate-700 *:rounded-full *:duration-300 *:cursor-pointer">
                    <div class="h-12 w-12 flex items-center justify-center" @click="navigateTo('/')">
                        <i class="pi pi-home text-xl"></i>
                    </div>
                    <div class="h-12 w-12 flex items-center justify-center">
                        <i class="pi pi-question-circle text-xl"></i>
                    </div>
                    <div class="h-12 w-12 flex items-center justify-center">
                        <!-- <i class="pi pi-moon text-xl"></i> -->
                        <i class="pi pi-sun text-xl"></i>
                    </div>
                </div>
                <div class="h-12 w-12 block bg-white rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300" @click="toggle"></div>
                <Popover ref="op">
                    <div class="flex flex-col w-56">
                        <div class="hover:bg-slate-800 p-4 cursor-pointer" @click="handleLogout">
                            Sign out
                        </div>
                    </div>
                </Popover>
            </div>
        </div>
        <Toast />
        <DataTable v-model:filters="filters" v-model:expandedRows="expandedRows" :value="employees" dataKey="id" filterDisplay="row" :loading="loading"
                :globalFilterFields="['firstName', 'lastName', 'birthDate', 'employeeId', 'salary', 'role', 'manager', 'joiningDate', 'leaveDays', 'linkedIn', 'email', 'bio']" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" :options="{ rowExpansionTemplate: 'expansion', size: 'small' }" stripedRows class="text-sm">
            <template #empty> No employees found. </template>
            <template #loading> Loading employees data. Please wait. </template>
            <Column expander style="width: 5rem" />
            <Column field="employeeId" header="Employee ID" sortable>
                <template #body="{ data }">
                    {{ data.employeeId }}
                </template>
            </Column>
            <Column field="firstName" header="First Name" sortable>
                <template #body="{ data }">
                    {{ data.firstName }}
                </template>
            </Column>
            <Column field="lastName" header="Last Name" sortable>
                <template #body="{ data }">
                    {{ data.lastName }}
                </template>
            </Column>
            <Column field="birthDate" header="Birth Date" sortable>
                <template #body="{ data }">
                    {{ formatDate(new Date(data.birthDate)) }}
                </template>
            </Column>
            <Column field="salary" header="Salary" sortable>
                <template #body="{ data }">
                    {{ formatCurrency(data.salary) }}
                </template>
            </Column>
            <Column field="role" header="Role" sortable>
                <template #body="{ data }">
                    {{ data.role }}
                </template>
            </Column>
            <Column field="manager" header="Manager" sortable>
                <template #body="{ data }">
                    {{ data.manager || 'N/A' }}
                </template>
            </Column>
            <Column field="joiningDate" header="Joining Date" sortable>
                <template #body="{ data }">
                    {{ formatDate(new Date(data.joiningDate)) }}
                </template>
            </Column>
            <Column field="leaveDays" header="Leave Days" sortable>
                <template #body="{ data }">
                    {{ data.leaveDays }}
                </template>
            </Column>
            <Column field="linkedIn" header="LinkedIn" sortable>
                <template #body="{ data }">
                    <a :href="data.linkedIn" target="_blank" class="text-blue-500">{{ data.linkedIn }}</a>
                </template>
            </Column>
            <Column field="email" header="Email" sortable>
                <template #body="{ data }">
                    {{ data.email }}
                </template>
            </Column>
            <Column field="gravatarUrl" header="Gravatar" sortable>
                <template #body="{ data }">
                    <img :src="data.gravatarUrl" class="w-8 h-8 rounded-full" v-if="data.gravatarUrl" />
                    <p v-else>N/A</p>
                </template>
            </Column>
            <Column field="bio" header="Bio" sortable>
                <template #body="{ data }">
                    {{ data.bio || 'N/A' }}
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4">
                    <OrgView />
                </div>
            </template>
        </DataTable>

        <div class="fixed right-0 bottom-0 z-10 p-8">
            <NuxtLink to="/">
                <div class="bg-blue-500 border border-blue-700 p-2 px-4 rounded-full flex space-x-2 cursor-pointer hover:bg-opacity-70 duration-300">
                    <i class="pi pi-table text-2xl"></i>
                    <p class="text-center text-white">Switch to Dashboard View</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>