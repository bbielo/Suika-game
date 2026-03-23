import type { Body } from "matter-js";

export type FruitBody = Body & {
    fruitLevel: number;
    merged?: boolean;
    mergeLocked?: boolean;
    droppedAt?: number;
};