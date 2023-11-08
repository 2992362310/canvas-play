import {
	JWgetGK
}
from "./coorUtil";

// 绘制专题图
// context 画布
// code 图幅编码
// grid 格网设置 {x,y,width,height,x_span,y_span}
// title 标题 {mapTitle,mapCode,fontName,fontSize,fontColor}
export function drawThematicMap(
	context,
	code,
	grid,
	gridTitle,
	gridLine,
	gridFont
) {
	// 绘制正上方标题
	drawGridTitle(context, grid, gridTitle, gridFont);

	// 绘制左上角图幅格网
	drawGridCode(context, code, grid, gridLine, gridFont);

	// 绘制中间格网
	drawGrid(context, code, grid, gridLine, gridFont);

	// 绘制右侧图例
	drawGridLegend(context, grid);

	// 绘制下边比例
	drawGridProportion(context, grid);

	// 绘制左下竖直文本
	let leftLowerText = "广水市自然资源和规划局";
	drawGridLeftLowerText(context, grid, leftLowerText, gridFont);

	// 绘制下方左侧分段文本
	let bottomLeftText = "CGS2000坐标系&2018年度土地变更调查&1985年高程系";
	drwaGridBottomLeftText(context, grid, bottomLeftText, gridFont);

	// 绘制下方右侧文本
	let bottomRightText = "制图人:姚志武&制图日期：二零二零年八月十日";
	drawGridBottomRightText(context, grid, bottomRightText, gridFont);
}

// 绘制图名
// context 画布
// grid {x,y,width,height}
// gridTitle {mapName,mapCode}
function drawGridTitle(context, grid, gridTitle, gridFont) {
	let mid_x = grid.x + grid.width / 2;
	let mid_y = grid.y / 8;
	let point = {},
		fontSets = {};
	let textWidth = 0;

	// 上边距:一级标题:二级标题:下边距 = 1 : 4 : 2 : 1
	// 绘制一级标题专题名
	textWidth = measureTextWidth(context, gridTitle.mapName, gridFont);
	point.x = mid_x - textWidth / 2;
	point.y = grid.y - mid_y * 4;
	point.value = gridTitle.mapName;
	drawText(context, point, gridFont);

	// 绘制二级标题图幅号
	fontSets.fontSize = gridFont.fontSize * 0.6;
	textWidth = measureTextWidth(context, gridTitle.mapCode, fontSets);
	point.x = mid_x - textWidth / 2;
	point.y = grid.y - mid_y;
	point.value = gridTitle.mapCode;
	drawText(context, point, fontSets);
}

// 绘制左侧下边文本,竖向绘制,制图单位
// context 画布
// grid {x,y,width,height,x_span,y_span}
// leftLowerText 左下文本
// gridFont {fontName,fontSize,fontColor}
function drawGridLeftLowerText(context, grid, leftLowerText, gridFont) {
	let fontSets = {};
	fontSets.fontSize = gridFont.fontSize * 0.6;
	let textWidth = measureTextWidth(context, leftLowerText[0], fontSets)
	let point = {};
	point.x = grid.x - textWidth - 4;
	point.y = grid.y + grid.height + grid.y_span;
	// 从下往上绘制文本
	for (let i = leftLowerText.length - 1; i > -1; i--) {
		point.value = leftLowerText[i];
		drawText(context, point, fontSets);
		point.y -= fontSets.fontSize;
	}
}

// 绘制下边左侧文本,数据说明
// context 画布
// grid {x,y,width,height,x_span,y_span}
// bottomLeftText 下左文本
// gridFont {fontName,fontSize,fontColor}
function drwaGridBottomLeftText(context, grid, bottomLeftText, gridFont) {
	let fontSets = {};
	fontSets.fontSize = gridFont.fontSize * 0.6;
	let point = {};
	point.x = grid.x + grid.x_span;
	point.y = grid.y + grid.height + grid.y_span * 2 + 4;

	let textArr = bottomLeftText.split("&")
	for (let i = 0; i < textArr.length; i++) {
		point.value = textArr[i];
		point.y += fontSets.fontSize;
		drawText(context, point, fontSets);
	}
}

