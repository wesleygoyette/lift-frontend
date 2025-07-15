<template>
    <nav class="bg-gradient-to-r from-[rgb(23,23,23)] to-[rgb(51,51,51)] shadow-sm h-[64px]">
        <div class="px-[32px] w-full h-full flex justify-between items-center">
            <router-link to="/" class="permanent-marker-regular text-xl text-gray-200 hover:text-gray-400">
                Personal Record
            </router-link>

            <div class="flex items-center space-x-4">
                <template v-if="isAuthenticated">
                    <span class="text-sm text-gray-200">{{ user?.name }}</span>

                    <button @click="handleLogout"
                        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm">
                        Logout
                    </button>
                </template>
                <template v-else>
                    <router-link to="/login" class="text-blue-600 hover:text-blue-500 font-medium">
                        Login
                    </router-link>
                    <router-link to="/register"
                        class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm">
                        Sign Up
                    </router-link>
                </template>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const handleLogout = async () => {
    await logout()
    router.push('/')
}
</script>
