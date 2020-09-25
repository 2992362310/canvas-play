<template>
  <div class="hello">
    <button @click="draw">绘制</button>
    <img id="proportion" src="../../assets/img/thematic-map/proportion.png" />
    <img id="legend" src="../../assets/img/thematic-map/legend.png" />
    <canvas
      id="canvas"
      width="840"
      height="580"
      style="width:840px;height:580px;"
      class="mapCanvas"
    ></canvas>
  </div>
</template>

<script>
import { drawThematicMap } from "./thematic-map";

export default {
  name: "HelloWorld",

  methods: {
    draw() {
      let canvas = document.getElementById("canvas");
      let context = canvas.getContext("2d");
      let code = {
        value: "H49G002091",
        位置: "吴家店",
        经度跨度: "345",
        纬度跨度: "230",
        经度_度: "113",
        经度_分: "37",
        经度_秒: "30",
        纬度_度: "31",
        纬度_分: "55",
        纬度_秒: "00",
      };

      let testValue = 2400;
      let size = testValue / 840;
      canvas.width = 840 * size;
      canvas.height = 580 * size;

      let gridSets = {},
        gridTitle = {},
        gridLine = {},
        gridFont = {};

      gridSets.x = 20 * size;
      gridSets.y = 50 * size;
      gridSets.width = 720 * size;
      gridSets.height = 480 * size;
      gridSets.x_span = 14 * size;
      gridSets.y_span = 14 * size;

      gridTitle.mapName = "一级标题——专题图名";
      gridTitle.mapCode = "二级标题——图幅编号";

      gridLine.lineWidth = 1 * size;
      gridLine.lineColor = "black";

      gridFont.fontName = "宋体";
      gridFont.fontSize = 14 * size;
      gridFont.fontColor = "black";

      drawThematicMap(context, code, gridSets, gridTitle, gridLine, gridFont);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas {
  border: 1px solid;
}

img {
  display: none;
}
</style>
