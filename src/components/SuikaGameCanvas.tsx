"use client";

import { useEffect, useRef } from "react";
import { Bodies, Engine, Render, Runner, World, Events } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";
import { createGameEngine } from "@/game/engine";

export default function SuikaGameCanvas() {
    const sceneRef = useRef<HTMLDivElement | null>(null);

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

        // [TODO]: 과일 이미지 삽입
        const FRUITS = [
            { radius: 20, color: "#ffcc00" }, // level 0
            { radius: 30, color: "#ff9900" }, // level 1
            { radius: 40, color: "#ff6600" }, // level 2
        ];

        // fix: Body내 속성에 fruitLevel 생성
        type FruitBody = Matter.Body & {
            fruitLevel: number;
        };

        // 클릭시 과일 생성
        const handleClick = (event: MouseEvent) => {

            const rect = render.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;

            const fruit = Bodies.circle(x, 50, FRUITS[0].radius, { restitution: 0.2,render: {fillStyle: FRUITS[0].color}}) as FruitBody;              // FruitBody 타입으로 변환

            fruit.fruitLevel = 0;
            World.add(engine.world, fruit);
        };

        render.canvas.addEventListener("click", handleClick);

        Events.on(engine, "collisionStart", (event) => {

            event.pairs.forEach((pair) => {
                // 충돌 과일
                const a = pair.bodyA as FruitBody;
                const b = pair.bodyB as FruitBody;

                if (a.fruitLevel === undefined || b.fruitLevel === undefined) return;
                if (a.fruitLevel !== b.fruitLevel) return;

                const level = a.fruitLevel;

                if (level >= FRUITS.length - 1) return;

                const newLevel = level + 1;

                const x = (a.position.x + b.position.x) / 2;
                const y = (a.position.y + b.position.y) / 2;

                // 기존 과일 제거
                World.remove(engine.world, a);
                World.remove(engine.world, b);

                // 새로운 과일 생성
                const newFruit = Bodies.circle(x, y, FRUITS[newLevel].radius,
                    {
                        restitution: 0.2,
                        render: {
                            fillStyle: FRUITS[newLevel].color
                        }
                    }
                ) as FruitBody;

                newFruit.fruitLevel = newLevel;

                World.add(engine.world, newFruit);
            });
        });

        Runner.run(runner, engine);
        Render.run(render);

        return () => {

            render.canvas.removeEventListener("click", handleClick);

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
                        <span className="font-semibold">Score: 0</span>
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