// 绘制下边右侧文本,制图人和制图日期
// context 画布
// grid {x,y,width,height,x_span,y_span}
// bottomRightText 下右文本
// gridFont {fontName,fontSize,fontColor}
function drawGridBottomRightText(context, grid, bottomRightText, gridFont) {
	let fontSets = {};
	fontSets.fontSize = gridFont.fontSize * 0.6;
	let point = {};
	point.x = grid.x + grid.width + grid.x_span - 4;
	point.y = grid.y + grid.height + grid.y_span * 2 + 4;

	let textArr = bottomRightText.split("&")
	for (let i = 0; i < textArr.length; i++) {
		let x = grid.x + grid.width + grid.x_span - 4;
		point.value = textArr[i];
		let textWidth = measureTextWidth(context, point.value, fontSets);
		x -= textWidth;
		point.x = x;
		point.y += fontSets.fontSize;
		drawText(context, point, fontSets);
	}
}

// 绘制左上角图幅编号与图幅格网
// context 画布
// code 当前编码
// grid	格网 {x,y,width,height}
// gridLine 格网线设置 {lineSize,lineColor}
// gridFont 格网字体设置 {fontSize,fontName,fontColor}
function drawGridCode(context, code, grid, gridLine, gridFont) {
	let gridFrame = {};
	gridFrame.x = grid.x + grid.x_span;
	gridFrame.y = grid.y / 8;
	gridFrame.width = grid.width / 4;
	gridFrame.height = grid.y * 0.75;
	gridFrame.lineWidth = gridLine.lineWidth * 0.5;
	drawRectangle(context, gridFrame);

	//绘制三行三列格网
	let width = gridFrame.width / 3; //列距
	let height = gridFrame.height / 3; //行距
	// 绘制两条竖线
	for (let count = 1; count < 3; count++) {
		let startPoint = {},
			endPoint = {};
		startPoint.x = gridFrame.x + width * count;
		startPoint.y = gridFrame.y;
		endPoint.x = gridFrame.x + width * count;
		endPoint.y = gridFrame.y + gridFrame.height;
		drawLine(context, startPoint, endPoint, gridFrame);
	}
	//绘制两条横线
	for (let count = 1; count < 3; count++) {
		let startPoint = {},
			endPoint = {};
		startPoint.x = gridFrame.x;
		startPoint.y = gridFrame.y + height * count;
		endPoint.x = gridFrame.x + gridFrame.width;
		endPoint.y = gridFrame.y + height * count;
		drawLine(context, startPoint, endPoint, gridFrame);
	}

	let codeArr = calculateCodeArr(code["value"]);
	fillGridCode(context, codeArr, gridFrame, gridFont)
}

// 填充格网编码
// codeArr 编码数组，长度9
// gridFrame 编码格网{x,y,width,height}
// gridFont 格网字体{fontSize,fontName,fontColor}
function fillGridCode(context, codeArr, gridFrame, gridFont) {
	let flag = 0;
	let fontSets = {};
	fontSets.fontSize = gridFont.fontSize * 0.4;
	let width = gridFrame.width / 3; //列距
	let height = gridFrame.height / 3; //行距
	let textWidth = measureTextWidth(context, codeArr[0], fontSets);
	let point = {};
	point.y = gridFrame.y + height / 2 + fontSets.fontSize / 2 - 2;
	for (let row = 0; row < 3; row++) {
		point.x = gridFrame.x + width / 2 - textWidth / 2;
		for (let colum = 0; colum < 3; colum++) {
			if (row == 1 && colum == 1) {
				point.value = "**********";
			} else {
				point.value = codeArr[flag];
			}
			drawText(context, point, fontSets);

			point.x += width;
			flag++;
		}
		point.y += height;
	}
}

// 绘制地图格网
// context 画布
// code {} 图幅编码
// gridSets {x,y,width,height,x_span,y_span}
function drawGrid(context, code, grid, gridLine, gridFont) {
	//外边框
	drawGridOutBorder(context, grid, gridLine);
	//内边框
	drawGridInnerBorder(context, grid, gridLine);
	// 格网线
	drawGridLine(context, code, grid, gridLine, gridFont);
}

