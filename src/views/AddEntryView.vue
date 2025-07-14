<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEntries } from '@/composables/useEntries';

const entry = ref('');
const isLoading = ref(false);
const placeholder = ref('Tell me about your workout, nutrition, or personal goals...');
const router = useRouter();
const { createEntry } = useEntries();

const handleSubmit = async () => {
  if (!entry.value.trim()) return;

  isLoading.value = true;

  try {
    await createEntry(entry.value);

    entry.value = '';

    await router.push('/entries');
  } catch (error) {
    console.error('Error saving entry:', error);
    // You might want to show a toast notification or error message here
    alert('Failed to save entry: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    handleSubmit();
  }
};
</script>

<template>
  <div class="w-full h-screen">
    <div class="mx-6 py-6 sm:px-0">
      <div class="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-100 mb-2">Add New Entry</h2>
            <p class="text-gray-200">Share your fitness journey, nutrition insights, or personal goals</p>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
            <!-- Input Area -->
            <div class="flex-1 p-6">
              <div class="h-full">
                <textarea
                  v-model="entry"
                  @keydown="handleKeyDown"
                  :placeholder="placeholder"
                  class="w-full h-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-lg leading-relaxed"
                  :disabled="isLoading"
                />
              </div>
            </div>

            <!-- Bottom Bar -->
            <div class="border-t border-white/20 p-4 bg-black/20">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-300">
                    {{ entry.trim().split(/\s+/).filter(Boolean).length }} words
                  </span>
                  <span class="text-xs text-gray-400">
                    Tip: Press ⌘+Enter to submit
                  </span>
                </div>

                <div class="flex items-center space-x-3">
                  <router-link
                    to="/dashboard"
                    class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Back
                  </router-link>

                  <button
                    @click="handleSubmit"
                    :disabled="!entry.trim() || isLoading"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                  >
                    <span v-if="isLoading" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>{{ isLoading ? 'Saving...' : 'Save' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  </div>
</template>

<style scoped>
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
