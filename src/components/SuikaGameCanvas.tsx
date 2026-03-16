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
            { radius: 20, color: "#ffcc00" },
            { radius: 30, color: "#ff9900" },
            { radius: 40, color: "#ff6600" },
        ];

        // fix: Body내 속성에 fruitLevel 생성
        type FruitBody = Matter.Body & {
            fruitLevel: number;
            merged?: boolean;
            mergeLocked?: boolean;
        };

        // 클릭시 과일 생성
        const handleClick = (event: MouseEvent) => {
            const rect = render.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;

            const level = Math.floor(Math.random() * 2);

            const fruit = Bodies.circle(
                x,
                50,
                FRUITS[level].radius,
                {
                    restitution: 0.2,
                    render: {
                        fillStyle: FRUITS[level].color,
                    },
                }
            ) as FruitBody;

            fruit.fruitLevel = level;
            fruit.merged = false;
            fruit.mergeLocked = false;

            World.add(engine.world, fruit);
        };

        render.canvas.addEventListener("click", handleClick);

        Events.on(engine, "collisionStart", (event) => {
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

                // 마지막 과일이면 더 이상 합체 안 함
                if (level >= FRUITS.length - 1) return;

                const newLevel = level + 1;

                // 새 과일은 두 과일의 중간 위치에 생성
                const x = (a.position.x + b.position.x) / 2;
                const y = (a.position.y + b.position.y) / 2;

                // 같은 body가 여러 번 처리되는 것 방지
                a.merged = true;
                b.merged = true;

                // 기존 과일 제거
                World.remove(engine.world, a);
                World.remove(engine.world, b);

                // 합쳐진 새 과일 생성
                const newFruit = Bodies.circle(
                    x,
                    y,
                    FRUITS[newLevel].radius,
                    {
                        restitution: 0.2,
                        render: {
                            fillStyle: FRUITS[newLevel].color,
                        },
                    }
                ) as FruitBody;

                newFruit.fruitLevel = newLevel;
                newFruit.merged = false;

                // 바로 또 연쇄 합체되는 것 방지
                newFruit.mergeLocked = true;

                World.add(engine.world, newFruit);

                // 0.25초 뒤 다시 합체 가능하게 풀기
                setTimeout(() => {
                    newFruit.mergeLocked = false;
                }, 250);
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