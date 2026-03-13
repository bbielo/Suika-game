"use client";

import { useEffect, useRef } from "react";
import { Bodies, Engine, Render, Runner, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";
import { createGameEngine } from "@/game/engine";

export default function SuikaGameCanvas() {
    const sceneRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const engine = createGameEngine();
        const runner = Runner.create();

        const render = Render.create({
            element: sceneRef.current!,
            engine: engine,
            options: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                wireframes: false,
                background: "#e5e5e5",
            },
        });

        // 클릭시 과일 생성
        const handleClick = (event: MouseEvent) => {
            const rect = sceneRef.current!.getBoundingClientRect();

            // 클릭한 x 좌표 구하기
            const x = event.clientX - rect.left;

            // 클릭한 위치에 test용 과일 생성
            const fruit = Bodies.circle(
                x, 50, 20, { restitution: 0.2});
            World.add(engine.world, fruit);
        };

        sceneRef.current!.addEventListener("click", handleClick);

        Runner.run(runner, engine);
        Render.run(render);

        return () => {
            // 클릭 이벤트 제거
            sceneRef.current?.removeEventListener("click", handleClick);

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