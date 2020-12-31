<template>
  <main class="tw-min-h-screen tw-p-6 dark:tw-bg-gray-800">
    <section class="tw-flex tw-flex-col tw-items-center tw-pt-20">
      <router-link to="/">
        <h2 class="tw-py-5 tw-text-3xl tw-text-indigo-500 tw-font-bold">
          Vue 3
        </h2>
      </router-link>

      <div class="tw-container">
        <slot></slot>
      </div>
    </section>
  </main>
</template>
