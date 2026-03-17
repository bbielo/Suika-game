"use client";

import { useEffect, useRef, useState } from "react";
import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";
import { createGameEngine } from "@/game/engine";

export default function SuikaGameCanvas() {
    const sceneRef = useRef<HTMLDivElement | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!sceneRef.current) return;

        const engine = createGameEngine();
        const runner = Runner.create();

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                wireframes: false,
                background: "#e5e5e5",
            },
        });

        const FRUITS = [
            { name: "blueberry", radius: 12, color: "#4C6FFF" },
            { name: "strawberry", radius: 16, color: "#FF4D6D" },
            { name: "lemon", radius: 20, color: "#FFD60A" },
            { name: "apple", radius: 24, color: "#FF6B6B" },
            { name: "peach", radius: 28, color: "#FFB4A2" },
            { name: "orange", radius: 32, color: "#FF922B" },
            { name: "pineapple", radius: 38, color: "#E9C46A" },
            { name: "watermelon", radius: 46, color: "#43AA8B" },
        ];

        const SCORE_TABLE = [10, 20, 30, 40, 50, 60, 80, 100];

        type FruitBody = Body & {
            fruitLevel: number;
            merged?: boolean;
            mergeLocked?: boolean;
        };

        // 초반엔 너무 큰 과일이 바로 안 나오게 처음 4개만 랜덤
        const SPAWN_LEVEL_COUNT = 4;

        const createFruit = (level: number, x: number, y: number) => {
            const fruit = Bodies.circle(
                x,
                y,
                FRUITS[level].radius,
                {
                    restitution: 0,
                    friction: 0.9,
                    frictionAir: 0.01,
                    density: 0.002,
                    render: {
                        fillStyle: FRUITS[level].color,
                    },
                }
            ) as FruitBody;

            fruit.fruitLevel = level;
            fruit.merged = false;
            fruit.mergeLocked = false;

            return fruit;
        };

        // 클릭시 과일 생성
        const handleClick = (event: MouseEvent) => {
            const rect = render.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;

            const level = Math.floor(Math.random() * SPAWN_LEVEL_COUNT);
            const fruit = createFruit(level, x, 50);

            World.add(engine.world, fruit);
        };

        const handleCollision = (event: Matter.IEventCollision<Engine>) => {
            event.pairs.forEach((pair) => {
                const a = pair.bodyA as FruitBody;
                const b = pair.bodyB as FruitBody;

                // return 조건 추가
                // 1. 과일이 아니면 무시
                // 2. 이미 합쳐졌으면 무시
                // 3. 잠금 상태면 무시
                // 4. 같은 레벨만 합체
                if (a.fruitLevel === undefined || b.fruitLevel === undefined) return;
                if (a.merged || b.merged) return;
                if (a.mergeLocked || b.mergeLocked) return;
                if (a.fruitLevel !== b.fruitLevel) return;

                const level = a.fruitLevel;

                const x = (a.position.x + b.position.x) / 2;
                const y = (a.position.y + b.position.y) / 2;

                a.merged = true;
                b.merged = true;

                World.remove(engine.world, a);
                World.remove(engine.world, b);

                // 점수 추가
                setScore((prev) => prev + SCORE_TABLE[level]);

                // 마지막 과일이면 새 과일 생성 안 하고 그냥 사라지게
                if (level >= FRUITS.length - 1) {
                    return;
                }

                const newLevel = level + 1;

                const newFruit = createFruit(newLevel, x, y);
                newFruit.mergeLocked = true;

                World.add(engine.world, newFruit);

                setTimeout(() => {
                    newFruit.mergeLocked = false;
                }, 250);
            });
        };

        render.canvas.addEventListener("click", handleClick);
        Events.on(engine, "collisionStart", handleCollision);

        Runner.run(runner, engine);
        Render.run(render);

        return () => {
            render.canvas.removeEventListener("click", handleClick);
            Events.off(engine, "collisionStart", handleCollision);

            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);

            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div style={{ width: GAME_WIDTH }}>
                <h1 className="mb-4 text-center text-3xl font-bold">Suika Game</h1>

                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-3 flex justify-between">
                        <span className="font-semibold">Score: {score}</span>
                        <button className="rounded bg-red-400 px-3 py-1 text-white">
                            Restart
                        </button>
                    </div>

                    <div
                        ref={sceneRef}
                        style={{ height: GAME_HEIGHT }}
                        className="relative overflow-hidden rounded bg-neutral-200"
                    />
                </div>
            </div>
        </main>
    );
}