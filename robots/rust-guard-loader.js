(async () => {
    if (!document.querySelector("[data-rust-guard]")) return;
    try {
        const [three, geometry] = await Promise.all([
            import("https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js"),
            import("https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/geometries/RoundedBoxGeometry.js")
        ]);
        window.RustGuardThree = three;
        window.RustGuardRoundedBoxGeometry = geometry.RoundedBoxGeometry;
        await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "robots/rust-guard.js?v=20260930-1";
            script.onload = resolve;
            script.onerror = () => reject(new Error("Could not load Rust Guard"));
            document.body.appendChild(script);
        });
    } catch (error) {
        console.error("Rust Guard could not start:", error);
    }
})();
