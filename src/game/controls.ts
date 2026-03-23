import { FRUITS } from "./fruits";
import { PLAY_MAX_X, PLAY_MIN_X } from "./constants";

export function getPreviewY(level: number) {
    return FRUITS[level].radius + 12;
}

export function clampMouseX(x: number, level: number) {
    const radius = FRUITS[level].radius;
    const minX = PLAY_MIN_X + radius;
    const maxX = PLAY_MAX_X - radius;

    if (x < minX) return minX;
    if (x > maxX) return maxX;
    return x;
}