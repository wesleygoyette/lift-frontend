<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';

const route = useRoute();
const router = useRouter();
const { entries, isLoading, fetchEntries, deleteEntry } = useEntries();
const entry = ref(null);
const isDeleting = ref(false);

onMounted(async () => {
  try {
    await fetchEntries();
    const entryId = parseInt(String(route.params.id));
    entry.value = entries.value.find(e => e.id === entryId);

    if (!entry.value) {
      router.push('/entries');
    }
  } catch (error) {
    console.error('Error loading entry:', error);
    alert('Failed to load entry: ' + error.message);
    router.push('/entries');
  }
});

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

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this entry?')) return;

  isDeleting.value = true;
  try {
    await deleteEntry(entry.value.id);
    router.push('/entries');
  } catch (error) {
    console.error('Error deleting entry:', error);
    alert('Failed to delete entry: ' + error.message);
  } finally {
    isDeleting.value = false;
  }
};

const goBack = () => {
  router.push('/entries');
};
</script>

<template>
  <div class="w-full h-screen text-white overflow-hidden">
    <div class="px-6 py-6 sm:px-0 h-full">
      <div class="max-w-4xl mx-auto h-full flex flex-col">
          <!-- Header -->
          <div class="text-center mb-6 flex-shrink-0">
            <h2 class="text-3xl font-bold text-gray-100 mb-2">Entry Details</h2>
            <p class="text-gray-200">View your fitness journey entry</p>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <!-- Loading State -->
            <div v-if="isLoading || !entry" class="flex-1 flex items-center justify-center">
              <div class="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
              <span class="ml-3 text-gray-200">Loading entry...</span>
            </div>

            <!-- Entry Content -->
            <div v-else class="flex-1 flex flex-col min-h-0">
              <!-- Entry Header -->
              <div class="border-b border-white/20 p-6 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-400 text-sm mb-1">
                      {{ formatDate(entry.created_at) }}
                    </p>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs bg-blue-600/30 text-blue-200 px-2 py-1 rounded">
                        {{ entry.content.split(/\s+/).filter(Boolean).length }} words
                      </span>
                    </div>
                  </div>
                  <button
                    @click="handleDelete"
                    :disabled="isDeleting"
                    class="text-red-400 hover:text-red-300 p-2 rounded transition-colors disabled:opacity-50"
                    title="Delete entry"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Entry Content -->
              <div class="flex-1 overflow-y-auto p-6">
                <div class="bg-white/5 rounded-lg p-6">
                  <p class="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">{{ entry.content }}</p>
                </div>
              </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-white/20 p-4 bg-black/20 flex-shrink-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-300" v-if="entry">
                    Created {{ formatDate(entry.created_at) }}
                  </span>
                </div>

                <div class="flex items-center space-x-3">
                  <button
                    @click="goBack"
                    class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    ← Back to Entries
                  </button>

                  <router-link
                    to="/add"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
