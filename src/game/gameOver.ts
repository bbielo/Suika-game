import { Runner, type Engine, type Runner as RunnerType } from "matter-js";
import type { FruitBody } from "./types";
import {
    GAME_OVER_GRACE_MS,
    GAME_OVER_LINE_Y,
    GAME_OVER_OFFSET,
    GAME_OVER_SPEED_LIMIT,
} from "./constants";

type CheckGameOverParams = {
    engine: Engine;
    runner: RunnerType;
    gameOverRef: { current: boolean };
    setGameOver: (value: boolean) => void;
};

export function checkGameOver({
    engine,
    runner,
    gameOverRef,
    setGameOver,
}: CheckGameOverParams) {
    if (gameOverRef.current) return true;

    const bodies = engine.world.bodies as FruitBody[];
    const now = Date.now();

    for (const body of bodies) {
        if (body.fruitLevel === undefined) continue;

        if (body.droppedAt && now - body.droppedAt < GAME_OVER_GRACE_MS) {
            continue;
        }

        const speed = Math.hypot(body.velocity.x, body.velocity.y);
        if (speed > GAME_OVER_SPEED_LIMIT) continue;

        const topY = body.bounds.min.y + GAME_OVER_OFFSET;

        if (topY <= GAME_OVER_LINE_Y) {
            gameOverRef.current = true;
            setGameOver(true);
            Runner.stop(runner);
            return true;
        }
    }

    return false;
}