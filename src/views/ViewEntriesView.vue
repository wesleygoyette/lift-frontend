<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';

const router = useRouter();
const { entries, isLoading, fetchEntries, deleteEntry } = useEntries();
const searchQuery = ref('');
const isDeleting = ref(false);

const filteredEntries = ref([]);

const updateFilteredEntries = () => {
    if (!searchQuery.value.trim()) {
        filteredEntries.value = entries.value;
    } else {
        const query = searchQuery.value.toLowerCase();
        filteredEntries.value = entries.value.filter(entry =>
            entry.content.toLowerCase().includes(query)
        );
    }
};

onMounted(async () => {
    try {
        await fetchEntries();
        updateFilteredEntries();
    } catch (error) {
        console.error('Error loading entries:', error);
        alert('Failed to load entries: ' + error.message);
    }
});

const handleSearch = () => {
    updateFilteredEntries();
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const handleDelete = async (entryId) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    isDeleting.value = true;
    try {
        await deleteEntry(entryId);
        updateFilteredEntries();
    } catch (error) {
        console.error('Error deleting entry:', error);
        alert('Failed to delete entry: ' + error.message);
    } finally {
        isDeleting.value = false;
    }
};

const getFirstLine = (content, maxLength = 200) => {

    content = content.split("\n")[0];

    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
};

const viewFullEntry = (entry) => {
    router.push(`/entries/${entry.id}`);
};

watch(entries, () => {
    updateFilteredEntries();
}, { immediate: true });

watch(searchQuery, () => {
    updateFilteredEntries();
});
</script>

<template>
    <div class="w-full h-screen text-white">
        <div class="rmx-6 py-6 sm:px-0">
            <div class="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-100 mb-2">All Entries</h2>
                    <p class="text-gray-200">View and manage your fitness journey entries</p>
                </div>

                <!-- Search Bar -->
                <div class="mb-6">
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4">
                        <input v-model="searchQuery" @input="handleSearch" type="text"
                            placeholder="Search your entries..."
                            class="w-full bg-transparent text-white placeholder-gray-400 outline-none text-lg" />
                    </div>
                </div>

                <!-- Main Content Area -->
                <div
                    class="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
                        <div class="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                        <span class="ml-3 text-gray-200">Loading entries...</span>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="filteredEntries.length === 0" class="flex-1 flex items-center justify-center">
                        <div class="text-center">
                            <h3 class="text-xl font-semibold text-gray-200 mb-2">
                                {{ searchQuery ? 'No matching entries found' : 'No entries yet' }}
                            </h3>
                            <p class="text-gray-400 mb-6">
                                {{ searchQuery ? 'Try a different search term' :
                                    'Start documenting your fitness journey today!' }}
                            </p>
                            <router-link v-if="!searchQuery" to="/add"
                                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Add Your First Entry
                            </router-link>
                        </div>
                    </div>

                    <!-- Entries List -->
                    <div v-else class="flex-1 overflow-y-auto p-6">
                        <div class="space-y-4">
                            <button v-for="entry in filteredEntries" :key="entry.id" @click="viewFullEntry(entry)"
                                class="bg-black/20 rounded-lg border border-white/10 p-4 hover:bg-black/30 transition-colors w-full">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="flex items-center space-x-3 mb-2">
                                            <span class="text-sm text-gray-400">
                                                {{ formatDate(entry.created_at) }}
                                            </span>
                                            <span class="text-xs bg-blue-600/30 text-blue-200 px-2 py-1 rounded">
                                                {{ entry.content.split(/\s+/).filter(Boolean).length }} words
                                            </span>
                                        </div>
                                        <p class="text-gray-200 leading-relaxed w-fit">
                                            {{ getFirstLine(entry.content) }}
                                        </p>
                                        <div class="mt-3 flex items-center space-x-3">
                                            <p class="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                                                View Full Entry
                                            </p>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <button @click.stop="handleDelete(entry.id)" :disabled="isDeleting"
                                            class="text-red-400 hover:text-red-300 p-2 rounded transition-colors disabled:opacity-50"
                                            title="Delete entry">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    <!-- Bottom Bar -->
                    <div class="border-t border-white/20 p-4 bg-black/20">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <span class="text-sm text-gray-300">
                                    {{ filteredEntries.length }} {{ filteredEntries.length === 1 ? 'entry' : 'entries'
                                    }}
                                    {{ searchQuery ? 'found' : 'total' }}
                                </span>
                            </div>

                            <div class="flex items-center space-x-3">
                                <router-link to="/dashboard"
                                    class="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Dashboard
                                </router-link>

                                <router-link to="/add"
                                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    <span>Add Entry</span>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hide scrollbars but keep scroll functionality */
.overflow-y-auto {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
}

.overflow-y-auto::-webkit-scrollbar {
    display: none;
    /* Safari and Chrome */
}
</style>
