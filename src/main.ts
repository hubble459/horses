import './style.css';
import modes from './modes';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

if (ctx === null) {
    throw new Error('Could not get context from canvas');
}

const current_mode = location.hash?.slice(1);
const buttons = document.querySelectorAll<HTMLButtonElement>('button[id^=mode_]');

for (const button of buttons) {
  const type = button.id.slice('mode_'.length) as keyof typeof modes;

  button.addEventListener('click', () => {
    location.hash = type;

    const play = modes[type];
    if (play) {
      console.debug(`Starting ${type}...`);
      play(canvas, ctx);
    } else {
      console.debug(`Could not find ${type}`);
    }
  });

  if (type === current_mode) {
    button.click();
  }
}

// console.log(buttons);

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
