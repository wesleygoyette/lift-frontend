<script setup>
import WelcomeWall from '@/components/WelcomeWall.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter()
const { isAuthenticated } = useAuth()

const buttonText = computed(() => {
  return isAuthenticated.value ? "Dashboard" : "Login"
})

const handleButtonClick = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <main class="fixed w-screen h-screen flex flex-col items-center">
    <WelcomeWall class="fixed top-0 left-0">
      <div class="w-full flex flex-col items-center h-screen">
        <h1 class="permanent-marker-regular text-[98px] flex gap-[12px] mt-[10vh] items-baseline">P<span class="text-[48px] mr-[32px]">ersonal</span>R<span class="text-[48px]">ecord</span></h1>
        <button
          @click="handleButtonClick"
          class="text-[16px] text-black bg-gray-200 font-bold px-4 py-1 rounded-full mt-[10vh]"
          style="box-shadow: 0 0px 8px 0 white;"
        >
          {{buttonText}}
        </button>
      </div>
    </WelcomeWall>

  </main>
</template>
