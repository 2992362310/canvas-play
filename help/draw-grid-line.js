// 分幅图编号信息
// (1) 每幅图四个顶点经纬坐标，可通过图幅编号获知 
// (2) 1:10000，经差3'45",纬差2'30"
// (3) 转化平面公里坐标时，所使用方法保留小数点后3位
// (4) 

// 图幅编号 H49G002091
// 最小经度113°37'30"，最小纬度31°55'00"
// 最大经度113°41'15"，最大纬度31°57'30"
// 四顶点经纬度坐标：
// 左上角(113°37'30",31°57'30") 右上角(113°41'15",31°57'30")
// 左下角(113°37'30",31°55'00") 右下角(113°41'15",31°55'00")
// 使用JWgetGK(j,w,0)计算后
// 最小经度转化464532.96，最小纬度转化3532676.986
// 最大经度转化470444.162，最大纬度转化3537289.876
// 左上角(464532.96,3537289.876) 右上角(470444.162,3537289.876)
// 左下角(464532.96,3532676.986) 右下角(470444.162,3537289.876)
// 1000米为一格

// 分幅图经纬格网计算
// (1) 格网参数，高480px、宽720px、单位1000
// (2) 转化公里网平面坐标时，所使用方法保留小数点后3位
// (3) 经度 每一米所需px 720÷(470444-464533)=0.1218(px/米)
// (4) 纬度 每一米所需px 480px÷(3537290-3532677)=0.1040(px/米)
// (5) 根据初始位置，画整数线，加1000画一段，当小于最大值时停止绘制
//

//drawMapRegionLine()方法有地图格网左上角起始画布坐标(px,px)
//

// 绘制经纬线，画布坐标与格网坐标有区别
// 数据格网在画布起点坐标（x,y）,格网在画布高宽h，w
// longitude经度，latitude纬度
// 为与示意图一致，均除以1000，latMin = latitude/1000
function calculateGrid(framingNumber, x, y, h, w) {
    let vertex = getCoordByFramingNumber(framingNumber);
    let lonExtremum = {
        min: vertex.lonMin,
        max: vertex.lonMax
    };
    let latExtremum = {
        min: vertex.latMin,
        max: vertex.latMax
    };
    let lonArr = getCoordByExtremum(x, lonExtremum, w);
    let latArr = getCoordByExtremum(y, latExtremum, h);
    const lonCoordExtremum = {
        min: lonArr[0],
        max: lonArr[lonArr.length - 1] 
    };
    const latCoordExtremum = {
        min: latArr[0],
        max: latArr[latArr.length - 1]
    };
    //绘制经线
    drawGridLineByCoordArr(lonArr, latCoordExtremum);
    //绘制纬线
    drawGridLineByCoordArr(latArr, lonCoordExtremum);
}

// 根据坐标数组，绘制格网线
// coorArr 坐标x(y)的数组
// extremum 坐标y(x)的最值
function drawGridLineByCoordArr(coordArr, extremum){
    for(let i =0; i < lonArr.length; i++){
        let startCoord = {};
        let endCoord = {};
        startCoord.x = coordArr[i];
        startCoord.y = extremum.min;
        endCoord.x = coordArr[i];
        endCoord.y = extremum.max;
        drawLineByCoord(startCoord, endCoord);
    }
}

// 根据最大最小值，获取等间距坐标数组
// coord 画布起点坐标
// extremum 坐标极值对象，包含最大和最小值
// dis 画布上px距离
// coorArr 返回画布坐标数组
function getCoordByExtremum(coord, extremum, dis){
    let coordArr = [];
    let diff = (dis / (extremum.max - extremum.min)).toFixed(3);
    let ceilVal = Math.ceil(extremum.min); //464.548932向上取整465
    coord = coord + (ceilVal - extremum.min) * diff;
    coordArr.push(coord);
    for(; ceilVal < extremum.max; ceilVal++){
        coord += diff;
        coordArr.push(coord);
    }
    return coordArr;
}

// 在画布上画线
// context 画布
// satrCoord 起始坐标对象
// endCoord 终点坐标对象
function drawLineByCoord(context,starCoord, endCoord){
    context.moveTo(starCoord.x,starCoord.y);
    context.lineTo(endCoord.x,endCoord.y);
    context.stroke();
}

// 根据分幅编号，计算对应图幅顶点经纬度以及平面坐标
// framingNumber 图幅编号
function getCoordByFramingNumber(framingNumber) {
    let vertex = {};

    vertex.latMin = 3532.676986;
    vertex.lonMin = 3537.289237;
    vertex.latMax = 464.532960;
    vertex.lonMin = 470.444162;

    return vertex;
}