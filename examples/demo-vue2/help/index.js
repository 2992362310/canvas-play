import {
    drawThematicMap
} from "./thematic-map"

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let code = {
    "value": "I49G095092",
    "位置": "柳板河",
    "经度跨度": "345",
    "纬度跨度": "230",
    "经度_度": "113",
    "经度_分": "41",
    "经度_秒": "15",
    "纬度_度": "32",
    "纬度_分": "2",
    "纬度_秒": "30"
};

let gridSets = {},
    titleSets = {},
    lineSets = {},
    fontSets = {};

drawThematicMap(context, code, gridSets, titleSets, lineSets, fontSets);