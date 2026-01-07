<template>
  <div className="min-h-screen flex flex-col justify-center items-center pt-20">
    <Card className="pb-10 max-w-sm">
      <RegisterForm />
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue';
import RegisterForm from '@/components/forms/Register.vue';
</script>
