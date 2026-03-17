import { Bodies, Engine, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";

export function createGameEngine() {
    const engine = Engine.create();

    engine.gravity.x = 0;
    engine.gravity.y = 1;

    const wallThickness = 40;

    const ground = Bodies.rectangle(
        GAME_WIDTH / 2,
        GAME_HEIGHT + wallThickness / 2,
        GAME_WIDTH,
        wallThickness,
        {
            isStatic: true,
            restitution: 0,
            friction: 1,
            render: {
                fillStyle: "#E7B143",
            },
        }
    );

    const leftWall = Bodies.rectangle(
        -wallThickness / 2,
        GAME_HEIGHT / 2,
        wallThickness,
        GAME_HEIGHT,
        {
            isStatic: true,
            restitution: 0,
            friction: 1,
            render: {
                fillStyle: "#E7B143",
            },
        }
    );

    const rightWall = Bodies.rectangle(
        GAME_WIDTH + wallThickness / 2,
        GAME_HEIGHT / 2,
        wallThickness,
        GAME_HEIGHT,
        {
            isStatic: true,
            restitution: 0,
            friction: 1,
            render: {
                fillStyle: "#E7B143",
            },
        }
    );

    World.add(engine.world, [ground, leftWall, rightWall]);

    return engine;
}