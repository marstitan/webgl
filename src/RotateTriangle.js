/**
 * Created by Administrator on 2016/5/26.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main(){\n' +
    'gl_Position = u_ModelMatrix*a_Position;\n' +
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5
    ]);
    var n = 4;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;

}
var ANGLE_STEP = 0.1;
function main() {
    var canvas = document.getElementById("example");
    if (!canvas) {
        console.log("fail to get canvas");
        return false;
    }
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("fail to get gl context");
        return false;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("fail to init shaders");
        return false;
    }
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set buffer object');
        return;
    }
    //bg color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //frag color
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0);
    //model matrix
    var modelMatrix = new Matrix4();
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var curAngle = 0.0;

    var g_last = Date.now();
    function animate(angle) {
        var now = Date.now();
        var elapsed = now - g_last;
        g_last = now;
        var newAngle = angle + (ANGLE_STEP * elapsed);
        return newAngle % 360;

    }

    function draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix){
        modelMatrix.setRotate(currentAngle,0,0,1);
        modelMatrix.translate(0.8,0.0,0.0);
        gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,n);
    }

    var tick = function () {
        curAngle = animate(curAngle);
        draw(gl, n, curAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);
    };
    tick();
    //canvas.onmousedown = function(evt){
    //    click(evt,gl,canvas,a_Position,u_FragColor);
    //};
    //var g_points = [];
    //var g_colors = [];
    //function click(evt,gl,canvas,a_Position,u_FragColor){
    //    var x = evt.clientX;
    //    var y = evt.clientY;
    //    var rect = evt.target.getBoundingClientRect();
    //
    //    x = (x - rect.left - canvas.width/2)/(canvas.width/2);
    //    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    //    g_points.push({
    //        x:x,y:y
    //    });
    //
    //    g_colors.push([Math.random(),Math.random(),Math.random(),1.0]);
    //
    //    gl.clear(gl.COLOR_BUFFER_BIT);
    //    for(var i = 0;i < g_points.length;i++){
    //        var point = g_points[i];
    //        var color = g_colors[i];
    //        gl.vertexAttrib2f(a_Position,point.x,point.y);
    //        gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
    //        gl.drawArrays(gl.Points,0,1);
    //    }
    //}

}