<template>    
  <div v-if="editor" class="min-h-[300px]">
    <div class="control-group">
      <div class="button-group mb-4 text-sm">
        <button
          @click.prevent="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          H1
        </button>
        <button
          @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          H2
        </button>
        <button @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          H3
        </button>
        <button @click.prevent="editor.chain().focus().setParagraph().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('paragraph') ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Paragraph
        </button>
        <button @click.prevent="editor.chain().focus().toggleBold().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('bold') ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Bold
        </button>
        <button @click.prevent="editor.chain().focus().toggleItalic().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('italic') ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Italic
        </button>
        <button @click.prevent="editor.chain().focus().toggleStrike().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('strike') ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Strike
        </button>
        <button @click.prevent="editor.chain().focus().toggleHighlight().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('highlight') ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Highlight
        </button>
        <button @click.prevent="editor.chain().focus().setTextAlign('left').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'left'}) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Left
        </button>
        <button @click.prevent="editor.chain().focus().setTextAlign('center').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'center'}) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Center
        </button>
        <button @click.prevent="editor.chain().focus().setTextAlign('right').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'right'}) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Right
        </button>
        <button @click.prevent="editor.chain().focus().setTextAlign('justify').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'justify'}) ? 'bg-blue-200 text-black' : 'bg-gray-100 text-black']">
          Justify
        </button>
      </div>
    </div>

    <editor-content :editor="editor" class="custom-editor" />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Callout from '@/components/common/Callout.vue';
import SubmitButton from '@/components/common/SubmitButton.vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'min-h-[200px] focus:outline-none',
    },
  },
  extensions: [
    StarterKit,
    Highlight,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false)
  }
})
</script>