<template>
    <div class="bg-slate-900 rounded-md w-full">
        <div class="space-y-4">
            <p class="text-xl">Your Team</p>
            <EmployeeCard v-for="employee in employees" :key="employee.id" :employee="employee"/>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    employees: Object[]
}>();
</script>

