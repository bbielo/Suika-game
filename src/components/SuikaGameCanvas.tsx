"use client";

import { useEffect, useRef } from "react";
import { Engine, Render, Runner } from "matter-js";
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

        Runner.run(runner, engine);
        Render.run(render);

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
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