<script setup lang="ts">
import WelcomeWall from '@/components/WelcomeWall.vue';

</script>

<template>
  <div class="w-full h-full text-white bg-red-400">

    <WelcomeWall class="h-[calc(100vh-64px)]">
      <div class="mx-6 py-6 sm:px-0 ">
          <div class="text-center h-[calc(100vh-64px)]">
            <h2 class="text-3xl font-bold text-gray-100 mb-4">Dashboard</h2>
            <p class="text-gray-200 mb-8">Welcome to your personal record dashboard</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-white p-6 rounded-lg shadow">
                <div class="text-2xl font-bold text-blue-600">0</div>
                <div class="text-gray-600">Total Records</div>
              </div>
              <div class="bg-white p-6 rounded-lg shadow">
                <div class="text-2xl font-bold text-green-600">0</div>
                <div class="text-gray-600">Recent Activity</div>
              </div>
              <div class="bg-white p-6 rounded-lg shadow">
                <div class="text-2xl font-bold text-purple-600">0</div>
                <div class="text-gray-600">Achievements</div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link
                to="/add"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Add New Entry
              </router-link>
              <button class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                View All Entries
              </button>
            </div>
          </div>
      </div>
    </WelcomeWall>
  </div>
</template>