// 绘制地图比例尺
// context 画布
// grid {x,y,width,height,x_span,y_span}
function drawGridProportion(context, grid) {
	// let x = grid.x ? grid.x : 308;
	// let y = grid.y ? grid.y : 550;

	// // 比例
	// let proportion = new Image();
	// proportion.src = "/src/assets/img/thematic-map/proportion.png";
	// proportion.onload = () => {
	//     let multiple = grid.width / 720; //等比缩放
	//     let imgWidth = proportion.width * multiple;
	//     let imgHeight = proportion.height * multiple;
	//     let x = grid.x + grid.x_span + grid.width / 2 - imgWidth / 2;
	//     let y = grid.y + grid.height + grid.y_span * 2 + 2;

	//     context.drawImage(proportion, x, y, imgWidth, imgHeight);
	//     //context.drawImage(proportion, 308, 550, 128, 24);
	// };

	let proportion = document.getElementById("proportion");
	let multiple = grid.width / 720; //等比缩放
	let width = 160 * multiple;
	let height = 20 * multiple;
	let x = grid.x + grid.x_span + grid.width / 2 - width / 2;
	let y = grid.y + grid.height + grid.y_span * 2 + height / 2;

	context.drawImage(proportion, x, y, width, height);
}

// 绘制地图图例
// context 画布
// grid {x,y,width,height,x_span,y_span}
function drawGridLegend(context, grid) {
	// let x = grid.x ? grid.x : 760;
	// let y = grid.y ? grid.y : 46;

	// // 图例
	// let legend = new Image();
	// legend.src = "/src/assets/img/thematic-map/legend.png";
	// proportion
	// legend.onload = () => {
	//     let multiple = grid.width / 720; //等比缩放
	//     let imgWidth = legend.width * multiple;
	//     let imgHeight = legend.height * multiple;
	//     let x = grid.x + grid.width + grid.x_span * 2 + 2;
	//     let y = grid.y;

	//     context.drawImage(legend, x, y, imgWidth, imgHeight);
	//     //context.drawImage(legend, 760, 46, 86, 490);
	// };

	let legend = document.getElementById("legend");
	let multiple = grid.width / 720; //等比缩放
	let width = 70 * multiple;
	let height = 450 * multiple;
	let x = grid.x + grid.width + grid.x_span * 2 + 2 * multiple;
	let y = grid.y;

	context.drawImage(legend, x, y, width, height);
}

/*--------------------绘制格网---------------------*/
// 绘制格网内边框
// context 画布
// grid {x,y,width,height,x_span,y_span}
function drawGridOutBorder(context, grid, gridLine) {
	let gridOutBorder = {};
	gridOutBorder.x = grid.x;
	gridOutBorder.y = grid.y;
	gridOutBorder.width = grid.width + grid.x_span * 2;
	gridOutBorder.height = grid.height + grid.y_span * 2;
	gridOutBorder.lineWidth = gridLine.lineWidth;
	drawRectangle(context, gridOutBorder);
}

// 绘制格网内边框
// context 画布
// grid {x,y,width,height,x_span,y_span}
function drawGridInnerBorder(context, grid, gridLine) {
	let gridInnerBorder = {};
	gridInnerBorder.x = grid.x + grid.x_span;
	gridInnerBorder.y = grid.y + grid.y_span;
	gridInnerBorder.width = grid.width;
	gridInnerBorder.height = grid.height;
	gridInnerBorder.lineWidth = gridLine.lineWidth * 0.85;
	drawRectangle(context, gridInnerBorder);
}

