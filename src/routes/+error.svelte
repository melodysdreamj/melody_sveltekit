<script>
  import { page } from "$app/stores";
</script>

<div
  class="flex min-h-full flex-col bg-contents-color dark:bg-dark-contents-color pt-16 pb-12"
>
  <main
    class="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8"
  >
    <div class="flex flex-shrink-0 justify-center">
      <a href="/" class="inline-flex">
        <img class="h-12 w-auto" src="/favicon.png" alt="Home" />
      </a>
    </div>
    <div class="py-16">
      <div class="text-center">
        <p class="text-base font-semibold text-indigo-600 dark:text-indigo-400">
          {$page.status}
        </p>
        <h1
          class="mt-2 text-4xl font-bold tracking-tight text-text-color dark:text-dark-text-color sm:text-5xl"
        >
          {#if $page.status === 404}
            Page not found.
          {:else}
            Something went wrong.
          {/if}
        </h1>
        <p class="mt-2 text-base text-brand-gray dark:text-dark-brand-gray">
          {#if $page.error?.message}
            {$page.error.message}
          {:else}
            Sorry, we couldn't find the page you're looking for.
          {/if}
        </p>
        <div class="mt-6">
          <a
            href="/"
            class="text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Go back home
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  </main>
</div>
