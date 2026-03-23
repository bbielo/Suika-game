export const FRUITS = [
    { name: "blueberry", radius: 12, color: "#4C6FFF" },
    { name: "strawberry", radius: 16, color: "#FF4D6D" },
    { name: "lemon", radius: 20, color: "#FFD60A" },
    { name: "apple", radius: 24, color: "#FF6B6B" },
    { name: "peach", radius: 28, color: "#FFB4A2" },
    { name: "orange", radius: 32, color: "#FF922B" },
    { name: "pineapple", radius: 38, color: "#E9C46A" },
    { name: "watermelon", radius: 46, color: "#43AA8B" },
] as const;

export const SCORE_TABLE = [10, 20, 30, 40, 50, 60, 80, 100];

export function getRandomSpawnLevel() {
    return Math.floor(Math.random() * 4);
}