// 绘制经纬线，画布坐标与格网坐标有区别
// context 画布
// code 图幅编码
// grid {x,y,width,height,x_span,y_span,lineWidth}
// lineSets {lineWidth,lineColor}
// fontSets {fontSize,fontName,fontColor}
function drawGridLine(context, code, grid, gridLine, gridFont) {
	let startPoint = {};
	startPoint.x = grid.x + grid.x_span;
	startPoint.y = grid.y + grid.y_span;
	let [decimal, dms] = getVertexArrByCode(code);
	let lonExtremum = {};
	lonExtremum.min = decimal.lonMin;
	lonExtremum.max = decimal.lonMax;
	let latExtremum = {};
	latExtremum.min = decimal.latMin;
	latExtremum.max = decimal.latMax;
	let lonPointArr = getIntValuePointArrByIncrease(startPoint.x, lonExtremum, grid.width);
	let latPointArr = getIntValuePointArrByDecrease(startPoint.y, latExtremum, grid.height);
	let lonPointExtremum = {
		min: grid.x,
		max: grid.x + grid.width + grid.x_span * 2,
	};
	let latPointExtremum = {
		min: grid.y,
		max: grid.y + grid.height + grid.y_span * 2,
	};
	let lineSets = {};
	lineSets.lineWidth = gridLine.lineWidth * 0.5;
	let fontSets = {};
	fontSets.fontSize = gridFont.fontSize * 0.5;
	//绘制经线
	drawLonLineByLonPointArr(
		context,
		lonPointArr,
		latPointExtremum,
		lineSets,
		fontSets
	);
	//绘制纬线
	drawLatLineByLatPointArr(
		context,
		latPointArr,
		lonPointExtremum,
		lineSets,
		fontSets
	);
	//绘制边框线
	drawGridLineBorder(context, grid, dms, lineSets, fontSets);
}

// 根据最大最小值，获取等间距整数数组
// startPoint 画布起点坐标
// extremumValue {max,min}
// gridLength 格网长度
// intValuePointArr [{point,intValue}]
function getIntValuePointArrByIncrease(startPoint, extremum, gridLength) {
	let intValuePointArr = [];
	let dis = gridLength / (extremum.max - extremum.min);
	let value = Math.ceil(extremum.min); //464.548932向上取整465
	let point = startPoint + (value - extremum.min) * dis;
	intValuePointArr.push({
		point,
		value,
	});
	value++;
	while (value < extremum.max) {
		point += dis;
		intValuePointArr.push({
			point,
			value,
		});
		value++;
	}
	return intValuePointArr;
}

// 根据最大最小值，获取等间距整数数组
// startPoint 画布起点坐标
// extremumValue {max,min}
// gridLength 格网长度
// intValuePointArr [{point,intValue}]
function getIntValuePointArrByDecrease(startPoint, extremum, gridLength) {
	let intValuePointArr = [];
	let dis = gridLength / (extremum.max - extremum.min);
	let value = Math.ceil(extremum.max) - 1; //464.548932向下取整465
	let point = startPoint + (extremum.max - value) * dis;
	intValuePointArr.push({
		point,
		value,
	});
	value--;
	while (value > extremum.min) {
		point += dis;
		intValuePointArr.push({
			point,
			value,
		});
		value--;
	}
	return intValuePointArr;
}

// 绘制经线
// lonPointArr [{point,value}]
// latExtremum {max,min}
// lineSets {lineWidth,lineColor}
// fontSets {fontSize,fontName,fontColor}
function drawLonLineByLonPointArr(
	context,
	lonPointArr,
	latExtremum,
	lineSets,
	fontSets
) {
	let startPoint = {},
		endPoint = {};
	for (let i = 0; i < lonPointArr.length; i++) {
		startPoint.x = lonPointArr[i].point;
		startPoint.y = latExtremum.min;
		endPoint.x = lonPointArr[i].point;
		endPoint.y = latExtremum.max;
		startPoint.value = lonPointArr[i].value;
		endPoint.value = lonPointArr[i].value;

		drawLine(context, startPoint, endPoint, lineSets);
		drawPositionText(context, startPoint, endPoint, fontSets, 0);
	}
}

