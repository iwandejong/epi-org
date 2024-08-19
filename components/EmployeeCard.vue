<script setup lang="ts">
import { ref } from "vue";
import type { Employee } from '~/interfaces/Employee';

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

const visible = ref(false);

// define props
const props = defineProps<{
    employee: Employee,
    employees: Employee[]
}>();

console.log(props.employees);

// remove employee from employees list
const otherEmployees = ref(props.employees);
otherEmployees.value = props.employees.filter(e => e.employeeId !== props.employee.employeeId);

// filter out if other employee is already managed by current employee
otherEmployees.value = otherEmployees.value.filter(e => e.manager !== props.employee.employeeId);

console.log(otherEmployees.value);

let salary = props.employee.salary / 1000;
salary = Math.round(salary * 10) / 10;
let s = "R" + salary + "k";

// convert dates to short format
props.employee.joiningDate = new Date(props.employee.joiningDate).toLocaleDateString();
props.employee.birthDate = new Date(props.employee.birthDate).toLocaleDateString();

// console.log(props.employee);

const gravatar = ref('');
const gravatarProfileUrl = props.employee.gravatarURL;
const loadingGrav = ref(true);

fetch(`${gravatarProfileUrl}.json`)
.then(response => response.json())
.then(data => {
    gravatar.value = data.entry[0].thumbnailUrl;
    // console.log(gravatar.value);
    loadingGrav.value = false;
})
.catch(err => {
    console.error('Error fetching Gravatar profile:', err);
})

const loading = ref(false);
const toast = useToast();

const salaryString = computed({
  get() {
    return props.employee.salary.toString();
  },
  set(value) {
    props.employee.salary = Number(value);
  },
});

const leaveDaysString = computed({
  get() {
    return props.employee.leaveDays.toString();
  },
  set(value) {
    props.employee.leaveDays = Number(value);
  },
});

async function handleUpdate() {
    if (loading.value) return;

    // drop props.employee.password
    delete props.employee.password;

    try {
        loading.value = true;
        const result = await $fetch('/api/update/employee', {
            method: 'POST',
            body: props.employee,
        });

        if (result.statusCode !== 200) {
            toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Please try again', life: 3000 });
            loading.value = false;
            return;
        } else {
            toast.add({ severity: 'success', summary: 'Update Complete', detail: 'Your account has been updated. Refreshing page...', life: 3000 });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            return;
        }
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Internal Server Error', life: 3000 });
        return err;
    } finally {
        loading.value = false;
        return;
    }
}

async function deleteEmp() {
    if (loading.value) return;

    try {
        loading.value = true;
        const result = await $fetch('/api/delete/employee', {
            method: 'POST',
            body: { employeeId: props.employee.employeeId },
        });

        if (result.statusCode !== 200) {
            toast.add({ severity: 'error', summary: 'Delete Failed', detail: 'Please try again', life: 3000 });
            loading.value = false;
            return;
        } else {
            toast.add({ severity: 'success', summary: 'Delete Complete', detail: 'Employee has been deleted. Refreshing page...', life: 3000 });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            return;
        }
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Delete Failed', detail: 'Internal Server Error', life: 3000 });
        return err;
    } finally {
        loading.value = false;
        return;
    }
}
</script>

