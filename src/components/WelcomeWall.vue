<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const blockSize = 2
const spaceSize = 20
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const colorSeed = ref(0)
const mouseX = ref(-9999)
const mouseY = ref(-9999)

const canvas = ref(null)
const ctx = ref(null)

const gridCols = computed(() => Math.floor(width.value / spaceSize))
const gridRows = computed(() => Math.floor(height.value / spaceSize))
const totalBlocks = computed(() => gridCols.value * gridRows.value)

const blockColors = ref([])
const targetColors = ref([])
const colorTransitions = ref([])

function updateSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight

    if (canvas.value) {
        canvas.value.width = width.value
        canvas.value.height = height.value
    }

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

function parseRgb(rgb) {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0]
}

function rgbToString(r, g, b) {
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

function interpolateColor(from, to, t) {
    const fromRgb = parseRgb(from)
    const toRgb = parseRgb(to)

    return rgbToString(
        fromRgb[0] + (toRgb[0] - fromRgb[0]) * t,
        fromRgb[1] + (toRgb[1] - fromRgb[1]) * t,
        fromRgb[2] + (toRgb[2] - fromRgb[2]) * t
    )
}

function generateColors() {
    const newColors = []
    const newTargetColors = []
    const newTransitions = []

    for (let i = 0; i < totalBlocks.value; i++) {
        const color = getRandomColor()
        newColors.push(color)
        newTargetColors.push(color)
        newTransitions.push({ progress: 1, duration: 0 })
    }

    blockColors.value = newColors
    targetColors.value = newTargetColors
    colorTransitions.value = newTransitions
}

function updateColors() {
    for (let i = 0; i < totalBlocks.value; i++) {
        if (Math.random() < 0.15) {
            const newColor = getRandomColor()
            targetColors.value[i] = newColor
            colorTransitions.value[i] = {
                progress: 0,
                duration: 300 + Math.random() * 200 // 300-500ms transition
            }
        }
    }
    colorSeed.value = Math.random()
}

function updateTransitions(deltaTime) {
    for (let i = 0; i < colorTransitions.value.length; i++) {
        const transition = colorTransitions.value[i]
        if (transition.progress < 1) {
            transition.progress = Math.min(1, transition.progress + deltaTime / transition.duration)

            // Ease-out function for smoother transitions
            const easeProgress = 1 - Math.pow(1 - transition.progress, 3)

            blockColors.value[i] = interpolateColor(
                blockColors.value[i],
                targetColors.value[i],
                easeProgress - (transition.progress - deltaTime / transition.duration > 0 ? 1 - Math.pow(1 - (transition.progress - deltaTime / transition.duration), 3) : 0)
            )

            if (transition.progress >= 1) {
                blockColors.value[i] = targetColors.value[i]
            }
        }
    }
}

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
        const baseRgb = parseRgb(baseColor)
        const blended = baseRgb.map((v, i) => Math.round(v * t + proximityColor[i] * (1 - t)))
        return `rgb(${blended[0]}, ${blended[1]}, ${blended[2]})`
    }

    return baseColor
}

function drawBlocks() {
    if (!ctx.value) return

    // Clear canvas
    ctx.value.fillStyle = '#000000'
    ctx.value.fillRect(0, 0, width.value, height.value)

    // Draw all blocks
    for (let col = 0; col < gridCols.value; col++) {
        for (let row = 0; row < gridRows.value; row++) {
            const color = getBlockColor(col, row)
            ctx.value.fillStyle = color

            const x = 16 + (col * spaceSize)
            const y = 16 + (row * spaceSize)

            ctx.value.fillRect(x, y, blockSize, blockSize)
        }
    }
}

let animationId = null
let lastTime = 0

function animate(currentTime) {
    const deltaTime = currentTime - lastTime
    lastTime = currentTime

    updateTransitions(deltaTime)
    drawBlocks()
    animationId = requestAnimationFrame(animate)
}

onMounted(() => {
    ctx.value = canvas.value.getContext('2d')
    canvas.value.width = width.value
    canvas.value.height = height.value

    window.addEventListener('resize', updateSize)
    window.addEventListener('mousemove', updateMousePosition)
    generateColors()

    const colorInterval = setInterval(updateColors, 100)

    lastTime = performance.now()
    animate(lastTime)

    onBeforeUnmount(() => {
        clearInterval(colorInterval)
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
        window.removeEventListener('resize', updateSize)
        window.removeEventListener('mousemove', updateMousePosition)
    })
})
</script>

<template>
    <div class="relative w-full h-full bg-black">
        <canvas ref="canvas" class="absolute top-0 left-0 w-full h-full" :width="width" :height="height" />
        <div class="absolute top-0 left-0 w-full h-full welcomeWallGradient" style="z-index: 10; pointer-events: none;">
        </div>
        <div class="absolute top-0 left-0 w-full" style="z-index: 20;">
            <slot />
        </div>
    </div>
</template>