//绘制纬线与纬度
// context 文本
// lonPointArr [{point,value}]
// latExtremum {max,in}
// lineSets {lineWidth,lineColor}
// fontSets {fontSize,fontName,fontColor}
function drawLatLineByLatPointArr(
	context,
	latPointArr,
	lonExtremum,
	lineSets,
	fontSets
) {
	let startPoint = {},
		endPoint = {};
	for (let i = 0; i < latPointArr.length; i++) {
		startPoint.x = lonExtremum.min;
		startPoint.y = latPointArr[i].point;
		endPoint.x = lonExtremum.max;
		endPoint.y = latPointArr[i].point;
		startPoint.value = latPointArr[i].value;
		endPoint.value = latPointArr[i].value;

		drawLine(context, startPoint, endPoint, lineSets);
		drawPositionText(context, startPoint, endPoint, fontSets, 1);
	}
}

// 绘制边框线
function drawGridLineBorder(context, grid, dms, lineSets, fontSets) {
	let startPoint = {},
		endPoint = {};

	// 左经线
	startPoint.x = grid.x + grid.x_span;
	startPoint.y = grid.y;
	startPoint.value = dms.lonMin;
	endPoint.x = grid.x + grid.x_span;
	endPoint.y = grid.y + grid.height + grid.y_span * 2;
	endPoint.value = dms.lonMin;
	drawLine(context, startPoint, endPoint, lineSets);
	drawPositionText(context, startPoint, endPoint, fontSets, 0);

	// 右经线
	startPoint.x = grid.x + grid.width + grid.x_span;
	startPoint.y = grid.y;
	startPoint.value = dms.lonMax;
	endPoint.x = grid.x + grid.width + grid.x_span;
	endPoint.y = grid.y + grid.height + grid.y_span * 2;
	endPoint.value = dms.lonMax;
	drawLine(context, startPoint, endPoint, lineSets);
	drawPositionText(context, startPoint, endPoint, fontSets, 0);

	// 上纬线
	startPoint.x = grid.x;
	startPoint.y = grid.y + grid.y_span;
	startPoint.value = dms.latMax;
	endPoint.x = grid.x + grid.width + grid.x_span * 2;
	endPoint.y = grid.y + grid.y_span;
	endPoint.value = dms.latMax;
	drawLine(context, startPoint, endPoint, lineSets);
	drawPositionText(context, startPoint, endPoint, fontSets, 1);

	// 下纬线
	startPoint.x = grid.x;
	startPoint.y = grid.y + grid.height + grid.y_span;
	startPoint.value = dms.latMin;
	endPoint.x = grid.x + grid.width + grid.x_span * 2;
	endPoint.y = grid.y + grid.height + grid.y_span;
	endPoint.value = dms.latMin;
	drawLine(context, startPoint, endPoint, lineSets);
	drawPositionText(context, startPoint, endPoint, fontSets, 1);
}

/***********************************绘制格网经纬度文本******************************/

// 绘制经纬度文本
// context 画布
// startPoint 起点
// endPoint 终点
// axis 0经线，1纬线
// fontSets 字体设置{fontSize,fontName,fontColor}
function drawPositionText(context, startPoint, endPoint, fontSets, axis) {
	if (axis == 0) {
		drawLongitudeText(context, startPoint, fontSets, 0);
		drawLongitudeText(context, endPoint, fontSets, 1);
	} else {
		drawLatitudeText(context, startPoint, fontSets, 0);
		drawLatitudeText(context, endPoint, fontSets, 1);
	}
}

// 绘制经度文本
// context 画布
// point 坐标点，包含x,y,value
// fontSets 字体设置，包含fontSize,fontName,fontColor
// position 经度位置，0在经线下边，1在经线上边
function drawLongitudeText(context, point, fontSets, position) {
	let textWidth = measureTextWidth(context, point.value, fontSets);
	let text = {};
	text.x = point.x - textWidth / 2;
	if (position == 0) {
		text.y = point.y + fontSets.fontSize;
	} else {
		text.y = point.y;
	}
	text.value = point.value;
	drawText(context, text, fontSets);
}

