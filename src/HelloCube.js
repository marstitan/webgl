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
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0,
    ]);
    var indices = new Uint8Array([
        0,1,2,0,2,3,
        0,3,4,0,4,5,
        0,5,6,0,6,1,
        1,6,7,1,7,2,
        7,4,3,7,3,2,
        4,6,7,4,5,6
    ]);
    var n = 36;
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
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

    return indices.length;

}
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

    var u_MVPMatrix = gl.getUniformLocation(gl.program, 'u_MVPMatrix');

    var mvpMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();

    viewMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix);

    gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    document.onkeydown = function (evt) {
        keydown(evt, gl, n, u_ModelViewMatrix, viewMatrix);
    };
    //draw(gl, n, u_ModelViewMatrix, viewMatrix);

}
var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25;
function keydown(ev, gl, n, u_MVMatrix, mvMatrix) {
    if (ev.keyCode == 39) {
        g_eyeX += 0.01;
    } else if (ev.keyCode == 37) {
        g_eyeX -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_MVMatrix, mvMatrix);
}
function draw(gl, n, u_MVMatrix, mvMatrix) {
    mvMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    gl.uniformMatrix4fv(u_MVMatrix, false, mvMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

}