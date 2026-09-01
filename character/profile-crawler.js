import { THREE, createScrapCrawler, poseFrontLegsAsGrippers } from "./scrap-crawler.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let gameGuideActive = false;

function alignRaisedArmSegment(mesh, start, end, radius) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = Math.max(0.001, direction.length());
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.scale.set(radius, length, radius);
    mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.multiplyScalar(1 / length)
    );
}

function raiseThirdRightArm(crawler) {
    const arm = crawler.parts.legs.find((leg) => leg.side === 1 && leg.rowIndex === 2);
    if (!arm) return null;

    // This remains the third anatomical arm on the crawler's right side. Its
    // visible anchor shares the body-side shoulder mount so the raised limb
    // cannot separate when the complete front assembly turns toward the photo.
    const shoulder = new THREE.Vector3(0.36, 0.36, 0.45);
    const armScale = 0.5;
    const elbow = shoulder.clone().lerp(new THREE.Vector3(0.58, 0.68, 0.26), armScale);
    const wrist = shoulder.clone().lerp(new THREE.Vector3(0.5, 0.94, 0.2), armScale);
    const foot = shoulder.clone().lerp(new THREE.Vector3(0.47, 1, 0.18), armScale);

    alignRaisedArmSegment(arm.upper, shoulder, elbow, 0.05 * armScale);
    alignRaisedArmSegment(arm.lower, elbow, wrist, 0.045 * armScale);
    arm.joint.position.copy(elbow);
    arm.joint.scale.copy(arm.joint.userData.baseScale).multiplyScalar(0.72 * armScale);
    arm.foot.position.copy(foot);
    arm.foot.rotation.set(-0.45, Math.PI / 2, 0.18);
    arm.foot.scale.copy(arm.foot.userData.baseScale).multiplyScalar(0.72 * armScale);
    return arm;
}

