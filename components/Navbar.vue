<script setup lang="ts">
    import { ref } from "vue";
    import { v4 as uuidv4 } from 'uuid';
    import { useClipboard } from '@vueuse/core';
    import { fetchEmployees } from "~/services/fetchEmployees";
    import type { Employee } from "~/interfaces/Employee";
    import type { Organisation } from "~/interfaces/Organisation";

    const visible = ref(false);

    const { signOut } = useAuth();

    const loading = ref(false);
    
    const toast = useToast();
    
    const { data } = useAuth();
    
    const empID = ref('');
    const employees = ref<any>();
    const organisation = ref<any>();
    const account = ref<any>();
    empID.value = data.value?.user?.employeeId || '';

    try {
        organisation.value = await $fetch('/api/read/org', {
            method: 'POST',
            body: { orgId: data.value?.user?.orgId },
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch organisation',
            life: 3000
        });
    }

    try {
        employees.value = await $fetch('/api/read/employees', {
            method: 'POST',
            body: { orgId: data.value?.user?.orgId },
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch employees',
            life: 3000
        });
    }

    employees.value.body.forEach((emp : Employee) => {
        delete emp.password;
    });

    account.value = employees.value.body.find((emp : any) => emp.employeeId === empID.value);

    const form = ref(account.value);

    // console.log(form.value);

    const gravatar = ref('');
    const loadingGrav = ref(true);

    // collect gravatars for all employees
    const gravatars = ref([]);
    employees.value.body.forEach((emp : Employee) => {
        fetch(`${emp.gravatarURL}.json`)
        .then(response => response.json())
        .then(data => {
            gravatars.value.push(data.entry[0].thumbnailUrl);
            if (emp.employeeId === empID.value) {
                gravatar.value = gravatars.value[gravatars.value.length - 1];
            }
        })
        .catch(err => {
            if (emp.employeeId === empID.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch your Gravatar profile. Please update your Gravatar URL.',
                    life: 3000
                });
            }
        })
        .finally(() => {
            loadingGrav.value = false;
        });
    });

    console.log(gravatars.value);
    console.log(gravatar.value);

    const op = ref();

    const toggle = (event) => {
        op.value.toggle(event);
    }

    async function handleLogout() {
        await signOut();
    }

    async function handleUpdate() {
        if (loading.value) return;

        try {
            loading.value = true;
            const result = await $fetch('/api/update/employee', {
                method: 'POST',
                body: form.value,
            });
            let data : any = await result;

            if (data.statusCode > 400) {
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

    const route = useRoute();
    const isTable = ref(route.path === '/table');

    // Watch for changes in the route path
    watch(
        () => route.path,
        (newPath) => {
            isTable.value = newPath === '/table';
            // console.log('URL changed to:', newPath);
        }
    );

    const addEmployee = ref(false);

    function generateEmpID() {
        return uuidv4();
    }
    
    const newEmpID = ref(generateEmpID());
    const textToCopy = ref(newEmpID.value);
    const newEmployee = ref({
        role: '',
        email: '',
        manager: '',
        employeeId: textToCopy.value,
    });

    const { copy } = useClipboard();
    
    async function createAccount() {
        if (loading.value) return;

        if (newEmployee.value.email === '' || newEmployee.value.role === '' || newEmployee.value.manager === '') {
            toast.add({ severity: 'error', summary: 'Missing Fields', detail: 'Please fill in all required fields.', life: 3000 });
            return;
        }

        // first copy the employeeId to the clipboard
        copy(newEmployee.value.employeeId);

        toast.add({ severity: 'success', summary: 'Employee ID Copied', detail: 'The employee ID has been copied to the clipboard.', life: 3000 });

        // prepare Employee object for creation
        // .input('Email', sql.NVarChar, employee.email)
        //         .input('EmployeeId', sql.UniqueIdentifier, employee.employeeId)
        //         .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
        //         .input('OrgId', sql.UniqueIdentifier, employee.orgId)
        //         .input('LeaveDays', sql.Int, employee.leaveDays)
        //         .input('Salary', sql.Float, employee.salary)
        //         .input('Role', sql.NVarChar, employee.role)
        //         .input('ManagerId', sql.UniqueIdentifier, employee.manager)
        const newEmp = {
            ...newEmployee.value,
            orgId: account.value.orgId,
            leaveDays: 0,
            salary: 0,
        };

        try {
            loading.value = true;
            const result = await $fetch('/api/create/employee', {
                method: 'POST',
                body: newEmp,
            });
            let data : any = await result;

            // console.log(data);

            if (data.statusCode > 400) {
                toast.add({ severity: 'error', summary: 'Account Creation Failed', detail: 'Please try again', life: 3000 });
                loading.value = false;
                return;
            } else {
                toast.add({ severity: 'success', summary: 'Account Created', detail: 'The employee account has been created.', life: 3000 });
                loading.value = false;
                return;
            }
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Account Creation Failed', detail: 'Internal Server Error', life: 3000 });
            return err;
        } finally {
            loading.value = false;
            return;
        }
    }

    async function deleteOrg() {
        if (loading.value) return;

        try {
            loading.value = true;
            const result = await $fetch('/api/delete/org', {
                method: 'POST',
                body: { orgId: account.value.orgId },
            });
            let data : any = await result;

            if (data.statusCode > 400) {
                toast.add({ severity: 'error', summary: 'Deletion Failed', detail: 'Please try again', life: 3000 });
                loading.value = false;
                return;
            } else {
                toast.add({ severity: 'success', summary: 'Deletion Complete', detail: 'Your organisation has been deleted. Redirecting...', life: 3000 });
                setTimeout(() => {
                    navigateTo('/login');
                }, 3000);
                return;
            }
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Deletion Failed', detail: 'Internal Server Error', life: 3000 });
            return err;
        } finally {
            loading.value = false;
            return;
        }
    }
</script>

<template>
    <div>
        <Toast />
        <Dialog v-model:visible="visible" modal header="Manage your account">
            <form @submit.prevent="handleUpdate">
                <div class="space-y-4">
                    <span class="text-surface-500 dark:text-surface-400 block">Update your information.</span>
                    <div class="grid grid-cols-2 gap-y-4 gap-x-8 *:flex *:items-center *:gap-4">
        
                        <div class="">
                            <label for="firstName" class="font-semibold w-24">First Name</label>
                            <InputText id="firstName" class="flex-auto" autocomplete="off" v-model="form.firstName" />
                        </div>
                        <div class="">
                            <label for="lastName" class="font-semibold w-24">Last Name</label>
                            <InputText id="lastName" class="flex-auto" autocomplete="off" v-model="form.lastName" />
                        </div>
                        <div class="">
                            <label for="linkedIn" class="font-semibold w-24">LinkedIn</label>
                            <InputText id="linkedIn" class="flex-auto" autocomplete="off" v-model="form.linkedIn" />
                        </div>
                        <div class="">
                            <label for="email" class="font-semibold w-24">Email</label>
                            <InputText id="email" class="flex-auto" autocomplete="off" v-model="form.email" />
                        </div>
                        <div class="">
                            <label for="password" class="font-semibold w-24">Password</label>
                            <InputText id="password" class="flex-auto" autocomplete="off" v-model="form.password" />
                        </div>
                        <div class="">
                            <label for="bio" class="font-semibold w-24">Bio</label>
                            <InputText id="bio" class="flex-auto" autocomplete="off" v-model="form.bio" />
                        </div>
                        <div class="">
                            <label for="birthDate" class="font-semibold w-24">Birth Date</label>
                            <InputText id="birthDate" class="flex-auto" autocomplete="off" v-model="form.birthDate" />
                        </div>
                        <div class="">
                            <label for="gravatarURL" class="font-semibold w-24">Gravatar URL</label>
                            <InputText id="gravatarURL" class="flex-auto" autocomplete="off" v-model="form.gravatarURL" />
                        </div>
                    </div>
        
                    <div class="flex justify-between gap-2">
                        <Button type="button" label="Delete Organisation" severity="danger" outlined @click="deleteOrg" class="text-red-500" v-if="account.manager === null"/>
                        <div v-else></div>
                        <div class="flex gap-2">
                            <Button label="Update Employee" type="submit"></Button>
                            <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="addEmployee" modal header="Add new employee">
            <form @submit.prevent="createAccount">
                <div class="space-y-4">
                    <span class="text-surface-500 dark:text-surface-400 block">An <span class="font-mono text-slate-400">employeeId</span> has been generated. Copy it and share it with the employee.</span>
                    <div class="grid gap-y-4 gap-x-8 *:flex *:items-center *:gap-4">
        
                        <div class="">
                            <label for="email" class="font-semibold w-24">
                                <span>
                                    Email Address
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <InputText id="email" type="email" class="flex-auto" autocomplete="off" v-model="newEmployee.email" />
                        </div>

                        <div class="">
                            <label for="role" class="font-semibold w-24">
                                <span>
                                    Role
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <InputText id="role" type="text" class="flex-auto" autocomplete="off" v-model="newEmployee.role" />
                        </div>

                        <div class="">
                            <label for="manager" class="font-semibold w-24">
                                <span>
                                    Direct Line Manager
                                    <span class="text-red-500">*</span>
                                </span>
                            </label>
                            <!-- <InputText id="manager" class="flex-auto" autocomplete="off" v-model="newEmployee.manager" /> -->
                             <Select id="manager" class="flex-auto" v-model="newEmployee.manager" :options="employees.body" optionLabel="firstName" optionValue="employeeId">
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
                            <label for="employeeId" class="font-semibold w-24">Employee ID</label>
                            <InputText id="employeeId" class="flex-auto cursor-text" autocomplete="off" v-model="newEmployee.employeeId" disabled/>
                        </div>
                    </div>
        
                    <div class="flex justify-center gap-2">
                        <Button type="submit" icon="pi pi-copy" label="Submit & Copy to Clipboard" severity="primary" @click="addEmployee = false"></Button>
                    </div>
                </div>
            </form>
        </Dialog>

        <div class="w-full grid grid-cols-2 justify-between py-4 px-40 sticky top-0 bg-slate-900 bg-opacity-40 backdrop-blur-lg">
            <div class="flex items-center space-x-2 text-xl cursor-pointer hover:opacity-80 duration-300" @click="navigateTo('/')">
                <i class="pi pi-sitemap text-2xl rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p>
                    {{ organisation.body.name }}
                </p>
            </div>
            <div class="flex items-center space-x-6 justify-end flex-shrink-0">
                <div class="flex items-center space-x-6 hover:*:bg-slate-700 *:rounded-full *:duration-300 *:cursor-pointer">
                    <!-- v-if current url is not /table -->
                    <div class="h-12 w-12 flex items-center justify-center" @click="navigateTo('/table')" v-if="!isTable">
                        <i class="pi pi-search text-xl"></i>
                    </div>
                    <div class="h-12 w-12 flex items-center justify-center" @click="navigateTo('/')" v-else>
                        <i class="pi pi-home text-xl"></i>
                    </div>
                    <div class="h-12 w-12 flex items-center justify-center" @click="addEmployee = true">
                        <!-- <i class="pi pi-moon text-xl"></i> -->
                        <i class="pi pi-plus text-xl"></i>
                    </div>
                </div>
                <div class="  shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center" @click="toggle">
                    <div v-if="gravatar != '' && !loadingGrav">
                        <div class="rounded-full text-xs p-1 bg-slate-800 border-2 border-slate-700 flex items-center space-x-2 pr-2">
                            <img :src="gravatar" alt="Gravatar" class="h-8 w-8 rounded-full" />
                            <p>
                                {{ account.firstName + ' ' + account.lastName }}
                            </p>
                        </div>
                    </div>
                    <div v-else class="h-12 w-12 text-blue-500 bg-blue-900 rounded-full  flex items-center justify-center">
                        <span>
                            {{ account.firstName.charAt(0).toUpperCase() + account.lastName.charAt(0).toUpperCase() }}
                        </span>
                    </div>
                </div>
                <Popover ref="op">
                    <div class="flex flex-col w-56 *:rounded-md">
                        <div class="hover:bg-slate-800 p-4 cursor-pointer" @click="visible = true">
                            Manage Account
                            <span v-if="account.manager === null"> & Organisation</span>
                        </div>
                        <div class="hover:bg-slate-800 p-4 cursor-pointer" @click="handleLogout">
                            Sign out
                        </div>
                    </div>
                </Popover>
            </div>
        </div>
    </div>
</template>
