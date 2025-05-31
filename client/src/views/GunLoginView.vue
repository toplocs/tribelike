<template>
  <div className="min-h-screen flex flex-col justify-center items-center">
    <Card className="pb-10 max-w-sm">
      <BackButton href="/" />

      <LoginForm />
    </Card>
  </div>
</template>

<script setup lang="ts">
import BackButton from '@/components/common/BackButton.vue';
import LoginForm from '@/components/forms/Login.vue';
import Card from '@/components/common/Card.vue';
</script>
