<template>
  <div class="w-screen h-screen flex items-center justify-center">
    <div class="bg-black p-8 rounded-lg shadow-lg w-full max-w-md border-[0.5px] border-white">
        <div class="text-center mb-8">
          <h1 class="permanent-marker-regular text-3xl text-gray-100">Create Account</h1>
        </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="space-y-2">
          <div class="flex gap-3">
            <div class="flex-1">
              <label for="firstName" class="block text-sm font-medium text-white">First Name</label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                required
                class="w-full px-4 py-3 border bg-black text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent autofill-dark"
                placeholder="First name"
              />
            </div>
            <div class="flex-1">
              <label for="lastName" class="block text-sm font-medium text-white">Last Name</label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                required
                class="w-full px-4 py-3 border bg-black text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent autofill-dark"
                placeholder="Last name"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-white">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border bg-black text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent autofill-dark"
            placeholder="Enter your email"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-white">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border text-white bg-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent autofill-dark"
            placeholder="Enter your password"
          />
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium text-white">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="w-full px-4 py-3 border text-white bg-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent autofill-dark"
            placeholder="Confirm your password"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-left py-1">
            {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-600 text-white text-lg font-bold py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          Already have an account?
          <router-link
            to="/login"
            class="text-green-500 hover:text-green-400 font-medium ml-1"
          >
            Sign in
          </router-link>
        </p>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await register(firstName.value, lastName.value, email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