<template>
    <div>
        <Dialog v-model:visible="visible" modal header="Edit Employee Profile">
            <form @submit.prevent="handleUpdate">
                <div class="space-y-4">
                    <span class="text-surface-500 dark:text-surface-400 block">Update your information.</span>
                    <div class="grid grid-cols-2 gap-y-4 gap-x-8 *:flex *:items-center *:gap-4">
        
                        <div class="">
                            <label for="firstName" class="font-semibold w-24">First Name</label>
                            <InputText id="firstName" class="flex-auto" autocomplete="off" v-model="props.employee.firstName" disabled/>
                        </div>
                        <div class="">
                            <label for="lastName" class="font-semibold w-24">Last Name</label>
                            <InputText id="lastName" class="flex-auto" autocomplete="off" v-model="props.employee.lastName" disabled/>
                        </div>
                        <div class="">
                            <label for="role" class="font-semibold w-24">Role</label>
                            <InputText id="role" class="flex-auto" autocomplete="off" v-model="props.employee.role" />
                        </div>
                        <div class="">
                            <label for="salary" class="font-semibold w-24">Monthly Salary (R)</label>
                            <InputText id="salary" type="number" class="flex-auto" autocomplete="off" v-model="salaryString" />
                        </div>
                        <div class="">
                            <label for="leaveDays" class="font-semibold w-24">Leave Days</label>
                            <InputText id="leaveDays" type="number" class="flex-auto" autocomplete="off" v-model="leaveDaysString" />
                        </div>
                        <div class="">
                            <label for="linkedIn" class="font-semibold w-24">LinkedIn</label>
                            <InputText id="linkedIn" class="flex-auto" autocomplete="off" v-model="props.employee.linkedIn" disabled/>
                        </div>
                        <div class="">
                            <label for="email" class="font-semibold w-24">Email</label>
                            <InputText id="email" class="flex-auto" autocomplete="off" v-model="props.employee.email" disabled/>
                        </div>
                        <div class="">
                            <label for="bio" class="font-semibold w-24">Bio</label>
                            <InputText id="bio" class="flex-auto" autocomplete="off" v-model="props.employee.bio" disabled/>
                        </div>
                        <div class="">
                            <label for="joiningDate" class="font-semibold w-24">Joining Date</label>
                            <InputText id="joiningDate" class="flex-auto" autocomplete="off" v-model="props.employee.joiningDate" disabled/>
                        </div>
                        <div class="">
                            <label for="birthDate" class="font-semibold w-24">Birth Date</label>
                            <InputText id="birthDate" class="flex-auto" autocomplete="off" v-model="props.employee.birthDate" disabled/>
                        </div>
                        <div class="">
                            <label for="manager" class="font-semibold w-24">Manager</label>
                            <Select id="manager" class="flex-auto" v-model="props.employee.manager" :options="otherEmployees" optionLabel="firstName" optionValue="employeeId">
                                <template #option="{ option }">
                                    <div class="flex items-center space-x-2">
                                        <div class="h-12 w-12 bg-blue-900 rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center text-blue-500">
                                            {{ option.firstName.charAt(0).toUpperCase() + option.lastName.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <p>
                                                {{ option.firstName + ' ' + option.lastName }}
                                            </p>
                                            <p class="text-sm text-slate-400">
                                                {{ option.role }}
                                            </p>
                                        </div>
                                    </div>
                                </template>
                             </Select>
                        </div>
                        <div class="">
                            <label for="gravatarURL" class="font-semibold w-24">Gravatar URL</label>
                            <InputText id="gravatarURL" class="flex-auto" autocomplete="off" v-model="props.employee.gravatarURL" disabled/>
                        </div>
                    </div>
        
                    <div class="flex justify-between gap-2">
                        <Button type="button" label="Delete Employee" severity="danger" outlined @click="deleteEmp" class="text-red-500"></Button>
                        <div class="flex gap-2">
                            <Button type="submit" label="Update Employee"></Button>
                            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
        <div class="bg-slate-900 border border-slate-700 rounded-md p-6 w-full h-full hover:border-blue-500 cursor-pointer duration-300">
            <div ref="wrapper" class="grid grid-cols-5 items-center w-full h-full _transition-all duration-1000 ease-in-out">
                <div ref="profile" class="flex _flex-col _justify-end col-span-4 items-center space-x-4 _space-y-4 _bg-gradient-to-t from-blue-700 to-pink-600 _p-6 _rounded-md h-full bg-opacity-0">
                    <div class="h-12 w-12 bg-blue-900 rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center" @click="toggle">
                        <div v-if="gravatar !== '' && !loadingGrav">
                            <img :src="gravatar" alt="Gravatar" class="rounded-full h-12 w-12">
                        </div>
                        <div v-else class="text-blue-500">
                            {{ props.employee.firstName.charAt(0).toUpperCase() + props.employee.lastName.charAt(0).toUpperCase() }}
                        </div>
                    </div>
                    <div class="space-y-px">
                        <div class="text-lg flex items-center space-x-2">
                            <p>
                                {{ props.employee.firstName + " " + props.employee.lastName }}
                            </p>
                            <a class="pi pi-linkedin hover:opacity-70 duration-300" :href="props.employee.linkedIn" target="_blank" v-if="active"></a>
                            <a class="pi pi-envelope hover:opacity-70 duration-300" :href="`mailto:${props.employee.email}`" v-if="active"></a>
                        </div>
                        <p class="text-slate-400 text-sm">
                            {{ props.employee.role }}
                        </p>
                    </div>
                </div>
                <div ref="info" class="hidden col-span-3 pl-8 space-y-8 _transition-all duration-1000 ease-in-out"> 
                    <div>
                        <p class="text-lg">Bio</p>
                        <p class="text-slate-400 text-sm">
                            {{ props.employee.bio }}
                        </p>
                    </div>
                    <div class="flex w-full justify-between">
                        <div>
                            <p class="">Salary</p>
                            <p class="text-slate-400">
                                {{ s }}
                            </p>
                        </div>
                        <div>
                            <p class="">Joining Date</p>
                            <p class="text-slate-400">
                                {{ props.employee.joiningDate }}
                            </p>
                        </div>
                        <div>
                            <p class="">Leave Days</p>
                            <p class="text-slate-400">
                                {{ props.employee.leaveDays }}
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <div class="bg-blue-500 flex rounded-md items-center justify-center px-4 hover:opacity-70 cursor-pointer flex-nowrap flex-shrink-0" @click="visible = true">
                            <p>Manage Employee</p>
                        </div>
                        <div class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 flex-shrink-0" @click="toggle">
                            <i class="pi pi-chevron-up text-xl"></i>
                        </div>
                    </div>
                </div>
                <div ref="dropdown" class="h-full flex items-center col-span-1 justify-end _transition-all duration-1000 ease-in-out space-x-2">
                    <a class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 shrink-0" :href="props.employee.linkedIn">
                        <p class="pi pi-linkedin" :href="props.employee.linkedIn" target="_blank"></p>
                    </a>
                    <a class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 shrink-0" :href="`mailto:${props.employee.email}`">
                        <p class="pi pi-envelope"></p>
                    </a>
                    <div class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 shrink-0" @click="toggle">
                        <i class="pi pi-chevron-down text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
