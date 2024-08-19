<template>
    <div class="bg-slate-900 rounded-md w-full">
        <div class="space-y-4">
            <div>
                <p class="text-xl">Team Management</p>
                <p class="text-slate-400 text-sm">Here are the employees under your supervision</p>
            </div>
            <EmployeeCard v-for="employee in employees" :key="employee.id" :employee="employee" :employees="employees" v-if="employees.length > 0"/>
            <div v-else class="text-red-500 flex justify-center w-full">
                <p class="">No employees under your supervision</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Employee } from '~/interfaces/Employee';

const props = defineProps<{
    employees: Employee[],
    employee: Employee
}>();

// get all employees except the current user
// const otherEmployees = props.employees.filter((employee: Employee) => employee.employeeId !== props.employee.employeeId);
</script>

