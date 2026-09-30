(async () => {
    const loadScript = (src) => new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Could not load " + src));
        document.body.appendChild(script);
    });

    try {
        const [three, geometry] = await Promise.all([
            import("https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js"),
            import("https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/geometries/RoundedBoxGeometry.js")
        ]);
        window.THREE = three;
        window.RoundedBoxGeometry = geometry.RoundedBoxGeometry;
        await loadScript("character/scrap-crawler.js?v=20260930-1");
        await loadScript("character/profile-crawler.js?v=20260930-2");
    } catch (error) {
        console.error("Profile crawler could not start:", error);
    }
})();
