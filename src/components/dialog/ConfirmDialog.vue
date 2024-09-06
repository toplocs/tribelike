<template>
  <Title>
    Auswahl bestätigen
  </Title>

  <p className="dark:text-white">{{ text }}</p>
  <SubmitButton className="w-full mt-4">
    Schließen
  </SubmitButton>

  <form
    ref="form"
    @submit.prevent="onSubmit"
    class="flex flex-col gap-4"
  >
    <SubmitButton className="w-full mt-4">
      Bestätigen
    </SubmitButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Title from '../../components/common/TitleComponent.vue';
import SelectInput from '../../components/common/SelectInput.vue';
import SubmitButton from '../../components/common/SubmitButton.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Möchtest du deine Auswahl bestätigen?',
  },
  closeDialog: {
    type: Function,
    required: true,
  },
});

const router = useRouter();
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);
const selectedModel = ref('');

const onSubmit = async () => {
  props.closeDialog(true);
}
</script>
