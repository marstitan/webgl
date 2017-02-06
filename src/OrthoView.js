/**
 * Created by mac on 2/4/17.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MVPMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MVPMatrix*a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    var n = 9;
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);

    var colorBuffer = gl.createBuffer();
    if (!colorBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_Color);

    return n;

}
function main() {
    var canvas = document.getElementById("example");
    if (!canvas) {
        console.log("fail to get canvas");
        return false;
    }
    var nf = document.getElementById('nearFar');
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

    var u_MVPMatrix = gl.getUniformLocation(gl.program, 'u_MVPMatrix');
    var mvpMatrix = new Matrix4();
    document.onkeydown = function(ev){
        keydown(ev,gl,n,u_MVPMatrix,mvpMatrix,nf);
    }
    draw(gl,n,u_MVPMatrix,mvpMatrix,nf);

}
var g_near = 0.0, g_far = 0.5;
function keydown(ev, gl, n, u_MVPMatrix, mvpMatrix, nf) {
    switch (ev.keyCode) {
        case 39:
            g_near += 0.01;
            break;
        case 37:
            g_near -= 0.01;
            break;
        case 38:
            g_far += 0.01;
            break;
        case 40:
            g_far -= 0.01;
            break;
        default :
            return;
    }
    draw(gl,n,u_MVPMatrix,mvpMatrix,nf);
}
function draw(gl,n,u_MVPMatrix,mvpMatrix,nf){
    mvpMatrix.setOrtho(-0.3,0.3,-1,1,g_near,g_far);
    gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    nf.innerHTML = 'near: '+Math.round(g_near*100)/100+', far: '
    +Math.round(g_far*100)/100;
    gl.drawArrays(gl.TRIANGLES,0,n);
}