document.querySelectorAll("[data-crawler-stage]").forEach((stage, stageIndex) => {
    const gripStage = stage.parentElement.querySelector("[data-crawler-grip-stage]");
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.setAttribute("aria-hidden", "true");
    stage.appendChild(renderer.domElement);

    const gripRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    gripRenderer.setClearColor(0x000000, 0);
    gripRenderer.outputColorSpace = THREE.SRGBColorSpace;
    gripRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    gripRenderer.toneMappingExposure = 1.18;
    gripRenderer.domElement.setAttribute("aria-hidden", "true");
    gripStage.appendChild(gripRenderer.domElement);

    const scene = new THREE.Scene();
    const gripScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0.15, 1.25, 5.15);
    camera.lookAt(0, 0.48, 0.45);

    scene.add(new THREE.HemisphereLight(0xd9ffff, 0x07111a, 2.25));
    const key = new THREE.DirectionalLight(0xb6fff4, 3.1);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2f7dff, 2.6);
    rim.position.set(4, 2, -3);
    scene.add(rim);

    gripScene.add(new THREE.HemisphereLight(0xd9ffff, 0x07111a, 2.25));
    const gripKey = new THREE.DirectionalLight(0xb6fff4, 3.1);
    gripKey.position.copy(key.position);
    gripScene.add(gripKey);
    const gripRim = new THREE.DirectionalLight(0x2f7dff, 2.6);
    gripRim.position.copy(rim.position);
    gripScene.add(gripRim);

    const crawler = createScrapCrawler();
    const gripCrawler = createScrapCrawler();
    poseFrontLegsAsGrippers(crawler);
    poseFrontLegsAsGrippers(gripCrawler);
    const raisedRightArm = raiseThirdRightArm(gripCrawler);
    const belongsToForegroundRig = (leg) => leg.rowIndex <= 1 || leg === raisedRightArm;

    // The complete eight-limb crawler remains in the rear scene. This second
    // copy contributes the head, shoulder roots, four front limbs and the one
    // raised third-right arm above the photo.
    const foregroundMeshes = new Set();
    gripCrawler.parts.head.traverse((child) => {
        if (child.isMesh) foregroundMeshes.add(child);
    });
    gripCrawler.parts.legs.filter(belongsToForegroundRig).forEach((leg) => {
        [leg.upper, leg.joint, leg.lower, leg.foot].forEach((part) => foregroundMeshes.add(part));
    });
    gripCrawler.parts.frontShoulders.forEach((part) => foregroundMeshes.add(part));
    gripCrawler.group.traverse((child) => {
        if (child.isMesh) child.visible = foregroundMeshes.has(child);
    });

    // Head, shoulders and the first two leg pairs bend as one connected assembly at
    // the rim. This is the crawler equivalent of the cat leaning over a shoulder.
    const frontPivot = new THREE.Vector3(0, 0.38, 0.35);
    const frontRig = new THREE.Group();
    frontRig.name = "profile-crawler-front-bend";
    frontRig.position.copy(frontPivot);
    const frontObjects = [gripCrawler.parts.head, ...gripCrawler.parts.frontShoulders];
    gripCrawler.parts.legs.filter(belongsToForegroundRig).forEach((leg) => {
        frontObjects.push(leg.upper, leg.joint, leg.lower, leg.foot);
    });
    frontObjects.forEach((part) => {
        gripCrawler.group.remove(part);
        part.position.sub(frontPivot);
        frontRig.add(part);
    });
    // Slight three-quarter side angle toward the portrait. The head, four
    // leading arms and raised third-right arm share this connected bend rig.
    frontRig.rotation.set(0.17, -1.28, -0.03);
    gripCrawler.group.add(frontRig);

    // The complete rear copy stays loaded and animated beneath the opaque
    // portrait, but none of it may protrude above the circular edge.
    crawler.group.traverse((child) => {
        if (child.isMesh) child.visible = false;
    });

    const mobile = stage.classList.contains("profile-crawler-stage-mobile");
    const modelScale = mobile ? 1.02 : 1.14;
    // Target placement from the approved first screenshot.
    const perchY = mobile ? 0.32 : 0.42;
    const perchX = -0.04;
    const applyPerchTransform = (model) => {
        model.group.scale.setScalar(modelScale);
        // Positive yaw tucks the chassis inward beneath the photo. The shared
        // front bend turns only the visible head and four arms back down-left.
        model.group.rotation.set(-0.08, 0.7, 0.18);
        model.group.position.set(perchX, perchY, 0);
    };
    applyPerchTransform(crawler);
    applyPerchTransform(gripCrawler);
    // The head is neutral inside the shared bend rig, so its face, shoulders and
    // arms all point in the same smooth down-left direction.
    gripCrawler.parts.head.rotation.x = 0;
    gripCrawler.parts.head.rotation.y = 0;
    scene.add(crawler.group);
    gripScene.add(gripCrawler.group);

    const crawlerGameLink = document.createElement("a");
    crawlerGameLink.className = "crawler-arm-game-link";
    crawlerGameLink.href = "#projects";
    crawlerGameLink.textContent = "PLAY MY GAME";
    crawlerGameLink.setAttribute("aria-label", "Go to the Neon Outpost project");
    stage.parentElement.appendChild(crawlerGameLink);

    crawlerGameLink.addEventListener("click", async (event) => {
        event.preventDefault();
        if (gameGuideActive) return;

        const projectPlayLink = document.querySelector("[data-neon-play-link]");
        const projectArea = document.querySelector("[data-neon-project]");
        if (!projectPlayLink || !projectArea) {
            document.querySelector("#projects")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
            return;
        }

        const navbar = document.querySelector("#navbar");
        const projectTopGap = Math.max(32, Math.min(72, window.innerHeight * 0.075));
        const scrollToProjectArea = (behavior) => {
            const projectRect = projectArea.getBoundingClientRect();
            const navbarHeight = navbar?.getBoundingClientRect().height || 0;
            const destinationTop = window.scrollY + projectRect.top - navbarHeight - projectTopGap;
            const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const resolvedTop = Math.min(maxScrollTop, Math.max(0, destinationTop));
            window.scrollTo({ top: resolvedTop, behavior });
            return { projectRect, navbarHeight, destinationTop: resolvedTop };
        };

        const waitForScrollToSettle = (destinationTop) => new Promise((resolve) => {
            const deadline = performance.now() + 1800;
            let stableFrames = 0;
            const checkPosition = () => {
                stableFrames = Math.abs(window.scrollY - destinationTop) < 2 ? stableFrames + 1 : 0;
                if (stableFrames >= 3 || performance.now() >= deadline) {
                    resolve();
                    return;
                }
                requestAnimationFrame(checkPosition);
            };
            requestAnimationFrame(checkPosition);
        });

        if (reducedMotion || event.detail === 0) {
            scrollToProjectArea("auto");
            requestAnimationFrame(() => projectPlayLink.focus({ preventScroll: true }));
            return;
        }

        gameGuideActive = true;
        const guidePointer = document.createElement("span");
        guidePointer.className = "crawler-guided-pointer";
        guidePointer.setAttribute("aria-hidden", "true");
        guidePointer.innerHTML = '<i class="fa-solid fa-arrow-pointer"></i>';
        guidePointer.style.left = `${event.clientX}px`;
        guidePointer.style.top = `${event.clientY}px`;
        document.body.appendChild(guidePointer);
        document.documentElement.classList.add("crawler-pointer-guiding");
        const realPointerPosition = { x: event.clientX, y: event.clientY };
        const rememberRealPointer = (pointerEvent) => {
            realPointerPosition.x = pointerEvent.clientX;
            realPointerPosition.y = pointerEvent.clientY;
        };
        window.addEventListener("pointermove", rememberRealPointer, { passive: true });

        try {
            const targetRect = projectPlayLink.getBoundingClientRect();
            const { projectRect, navbarHeight, destinationTop } = scrollToProjectArea("smooth");
            const predictedTargetY = targetRect.top - projectRect.top + navbarHeight + projectTopGap + targetRect.height / 2;

            await guidePointer.animate([
                { left: `${event.clientX}px`, top: `${event.clientY}px`, transform: "scale(1)" },
                { left: `${targetRect.left + targetRect.width / 2}px`, top: `${predictedTargetY}px`, transform: "scale(1.05)" }
            ], {
                duration: 850,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards"
            }).finished;

            await waitForScrollToSettle(destinationTop);
            const settledRect = projectPlayLink.getBoundingClientRect();
            const settledCenterX = settledRect.left + settledRect.width / 2;
            const settledCenterY = settledRect.top + settledRect.height / 2;
            await guidePointer.animate([
                { left: `${targetRect.left + targetRect.width / 2}px`, top: `${predictedTargetY}px` },
                { left: `${settledCenterX}px`, top: `${settledCenterY}px` }
            ], {
                duration: 220,
                easing: "ease-out",
                fill: "forwards"
            }).finished;

            projectPlayLink.focus({ preventScroll: true });
            await new Promise((resolve) => window.setTimeout(resolve, 450));
            await guidePointer.animate([
                { left: `${settledCenterX}px`, top: `${settledCenterY}px`, opacity: 1 },
                { left: `${realPointerPosition.x}px`, top: `${realPointerPosition.y}px`, opacity: 0.9 }
            ], {
                duration: 280,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                fill: "forwards"
            }).finished;
        } catch (error) {
            scrollToProjectArea("auto");
            projectPlayLink.focus({ preventScroll: true });
        } finally {
            window.removeEventListener("pointermove", rememberRealPointer);
            guidePointer.remove();
            document.documentElement.classList.remove("crawler-pointer-guiding");
            gameGuideActive = false;
        }
    });

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const pupilTarget = new THREE.Vector2();
    const raisedArmTip = new THREE.Vector3();
    const projectedArmTip = new THREE.Vector3();

    const positionGameLink = () => {
        if (!raisedRightArm) {
            crawlerGameLink.hidden = true;
            return;
        }

        camera.updateMatrixWorld();
        gripCrawler.group.updateMatrixWorld(true);
        raisedRightArm.foot.getWorldPosition(raisedArmTip);
        projectedArmTip.copy(raisedArmTip).project(camera);
        crawlerGameLink.hidden = projectedArmTip.z < -1 || projectedArmTip.z > 1;
        crawlerGameLink.style.left = `${gripStage.offsetLeft + (projectedArmTip.x + 1) * 0.5 * gripStage.offsetWidth}px`;
        crawlerGameLink.style.top = `${gripStage.offsetTop + (1 - projectedArmTip.y) * 0.5 * gripStage.offsetHeight}px`;
    };

    const resize = () => {
        const rect = stage.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(rect.width));
        const nextHeight = Math.max(1, Math.round(rect.height));
        if (nextWidth === width && nextHeight === height) return;
        width = nextWidth;
        height = nextHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(width, height, false);
        gripRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        gripRenderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    const render = (time = 0) => {
        resize();
        const seconds = time * 0.001 + stageIndex * 0.7;
        if (!reducedMotion) {
            const perchBob = Math.sin(seconds * 1.25) * 0.018;
            const perchRoll = Math.sin(seconds * 0.82) * 0.012;
            crawler.group.position.y = gripCrawler.group.position.y = perchY + perchBob;
            crawler.group.rotation.z = gripCrawler.group.rotation.z = 0.18 + perchRoll;
            frontRig.rotation.x = 0.17 + Math.sin(seconds * 0.9) * 0.008;
            frontRig.rotation.z = -0.03 + Math.sin(seconds * 0.72) * 0.006;
            gripCrawler.parts.head.rotation.y = Math.sin(seconds * 0.7) * 0.018;
            gripCrawler.parts.head.rotation.x = Math.sin(seconds * 1.05) * 0.008;
            gripCrawler.parts.feelers.forEach((feeler, index) => {
                feeler.rotation.x = feeler.userData.baseRotation.x + Math.sin(seconds * 1.8 + index) * 0.045;
            });
            gripCrawler.parts.eyes.forEach((eye, index) => {
                const pulse = 1 + Math.sin(seconds * 2.2 + index * 0.6) * 0.05;
                eye.scale.copy(eye.userData.baseScale).multiplyScalar(pulse);
            });
        }
        gripCrawler.parts.pupils.forEach((pupil) => {
            pupil.position.x = THREE.MathUtils.lerp(pupil.position.x, pupilTarget.x * 0.18, 0.24);
            pupil.position.y = THREE.MathUtils.lerp(pupil.position.y, pupilTarget.y * 0.14, 0.24);
        });
        positionGameLink();
        renderer.render(scene, camera);
        gripRenderer.render(gripScene, camera);
        if (!reducedMotion) animationFrame = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    const trackPointer = (event) => {
        const rect = stage.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        pupilTarget.set(
            THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
            THREE.MathUtils.clamp(-(((event.clientY - rect.top) / rect.height) * 2 - 1), -1, 1)
        );
        if (reducedMotion) render(performance.now());
    };
    window.addEventListener("pointermove", trackPointer, { passive: true });
    render();

    window.addEventListener("pagehide", () => {
        cancelAnimationFrame(animationFrame);
        observer.disconnect();
        window.removeEventListener("pointermove", trackPointer);
        crawlerGameLink.remove();
        renderer.dispose();
        gripRenderer.dispose();
    }, { once: true });
});
