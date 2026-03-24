import type { Render } from "matter-js";
import { FRUITS } from "./fruits";
import { GAME_OVER_LINE_Y, PLAY_MAX_X, PLAY_MIN_X } from "./constants";
import { clampMouseX, getPreviewY } from "./controls";
import type { FruitBody } from "./types";

function drawFace(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
) {
    const eyeRadius = Math.max(1.5, radius * 0.08);
    const eyeOffsetX = radius * 0.28;
    const eyeOffsetY = radius * 0.18;

    context.save();

    // 눈 생성
    context.beginPath();
    context.arc(x - eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    context.arc(x + eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    context.fillStyle = "#222";
    context.fill();

    // 입
    context.beginPath();
    context.arc(x, y + radius * 0.1, radius * 0.22, 0.15 * Math.PI, 0.85 * Math.PI);
    context.strokeStyle = "#222";
    context.lineWidth = Math.max(1, radius * 0.06);
    context.stroke();

    context.restore();
}

export function drawFruits(render: Render, bodies: FruitBody[]) {
    const context = render.context;

    bodies.forEach((body) => {
        if (body.fruitLevel === undefined) return;

        const fruit = FRUITS[body.fruitLevel];
        const x = body.position.x;
        const y = body.position.y;
        const r = fruit.radius;

        context.save();
        context.translate(x, y);
        context.rotate(body.angle);

        // 과일 몸통
        context.beginPath();
        context.arc(0, 0, r, 0, Math.PI * 2);
        context.fillStyle = fruit.color;
        context.fill();

        // 살짝 테두리
        context.beginPath();
        context.arc(0, 0, r, 0, Math.PI * 2);
        context.strokeStyle = "rgba(0,0,0,0.12)";
        context.lineWidth = 2;
        context.stroke();

        // 얼굴
        drawFace(context, 0, 0, r);

        context.restore();
    });
}

export function drawPreviewFruit(render: Render, mouseX: number, level: number) {
    const context = render.context;
    const x = clampMouseX(mouseX, level);
    const y = getPreviewY(level);
    const radius = FRUITS[level].radius;

    context.save();
    context.globalAlpha = 0.45;

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = FRUITS[level].color;
    context.fill();

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(0,0,0,0.12)";
    context.lineWidth = 2;
    context.stroke();

    drawFace(context, x, y, radius);

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