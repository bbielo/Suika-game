import type { Render } from "matter-js";
import { FRUITS } from "./fruits";
import { GAME_OVER_LINE_Y, PLAY_MAX_X, PLAY_MIN_X } from "./constants";
import { clampMouseX, getPreviewY } from "./controls";

export function drawPreviewFruit(render: Render, mouseX: number, level: number) {
    const context = render.context;
    const x = clampMouseX(mouseX, level);
    const y = getPreviewY(level);

    context.save();
    context.globalAlpha = 0.45;
    context.beginPath();
    context.arc(x, y, FRUITS[level].radius, 0, Math.PI * 2);
    context.fillStyle = FRUITS[level].color;
    context.fill();
    context.restore();
}

export function drawGameOverLine(render: Render) {
    const context = render.context;

    context.save();
    context.beginPath();
    context.moveTo(PLAY_MIN_X, GAME_OVER_LINE_Y);
    context.lineTo(PLAY_MAX_X, GAME_OVER_LINE_Y);
    context.strokeStyle = "#ff0000";
    context.lineWidth = 2;
    context.setLineDash([8, 6]);
    context.stroke();
    context.restore();
}