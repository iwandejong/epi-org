<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});

const orgID = ref('');

const { data } = useAuth();
orgID.value = data.value?.user?.orgId || '';

// console.log(orgID.value);
import { FilterMatchMode } from '@primevue/core/api';

const toast = useToast();

const employees = ref();
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
    gravatarURL: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const loading = ref(true);

const orgData = ref<any>();

try {
    const response = await useFetch('/api/read/employees', {
        method: 'POST',
        body: JSON.stringify({ orgId: orgID.value }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.error.value) {
        throw new Error('Error fetching data');
    } else {
        // console.log(response.data.value);
        orgData.value = response.data.value;
        // console.log(orgData.value);
    }
    employees.value = orgData.value.body;
} catch (error) {
    toast.add({ severity: 'error', summary: 'Error fetching data', detail: 'Please try again later', life: 3000 });
} finally {
    loading.value = false;
    // console.log(employees.value);

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
            gravatarURL: employee.gravatarURL
        }
    });

    // console.log(employees.value);
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
        <div class="flex justify-center w-1/2 space-x-2 absolute top-0 left-1/4 h-20 items-center">
            <IconField class="w-1/3 m-2">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Filter Keyword Search" class="w-full" />
            </IconField>
            <Button type="button" icon="pi pi-times" class="m-2" severity="danger" @click="clearFilter()" v-if="Object.values(filters).some((filter) => filter.value)"/>
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
            <Column field="gravatarURL" header="Gravatar" sortable>
                <template #body="{ data }">
                    <a :href="data.gravatarURL" target="_blank" class="text-blue-500">{{ data.gravatarURL }}</a>
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