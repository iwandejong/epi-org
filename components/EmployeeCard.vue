<script setup lang="ts">
import { ref } from "vue";

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

// employees.value = orgData.value.body.map((employee) => {
//         return {
//             id: employee.id,
//             firstName: employee.firstName,
//             lastName: employee.lastName,
//             birthDate: employee.birthDate,
//             employeeId: employee.employeeId,
//             salary: employee.salary,
//             role: employee.role,
//             manager: employee.manager,
//             joiningDate: employee.joiningDate,
//             leaveDays: employee.leaveDays,
//             linkedIn: employee.linkedIn,
//             email: employee.email,
//             bio: employee.bio,
//             gravatarUrl: employee.gravatarUrl
//         }
//     });

// define props
const props = defineProps<{
    employee: Object,
}>();

let salary = props.employee.salary / 1000;
salary = Math.round(salary * 10) / 10;
salary = "R" + salary + "k";

// convert dates to short format
props.employee.joiningDate = new Date(props.employee.joiningDate).toLocaleDateString();
props.employee.birthDate = new Date(props.employee.birthDate).toLocaleDateString();

console.log(props.employee);

const gravatar = ref('');
const gravatarProfileUrl = props.employee.gravatarUrl;
const loadingGrav = ref(true);

fetch(`${gravatarProfileUrl}.json`)
.then(response => response.json())
.then(data => {
    gravatar.value = data.entry[0].thumbnailUrl;
    console.log(gravatar.value);
    loadingGrav.value = false;
})
.catch(err => {
    console.error('Error fetching Gravatar profile:', err);
})
</script>

<template>
    <div>
        <Dialog v-model:visible="visible" modal header="Edit Employee Profile">
            <div class="space-y-4">

                <span class="text-surface-500 dark:text-surface-400 block">Update your information.</span>
                <!-- <div class="flex items-center gap-4 mb-4">
                    <label for="username" class="font-semibold w-24">Username</label>
                    <InputText id="username" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <InputText id="email" class="flex-auto" autocomplete="off" />
                </div> -->
    
                <!-- take from employee -->
                <div class="grid grid-cols-2 gap-y-4 gap-x-8 *:flex *:items-center *:gap-4">
    
                    <div class="">
                        <label for="firstName" class="font-semibold w-24">First Name</label>
                        <InputText id="firstName" class="flex-auto" autocomplete="off" :value="employee.firstName" />
                    </div>
                    <div class="">
                        <label for="lastName" class="font-semibold w-24">Last Name</label>
                        <InputText id="lastName" class="flex-auto" autocomplete="off" :value="employee.lastName" />
                    </div>
                    <div class="">
                        <label for="role" class="font-semibold w-24">Role</label>
                        <InputText id="role" class="flex-auto" autocomplete="off" :value="employee.role" />
                    </div>
                    <div class="">
                        <label for="salary" class="font-semibold w-24">Salary</label>
                        <InputText id="salary" class="flex-auto" autocomplete="off" :value="salary" />
                    </div>
                    <div class="">
                        <label for="leaveDays" class="font-semibold w-24">Leave Days</label>
                        <InputText id="leaveDays" class="flex-auto" autocomplete="off" :value="employee.leaveDays" />
                    </div>
                    <div class="">
                        <label for="linkedIn" class="font-semibold w-24">LinkedIn</label>
                        <InputText id="linkedIn" class="flex-auto" autocomplete="off" :value="employee.linkedIn" />
                    </div>
                    <div class="">
                        <label for="email" class="font-semibold w-24">Email</label>
                        <InputText id="email" class="flex-auto" autocomplete="off" :value="employee.email" />
                    </div>
                    <div class="">
                        <label for="bio" class="font-semibold w-24">Bio</label>
                        <InputText id="bio" class="flex-auto" autocomplete="off" :value="employee.bio" />
                    </div>
                    <div class="">
                        <label for="joiningDate" class="font-semibold w-24">Joining Date</label>
                        <InputText id="joiningDate" class="flex-auto" autocomplete="off" :value="employee.joiningDate" />
                    </div>
                    <div class="">
                        <label for="birthDate" class="font-semibold w-24">Birth Date</label>
                        <InputText id="birthDate" class="flex-auto" autocomplete="off" :value="employee.birthDate" />
                    </div>
                    <div class="">
                        <label for="manager" class="font-semibold w-24">Manager</label>
                        <InputText id="manager" class="flex-auto" autocomplete="off" :value="employee.manager" />
                    </div>
                    <div class="">
                        <label for="gravatarUrl" class="font-semibold w-24">Gravatar URL</label>
                        <InputText id="gravatarUrl" class="flex-auto" autocomplete="off" :value="employee.gravatarUrl" />
                    </div>
                </div>
    
                <div class="flex justify-between gap-2">
                    <Button type="button" label="Delete Employee" severity="danger" outlined @click="visible = false" class="text-red-500"></Button>
                    <div class="flex gap-2">
                        <Button type="button" label="Update Employee" @click="visible = false"></Button>
                        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                    </div>
                </div>
            </div>
        </Dialog>
        <div class="bg-slate-900 border border-slate-700 rounded-md p-6 w-full h-full hover:border-blue-500 cursor-pointer duration-300">
            <div ref="wrapper" class="grid grid-cols-5 items-center w-full h-full _transition-all duration-1000 ease-in-out">
                <div ref="profile" class="flex _flex-col _justify-end col-span-4 items-center space-x-4 _space-y-4 _bg-gradient-to-t from-blue-700 to-pink-600 _p-6 _rounded-md h-full bg-opacity-0">
                    <div class="h-12 w-12 bg-blue-900 rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center" @click="toggle">
                        <div v-if="gravatar.value !== '' && !loadingGrav">
                            <img :src="gravatar" alt="Gravatar" class="rounded-full h-12 w-12">
                        </div>
                        <div v-else class="text-blue-500">
                            {{ employee.firstName.charAt(0).toUpperCase() + employee.lastName.charAt(0).toUpperCase() }}
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="text-lg flex items-center space-x-2">
                            <p>
                                {{ employee.firstName + " " + employee.lastName }}
                            </p>
                            <a class="pi pi-linkedin hover:opacity-70 duration-300" :href="employee.linkedIn" target="_blank" v-if="active"></a>
                            <a class="pi pi-envelope hover:opacity-70 duration-300" :href="`mailto:${employee.email}`" v-if="active"></a>
                        </div>
                        <p class="text-slate-400 text-sm">
                            {{ employee.role }}
                        </p>
                    </div>
                </div>
                <div ref="info" class="hidden col-span-3 pl-8 space-y-8 _transition-all duration-1000 ease-in-out"> 
                    <div>
                        <p class="text-lg">Bio</p>
                        <p class="text-slate-400 text-sm">
                            {{ employee.bio }}
                        </p>
                    </div>
                    <div class="flex w-full justify-between">
                        <div>
                            <p class="">Salary</p>
                            <p class="text-slate-400">
                                {{ salary }}
                            </p>
                        </div>
                        <div>
                            <p class="">Joining Date</p>
                            <p class="text-slate-400">
                                {{ employee.joiningDate }}
                            </p>
                        </div>
                        <div>
                            <p class="">Leave Days</p>
                            <p class="text-slate-400">
                                {{ employee.leaveDays }}
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
                    <a class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 shrink-0" :href="employee.linkedIn">
                        <p class="pi pi-linkedin" :href="employee.linkedIn" target="_blank"></p>
                    </a>
                    <a class="flex items-center space-x-4 h-12 w-12 justify-center rounded-full hover:bg-slate-700 shrink-0" :href="`mailto:${employee.email}`">
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
