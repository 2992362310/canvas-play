<template>
  <div>
    <div id="controls">
      Stroke Color:
      <select id="strokeStyleSelect" style="margin-right:20px" v-model="strokeColor">
        <option value="red">red</option>
        <option value="green">green</option>
        <option value="blue">blue</option>
        <option value="orange">orange</option>
      </select>
      Guid Wires:
      <input
        type="checkbox"
        id="guideWireCbx"
        v-model="isGuideWire"
        style="margin-right: 20px"
      />
      矩形选框
      <input
        type="checkbox"
        id="rectangleCbx"
        v-model="isRectangle"
        style="margin-right: 20px"
      />
      <input type="button" id="clearCanvasBtn" value="清空画布" @click="clearCanvas" />
    </div>
    <canvas
      id="canvas"
      width="800"
      height="600"
      style="width:800px;height:600px;"
      @mousedown="startDraw"
      @mousemove="drawing"
      @mouseup="endDraw"
    ></canvas>
  </div>
</template>

<script>
import { drawLine, windowToCanvasXY } from "./canvas-help";

export default {
  name: "DrawingBoard",
  data() {
    return {
      strokeColor: "red",
      isGuideWire: true,
      isRectangle: false,
      canvas: null,
      ctx: null,
      drawingSurfaceImageData: null,
      rubberbandRect: {},
      mousedown: {},
      dragging: false,
    };
  },
  mounted() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.drawGrid();
  },
  methods: {
    startDraw(e) {
      let loc = windowToCanvasXY(e, this.canvas);
      e.preventDefault();
      this.saveDrawingSurface();
      this.mousedown.x = loc.x;
      this.mousedown.y = loc.y;
      this.dragging = true;
    },
    drawing(e) {
      if (this.dragging) {
        e.preventDefault();
        let loc = windowToCanvasXY(e, this.canvas);
        this.restoreDrawingSurface();
        this.updateRubberband(loc);
        if (this.isGuideWire) {
          this.drawGuideWires(loc);
        }
      }
    },
    endDraw(e) {
      let loc = windowToCanvasXY(e, this.canvas);
      this.restoreDrawingSurface();
      this.updateRubberband(loc);
      this.dragging = false;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawGrid();
      this.saveDrawingSurface();
    },
    drawGrid() {
      let line = {};
      line.color = "lightgray";
      line.width = 0.5;

      //绘制竖线
      for (let x = 0; x < this.canvas.width; x += 10) {
        let start = {},
          end = {};
        start.x = x;
        start.y = 0;
        end.x = x;
        end.y = this.canvas.height;
        drawLine(this.ctx, start, end, line);
      }
      //绘制横线
      for (let y = 1; y < this.canvas.height; y += 10) {
        let start = {},
          end = {};
        start.x = 0;
        start.y = y;
        end.x = this.canvas.width;
        end.y = y;
        drawLine(this.ctx, start, end, line);
      }
    },
    saveDrawingSurface() {
      this.drawingSurfaceImageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    },
    restoreDrawingSurface() {
      this.ctx.putImageData(this.drawingSurfaceImageData, 0, 0);
    },
    updateRubberbandRectangle(loc) {
      this.rubberbandRect.width = Math.abs(loc.x - this.mousedown.x);
      this.rubberbandRect.height = Math.abs(loc.y - this.mousedown.y);

      //从左往右拉，和从右往左拉的两种情况。主要是判断左边的位置
      //因为从左往右拉的时候，左边x坐标不变
      //从右往左拉的时候，左边线的x坐标需要跟着鼠标移动

      if (loc.x > this.mousedown.x) {
        this.rubberbandRect.left = this.mousedown.x;
      } else {
        this.rubberbandRect.left = loc.x;
      }

      if (loc.y > this.mousedown.y) {
        this.rubberbandRect.top = this.mousedown.y;
      } else {
        this.rubberbandRect.top = loc.y;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(
        this.rubberbandRect.left,
        this.rubberbandRect.top,
        this.rubberbandRect.width,
        this.rubberbandRect.height
      );
      this.ctx.stroke();
      this.ctx.restore();
    },
    drawRubberbandShape(loc) {
      let line = {};
      line.color = this.strokeColor;
      line.width = 0.5;
      drawLine(this.ctx, this.mousedown, loc, line);
    },
    updateRubberband(loc) {
      //如果判断需要画矩形，就执行画矩形方法
      if (this.isRectangle) {
        this.updateRubberbandRectangle(loc);
      }
      //执行画直线的方法，这里没加if是为了让读者容易理解矩形的绘制方法，因为"draw矩形"是基于"draw直线"的
      this.drawRubberbandShape(loc);
    },
    drawHorizontalLine(y) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + 0.5);
      this.ctx.lineTo(this.canvas.width, y + 0.5);
      this.ctx.stroke();
    },
    drawVerticalLine(x) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + 0.5, 0);
      this.ctx.lineTo(x + 0.5, this.canvas.height);
      this.ctx.stroke();
    },
    drawGuideWires(loc) {
      this.ctx.save();
      this.ctx.strokeStyle = "rgba(0,0,230,0.4)";
      this.ctx.lineWidth = 0.5;
      this.drawVerticalLine(loc.x);
      this.drawHorizontalLine(loc.y);
      this.ctx.restore();
    },
  },
};
</script>

<style>
#controls {
  margin: 5x;
}

#canvas {
  margin: 10px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
}

input[type="button"] {
  background: cornflowerblue;
  cursor: pointer;
  border-radius: 10px;
}
</style>