import blob from './blob';

const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

if (canvas === null) {
    throw new Error("Missing <canvas id=\"canvas\"> element");
}

const ctx = canvas.getContext('2d')!;

if (ctx === null) {
    throw new Error("Could not get context from canvas");
}

const navigation = document.getElementById('navigation') as HTMLElement | null;

if (navigation === null) {
    throw new Error("Missing <nav id=\"navigation\"> element");
}

function button(text: string, onclick: (this: HTMLButtonElement, event: MouseEvent) => any) {
    const button = document.createElement('button');
    button.innerText = text;
    button.addEventListener('click', onclick);

    navigation?.appendChild(button);
}

button('blob', () => blob(canvas!, ctx!));
