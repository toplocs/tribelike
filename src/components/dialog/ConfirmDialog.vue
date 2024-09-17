<template>
  <Title>
    Auswahl bestätigen
  </Title>

  <p className="dark:text-white">{{ text }}</p>
    <SubmitButton
      @click.stop="props.closeDialog(true)"
      className="w-full mt-4"
    >
      Bestätigen
    </SubmitButton>

  <SubmitButton
    @click.stop="props.closeDialog(false)"
    className="w-full mt-1"
  >
    Schließen
  </SubmitButton>
</template>

<script setup lang="ts">
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
</script>
