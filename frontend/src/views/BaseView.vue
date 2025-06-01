<template>
  <div class="flex justify-center items-center align-middle">
    <InstallationButton />
  </div>
</template>

<script lang="ts">
import InstallationButton from '@/components/InstallationButton.vue';

export default {
  name: 'BaseView',
  components: { InstallationButton },
};
</script>
