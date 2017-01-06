/**
 * Created by mac on 1/4/17.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '}\n';
var FSHADER_SOURCE =
    'void main(){\n' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get wengl context');
        return;
    }
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to init shaders');
        return;
    }
    var a_Postion = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Postion < 0) {
        console.log('Failed to get attribute a_Position in webgl');
        return;
    }
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get attribute a_PointSize in webgl');
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 10.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    canvas.onmousedown = function (evt) {
        click(evt, gl, canvas, a_Postion);
    };
    var g_points = [];
    function click(evt, gl, canvas, a_Position) {
        var x = evt.clientX;
        var y = evt.clientY;
        var rect = evt.target.getBoundingClientRect();
        x = (x - rect.left - rect.width / 2) / rect.width / 2;
        y = -((y - rect.top - rect.height/2)/rect.height/2);
        g_points.push({
            x:x,y:y
        });

        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0;i < g_points.length;i++){
            gl.vertexAttrib2f(a_Position,
                g_points[i].x,g_points[i].y);
            gl.drawArrays(gl.POINTS,0,1);
        }
    }
}