/**
 * Created by mac on 2/4/17.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;'+
    'uniform mat4 u_MVPMatrix;\n' +
    'uniform mat4 u_ModelMatrix;\n'+
    'uniform mat4 u_NormalMatrix;\n'+
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Normal;\n'+
    'varying vec3 v_Position;\n'+
    'void main(){\n' +
    'gl_Position = u_MVPMatrix*a_Position;\n' +
    'v_Position = vec3(u_ModelMatrix*a_Position);\n'+
    'v_Normal = normalize(vec3(u_NormalMatrix*a_Normal));\n'+
    'v_Color = a_Color;\n' +
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec3 u_LightColor;\n'+
    'uniform vec3 u_LightPosition;\n'+
    'uniform vec3 u_AmbientLight;\n'+
    'varying vec4 v_Color;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec3 v_Normal;\n'+
    'void main(){\n' +
        'vec3 normal = normalize(v_Normal);\n'+
        'vec3 lightDirection = normalize(u_LightPosition - v_Position);\n'+
        'float ndotL = max(dot(lightDirection,normal),0.0);\n'+
        'vec3 diffuse = u_LightColor*v_Color.rgb*ndotL;\n'+
        'vec3 ambient = u_AmbientLight*v_Color.rgb;\n'+
    'gl_FragColor = vec4(diffuse+ambient,v_Color.a);\n' +
    '}\n';
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,-1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0,
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0,
    ]);
    var colors = new Float32Array([
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
        1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,
    ]);
    var normals = new Float32Array([
        0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,
        1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,
        0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0,
        0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,
    ]);
    var indices = new Uint8Array([
        0,1,2,0,2,3,
        4,5,6,4,6,7,
        8,11,9,8,10,11,
        12,13,14,12,15,14,
        16,17,18,16,18,19,
        20,21,22,20,22,23,
    ]);
    if (!initArrayBuffer(gl,vertices,'a_Position',3,gl.FLOAT)) {
        return -1;
    }
    if (!initArrayBuffer(gl,colors,'a_Color',3,gl.FLOAT)) {
        return -1;
    }
    if (!initArrayBuffer(gl,normals,'a_Normal',3,gl.FLOAT)) {
        return -1;
    }
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;

}
function initArrayBuffer(gl,data,attribute,no,type){
    var vbo = gl.createBuffer();
    if(!vbo){
        console.log("Failed to create buffer object");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program,attribute);
    gl.vertexAttribPointer(a_attribute,no,type,false,0,0);
    gl.enableVertexAttribArray(a_attribute);
    return true;
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
    var u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
    var mvpMatrix = new Matrix4();
    var modelMatrix = new Matrix4();
    var viewMatrix = new Matrix4();
    var projMatrix = new Matrix4();

    modelMatrix.setTranslate(0,1,0);
    modelMatrix.rotate(90,0,0,1);
    viewMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MVPMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);

    var normalMatrix = new Matrix4();
    var u_NormalMatrix = gl.getUniformLocation(gl.program,'u_NormalMatrix');
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);

    var u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program,'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(gl.program,'u_AmbientLight');

    gl.uniform3f(u_AmbientLight,0.2,0.0,0.0);
    gl.uniform3f(u_LightColor,1.0,1.0,1.0);
    var lightDirection = new Vector3([0.5,3.0,4.0]);
    lightDirection.normalize();
    gl.uniform3f(u_LightPosition,0.0,3.0,4.0);

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