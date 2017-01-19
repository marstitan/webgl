/**
 * Created by Administrator on 2016/5/26.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n' +
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler0;\n' +
    'uniform sampler2D u_Sampler1;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'vec4 color0 = texture2D(u_Sampler0,v_TexCoord);\n' +
    'vec4 color1 = texture2D(u_Sampler1,v_TexCoord);\n' +
    'gl_FragColor = color0*color1;\n' +
    '}\n';
function initTextures(gl, n) {
    var texture0 = gl.createTexture();
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var texture1 = gl.createTexture();
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    var image0 = new Image();
    image0.onload = function () {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    };
    image0.src = '../resources/sky.jpg';
    var image1 = new Image();
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    };
    image1.src = '../resources/circle.gif';
    return true;

}
var g_Tex0 = false, g_Tex1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, tetUnit) {
    if(tetUnit == 0){
        gl.activeTexture(gl.TEXTURE0);
        g_Tex0 = true;
    }else{
        gl.activeTexture(gl.TEXTURE1);
        g_Tex1 = true;
    }
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, tetUnit);
    if(g_Tex0 && g_Tex1){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.2,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 4;
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;

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
    if (!initTextures(gl, n)) {
        console.log('Failed to init texture');
        return;
    }


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