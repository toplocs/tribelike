<template>
   <div class="flex items-end justify-end">
      <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 mb-2 order-1 items-end">
         <div>
            <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
               {{ message.chatInput }}
            </span>
         </div>
      </div>
      <div class="order-2">
         <ProfileImage
            :src="message.user?.image"
            :tooltipText="message.user?.username"
            size="small"
         />
      </div>
   </div>
</template>

<script setup lang="ts">
import ProfileImage from '@/components/common/ProfileImage.vue';

const props = defineProps({
   message: {
      type: Object,
      required: true,
   },
});
</script>