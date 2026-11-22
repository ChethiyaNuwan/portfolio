<template>
  <footer class="bg-darkest-gray border-t border-border-color flex flex-col items-center flex-nowrap gap-[10px] h-min justify-center overflow-visible py-10 px-0 relative w-full">
    <div class="items-center flex flex-none flex-col flex-nowrap gap-[10px] h-min justify-center overflow-hidden p-0 relative w-full">
      <div class="w-[80%] flex flex-col-reverse sm:flex-row items-center sm:items-start gap-5 sm:gap-0 flex-nowrap flex-none h-min justify-center overflow-hidden p-0 relative">
        <div class="shrink-0 flex justify-start flex-1 relative break-words whitespace-pre-wrap h-auto">
          <p class="text-lg text-light-gray-2 font-medium">&copy; {{ new Date().getFullYear() }} CNBH</p>
        </div>

        <div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </footer>
</template>
