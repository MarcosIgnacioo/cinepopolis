<script setup lang="ts">
defineProps<{
  classExtend: string,
  inputType: string,
  inputName: string,
  inputValue: string,
  inputOnChange: void
}>()
</script>

<template>
  <input type={{ inputType }} name={{}} value="" />
</template>
