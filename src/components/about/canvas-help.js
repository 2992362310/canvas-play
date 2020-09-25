// 画布画线
function drawLine(ctx, start, end, line) {
    ctx.save(); //保存当前环境状态
    ctx.beginPath();
    ctx.lineWidth = line.width;
    ctx.strokeStyle = line.color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore(); //返回之前保存过的路径状态和属性
}

function windowToCanvasXY(e, canvas) {
    let bbox = canvas.getBoundingClientRect();
    let loc = {};
    loc.x = e.clientX - bbox.left * (canvas.width / bbox.width);
    loc.y = e.clientY - bbox.top * (canvas.height / bbox.height);
    return loc;
}

export {
    drawLine,
    windowToCanvasXY
}