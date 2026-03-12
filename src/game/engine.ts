import { Engine } from "matter-js";

// 물리 엔진 생성
export function createGameEngine() {
    const engine = Engine.create();

    // x축 중력 - 좌우
    engine.gravity.x = 0;

    // y축 중력 - 상하
    engine.gravity.y = 1;

    return engine;
}