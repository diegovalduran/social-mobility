import fs from "fs";
import { createCanvas } from "canvas";
const w = 1280;
const h = 1280 / 1.6;
const canvas = createCanvas(w, h);
const ctx = canvas.getContext("2d");

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("image.png", buffer);
