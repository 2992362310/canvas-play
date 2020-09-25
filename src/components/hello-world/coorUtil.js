/**
 * 初始化参数，并进行必要的初始化操作
 */
var a; //长半轴
var b; //短半轴
var f; //扁率
var e; //第一扁心率
var e1; //第二扁心率
var FE; //东偏移
var FN; //北偏移
var L0; //中央经线
var W0; //原点纬线
var k0; //比例因子
/**
 * 幂函数
 */
function MZ(e, i) {
    return Math.pow(e, i);
}

/**
 * 说明: 用于初始化转换参数
 *
 * @param TuoqiuCanshu    枚举类型，提供北京54、西安80和WGS84三个椭球参数
 * @param CentralMeridian 中央经线
 * @param OriginLatitude  原点纬度，如果是标准的分幅，则该参数是0
 * @param EastOffset      东偏移
 * @param NorthOffset     北偏移
 */
function InitCorrParam(TuoqiuCanshu, CentralMeridian, OriginLatitude, EastOffset, NorthOffset) {
    /**
     * 'Krassovsky （北京54采用） 6378245 6356863.0188
     * 'IAG 75（西安80采用） 6378140 6356755.2882
     * 'WGS 84 6378137 6356752.3142
     * 'CGC 2000 6378137 6356752.31414
     */
    if (TuoqiuCanshu == 0) {
        a = 6378245;
        b = 6356863.0188;
    } else if (TuoqiuCanshu == 1) {
        a = 6378140;
        b = 6356755.2882;
    } else if (TuoqiuCanshu == 2) {
        a = 6378137;
        b = 6356752.3142;
    } else {
        a = 6378137;
        b = 6356752.31414;
    }
    //扁率
    f = (a - b) / a;
    //第一偏心率
    e = Math.sqrt(2 * f - MZ(f, 2));
    //'第二偏心率
    e1 = e / Math.sqrt(1 - MZ(e, 2));
    //中央经
    L0 = CentralMeridian;
    //原点纬线
    W0 = OriginLatitude;
    //'比例因子
    k0 = 1;
    //东偏移
    FE = EastOffset;
    //北偏移
    FN = NorthOffset;
}
/**
 * 设置一组默认的参数，广水地方区域
 */
InitCorrParam(3, 114, 0, 500000, 0);
console.log("初始化了坐标转换参数，以广水区域为参考...")

/**
 * 经纬度坐标转高斯投影坐标
 *
 * @param J 经度
 * @param W 纬度
 * @param DAI 带号  如果没有带号则设置为0
 */
function JWgetGK(J, W, DAI) {
    //'给出经纬度坐标，转换为高克投影坐标
    let resultP = [];
    let BR = (W - W0) * Math.PI / 180; //纬度弧长
    let lo = (J - L0) * Math.PI / 180; //经差弧度
    let N = a / Math.sqrt(1 - MZ((e * Math.sin(BR)), 2)); //卯酉圈曲率半径
    //求解参数s
    let B0;
    let B2;
    let B4;
    let B6;
    let B8;
    let C = MZ(a, 2) / b;
    B0 = 1 - 3 * MZ(e1, 2) / 4 + 45 * MZ(e1, 4) / 64 - 175 * MZ(e1, 6) / 256 + 11025 * MZ(e1, 8) / 16384;
    B2 = B0 - 1;
    B4 = 15 / 32 * MZ(e1, 4) - 175 / 384 * MZ(e1, 6) + 3675 / 8192 * MZ(e1, 8);
    B6 = 0 - 35 / 96 * MZ(e1, 6) + 735 / 2048 * MZ(e1, 8);
    B8 = 315 / 1024 * MZ(e1, 8);
    let s = C * (B0 * BR + Math.sin(BR) * (B2 * Math.cos(BR) + B4 * MZ((Math.cos(BR)), 3) + B6 * MZ((Math.cos(BR)), 5) + B8 * MZ((Math.cos(BR)), 7)));
    let t = Math.tan(BR);
    let g = e1 * Math.cos(BR);
    let XR = s + MZ(lo, 2) / 2 * N * Math.sin(BR) * Math.cos(BR) + MZ(lo, 4) * N * Math.sin(BR) * MZ((Math.cos(BR)), 3) / 24 * (5 - MZ(t, 2) + 9 * MZ(g, 2) + 4 * MZ(g, 4)) + MZ(lo, 6) * N * Math.sin(BR) * MZ((Math.cos(BR)), 5) * (61 - 58 * MZ(t, 2) + MZ(t, 4)) / 720;
    let YR = lo * N * Math.cos(BR) + MZ(lo, 3) * N / 6 * MZ((Math.cos(BR)), 3) * (1 - MZ(t, 2) + MZ(g, 2)) + MZ(lo, 5) * N / 120 * MZ((Math.cos(BR)), 5) * (5 - 18 * MZ(t, 2) + MZ(t, 4) + 14 * MZ(g, 2) - 58 * MZ(g, 2) * MZ(t, 2));
    resultP[0] = Number((YR + FE).toFixed(3));
    resultP[1] = Number((XR + FN).toFixed(3));
    if (DAI) {
        //X坐标添加带号
        resultP[0] += DAI * 1000000;
    }
    return resultP;
}

