<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppNavigation from '@/components/AppNavigation.vue'
import WelcomeWall from '@/components/WelcomeWall.vue'
import { computed } from 'vue'

const route = useRoute()

const showNavigation = computed(() => {
    return ['dashboard'].includes(route.name)
})
</script>

<template>
    <div class="fixed w-screen min-h-screen">
        <WelcomeWall class="w-screen h-screen">
            <AppNavigation v-if="showNavigation" />
            <RouterView />
        </WelcomeWall>
    </div>
</template>
