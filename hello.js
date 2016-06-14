/**
 * Created by mac on 5/31/16.
 */
var VSHADER_SOURCE = "attribute vec4 a_Position;\n"
    + "uniform mat4 u_Matrix;\n"
    + "void main(){\n"
    + "gl_Position = u_Matrix*a_Position;\n"
    + "}\n";

var FSHADER_SOURCE = "precision mediump float;\n"
    + "uniform vec4 u_FragColor;\n"
    + "void main(){\n"
    + "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"
    + "}\n";

var ANGLE = 45.0;
function main() {
    var canvas = document.getElementById("webgl");
    var up = document.getElementById("up");
    var down = document.getElementById("down");
    up.onclick = function () {
        ANGLE += 10;
    };
    down.onclick = function () {
        ANGLE -= 10;
    }
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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var curAngle = 0;
    var xformMatrix = new Matrix4();
    var u_Matrix = gl.getUniformLocation(gl.program, "u_Matrix");
    if (!u_Matrix) {
        console.log("failed to get u_Matrix");
        return;
    }

    var tick = function () {
        curAngle = animate(curAngle);
        draw(gl, n, curAngle, xformMatrix, u_Matrix);
        requestAnimationFrame(tick);
    }
    tick();
}
function draw(gl, n, curAngle, modelMatrix, u_Matrix) {

    modelMatrix.setRotate(curAngle, 0, 0, 1);
    modelMatrix.translate(0.35, 0, 0);
    gl.uniformMatrix4fv(u_Matrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

}
var g_Last = Date.now();
function animate(angle) {
    var now = Date.now();
    var elapse = now - g_Last;
    g_Last = now;
    var newAngle = angle + (ANGLE * elapse) / 1000;
    return newAngle %= 360;
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