// 绘制纬度文本
// context 画布
// point 坐标点，包含x,y,value
// fontSets 字体设置，包含fontSize,fontName,fontColor
// position 纬度文本位置，0在纬线左边，1在纬线右边
function drawLatitudeText(context, point, fontSets, position) {
	let text = {};
	text.y = point.y + fontSets.fontSize / 4;
	if (position == 0) {
		text.x = point.x;
	} else {
		let textWidth = measureTextWidth(context, point.value, fontSets);
		text.x = point.x - textWidth;
	}
	text.value = point.value;
	drawText(context, text, fontSets);
}

/**-----------------根据图幅编码,计算图幅顶点坐标-------------------**/

// 根据分幅编号，计算对应图幅顶点经纬度以及平面坐标
// longitude经度，latitude纬度
// 为与示意图一致，均除以1000，latMin = latitude/1000
// code 图幅编号
// vertext [decimal,dms]
// {lonMin,latMin,lonMax,latMax}
function getVertexArrByCode(code) {
	let [lonMin, latMin] = refactorLonAndLat(code);
	let lonDecimalMin = translateDegreeToDecimal(lonMin),
		latDecimalMin = translateDegreeToDecimal(latMin);
	let lonDegreeMin = stitchingDegree(lonMin),
		latDegreeMin = stitchingDegree(latMin);
	let GKMin = JWgetGK(lonDecimalMin, latDecimalMin);

	let lonMax = calculateDegreeBySpan(lonMin),
		latMax = calculateDegreeBySpan(latMin);
	let lonDecimalMax = translateDegreeToDecimal(lonMax),
		latDecimalMax = translateDegreeToDecimal(latMax);
	let lonDegreeMax = stitchingDegree(lonMax),
		latDegreeMax = stitchingDegree(latMax);
	let GKMax = JWgetGK(lonDecimalMax, latDecimalMax);

	let vertex = [];
	let decimal = {};
	decimal.latMin = GKMin[1] / 1000;
	decimal.lonMin = GKMin[0] / 1000;
	decimal.latMax = GKMax[1] / 1000;
	decimal.lonMax = GKMax[0] / 1000;
	vertex.push(decimal);

	let dms = {};
	dms.latMin = latDegreeMin;
	dms.lonMin = lonDegreeMin;
	dms.latMax = latDegreeMax;
	dms.lonMax = lonDegreeMax;
	vertex.push(dms);

	return vertex;
}

// 重构源数据经纬度结构
// 数据路径 /guangshuionemap/jsons/fenfu.json
// source 源数据
// target 目标数组[0,1],0经度,1纬度
function refactorLonAndLat(source) {
	let target = [];

	let longitude = {};
	(longitude.degree = source["经度_度"] * 1), //str*1,字符串转数字
	(longitude.minute = source["经度_分"] * 1),
	(longitude.second = source["经度_秒"] * 1),
	(longitude.minuteSpan = 3),
	(longitude.secondSpan = 45);
	target.push(longitude);

	let latitude = {};
	(latitude.degree = source["纬度_度"] * 1),
	(latitude.minute = source["纬度_分"] * 1),
	(latitude.second = source["纬度_秒"] * 1),
	(latitude.minuteSpan = 2),
	(latitude.secondSpan = 30);
	target.push(latitude);

	return target;
}

// 根据跨度计算经纬度
// degree 度
// minute 分，1°=60′
// second 秒，1′=60″
// minuteSpan， 分跨度
// secondSpan， 秒跨度
function calculateDegreeBySpan(source) {
	let target = {};
	target.degree = source.degree;
	target.minute = source.minute;
	target.second = source.second;

	target.second += source.secondSpan;
	if (target.second >= 60) {
		target.second -= 60;
		target.minute += 1;
	}
	target.minute += source.minuteSpan;
	if (target.minute >= 60) {
		target.minute -= 60;
		target.degree += 1;
	}
	return target;
}

// 度分秒转小数点
// 1°=60′=3600″
// DMS {degree,minute,second}
// decimal 浮点
function translateDegreeToDecimal(DMS) {
	let decimal = DMS.degree + DMS.minute / 60 + DMS.second / 3600;
	return decimal;
}

