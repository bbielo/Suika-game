"use client";

import { useEffect, useRef, useState } from "react";
import { Engine, Events, Render, Runner, World } from "matter-js";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";
import { createGameEngine } from "@/game/engine";
import { FRUITS, getRandomSpawnLevel } from "@/game/fruits";
import { clampMouseX, getPreviewY } from "@/game/controls";
import { drawGameOverLine, drawPreviewFruit } from "@/game/renderer";
import { checkGameOver } from "@/game/gameOver";
import { createFruit, tryMergeFruits } from "@/game/collision";
import type { FruitBody } from "@/game/types";

export default function SuikaGameCanvas() {
    const sceneRef = useRef<HTMLDivElement | null>(null);
    const gameOverRef = useRef(false);

    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [resetTick, setResetTick] = useState(0);
    const [nextFruit, setNextFruit] = useState(() => getRandomSpawnLevel());

    const nextFruitRef = useRef(nextFruit);

    useEffect(() => {
        if (!sceneRef.current) return;

        gameOverRef.current = false;
        sceneRef.current.innerHTML = "";

        const engine = createGameEngine();
        const runner = Runner.create();

        const render = Render.create({
            element: sceneRef.current,
            engine,
            options: {
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                wireframes: false,
                background: "#e5e5e5",
                pixelRatio: 1,
            },
        });

        // 캔버스 실제 크기와 CSS 크기를 강제로 동일하게 맞춤
        render.canvas.width = GAME_WIDTH;
        render.canvas.height = GAME_HEIGHT;
        render.canvas.style.width = `${GAME_WIDTH}px`;
        render.canvas.style.height = `${GAME_HEIGHT}px`;
        render.canvas.style.display = "block";

        let mouseX = GAME_WIDTH / 2;
        let nextLevel = nextFruitRef.current;

        const afterRender = () => {
            drawGameOverLine(render);

            if (!gameOverRef.current) {
                drawPreviewFruit(render, mouseX, nextLevel);
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (gameOverRef.current) return;

            const rect = render.canvas.getBoundingClientRect();
            const rawX = event.clientX - rect.left;

            mouseX = clampMouseX(rawX, nextLevel);
        };

        const handleClick = () => {
            if (gameOverRef.current) return;

            const x = clampMouseX(mouseX, nextLevel);
            const y = getPreviewY(nextLevel);

            const fruit = createFruit(nextLevel, x, y);
            World.add(engine.world, fruit);

            nextLevel = getRandomSpawnLevel();
            nextFruitRef.current = nextLevel;
            setNextFruit(nextLevel);
        };

        const handleCollision = (event: Matter.IEventCollision<Engine>) => {
            if (gameOverRef.current) return;

            event.pairs.forEach((pair) => {
                tryMergeFruits({
                    engine,
                    bodyA: pair.bodyA as FruitBody,
                    bodyB: pair.bodyB as FruitBody,
                    addScore: (value) => setScore((prev) => prev + value),
                });
            });

            checkGameOver({
                engine,
                runner,
                gameOverRef,
                setGameOver,
            });
        };

        const handleAfterUpdate = () => {
            if (!gameOverRef.current) {
                checkGameOver({
                    engine,
                    runner,
                    gameOverRef,
                    setGameOver,
                });
            }
        };

        render.canvas.addEventListener("mousemove", handleMouseMove);
        render.canvas.addEventListener("click", handleClick);

        Events.on(engine, "collisionActive", handleCollision);
        Events.on(engine, "afterUpdate", handleAfterUpdate);
        Events.on(render, "afterRender", afterRender);

        Runner.run(runner, engine);
        Render.run(render);

        return () => {
            render.canvas.removeEventListener("mousemove", handleMouseMove);
            render.canvas.removeEventListener("click", handleClick);

            Events.off(engine, "collisionActive", handleCollision);
            Events.off(engine, "afterUpdate", handleAfterUpdate);
            Events.off(render, "afterRender", afterRender);

            Render.stop(render);
            Runner.stop(runner);
            World.clear(engine.world, false);
            Engine.clear(engine);

            render.canvas.remove();
            render.textures = {};
        };
    }, [resetTick]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div style={{ width: GAME_WIDTH + 32 }}>
                <h1 className="mb-4 text-center text-3xl font-bold">Suika Game</h1>

                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-3 flex justify-between">
                        <span className="font-semibold">Score: {score}</span>

                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-500">Next</p>
                                <div
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: "50%",
                                        background: FRUITS[nextFruit].color,
                                        margin: "0 auto",
                                    }}
                                />
                            </div>

                            <button
                                className="rounded bg-red-400 px-3 py-1 text-white"
                                onClick={() => {
                                    const newNext = getRandomSpawnLevel();

                                    setScore(0);
                                    setGameOver(false);
                                    gameOverRef.current = false;
                                    nextFruitRef.current = newNext;
                                    setNextFruit(newNext);
                                    setResetTick((prev) => prev + 1);
                                }}
                            >
                                Restart
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                            ref={sceneRef}
                            className="overflow-hidden rounded bg-neutral-200"
                            style={{
                                width: `${GAME_WIDTH}px`,
                                height: `${GAME_HEIGHT}px`,
                            }}
                        />

                        {gameOver && (
                            <div
                                className="absolute inset-0 flex items-center justify-center rounded bg-black/35"
                                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                            >
                                <div className="rounded bg-white px-6 py-4 text-center shadow">
                                    <p className="text-2xl font-bold text-red-500">GAME OVER</p>
                                    <p className="mt-2 text-sm text-neutral-700">
                                        Final Score: {score}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}