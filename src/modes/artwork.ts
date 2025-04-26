export default function play(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const CANVAS_SIZE = canvas.width;
    const SIZE = 100;
    const GRID = Array(SIZE * SIZE).fill('#0000');
    const BLOCK_SIZE = Math.floor(CANVAS_SIZE / SIZE);

    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    const COLORS = Array.from({ length: 20 }, () => `hsl(${rand(0, 360)}deg ${rand(30, 70)}% ${rand(70, 90)}%)`);
    const pos_x = (pos: number) => pos % SIZE;
    const pos_y = (pos: number) => Math.floor(pos / SIZE);

    function draw_block(x: number, y: number, color: string) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    COLORS.forEach(color => {
        GRID[Math.floor(Math.random() * GRID.length)] = color;
    });

    function draw_grid() {
        GRID.forEach((color, i) => {
            const x = pos_x(i);
            const y = pos_y(i);
            draw_block(x, y, color);
        });
    }

    function frame() {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const blocks = GRID.map((c, i) => (c === color ? i : -1)).filter(i => i !== -1);
        const possibilities = blocks.flatMap(pos => {
            const x = pos_x(pos);
            const y = pos_y(pos);

            return [
                x > 0 && GRID[pos - 1] !== color && pos - 1,
                x < SIZE - 1 && GRID[pos + 1] !== color && pos + 1,
                y > 0 && GRID[pos - SIZE] !== color && pos - SIZE,
                y < SIZE - 1 && GRID[pos + SIZE] !== color && pos + SIZE,
            ].filter(Boolean) as number[];
        })
        // filter out colored blocks
        .filter(pos => GRID[pos] === '#0000');

        if (!possibilities.length) {
            console.log('DIED', color);

            COLORS.splice(COLORS.indexOf(color), 1);
            return;
        } else if (possibilities.length === 1) {
            GRID[possibilities[0]] = color;
        }

        const avg = blocks.reduce(([ax, ay], pos) => [ax + pos_x(pos), ay + pos_y(pos)], [0, 0]);
        const [avg_x, avg_y] = [Math.round(avg[0] / blocks.length), Math.round(avg[1] / blocks.length)];

        possibilities.sort((b, a) => {
            const dist = (pos: number) => Math.hypot(pos_x(pos) - avg_x, pos_y(pos) - avg_y);
            const score = dist(a) - dist(b);
            // empty one should be scored higher
            return (GRID[a] === '#0000' ? 1 : (GRID[b] === '#0000' ? -1 : 0)) || score;
        });

        GRID[possibilities[0]] = color;

        draw_grid();
        // draw_block(avg_x, avg_y, 'red');
        requestAnimationFrame(frame);
    }

    draw_grid();

    COLORS.forEach(() => requestAnimationFrame(frame));
}
