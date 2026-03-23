import { Bodies, World } from "matter-js";
import type { Engine } from "matter-js";
import type { FruitBody } from "./types";
import { FRUITS, SCORE_TABLE } from "./fruits";

export function createFruit(level: number, x: number, y: number) {
    const fruit = Bodies.circle(x, y, FRUITS[level].radius, {
        restitution: 0,
        friction: 0.9,
        frictionAir: 0.01,
        density: 0.002,
        render: {
            fillStyle: FRUITS[level].color,
        },
    }) as FruitBody;

    fruit.fruitLevel = level;
    fruit.merged = false;
    fruit.mergeLocked = false;
    fruit.droppedAt = Date.now();

    return fruit;
}

type HandleMergeParams = {
    engine: Engine;
    bodyA: FruitBody;
    bodyB: FruitBody;
    addScore: (value: number) => void;
};

export function tryMergeFruits({
    engine,
    bodyA,
    bodyB,
    addScore,
}: HandleMergeParams) {
    if (bodyA.fruitLevel === undefined || bodyB.fruitLevel === undefined) return;
    if (bodyA.merged || bodyB.merged) return;
    if (bodyA.mergeLocked || bodyB.mergeLocked) return;
    if (bodyA.fruitLevel !== bodyB.fruitLevel) return;

    const level = bodyA.fruitLevel;

    if (level >= FRUITS.length - 1) return;

    const x = (bodyA.position.x + bodyB.position.x) / 2;
    const y = (bodyA.position.y + bodyB.position.y) / 2;

    bodyA.merged = true;
    bodyB.merged = true;

    World.remove(engine.world, bodyA);
    World.remove(engine.world, bodyB);

    addScore(SCORE_TABLE[level]);

    const newFruit = createFruit(level + 1, x, y);
    newFruit.mergeLocked = true;

    World.add(engine.world, newFruit);

    setTimeout(() => {
        newFruit.mergeLocked = false;
    }, 250);
}