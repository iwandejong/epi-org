<template>
    <div class="bg-slate-900 rounded-md w-full h-full">
        <div class="space-y-4">
            <div>
                <p class="text-xl">Organisation Tree</p>
                <p class="text-slate-400 text-sm">The organisation tree shows the hierarchy of employees in the organisation. You are highlighted in blue.</p>
            </div>
            <div class="flex mb-4">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search employees..." 
                    class="p-2 border border-slate-700 rounded-md w-full"
                />
                <button 
                    @click="search" 
                    class="ml-2 bg-blue-500 text-white p-2 rounded-md"
                >
                    Search
                </button>
            </div>
            <div class="border border-slate-700 rounded-md pt-6 flex justify-center">
                <OrganizationChart v-model:selectionKeys="selection" :value="filteredData" collapsible selectionMode="single">
                    <template #person="slotProps">
                        <div class="flex flex-col">
                            <div class="flex flex-col items-center">
                                <img :src="slotProps.node.data.image" class="mb-4 w-12 h-12 rounded-full" v-if="slotProps.node.data.image.length > 0"/>
                                <div v-else class="h-12 w-12 text-blue-500 bg-blue-900 rounded-full  flex items-center justify-center mb-4">
                                    <span>
                                        <!-- capitalize first letter and first letter after space -->
                                        {{ slotProps.node.data.name[0].toUpperCase() }}
                                    </span>
                                </div>
                                <span class="font-bold mb-2">{{ slotProps.node.data.name }}</span>
                                <span class="text-slate-400 text-sm">{{ slotProps.node.data.title }}</span>
                            </div>
                        </div>
                    </template>
                    <template #default="slotProps">
                        <span>{{ slotProps.node.label }}</span>
                    </template>
                </OrganizationChart>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OrganizationChart from "primevue/organizationchart";
import type { Tree } from "~/interfaces/Tree";


// define props
const props = defineProps<{
    tree: Tree;
    authData: any;
}>();

const empID = ref(0);
empID.value = props.authData.user?.id || '';

console.log(empID.value);

console.log(props.tree);

function convertTreeToPrimeVueFormat(tree: Tree): any {
    return {
        key: tree.id,
        type: 'person',
        styleClass: `${tree.id === empID.value ? '!bg-blue-500' : ''}`,
        data: {
            image: tree.gravatarurl,
            name: `${tree.firstname} ${tree.lastname}`,
            title: tree.role
        },
        children: Array.isArray(tree.children)
            ? tree.children.map(child => convertTreeToPrimeVueFormat(child as Tree))
            : []
    };
}


const originalData = ref(convertTreeToPrimeVueFormat(props.tree[0]));
const data = ref(originalData.value);
const searchQuery = ref('');

console.log(data.value);

// highlight the current user in the tree (empID)
const selection = ref({});

const filteredData = computed(() => {
    function filterNode(node: any, query: string, isBestMatch = false): any {
        const matches = node.data.name.toLowerCase().includes(query.toLowerCase());
        let highlight = isBestMatch;

        selection.value[node.key] = matches;

        const children = node.children.map(child => filterNode(child, query, highlight)).filter(Boolean);

        return {
            ...node,
            data: {
                ...node.data,
            },
            children: children
        };
    }

    return filterNode(data.value, searchQuery.value, false);
});

function search() {
    data.value = originalData.value;
}
</script>
