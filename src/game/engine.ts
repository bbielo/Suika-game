import { Engine, Bodies, World } from "matter-js";

export function createGameEngine() {

    // 물리 엔진 생성
    const engine = Engine.create();

    // 중력 설정
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    // 바닥설정 (x, y, 너비, 높이, {고정 true})
    const ground = Bodies.rectangle(200, 610, 400, 20,{ isStatic: true });
    World.add(engine.world, ground);

    return engine;
}