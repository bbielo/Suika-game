import { Bodies, Engine, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH, WALL_THICKNESS } from "./constants";

export function createGameEngine() {
    const engine = Engine.create();
    engine.gravity.y = 1.1;

    const ground = Bodies.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT + WALL_THICKNESS / 2,
        GAME_WIDTH,
        WALL_THICKNESS,
        { isStatic: true }
    );

    const leftWall = Bodies.rectangle(
        -WALL_THICKNESS / 2,
        GAME_HEIGHT / 2,
        WALL_THICKNESS,
        GAME_HEIGHT,
        { isStatic: true }
    );

    const rightWall = Bodies.rectangle(
        GAME_WIDTH + WALL_THICKNESS / 2,
        GAME_HEIGHT / 2,
        WALL_THICKNESS,
        GAME_HEIGHT,
        { isStatic: true }
    );

    World.add(engine.world, [ground, leftWall, rightWall]);

    return engine;
}