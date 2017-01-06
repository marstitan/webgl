/**
 * Created by Administrator on 2016/5/26.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n'+
    'void main(){\n'+
    'gl_Position = a_Position;\n'+
    'gl_PointSize = 10.0;\n'+
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n'+
    'uniform vec4 u_FragColor;\n'+
    'void main(){\n'+
    'gl_FragColor = u_FragColor;\n'+
    '}\n';

function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("fail to get canvas");
        return false;
    }
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("fail to get gl context");
        return false;
    }
    if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.log("fail to init shaders");
        return false;
    }
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
    canvas.onmousedown = function(evt){
        click(evt,gl,canvas,a_Position,u_FragColor);
    };
    var g_points = [];
    var g_colors = [];
    function click(evt,gl,canvas,a_Position,u_FragColor){
        var x = evt.clientX;
        var y = evt.clientY;
        var rect = evt.target.getBoundingClientRect();

        x = (x - rect.left - canvas.width/2)/(canvas.width/2);
        y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        g_points.push({
            x:x,y:y
        });

        g_colors.push([Math.random(),Math.random(),Math.random(),1.0]);

        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0;i < g_points.length;i++){
            var point = g_points[i];
            var color = g_colors[i];
            gl.vertexAttrib2f(a_Position,point.x,point.y);
            gl.uniform4f(u_FragColor,color[0],color[1],color[2],color[3]);
            gl.drawArrays(gl.Points,0,1);
        }
    }
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}