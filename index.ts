const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

if (canvas === null) {
    throw new Error("Missing <canvas id=\"canvas\"> element");
}

const ctx = canvas.getContext('2d')!;

if (ctx === null) {
    throw new Error("Could not get context from canvas");
}

/** Constants */
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

enum Color {
    White = 'white',
    Black = 'black',
    Red = 'red',
}

function play(width: number, height: number, color: Color) {
    const get_real_x = (x: number) => Math.floor(CANVAS_WIDTH * (1 / width * x));
    const get_real_y = (y: number) => Math.floor(CANVAS_HEIGHT * (1 / height * y));
    const block_width = get_real_x(1);
    const block_height = get_real_y(1);
    const grid = Array.from({length: width})
        .map(() => Array.from({length: height}).fill(false));

    function real_line(from_x: number, from_y: number, to_x: number, to_y: number) {
        ctx.beginPath();
        ctx.moveTo(from_x, from_y);
        ctx.lineTo(to_x, to_y);
        ctx.stroke();
    }

    function draw_grid_lines() {
        for (let i = 0; i <= width; i++) {
            const x = get_real_x(i);
            real_line(x, 0, x, CANVAS_HEIGHT);
        }

        for (let i = 0; i <= height; i++) {
            const y = get_real_y(i);
            real_line(0, y, CANVAS_WIDTH, y);
        }
    }

    function draw_block(x: number, y: number) {
        const padding = 1;
        ctx.fillRect(
            get_real_x(x) + padding,
            get_real_y(y) + padding,
            block_width - padding * 2,
            block_height - padding * 2,
        );
    }

    grid[Math.floor(Math.random() * width)][Math.floor(Math.random() * height)] = true;

    let delete_mode = false;
    function frame(dt: number) {
        // clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        draw_grid_lines();

        const possibilities: [x: number, y: number][] = [];
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                // is filled
                if (grid[x][y]) {
                    draw_block(x, y);

                    const l = possibilities.length;

                    if (grid[x - 1]?.[y] === false) {
                        possibilities.push([x - 1, y]);
                    }
                    if (grid[x + 1]?.[y] === false) {
                        possibilities.push([x + 1, y]);
                    }
                    if (grid[x][y - 1] === false) {
                        possibilities.push([x, y - 1]);
                    }
                    if (grid[x][y + 1] === false) {
                        possibilities.push([x, y + 1]);
                    }

                    if (delete_mode) {
                        let is_side = possibilities.length - l !== 0;
                        possibilities.length = l;
                        if (is_side) {
                            possibilities.push([x, y]);
                        }
                        continue;
                    }
                }
            }
        }

        if (possibilities.length === +delete_mode) {
            delete_mode = !delete_mode;
            if (delete_mode) {
                grid[Math.floor(Math.random() * width)][Math.floor(Math.random() * height)] = false;
                setTimeout(frame, 100);
                return;
            }
        }

        const [target_x, target_y] = possibilities[Math.floor(Math.random() * possibilities.length)];
        // delete or set block
        grid[target_x][target_y] = !delete_mode;

        setTimeout(frame, 100);
    }

    frame(0);
}

play(20, 20, Color.Black);