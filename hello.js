/**
 * Created by mac on 5/31/16.
 */
var VSHADER_SOURCE = "attribute vec4 a_Position;\n"
    + "uniform float u_CosB,u_SinB;\n"
    + "void main(){\n"
    + "gl_Position.x = a_Position.x*u_CosB - a_Position.y*u_SinB;\n"
    + "gl_Position.y = a_Position.x*u_SinB + a_Position.y*u_CosB;\n"
    + "}\n";

var FSHADER_SOURCE = "precision mediump float;\n"
    + "uniform vec4 u_FragColor;\n"
    + "void main(){\n"
    + "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"
    + "}\n";

var ANGLE = 90.0;
function main() {
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("fail to get context of webgl");
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("fail to init shaders");
        return;
    }
    var n = initVertextBuffers(gl);
    if (n < 0) {
        console.log("fail to set positions of the vertics");
        return;
    }
    var radian = Math.PI / 180.0 * ANGLE;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, "u_CosB");
    if (!u_CosB) {
        console.log("failed to get u_CosB");
        return;
    }
    var u_SinB = gl.getUniformLocation(gl.program, "u_SinB");
    if (!u_SinB) {
        console.log("failed to get u_SinB");
        return;
    }
    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
function initVertextBuffers(gl) {
    var n = 4;
    var vertics = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log("fail to create buffer object");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("fail to get location of a_Position");
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}
var g_Points = [];
var g_Colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
    //获得浏览器页面的坐标
    var x = ev.clientX;
    var y = ev.clientY;
    //获得所点击的画布的在浏览器页面中的矩形大小
    var rect = ev.target.getBoundingClientRect();
    //获得所点击的画布的在浏览器页面中的矩形大小
    var xInCanvas = x - rect.left;
    var yInCanvas = y - rect.top;

    var xInGL = (xInCanvas - canvas.width / 2) / (canvas.width / 2);
    var yInGL = (canvas.height / 2 - yInCanvas) / (canvas.height / 2);

    if (xInGL >= 0.0 && yInGL >= 0.0) {
        g_Colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if (xInGL <= 0 && yInGL <= 0) {
        g_Colors.push([0.0, 1.0, 0.0, 1.0]);
    } else {
        g_Colors.push([1.0, 1.0, 1.0, 1.0]);
    }
    g_Points.push({x: xInGL, y: yInGL});
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < g_Points.length; i++) {
        gl.vertexAttrib2f(a_Position, g_Points[i].x,
            g_Points[i].y);
        var rgba = g_Colors[i];
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}