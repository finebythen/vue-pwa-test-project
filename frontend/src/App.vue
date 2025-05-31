<template>
  <NavBar />
  <div class="container mx-auto px-4 mt-20">
    <RouterView />
  </div>
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue';

export default {
  components: { NavBar },
};
</script>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
