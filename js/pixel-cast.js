// Sprite sheets and hover walk cycle copied from very_creative_porfolio.
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-pixel-cast]').forEach(cast => {
        const spriteConfigs = {
            one: {
                src: 'image/pixel-cast/student-one.png',
                x: [14, 218, 436, 655],
                y: [12, 285, 546],
                offsetY: [[6, -2, -2, -3], [15, 15, 15, 15], [10, 10, 10, 10]],
                width: 190,
                height: 260
            },
            two: {
                src: 'image/pixel-cast/student-two.png',
                x: [72, 222, 377, 532],
                y: [17, 261, 490],
                offsetY: [[3, 3, 3, 4], [19, 21, 21, 19], [44, 43, 44, 44]],
                width: 148,
                height: 240
            }
        };
        const actors = [...cast.querySelectorAll('[data-pixel-actor]')].map(canvas => {
            const config = spriteConfigs[canvas.dataset.pixelActor];
            const context = canvas.getContext('2d');
            const image = new Image();
            context.imageSmoothingEnabled = false;
            image.src = config.src;
            return { canvas, context, image, config };
        });
        const frames = [
            { cell: [0, 0], duration: 650 },
            { cell: [0, 1], duration: 180 },
            { cell: [0, 2], duration: 180 },
            { cell: [0, 3], duration: 180 },
            { cell: [0, 2], duration: 180 },
            { cell: [0, 1], duration: 180 },
            { cell: [0, 0], duration: 420 },
            { cell: [2, 0], duration: 170 },
            { cell: [2, 1], duration: 170 },
            { cell: [2, 2], duration: 170 },
            { cell: [2, 3], duration: 170 },
            { cell: [2, 2], duration: 170 },
            { cell: [2, 1], duration: 170 },
            { cell: [0, 0], duration: 420 },
            { cell: [1, 0], duration: 170 },
            { cell: [1, 1], duration: 170 },
            { cell: [1, 2], duration: 170 },
            { cell: [1, 3], duration: 170 },
            { cell: [1, 2], duration: 170 },
            { cell: [1, 1], duration: 170 },
            { cell: [0, 0], duration: 420 }
        ];
        let frame = 0;
        let animationTimer;
        const drawFrame = index => {
            const [row, column] = frames[index].cell;
            actors.forEach(({ canvas, context, image, config }) => {
                if (!image.complete || !image.naturalWidth) return;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    image,
                    config.x[column], config.y[row], config.width, config.height,
                    (canvas.width - config.width) / 2,
                    config.offsetY[row][column],
                    config.width,
                    config.height
                );
            });
        };
        actors.forEach(actor => actor.image.addEventListener('load', () => drawFrame(frame), { once: true }));
        const stopWalking = () => {
            clearTimeout(animationTimer);
            animationTimer = undefined;
            frame = 0;
            drawFrame(frame);
        };
        const startWalking = () => {
            if (reducedMotion || animationTimer) return;
            frame = 0;
            drawFrame(frame);
            const advance = () => {
                frame = (frame + 1) % frames.length;
                drawFrame(frame);
                animationTimer = setTimeout(advance, frames[frame].duration);
            };
            animationTimer = setTimeout(advance, frames[frame].duration);
        };
        cast.addEventListener('mouseenter', startWalking);
        cast.addEventListener('mouseleave', stopWalking);
        cast.addEventListener('focusin', startWalking);
        cast.addEventListener('focusout', stopWalking);
        stopWalking();
    });

});
