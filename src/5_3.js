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
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
    '}\n';
function initTextures(gl, n) {
    var texture = gl.createTexture();
    var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    var image = new Image();
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.src = '../resources/sky.jpg';
    return true;

}
function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, 0);
}
function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    var n = 3;
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
    if(!initTextures(gl,n)){
        console.log('Failed to init texture');
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

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