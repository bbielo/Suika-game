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
    
    // 벽 설정
    const leftWall = Bodies.rectangle(-10, GAME_HEIGHT / 2, 20, GAME_HEIGHT, { isStatic: true });
    const rightWall = Bodies.rectangle(GAME_WIDTH -22, GAME_HEIGHT / 2, 20, GAME_HEIGHT, { isStatic: true });
    
    World.add(engine.world, [ground, leftWall, rightWall]);
    return engine;
}