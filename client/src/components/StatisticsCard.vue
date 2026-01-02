<template>
  <Card class="flex flex-col gap-4">
    <Headline>Activity Overview</Headline>

    <div v-if="props.loading" class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <!-- Skeleton loaders -->
      <div v-for="i in 4" :key="i" class="space-y-2">
        <div class="h-8 w-12 rounded bg-gray-300 dark:bg-gray-600" />
        <div class="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>

    <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <!-- Comments Statistic -->
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ formatNumber(props.statistics.totalComments) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ props.statistics.totalComments === 1 ? 'Comment' : 'Comments' }}
        </div>
      </div>

      <!-- Spheres Statistic -->
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold text-green-600 dark:text-green-400">
          {{ formatNumber(props.statistics.totalSpheres) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ props.statistics.totalSpheres === 1 ? 'Sphere' : 'Spheres' }}
        </div>
      </div>

      <!-- Relations Statistic -->
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {{ formatNumber(props.statistics.totalRelations) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ props.statistics.totalRelations === 1 ? 'Relation' : 'Relations' }}
        </div>
      </div>

      <!-- Votes Received Statistic -->
      <div class="flex flex-col gap-1">
        <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {{ formatNumber(props.statistics.totalVotesReceived) }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ props.statistics.totalVotesReceived === 1 ? 'Vote' : 'Votes' }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import Headline from '@/components/common/Headline.vue';

interface Statistics {
  totalComments: number;
  totalSpheres: number;
  totalRelations: number;
  totalVotesReceived: number;
}

interface Props {
  statistics: Statistics;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

/**
 * Format number with thousand separators
 */
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en').format(num);
};
</script>
