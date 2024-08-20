<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';
import type { Employee } from '~/interfaces/Employee';
import { fetchEmployees } from '~/services/fetchEmployees';

definePageMeta({
    middleware: ['auth'],
});

const orgid = ref('');

const { data } = useAuth();
orgid.value = data.value?.user?.orgid || '';


const toast = useToast();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    birthdate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    employeeid: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    salary: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    manager: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    joiningdate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    leavedays: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    linkedin: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    bio: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    gravatarURL: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const loading = ref(true);
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
} finally {
    loading.value = false;
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
        <div class="absolute top-0 left-0 w-screen h-screen bg-slate-900 z-50" v-if="loading">
            <div class="flex items-center justify-center w-full h-full">
                <div class="flex flex-col items-center space-y-4">
                    <p class="pi pi-spin pi-spinner text-blue-500"></p>
                </div>
            </div>
        </div>
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
                :globalFilterFields="['firstname', 'lastname', 'birthdate', 'employeeid', 'salary', 'role', 'manager', 'joiningdate', 'leavedays', 'linkedin', 'email', 'bio']" :options="{ rowExpansionTemplate: 'expansion', size: 'small' }" stripedRows class="text-sm">
            <template #empty> No employees found. </template>
            <template #loading> Loading employees data. Please wait. </template>
            <Column field="employeeid" header="Employee ID" sortable>
                <template #body="{ data }">
                    {{ data.employeeid }}
                </template>
            </Column>
            <Column field="firstname" header="First Name" sortable>
                <template #body="{ data }">
                    {{ data.firstname }}
                </template>
            </Column>
            <Column field="lastname" header="Last Name" sortable>
                <template #body="{ data }">
                    {{ data.lastname }}
                </template>
            </Column>
            <Column field="birthdate" header="Birth Date" sortable>
                <template #body="{ data }">
                    {{ formatDate(new Date(data.birthdate)) }}
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
            <Column field="joiningdate" header="Joining Date" sortable>
                <template #body="{ data }">
                    {{ formatDate(new Date(data.joiningdate)) }}
                </template>
            </Column>
            <Column field="leavedays" header="Leave Days" sortable>
                <template #body="{ data }">
                    {{ data.leavedays }}
                </template>
            </Column>
            <Column field="linkedin" header="linkedin" sortable>
                <template #body="{ data }">
                    <a :href="data.linkedin" target="_blank" class="text-blue-500">{{ data.linkedin }}</a>
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
        </DataTable>

        <div class="fixed right-0 bottom-0 z-40 p-8">
            <NuxtLink to="/">
                <div class="bg-blue-500 border border-blue-700 p-2 px-4 rounded-full flex space-x-2 cursor-pointer hover:bg-opacity-70 duration-300">
                    <i class="pi pi-table text-2xl"></i>
                    <p class="text-center text-white">Switch to Dashboard View</p>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>