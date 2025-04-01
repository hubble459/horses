declare const canvas: HTMLCanvasElement | null;
declare const ctx: CanvasRenderingContext2D;
declare const CANVAS_WIDTH: number;
declare const CANVAS_HEIGHT: number;
declare enum Color {
    White = "white",
    Black = "black",
    Red = "red"
}
declare function play(width: number, height: number, color: Color): void;
