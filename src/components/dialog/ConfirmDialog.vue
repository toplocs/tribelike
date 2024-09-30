<template>
  <Title>
    Confirm the selection
  </Title>

  <p className="dark:text-white">{{ text }}</p>
    <SubmitButton
      @click.stop="props.closeDialog(true)"
      className="w-full mt-4"
    >
      Confirm
    </SubmitButton>

  <SubmitButton
    @click.stop="props.closeDialog(false)"
    className="w-full mt-1"
  >
    Close
  </SubmitButton>
</template>

<script setup lang="ts">
import Title from '@/components/common/TitleComponent.vue';
import SelectInput from '@/components/common/SelectInput.vue';
import SubmitButton from '@/components/common/SubmitButton.vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Please, confirm your selection?',
  },
  closeDialog: {
    type: Function,
    required: true,
  },
});
</script>
