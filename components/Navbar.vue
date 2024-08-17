<script setup lang="ts">
    import { ref } from "vue";
    import { v4 as uuidv4 } from 'uuid';
    import { useClipboard } from '@vueuse/core';

    const visible = ref(false);

    const { signOut } = useAuth();

    const empID = ref('');
    const loading = ref(false);

    const toast = useToast();

    const { data } = useAuth();
    
    const employee = ref();
    employee.value = data.value?.user || '';

    empID.value = data.value?.user?.employeeId || '';

    const account = ref();

    const orgName = ref('');

    // fetch org name
    try {
        const response = await useFetch('/api/read/org', {
            method: 'POST',
            body: JSON.stringify({ orgId: employee.value.orgId }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.error.value) {
            throw new Error('Error fetching data');
        }
        orgName.value = response.data.value.body.name;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error fetching data', detail: 'Please try again later', life: 3000 });
    } finally {
        console.log(orgName.value);
    }

    // try {
    //     const response = await useFetch('/api/read/account', {
    //         method: 'POST',
    //         body: JSON.stringify({ empId: empID.value }),
    //         headers: { 'Content-Type': 'application/json' }
    //     });

    //     if (response.error.value) {
    //         throw new Error('Error fetching data');
    //     }
    //     console.log(response.data.value.body);
    //     account.value = response.data.value.body;
    // } catch (error) {
    //     toast.add({ severity: 'error', summary: 'Error fetching data', detail: 'Please try again later', life: 3000 });
    // } finally {
    //     console.log(account.value);
    // }

    const employees = ref();
    const orgID = ref('');

    const orgData = ref<any>();

    orgID.value = data.value?.user?.orgId || '';

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
                gravatarURL: employee.gravatarURL,
                hierarchyId: employee.hierarchyId
            }
        });

        console.log(employees.value);
    }

    // managers is all employees (just store the employeeId and name and gravatar and role)
    const managers = ref(employees.value.map((emp) => {
        return {
            employeeId: emp.employeeId,
            name: emp.firstName + ' ' + emp.lastName,
            role: emp.role,
            gravatar: emp.gravatarURL
        }
    }));

    account.value = employees.value.find((emp) => emp.employeeId === empID.value);

    console.log(account.value);

    const form = ref({
        firstName: account.value.firstName,
        lastName: account.value.lastName,
        linkedIn: account.value.linkedIn,
        email: account.value.email,
        password: '',
        bio: account.value.bio,
        birthDate: account.value.birthDate,
        gravatarURL: account.value.gravatarURL,

        orgId: account.value.orgId,
        employeeId: account.value.employeeId,
    });

    console.log(form.value);

    const gravatar = ref('');
    const gravatarProfileUrl = account.value.gravatarURL;
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

    // collect gravatars for all managers
    managers.value.forEach((manager) => {
        fetch(`${manager.gravatar}.json`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            manager.gravatar = data.entry[0].thumbnailUrl;
            console.log(manager.gravatar);
        })
        .catch(err => {
            console.error('Error fetching Gravatar profile:', err);
        })
    });

    console.log(managers.value);


    const op = ref();

    const toggle = (event) => {
        op.value.toggle(event);
    }

    async function handleLogout() {
        await signOut();
    }

    async function handleUpdate() {
        if (loading.value) return;

        console.log(employee.value);

        try {
            loading.value = true;
            const result = await $fetch('/api/update/employee', {
                method: 'POST',
                body: form.value,
            });
            let data : any = await result;

            console.log(data);

            if (data.statusCode > 400) {
                toast.add({ severity: 'error', summary: 'Update Failed', detail: 'Please try again', life: 3000 });
                loading.value = false;
                return;
            } else {
                toast.add({ severity: 'success', summary: 'Update Complete', detail: 'Your account has been updated. Refreshing page...', life: 3000 });
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);
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
            console.log('URL changed to:', newPath);
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
        toast.add({ severity: 'info', summary: 'Employee ID', detail: newEmployee.employeeId, life: 3000 });

        try {
            loading.value = true;
            const result = await $fetch('/api/create/employee', {
                method: 'POST',
                body: newEmployee.value,
            });
            let data : any = await result;

            console.log(data);

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
                        <Button type="button" label="Leave Organisation" severity="danger" outlined @click="visible = false" class="text-red-500"></Button>
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
                             <Select id="manager" class="flex-auto" v-model="newEmployee.manager" :options="managers" optionLabel="name" optionValue="employeeId">
                                <template #option="{ option }">
                                    <div class="flex items-center space-x-2">
                                        <div class="h-12 w-12 bg-blue-900 rounded-full shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center text-blue-500">
                                            {{ employee.firstName.charAt(0).toUpperCase() + employee.lastName.charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <p>
                                                {{ option.name }}
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
                        <Button type="submit" icon="pi pi-copy" label="Submit & Copy to Clipboard" severity="primary"></Button>
                    </div>
                </div>
            </form>
        </Dialog>

        <div class="w-full grid grid-cols-2 justify-between py-4 px-40 sticky top-0 bg-slate-900 bg-opacity-40 backdrop-blur-lg">
            <div class="flex items-center space-x-2 text-xl cursor-pointer hover:opacity-80 duration-300" @click="navigateTo('/')">
                <i class="pi pi-sitemap text-2xl rotate-180 bg-gradient-to-tr from-blue-700 to-pink-600 bg-clip-text text-transparent"></i>
                <p>
                    {{ orgName }}
                </p>
                <div class="rounded-full text-xs p-1 px-2 bg-emerald-700 border-2 border-emerald-800">Org Admin</div>
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
                    <div class="h-12 w-12 flex items-center justify-center">
                        <i class="pi pi-question-circle text-xl"></i>
                    </div>
                    <div class="h-12 w-12 flex items-center justify-center">
                        <!-- <i class="pi pi-moon text-xl"></i> -->
                        <i class="pi pi-sun text-xl"></i>
                    </div>
                </div>
                <div class="  shrink-0 cursor-pointer hover:opacity-70 duration-300 flex items-center justify-center" @click="toggle">
                    <div v-if="gravatar.value !== '' && !loadingGrav">
                        <!-- <Chip :image="gravatar" :label="account.firstName + ' ' + account.lastName" class="text-xs rounded-full"/> -->
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
                    <div class="flex flex-col w-56">
                        <div class="hover:bg-slate-800 p-4 cursor-pointer" @click="visible = true">
                            Manage Account
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
