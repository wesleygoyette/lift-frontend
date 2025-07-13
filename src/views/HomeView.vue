<script setup>
import { ref, onMounted } from 'vue';
import WelcomeWall from '@/components/WelcomeWall.vue';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const pdfCanvas = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const pdf = await pdfjsLib.getDocument('/resume.pdf').promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 10 });

    const canvas = pdfCanvas.value;
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    isLoading.value = false;
  } catch (error) {
    console.error('Error loading PDF:', error);
    isLoading.value = false;
  }
});

</script>

<template>
  <main class="flex flex-col items-center">
    <WelcomeWall>
      <div class="w-full h-full flex flex-col items-center mt-[20vh]">
        <h1 class="text-[69px]">Wesley Goyette</h1>
        <h3 class="mt-[12px] text-[16px]">Developer Portfolio</h3>
      </div>
    </WelcomeWall>

    <div class="bg-gradient-to-b from-[#080833] to-black w-full h-full flex flex-col items-center">
      <div class="bg-white text-black max-w-[700px] w-[90%] p-0 mt-[-40px] z-10 flex flex-col items-center borderGradient aspect-[0.772727] relative">
        <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
          <div class="text-gray-500">Loading PDF...</div>
        </div>
        <canvas
          ref="pdfCanvas"
          v-show="!isLoading"
          class="w-full h-full object-contain"
          style="pointer-events: none;"
        />
      </div>
    </div>

  </main>
</template>
