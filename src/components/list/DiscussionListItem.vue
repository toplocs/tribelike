<template>
  <div class="flex items-center space-x-4">
    <router-link :to="`/profile/${discussion.attachment?.id}`">
      <ProfileImage
        :src="discussion.attachment?.image"
        :tooltipText="discussion.attachment?.username"
        size="medium"
      />
    </router-link>
    
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {{ discussion.username }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ discussion.email }}
      </p>
    </div>
  </div>

  <p class="mt-4 text-sm text-gray-700 dark:text-gray-300">
    {{ discussion.text }}
  </p>

  <div class="mt-6">
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
      <span>Yes</span>
      <span>No</span>
    </div>
    <div class="flex items-center space-x-2 mt-2">
      <div 
        class="h-4 bg-blue-500 dark:bg-blue-700 rounded transition-all"
        :style="{ width: `${yesPercentage}%` }"
      ></div>

      <div 
        class="h-4 bg-red-500 dark:bg-red-700 rounded transition-all"
        :style="{ width: `${noPercentage}%` }"
      ></div>
    </div>

    <div class="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
      <span>{{ yes }}</span>
      <span>{{ no }}</span>
    </div>
  </div>

  <div v-if="!voted" class="mt-2 flex gap-2">
    <ActionButton
      title="Yes"
      @useAction="voteYes"
    />

    <ActionButton
      title="No"
      @useAction="voteNo"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { inject, computed } from 'vue';
import ProfileImage from '@/components/common/ProfileImage.vue';
import ActionButton from '@/components/common/ActionButton.vue';

const props = defineProps({
  discussion: {
    type: Object,
    required: true,
  }
});
const profile = inject('profile');
const voted = computed(
  () => props.discussion.voters.includes(profile.value?.id)
);
const yes = computed(() => props.discussion.votes.yes);
const no = computed(() => props.discussion.votes.no);
const totalVotes = computed(() => yes.value + no.value);
const yesPercentage = computed(
  () => (totalVotes.value ? (yes.value / totalVotes.value) * 100 : 0)
);
const noPercentage = computed(
  () => (totalVotes.value ? (no.value / totalVotes.value) * 100 : 0)
);

const voteYes = async () => {
  try {
    const response = await axios.put(`/api/discussion/vote/yes`, {
      profileId: profile.value?.id,
      discussionId: props.discussion?.id,
    });
    props.discussion.voters.push(profile.value?.id);
    props.discussion.votes.yes++;

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const voteNo = async () => {
  try {
    const response = await axios.put(`/api/discussion/vote/no`, {
      profileId: profile.value?.id,
      discussionId: props.discussion?.id,
    });
    props.discussion.voters.push(profile.value?.id);
    props.discussion.votes.no++;

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
</script>
