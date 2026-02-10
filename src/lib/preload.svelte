<svelte:head>
    <script>
        function loadAds() {
            var ads = document.createElement("script");
            ads.async = true;
            ads.src =
                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID";
            var node = document.getElementsByTagName("script")[0];
            node.parentNode.insertBefore(ads, node);
        }

        function loadAnalytics() {
            var analytics = document.createElement("script");
            analytics.async = true;
            analytics.src =
                "https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_MEASUREMENT_ID";
            var firstScript = document.getElementsByTagName("script")[0];
            firstScript.parentNode.insertBefore(analytics, firstScript);

            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag("js", new Date());
            gtag("config", "YOUR_GA4_MEASUREMENT_ID");
        }

        // YOUR_ADSENSE_CLIENT_ID / YOUR_GA4_MEASUREMENT_ID 를 실제 값으로 교체한 뒤
        // 아래 주석을 해제하세요.

        // if (localStorage.getItem("visitedBeforeAd")) {
        //     loadAds();
        // } else {
        //     localStorage.setItem("visitedBeforeAd", "true");
        //     setTimeout(loadAds, 3400);
        // }

        // if (localStorage.getItem("visitedBeforeAnalytics")) {
        //     loadAnalytics();
        // } else {
        //     localStorage.setItem("visitedBeforeAnalytics", "true");
        //     setTimeout(loadAnalytics, 3000);
        // }
    </script>
</svelte:head>
