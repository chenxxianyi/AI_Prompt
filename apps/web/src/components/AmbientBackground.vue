<script setup lang="ts">
</script>

<template>
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      class="absolute rounded-full opacity-[0.06] blur-[120px] w-[600px] h-[600px] -top-[200px] -left-[100px] bg-primary animate-orb-float"
    ></div>
    <div
      class="absolute rounded-full opacity-[0.04] blur-[120px] w-[500px] h-[500px] -bottom-[150px] -right-[100px] bg-accent-cyan animate-orb-float [animation-delay:-7s]"
    ></div>
    <div
      class="absolute rounded-full opacity-[0.03] blur-[120px] w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-violet animate-orb-float [animation-delay:-14s]"
    ></div>
  </div>
</template>

<style scoped>
@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-20px, 15px) scale(0.95); }
}

.animate-orb-float {
  animation: orb-float 20s ease-in-out infinite;
}
</style>
