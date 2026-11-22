<template>
  <div class="flex lg:flex-1 flex-col gap-0 h-min px-5 overflow-hidden p-0 relative lg:px-0 w-full flex-wrap lg:flex-nowrap items-center justify-start">
    <div class="gap-[100px] flex-col max-w-full w-full lg:max-w-[820px] lg:w-[80%] lg:flex-nowrap flex items-center flex-none h-min justify-center relative overflow-hidden lg:overflow-visible p-[80px_0px]">
      <Hero />
      <MyExperience />
      <MyStack />
      <MyServices />
      <ShowCase :show-data="2" is-more />
    </div>
  </div>
</template>
