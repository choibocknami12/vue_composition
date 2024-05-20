<template>
  <div>
    <div v-for="item in props.products" :key="item.productName">
      <h4 @click="$emit('myOpenModal', item)">{{ item.productName }}</h4>
      <p>{{ item.price }} 원</p>
    </div>
    <slot></slot>
  </div>
  <ProvideTest />
</template>
<script setup>
import {defineProps} from 'vue';
import ProvideTest from './ProvideTest.vue';

const props = defineProps({
  'products': Array
});
</script>
<style>
    
</style>