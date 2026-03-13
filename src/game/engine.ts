import { Bodies, Engine, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";

export function createGameEngine() {

    // 물리 엔진 생성
    const engine = Engine.create();

    // 중력 설정
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    // 바닥설정 (x, y, 너비, 높이, {고정 true})
    const ground = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT + 10, GAME_WIDTH, 20, { isStatic: true });
    World.add(engine.world, ground);

    return engine;
}