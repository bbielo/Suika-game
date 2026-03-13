import { Bodies, Engine, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";

export function createGameEngine() {
    // 물리 엔진 생성
    const engine = Engine.create();

    // 중력 설정
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    // space 설정 : (x, y, 너비, 높이, {고정 true})
    const wallThickness = 20;
    const ground = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT + wallThickness / 2, GAME_WIDTH, wallThickness, { isStatic: true } );
    const leftWall = Bodies.rectangle(-10, GAME_HEIGHT / 2, wallThickness, GAME_HEIGHT, { isStatic: true });
    const rightWall = Bodies.rectangle(GAME_WIDTH - 22, GAME_HEIGHT / 2, wallThickness, GAME_HEIGHT, { isStatic: true } );

    World.add(engine.world, [ground, leftWall, rightWall]);
    return engine;
}