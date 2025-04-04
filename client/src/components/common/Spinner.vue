<template>
  <div
    class="relative animate-spin"
    role="progressbar"
    aria-label="Progress circle"
    :aria-valuenow="safeValue"
    aria-valuemin="0"
    :aria-valuemax="max"
  >
    <svg
      :width="diameter"
      :height="diameter"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      class="-rotate-90 transform"
    >
      <circle
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
        :stroke-width="strokeWidth"
        fill="transparent"
        stroke-linecap="round"
        :class="variantClasses.background"
      />
      <circle
        v-if="safeValue >= 0"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        fill="transparent"
        stroke-linecap="round"
        :class="[
          variantClasses.circle,
          'transition-all duration-300 ease-in-out transform-gpu',
        ]"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  value?: number
  max?: number
  radius?: number
  strokeWidth?: number
  variant?: 'default' | 'neutral' | 'warning' | 'error' | 'success'
}>()

const value = props.value ?? 0
const max = props.max ?? 100
const radius = props.radius ?? 32
const strokeWidth = props.strokeWidth ?? 6
const safeValue = Math.min(max, Math.max(value, 0))
const normalizedRadius = radius - strokeWidth / 2
const circumference = normalizedRadius * 2 * Math.PI
const offset = circumference - (safeValue / max) * circumference
const diameter = radius * 2

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'neutral':
      return {
        background: 'stroke-gray-200 dark:stroke-gray-500/40',
        circle: 'stroke-gray-500 dark:stroke-gray-500',
      }
    case 'warning':
      return {
        background: 'stroke-yellow-200 dark:stroke-yellow-500/30',
        circle: 'stroke-yellow-500 dark:stroke-yellow-500',
      }
    case 'error':
      return {
        background: 'stroke-red-200 dark:stroke-red-500/30',
        circle: 'stroke-red-500 dark:stroke-red-500',
      }
    case 'success':
      return {
        background: 'stroke-emerald-200 dark:stroke-emerald-500/30',
        circle: 'stroke-emerald-500 dark:stroke-emerald-500',
      }
    default:
      return {
        background: 'stroke-blue-200 dark:stroke-blue-500/30',
        circle: 'stroke-blue-500 dark:stroke-blue-500',
      }
  }
})
</script>
