<template>
   <div class="sticky bottom-0 border-t-2 border-gray-100 p-4 sm:p-2"> 
      <form
         ref="form"
         @submit.prevent="onSubmit"
         class="relative flex"
      >
         <span class="absolute inset-y-0 flex items-center">
            <button type="button" class="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 text-gray-600">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
               </svg>
            </button>
         </span>

         <textarea
            @input="autoResize"
            @keydown.enter="triggerSubmit"
            :key="textareaKey"
            ref="chatTextarea"
            rows="1"
            name="chatInput"
            type="text"
            placeholder="Write your message!"
            class="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3 resize-none"
         />
            <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
               
         
               <button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                     <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
               </button>
            </div>
         </form>
      </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  user: Object,
  conversation: Object,
  chatService: Object
});

const form = ref<HTMLFormElement | null>(null);
const chatTextarea = ref<HTMLTextAreaElement | null>(null);
const textareaKey = ref(0);

async function onSubmit() {
   const formData = new FormData(form.value);
   if (formData.get('chatInput').trim() === '') return;
   formData.append('userId', props.user.id);
   props.chatService.emit('message', {
         ...Object.fromEntries(formData.entries()),
         user: {
            ...props.user,
            image: '/images/default.jpeg',
         }
      }
   );
   textareaKey.value += 1;
   autoResize();
};

function autoResize() {
  const textarea = chatTextarea.value;
  if (textarea) {
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = parseInt(getComputedStyle(textarea).lineHeight) * 6;
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }
};

function triggerSubmit (event: KeyboardEvent) {
   if (!event.shiftKey) onSubmit();
};
</script>