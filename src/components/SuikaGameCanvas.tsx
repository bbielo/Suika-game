"use client";

export default function SuikaGameCanvas() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div className="w-[400px]">
                <h1 className="mb-4 text-center text-3xl font-bold">Suika Game</h1>

                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="mb-3 flex justify-between">
                        <span className="font-semibold">Score: 0</span>
                        <button className="rounded bg-red-400 px-3 py-1 text-white">
                            Restart
                        </button>
                    </div>

                    <div className="flex h-[600px] items-center justify-center rounded bg-neutral-200">
                        Game Area
                    </div>
                </div>
            </div>
        </main>
    );
}