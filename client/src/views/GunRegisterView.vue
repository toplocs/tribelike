<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />
      <RegisterForm />
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import BackButton from '@/components/common/BackButton.vue';
import Register from '@/components/forms/Register.vue';
</script>
