<svelte:head>
    <script>
        // function loadAds() {
        //     var ads = document.createElement('script');
        //     ads.async = true;
        //     ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_ADSENSE_CLIENT_ID";
        //     var node = document.getElementsByTagName('script')[0];
        //     node.parentNode.insertBefore(ads, node);
        //
        // }
        //
        // function loadAnalytics() {
        //     var analytics = document.createElement('script');
        //     analytics.async = true;
        //     analytics.src = "https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_MEASUREMENT_ID";
        //     var firstScript = document.getElementsByTagName('script')[0];
        //     firstScript.parentNode.insertBefore(analytics, firstScript);
        //
        //     window.dataLayer = window.dataLayer || [];
        //
        //     function gtag() {
        //         dataLayer.push(arguments);
        //     }
        //
        //     gtag('js', new Date());
        //     gtag('config', 'YOUR_GA4_MEASUREMENT_ID');
        // }
        //
        //
        //
        // if (localStorage.getItem("visitedBeforeAd")) {
        //     loadAds(); // 이전에 방문한 적이 있으면 딜레이 없이 로드
        // } else {
        //     localStorage.setItem("visitedBeforeAd", "true"); // 첫 방문이라면 localStorage에 정보 저장
        //     setTimeout(loadAds, 3400);
        // }
        //
        // if (localStorage.getItem("visitedBeforeAnalytics")) {
        //     loadAnalytics();
        // } else {
        //     localStorage.setItem("visitedBeforeAnalytics", "true"); // 첫 방문이라면 localStorage에 정보 저장
        //     setTimeout(loadAnalytics, 3000);
        // }
    </script>
</svelte:head>
