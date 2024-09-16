<template>
  <div className="mb-2">
    <SelectAvatar :src="profile?.image" />
  </div>

  <div className="mb-2">
    <label
      for="type"
      class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
    > Art des Profils
    </label>

    <TextInput
      type="text"
      id="type"
      name="type"
      autoComplete="type"
      placeholder="Gib den Typ des Profils an"
      :modelValue="profile?.type || 'Privat'"
    />
  </div>

  <div className="mb-2">
    <label
      for="select"
      class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
    > Benutzername
    </label>

    <TextInput
      type="text"
      id="username"
      name="username"
      autoComplete="username"
      placeholder="Gib den Benutzernamen des Profils an"
      :modelValue="profile?.username || ''"
    />
  </div>

  <div className="mb-2">
    <label
      for="email"
      class="block text-gray-900 dark:text-gray-100 font-medium text-sm mb-2"
    > Email Addresse
    </label>

    <TextInput
      type="text"
      id="email"
      name="email"
      autoComplete="email"
      placeholder="Gib die Email des Profils an"
      :modelValue="profile?.email || ''"
    />
  </div>
</template>

<script setup lang="ts">
import SubmitButton from '../components/common/SubmitButton.vue';
import TextInput from '../components/common/TextInput.vue';
import SelectAvatar from '../components/SelectAvatar.vue';

const props = defineProps({
  profile: {
    type: Object,
    required: false,
  },
});
</script>