// function draw_grid_lines() {
//     const fraction = CANVAS_SIZE / SIZE;
//     for (let pos = 0; pos <= CANVAS_SIZE; pos += fraction) {
//         ctx.beginPath();
//         ctx.moveTo(pos, 0);
//         ctx.lineTo(pos, CANVAS_SIZE);
//         ctx.stroke();

//         ctx.beginPath();
//         ctx.moveTo(0, pos);
//         ctx.lineTo(CANVAS_SIZE, pos);
//         ctx.stroke();
//     }
// }

export default function play(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    /** Constants */
    const CANVAS_SIZE = canvas.width;
    const SIZE = 100;
    const GRID = Array.from({ length: SIZE * SIZE }).fill('#0000');
    const BLOCK_PADDING = 0;
    const COLORS = Array.from({ length: 20 }).map(() => pastel_color());

    const transform = (x_or_y: number) => Math.floor(CANVAS_SIZE * (1 / SIZE * x_or_y));
    const pos_x = (pos: number) => pos % SIZE;
    const pos_y = (pos: number) => Math.floor(pos / SIZE);
    const rand_percentage = (min = 0, max = 100) => Math.floor(Math.random() * (max - min + 1) + min);
    const pastel_color = () => `hsl(${rand_percentage(0, 360)}deg ${rand_percentage(30, 70)}% ${rand_percentage(70, 90)}%)`;
    const BLOCK_SIZE = transform(1);

    function draw_block(x: number, y: number) {
        ctx.fillRect(
            transform(x) + BLOCK_PADDING,
            transform(y) + BLOCK_PADDING,
            BLOCK_SIZE - BLOCK_PADDING * 2,
            BLOCK_SIZE - BLOCK_PADDING * 2,
        );
    }


    for (const color of COLORS) {
        GRID[Math.floor(Math.random() * GRID.length)] = color;
    }

    function frame(_dt: number) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        const blocks: number[] = [];
        const possibilities: number[] = [];
        for (let pos = 0; pos < GRID.length; pos++) {
            // is filled
            if (GRID[pos] === color) {
                blocks.push(pos);
                const x = pos_x(pos);
                const y = pos_y(pos);

                ctx.fillStyle = color;
                draw_block(x, y);

                if (x > 0 && GRID[pos - 1] !== color) {
                    possibilities.push(pos - 1);
                }
                if (x < SIZE - 1 && GRID[pos + 1] !== color) {
                    possibilities.push(pos + 1);
                }
                if (y > 0 && GRID[pos - SIZE] !== color) {
                    possibilities.push(pos - SIZE);
                }
                if (y < SIZE - 1 && GRID[pos + SIZE] !== color) {
                    possibilities.push(pos + SIZE);
                }
            }
        }

        if (possibilities.length === 0) {
            COLORS.splice(COLORS.indexOf(color), 1);
        }

        console.log(possibilities);

        const avg = blocks.reduce(([avg_x, avg_y], pos) => [(avg_x + pos_x(pos)), (avg_y + pos_y(pos))], [0, 0]);
        const [avg_x, avg_y] = [Math.round(avg[0] / blocks.length), Math.round(avg[1] / blocks.length)];
        ctx.fillStyle = 'red';
        console.log({avg_x, avg_y})
        draw_block(avg_x, avg_y);
        possibilities.sort((pos_1, pos_2) => {
            const distance_1 = Math.sqrt(Math.pow(pos_x(pos_1) - avg_x, 2) + Math.pow(pos_y(pos_1) - avg_y, 2));
            const distance_2 = Math.sqrt(Math.pow(pos_x(pos_2) - avg_x, 2) + Math.pow(pos_y(pos_2) - avg_y, 2));

            return distance_1 - distance_2;
        });

        // const pos = possibilities[Math.floor(Math.sqrt(Math.random()) * possibilities.length * .75)];
        const pos = possibilities[Math.floor(Math.random() * possibilities.length)];
        // const pos = possibilities[Math.floor(Math.random() * Math.min(possibilities.length, 10))];
        // const pos = possibilities[0];
        GRID[pos] = color;

        requestAnimationFrame(frame);
        // setTimeout(frame, 1000);
    }

    for (let i = 0; i < COLORS.length; i++) {
        requestAnimationFrame(frame);
    }
    // setTimeout(frame, 1000);
}
