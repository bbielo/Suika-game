"use client";

import { useRef } from "react";
import { GAME_HEIGHT, GAME_WIDTH } from "@/game/constants";

export default function SuikaGameCanvas() {
    const sceneRef = useRef<HTMLDivElement | null>(null);

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