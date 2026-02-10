<!--
  프리로드 스크립트 (AdSense + GA4)
  사용법: YOUR_ADSENSE_CLIENT_ID / YOUR_GA4_MEASUREMENT_ID를 실제 값으로 교체한 뒤,
         아래 loadAds() / loadAnalytics() 호출부의 주석을 해제하세요.
-->
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

        // ── AdSense ──────────────────────────────
        // if (localStorage.getItem("visitedBeforeAd")) {
        //     loadAds();
        // } else {
        //     localStorage.setItem("visitedBeforeAd", "true");
        //     setTimeout(loadAds, 3400);
        // }

        // ── Google Analytics 4 ───────────────────
        // if (localStorage.getItem("visitedBeforeAnalytics")) {
        //     loadAnalytics();
        // } else {
        //     localStorage.setItem("visitedBeforeAnalytics", "true");
        //     setTimeout(loadAnalytics, 3000);
        // }
    </script>
</svelte:head>
