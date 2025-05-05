// ## Generated with AI ;-;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    color: string,
}

export default function play(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    const particles: Particle[] = [];
    const G = 0.09; // Gravitational constant
    const numParticles = 100; // Customizable number of particles
    const mouse = { x: 0, y: 0, mass: 500 }; // Mouse pointer with the largest mass

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            mass: Math.random() * 5 + 1,
            color: `hsl(${rand(0, 360)}deg ${rand(30, 70)}% ${rand(70, 90)}%)`,
        });
    }

    // Track mouse position
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left - 30;
        mouse.y = event.clientY - rect.top - 30;
    });

    function update() {
        // Update particle positions
        for (const particle of particles) {
            let ax = 0;
            let ay = 0;

            // Calculate gravitational force from the mouse
            const dxMouse = mouse.x - particle.x;
            const dyMouse = mouse.y - particle.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            if (distMouse > 1) {
                const forceMouse = (G * mouse.mass * particle.mass) / (distMouse * distMouse);
                ax += (forceMouse * dxMouse) / distMouse;
                ay += (forceMouse * dyMouse) / distMouse;
            }

            // Calculate gravitational forces between particles
            for (const other of particles) {
                if (other === particle) continue;
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 1) {
                    const force = (G * other.mass * particle.mass) / (dist * dist);
                    ax += (force * dx) / dist;
                    ay += (force * dy) / dist;
                }
            }

            // Update velocity and position
            particle.vx += ax;
            particle.vy += ay;
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Handle boundary collisions
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw particles
        for (const particle of particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.mass, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        }

        // Draw mouse pointer
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    function animate() {
        update();
        draw();
        requestAnimationFrame(animate);
    }

    animate();
}