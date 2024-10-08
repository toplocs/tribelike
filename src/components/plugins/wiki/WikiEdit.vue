<template>
  <form
    ref="form"
    @submit.prevent="onSubmit"
  >
    <Callout v-if="successMessage" color="green">
      {{ successMessage }}
    </Callout>
    <Callout v-if="errorMessage" color="red">
      {{ errorMessage }}
    </Callout>
    
    <div v-if="editor" class="min-h-[300px]">
      <div class="control-group">
        <div class="button-group mb-4 text-sm">
          <button
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 1 }) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            H1
          </button>
          <button
            @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 2 }) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            H2
          </button>
          <button @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="['px-2 py-1 border transition-colors', editor.isActive('heading', { level: 3 }) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            H3
          </button>
          <button @click.prevent="editor.chain().focus().setParagraph().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('paragraph') ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Paragraph
          </button>
          <button @click.prevent="editor.chain().focus().toggleBold().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('bold') ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Bold
          </button>
          <button @click.prevent="editor.chain().focus().toggleItalic().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('italic') ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Italic
          </button>
          <button @click.prevent="editor.chain().focus().toggleStrike().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('strike') ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Strike
          </button>
          <button @click.prevent="editor.chain().focus().toggleHighlight().run()" :class="['px-2 py-1 border transition-colors', editor.isActive('highlight') ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Highlight
          </button>
          <button @click.prevent="editor.chain().focus().setTextAlign('left').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'left'}) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Left
          </button>
          <button @click.prevent="editor.chain().focus().setTextAlign('center').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'center'}) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Center
          </button>
          <button @click.prevent="editor.chain().focus().setTextAlign('right').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'right'}) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Right
          </button>
          <button @click.prevent="editor.chain().focus().setTextAlign('justify').run()" :class="['px-2 py-1 border transition-colors', editor.isActive({'textAlign': 'justify'}) ? 'bg-blue-100' : 'bg-gray-100 text-black']">
            Justify
          </button>
        </div>
      </div>

      <editor-content :editor="editor" class="custom-editor" />
    </div>
    
    <div class="mt-2 space-x-2">
      <SubmitButton>
        Save
      </SubmitButton>
      <button
        type="button"
        class="bg-gray-500 text-white inline-flex justify-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-600 transition"
        @click.prevent="cancelEdit"
      > Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Callout from '../../../components/common/Callout.vue';
import SubmitButton from '../../../components/common/SubmitButton.vue';

const props = defineProps({
  cancelEdit: {
    type: Function,
    required: true,
  },
  modelValue: {
    type: String,
    required: false,
  },
});

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'focus:outline-none',
    },
  },
  extensions: [
    StarterKit,
    Highlight,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  content: `
   <h2>
      Welcome to the Wiki
    </h2>

    <p>
      This is a simple <em>wiki</em> page made for your <strong>text editor</strong>. It includes basic text styles that you would expect from any modern editor. But there’s more than just text. Take a look at the lists below:
    </p>

    <ul>
      <li>
        A standard bullet point …
      </li>
      <li>
        … with two items, just for fun.
      </li>
    </ul>

    <p>
      Pretty cool, right? But that’s not all! Here’s a code block for you to try:
    </p>

    <pre><code class="language-js">function greet() {
      console.log("Hello, world!");
    }</code></pre>

    <p>
      Nice, isn’t it? Don’t stop there, explore more features by trying out different options. Maybe even create some more code or lists of your own.
    </p>

    <blockquote>
      "This wiki page looks fantastic, keep up the good work!" 👏
      <br />
      — Your Mentor
    </blockquote>

  `,
});

const emit = defineEmits(['update:modelValue']);
const successMessage = ref('');
const errorMessage = ref('');

const onSubmit = async () => {
  try {
    const html = editor.value.getHTML()
    emit('update:modelValue', html);
    successMessage.value = 'Wiki content was saved successfully!';
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/plugin/wiki`, formData);
    
    return response.data;
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response.data;
  }
}
</script>