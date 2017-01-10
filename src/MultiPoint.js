/**
 * Created by mac on 1/6/17.
 */
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = 10.0;\n' +
    '}\n';
var FSHADER_SOURCE =
    'precision mediump float;\n'+
    'uniform vec4 u_FragColor\n'+
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';