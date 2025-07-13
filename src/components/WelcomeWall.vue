<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const blockSize = 2
const spaceSize = 20
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const colorSeed = ref(0)
const mouseX = ref(-9999)
const mouseY = ref(-9999)

const gridCols = computed(() => Math.floor(width.value / spaceSize))
const gridRows = computed(() => Math.floor(height.value / spaceSize))
const totalBlocks = computed(() => gridCols.value * gridRows.value)

const blockColors = ref([])

function updateSize() {
  width.value = window.innerWidth
  height.value = window.innerHeight
  generateColors()
}

function updateMousePosition(event) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

const colorPalette = [
  'rgb(0, 255, 0)',
  'rgb(0, 200, 0)',
  'rgb(0, 150, 0)',
  'rgb(50, 255, 50)',
  'rgb(255, 0, 0)',
  'rgb(200, 0, 0)',
  'rgb(255, 50, 50)',
  'rgb(255, 255, 0)',
  'rgb(200, 200, 0)',
  'rgb(0, 0, 0)',
]

function getRandomColor() {
  const rand = Math.random()
  if (rand > 0.7) {
    return 'rgb(0, 0, 0)'
  } else if (rand > 0.6) {
    return colorPalette[Math.floor(Math.random() * 2) + 7]
  } else if (rand > 0.52) {
    return colorPalette[Math.floor(Math.random() * 3) + 4]
  } else {
    return colorPalette[Math.floor(Math.random() * 4)]
  }
}

function generateColors() {
  const newColors = []
  for (let i = 0; i < totalBlocks.value; i++) {
    newColors.push(getRandomColor())
  }
  blockColors.value = newColors
}

function updateColors() {
  for (let i = 0; i < totalBlocks.value; i++) {
    if (Math.random() < 0.15) {
      blockColors.value[i] = getRandomColor()
    }
  }
  colorSeed.value = Math.random()
}

onMounted(() => {
  window.addEventListener('resize', updateSize)
  window.addEventListener('mousemove', updateMousePosition)
  generateColors()

  const colorInterval = setInterval(updateColors, 100)

  onBeforeUnmount(() => {
    clearInterval(colorInterval)
    window.removeEventListener('resize', updateSize)
    window.removeEventListener('mousemove', updateMousePosition)
  })
})

function getBlockColor(colIndex, rowIndex) {
  const blockIndex = colIndex * gridRows.value + rowIndex
  const baseColor = blockColors.value[blockIndex] || 'rgb(0, 0, 0)'

  const blockX = 16 + (colIndex * spaceSize) + (blockSize / 2)
  const blockY = 16 + (rowIndex * spaceSize) + (blockSize / 2)

  const distance = Math.sqrt(
    Math.pow(mouseX.value - blockX, 2) +
    Math.pow(mouseY.value - blockY, 2)
  )

  const proximityColor = [0, 255, 0]
  const maxDist = 180

  if (distance <= maxDist) {
    const t = distance / maxDist

    const match = baseColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    const baseRgb = match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0]

    const blended = baseRgb.map((v, i) => Math.round(v * t + proximityColor[i] * (1 - t)))
    return `rgb(${blended[0]}, ${blended[1]}, ${blended[2]})`
  }

  return baseColor
}
</script>

<template>
  <div class="flex justify-between w-full h-screen p-[16px] relative bg-black">
    <div class="flex flex-col justify-between" v-for="col in gridCols" :key="`col-${col}`">
      <div
        :style="{
          width: blockSize + 'px',
          height: blockSize + 'px',
          backgroundColor: getBlockColor(col - 1, row - 1),
          transition: 'background-color 0.2s ease-out'
        }"
        v-for="row in gridRows"
        :key="`row-${row}`"
      >
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full welcomeWallGradient" style="z-index: 10; pointer-events: none;">
    </div>
    <div class="absolute top-0 left-0 w-full" style="z-index: 20;">
      <slot/>
    </div>
  </div>
</template>
