<svelte:head>
    <title>My Homepage</title>
    <meta name="description" content="A warm welcome to our website! We hope you feel at home as you explore our content." />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="UTF-8" />

    <meta property="og:site_name" content="My Homepage" />
    <meta property="og:title" content="My Homepage" />
    <meta property="og:description" content="A warm welcome to our website! We hope you feel at home as you explore our content." />
    <meta property="og:type" content="website" />
</svelte:head>

<div class="flex flex-col min-h-screen relative bg-contents-colo dark:bg-dark-contents-color">

    <!-- Header with full width background color -->
    <header class="w-full bg-header-footer-color dark:bg-dark-header-footer-color">
        <div class="w-full max-w-2xl mx-auto p-3">
            <div class="flex items-center pl-1">
                <a href="/" class="mr-3">
                    <img src="favicon.png" alt="logo" class="" width="26" height="26"/>
                </a>
                <a href="/" class="text-base text-sub-title-color dark:text-dark-sub-title-color no-underline font-bold" rel="external">My Homepage</a>
            </div>
        </div>
    </header>

    <main class="w-full max-w-2xl mx-auto p-4 text-text-color dark:text-dark-text-color">
        <div>
            <h1 class="text-4xl font-bold pb-5 pt-2">Welcome!</h1>
            <p class="text-base font-sans pb-3 leading-relaxed tracking-wide">
                We warmly welcome you to our website! We're delighted to have you here and hope you feel at home as you explore our offerings.
            </p>
            <p>Enjoy your time here, and let’s embark on this journey together!</p>
        </div>
    </main>

    <!-- Footer with full width background color -->
    <footer class="flex-grow w-full bg-header-footer-color dark:bg-dark-header-footer-color">
        <div class="w-full max-w-2xl mx-auto p-4 text-text-color dark:text-dark-text-color">
            <div class="text-sm text-brand-gray dark:text-dark-brand-gray pt-2">
                Copyright ⓒ June. All Rights Reserved
            </div>
        </div>
    </footer>

</div>
