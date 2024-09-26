<template>
   <div class="flex items-end">
      <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
         <div>
            <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
               {{ message.chatInput }}
            </span>
         </div>
      </div>
      <img
         src="/images/default.jpeg"
         class="w-8 h-8 rounded-full order-1"
      />
   </div>
</template>

<script setup lang="ts">
const props = defineProps({
   message: {
      type: Object,
      required: true,
   },
});
</script>