<script setup lang="ts">

// check if user is authenticated
// if (!useAuth()) {
    // navigateTo('/login');

// Get logged in user

onBeforeMount(async () => {
    if (!useAuth()) {
        navigateTo('/login');
    }
    const { data } = useAuth();
    const orgID = ref('');
    orgID.value = data.value?.user?.orgId || '';

    console.log(orgID.value);

    try {
        const response = await useFetch('/api/read/employees', {
            method: 'POST',  // Use POST since you're sending a body
            body: JSON.stringify({ orgId: orgID.value }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.value) {
            console.log(response.data.value);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>