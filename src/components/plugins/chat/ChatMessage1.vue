<template>
   <div class="flex items-end justify-end">
      <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
         <div>
            <span class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
               {{ message.chatInput }}
            </span>
         </div>
      </div>
      <img
         src="/images/default.jpeg"
         class="w-8 h-8 rounded-full order-2"
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