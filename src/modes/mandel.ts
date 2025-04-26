export default function play(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const width = canvas.width;
    const height = canvas.height;

    const maxIterations = 1000;

    const minX = -1.8;
    const maxX = 0.5;
    const minY = -1;
    const maxY = 1;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
            const x0 = minX + (px / width) * (maxX - minX);
            const y0 = minY + (py / height) * (maxY - minY);

            let x = 0;
            let y = 0;
            let iteration = 0;

            while (x * x + y * y <= 4 && iteration < maxIterations) {
                const xtemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xtemp;
                iteration++;
            }

            const color = iteration === maxIterations ? 0 : (iteration / maxIterations) * 255;

            const pixelIndex = (py * width + px) * 4;
            data[pixelIndex] = color; // Red
            data[pixelIndex + 1] = color; // Green
            data[pixelIndex + 2] = color; // Blue
            data[pixelIndex + 3] = 255; // Alpha
        }
    }

    ctx.putImageData(imageData, 0, 0);
}