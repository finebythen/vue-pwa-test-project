<template>
  <button
    v-if="showInstallButton"
    @click="installPWA"
    class="bg-blue-600 text-white border-0 px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-700 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:translate-y-0"
    :disabled="isInstalling"
  >
    {{ isInstalling ? 'Installing...' : 'Install App' }}
  </button>
</template>

<script lang="ts">
export default {
  name: 'InstallationButton',
};
</script>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

// Types
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Refs & Reactive
const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const showInstallButton = ref<boolean>(false);
const isInstalling = ref<boolean>(false);

// Functions
const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
  // Prevent the mini-infobar from appearing on mobile and save the event so it can be triggered later
  e.preventDefault();
  deferredPrompt.value = e;
  showInstallButton.value = true;
};

const handleAppInstalled = (): void => {
  // Hide the install button after successful installation
  showInstallButton.value = false;
  deferredPrompt.value = null;
};

const installPWA = async (): Promise<void> => {
  if (!deferredPrompt.value) return;
  isInstalling.value = true;

  try {
    // Show the install prompt and wait for the user to respond to the prompt
    await deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }
  } catch (error: unknown) {
    console.error('Error during PWA installation:', error);
  } finally {
    // Clear the deferredPrompt
    deferredPrompt.value = null;
    showInstallButton.value = false;
    isInstalling.value = false;
  }
};

onMounted((): void => {
  // Check if the app is already installed -> if not, listen to events
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showInstallButton.value = false;
    return;
  }
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onUnmounted((): void => {
  // Clean Up
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});
</script>
