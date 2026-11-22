<script setup lang="ts">
const GA_ID = "G-D7QR2BL0BT";

useHead({
  script: [
    { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
    {
      innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`,
    },
  ],
});
</script>

<template>
  <div class="flex items-start w-full">
    <SideNavbar />
    <div class="w-full lg:flex-1">
      <Navbar />
      <main>
        <NuxtPage />
      </main>
      <Footer />
    </div>
    <SocialLists />
  </div>
  <SplashScreen />
</template>
