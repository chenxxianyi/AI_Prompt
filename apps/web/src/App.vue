<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { themeOverrides } from '@/styles/naive-theme'
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>
