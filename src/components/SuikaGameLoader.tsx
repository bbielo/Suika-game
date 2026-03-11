"use client";

import dynamic from "next/dynamic";

const SuikaGameCanvas = dynamic(
    () => import("@/components/SuikaGameCanvas"),
    { ssr: false }
);

export default function SuikaGameLoader() {
    return <SuikaGameCanvas />;
}