/**
 * 高斯投影坐标 转为 经纬度坐标
 *
 * @param Y 高斯投影坐标Y
 * @param X 高斯投影坐标X
 * @param DAI 带号  如果没有带号则设置为0
 */
function GKgetJW(Y, X, DAI) {
    if (DAI) {
        //Y坐标去掉带号
        Y = Y - DAI * 1000000;
    }
    //'给出高克投影坐标，转换为经纬度坐标
    let resultP = [];
    let El1 = (1 - Math.sqrt(1 - MZ(e, 2))) / (1 + Math.sqrt(1 - MZ(e, 2)));
    let Mf = (X - FN) / k0; //真实坐标值
    let Q = Mf / (a * (1 - MZ(e, 2) / 4 - 3 * MZ(e, 4) / 64 - 5 * MZ(e, 6) / 256)); //角度
    let Bf = Q + (3 * El1 / 2 - 27 * MZ(El1, 3) / 32) * Math.sin(2 * Q) + (21 * MZ(El1, 2) / 16 - 55 * MZ(El1, 4) / 32) * Math.sin(4 * Q) + (151 * MZ(El1, 3) / 96) * Math.sin(6 * Q) + 1097 / 512 * MZ(El1, 4) * Math.sin(8 * Q);
    let Rf = a * (1 - MZ(e, 2)) / Math.sqrt(MZ((1 - MZ((e * Math.sin(Bf)), 2)), 3));
    let Nf = a / Math.sqrt(1 - MZ((e * Math.sin(Bf)), 2)); //卯酉圈曲率半径
    let Tf = MZ((Math.tan(Bf)), 2);
    let D = (Y - FE) / (k0 * Nf);
    let Cf = MZ(e1, 2) * MZ((Math.cos(Bf)), 2);
    let B = Bf - Nf * Math.tan(Bf) / Rf * (MZ(D, 2) / 2 - (5 + 3 * Tf + 10 * Cf - 9 * Tf * Cf - 4 * MZ(Cf, 2) - 9 * MZ(e1, 2)) * MZ(D, 4) / 24 + (61 + 90 * Tf + 45 * MZ(Tf, 2) - 256 * MZ(e1, 2) - 3 * MZ(Cf, 2)) * MZ(D, 6) / 720);
    let L = L0 * Math.PI / 180 + 1 / Math.cos(Bf) * (D - (1 + 2 * Tf + Cf) * MZ(D, 3) / 6 + (5 - 2 * Cf + 28 * Tf - 3 * MZ(Cf, 2) + 8 * MZ(e1, 2) + 24 * MZ(Tf, 2)) * MZ(D, 5) / 120);
    let Bangle = B * 180 / Math.PI;
    let Langle = L * 180 / Math.PI;
    resultP[0] = Number(Langle.toFixed(6)); //RW * 180 / Math.PI;
    resultP[1] = Number((Bangle + W0).toFixed(6)); //RJ * 180 / Math.PI;
    return resultP;
}

export {
    InitCorrParam,
    JWgetGK,
    GKgetJW
}