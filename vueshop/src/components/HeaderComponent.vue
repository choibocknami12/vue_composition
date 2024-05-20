<template>
  <!-- 헤더 -->
  <div class="nav">
    <a v-for="item in data.navList" :key="item.navName" href="#">{{ item.navName }}</a>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const data = defineProps({
  'navList': Array
});

</script>

<style>
</style>