<template>
    <div class="bg-slate-900 rounded-md w-full">
        <div class="space-y-4">
            <p class="text-xl">Your Team</p>
            <EmployeeCard v-for="employee in employees" :key="employee.id" :employee="employee" :employees="employees"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Employee } from '~/interfaces/Employee';

const props = defineProps<{
    employees: Employee[]
}>();
</script>

