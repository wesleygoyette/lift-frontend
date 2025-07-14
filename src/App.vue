<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppNavigation from '@/components/AppNavigation.vue'
import { computed } from 'vue'

const route = useRoute()

const showNavigation = computed(() => {
  return ['dashboard'].includes(route.name)
})
</script>

<template>
  <AppNavigation v-if="showNavigation" />
  <RouterView />
</template>