// 拼接经纬度度分秒
// DMS {degree,minute,second}
// strDMS 字符串
function stitchingDegree(DMS) {
	let strDMS = `${DMS.degree}°${DMS.minute}′${DMS.second}″`;
	return strDMS;
}

/*----------------计算图幅编码----------------*/
//由中心位置的分幅号，计算 3 * 3 格子的各个分幅号
//该方法只适合广水区域  1:1万比例尺，其它区域需要扩展
// 根据中心图幅编码，计算周围编码
// code string I49G094092
function calculateCodeArr(code) {
	//由分幅号取得各个位置的代码
	//示例 ： I49G094092
	let latRange = code.substr(0, 1); //纬度范围,1:100万,0-4°N,A
	let lonRange = parseInt(code.substr(1, 2)); //经度范围,1:100万,0-6°E,1
	let proportion = code.substr(3, 1); //比例尺,1:1万,G
	let row = parseInt(code.substr(4, 3)); //001-100
	let column = parseInt(code.substr(7, 3)); //001-100

	let r = row - 1;
	let codeArr = [];
	for (let i = 0; i < 3; i++) {
		let c = column - 1;
		for (let j = 0; j < 3; j++) {
			let latNumber = latRange.charCodeAt(0);
			if (r == 0) {
				latNumber -= 1;
				r = 100;
			} else if (r > 100) {
				latNumber += 1;
				r = 1;
			}
			if (c == 0) {
				lonRange -= 1;
				c == 100
			} else if (c > 100) {
				lonRange += 1;
				c = 1;
			}
			latRange = String.fromCharCode(latNumber);
			let codeStr = `${latRange}${lonRange}${proportion}` + formatZero(r, 3) + formatZero(c, 3);
			codeArr.push(codeStr);
			c++;
		}
		r++;
	}
	return codeArr;
}

// 数字位数不够，前面补0
// num 数字
// len 长度
function formatZero(num, len) {
	if (String(num).length > len) {
		return num;
	}
	return (Array(len).join(0) + num).slice(-len);
}

/*------------------画布方法封装----------------*/

// 绘制矩形
// context 画布
// config {lineWidth=1,x,y,width,height}
function drawRectangle(context, config) {
	let lineWidth = config.lineWidth ? config.lineWidth : 1;
	context.beginPath();
	context.lineWidth = lineWidth;
	context.rect(config.x, config.y, config.width, config.height);
	context.stroke();
}

// 绘制直线段
// context 画布
// satrCoord {x,y,value}
// endCoord {x,y,value}
// lineSets {lineWidth=1,lineColor="black"}
function drawLine(context, starPoint, endPoint, lineSets) {
	let lineWidth = lineSets.lineWidth ? lineSets.lineWidth : 1;
	let lineColor = lineSets.lineColor ? lineSets.lineColor : "black";
	context.beginPath();
	context.lineWidth = lineWidth;
	context.strokeStyle = lineColor;
	context.moveTo(starPoint.x, starPoint.y);
	context.lineTo(endPoint.x, endPoint.y);
	context.stroke();
}

// 绘制文本
// context 画布
// point {x,y,value} (x,y)文本左下角坐标
// fontSets 文本属性{fontSize=6,fontName="宋体",fontColor="black"}
function drawText(context, point, fontSets) {
	let fontSize = fontSets.fontSize ? fontSets.fontSize : 6;
	let fontName = fontSets.fontName ? fontSets.fontName : "宋体";
	let fontColor = fontSets.fontColor ? fontSets.fontColor : "black";
	context.font = fontSize + "px " + fontName;
	context.fillStyle = fontColor;
	context.fillText(point.value, point.x, point.y);
}

// 测量文本在画布上的宽度
// context 画布
// text 文本
// fontSets {fontSize=6,fontName="宋体"}
// textWidth 返回文本在画布上长度
function measureTextWidth(context, text, fontSets) {
	let fontSize = fontSets.fontSize ? fontSets.fontSize : 6;
	let fontName = fontSets.fontName ? fontSets.fontName : "宋体";
	context.font = fontSize + "px " + fontName;
	let textWidth = context.measureText(text).width;
	return textWidth;
}