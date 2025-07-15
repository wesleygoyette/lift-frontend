<script setup lang="ts">
import { useEntries } from '@/composables/useEntries';
import { computed, onMounted, ref } from 'vue';

let { fetchEntries } = useEntries();

const entries = ref([]);
const isLoading = ref(true);
const fetchEntriesError = ref();

onMounted(async () => {
    try {
        entries.value = await fetchEntries();
        isLoading.value = false;
    } catch (error) {

        if (error.message == "Failed to fetch") {

            error.message = "Network Error"
            fetchEntriesError.value = error
        }
        else {

            fetchEntriesError.value = error;
        }
        isLoading.value = false;
    }
});

const retryFetchEntries = async () => {
    fetchEntriesError.value = null;
    isLoading.value = true;
    try {
        entries.value = await fetchEntries();
        isLoading.value = false;
    } catch (error) {
        fetchEntriesError.value = error;
        isLoading.value = false;
    }
};

const recentEntries = computed(() => {

    return entries.value.filter(e => {

        let date = new Date(e.created_at);

        return (Date.now() - date.getTime()) < 24 * 60 * 60 * 1000;
    })
})
</script>

<template>
    <div class="w-full h-[calc(100vh-64px)] text-white overflow-hidden">
        <div class="mx-6 py-6 sm:px-0 h-full">
            <div class="text-center h-full flex flex-col items-center">
                <h2 v-if="!fetchEntriesError && !isLoading" class="text-3xl font-bold text-gray-100 mb-4">Dashboard</h2>
                <p v-if="!fetchEntriesError && !isLoading" class="text-gray-200 mb-8">Welcome to your personal record
                    dashboard</p>

                <!-- Error Display -->
                <div v-if="fetchEntriesError" class="flex-1 flex items-center justify-center">
                    <div
                        class="bg-[#c1424242] border border-[#c14242] text-white px-4 py-3 rounded mb-6 w-fit flex flex-col gap-[12px]">
                        <div class="font-bold">Error loading entries</div>
                        <div class="text-sm mb-3">{{ fetchEntriesError.message ||
                            'Failed to fetch entries. Please try again.' }}
                        </div>
                        <button @click="retryFetchEntries" :disabled="isLoading"
                            class="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
                            {{ isLoading ? 'Retrying...' : 'Retry' }}
                        </button>
                    </div>
                </div>

                <!-- Cards and buttons - only show if no error and not loading -->
                <template v-if="!fetchEntriesError && !isLoading">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="text-2xl font-bold text-blue-600">
                                {{ entries.length }}
                            </div>
                            <div class="text-gray-600">Total Records</div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="text-2xl font-bold text-green-600">
                                {{ recentEntries.length > 0 ? recentEntries.length == 1 ? `${recentEntries.length}
                                recent entry` : `${recentEntries.length} recent entries` : 'No Recent Activity' }}
                            </div>
                            <div class="text-gray-600">Recent Activity</div>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow">
                            <div class="text-2xl font-bold text-purple-600">0</div>
                            <div class="text-gray-600">Achievements</div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link to="/add"
                            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center">
                            Add New Entry
                        </router-link>
                        <router-link to="/entries"
                            class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block text-center">
                            View All Entries
                        </router-link>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
