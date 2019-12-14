/*
// Computer Graphics
//
// WebGL project
*/

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram : -1,
    aVertexPositionId : -1,
    aVertexColorId : -1,
    aVertexNormalId : -1,
    uProjectionMatId : -1,
    uModelViewMatrixId : -1,
    uNormalMatrixId : -1,
    uEnableLightingId : -1,
    uLightPositionId : -1,
    uLightColorId : -1
};

var camera = {
    eye : {
        x : 0.0,
        y : 2.0,
        z : -2.0
    },
    center : {
        x : 0.0,
        y : 0.0,
        z : 0.0
    },
    up : {
        x : 0,
        y : 1,
        z : 0
    }
};

var transformation = {
    rotation : {
        rad : 0
    },
    translation : {
        x : 1/3,
        y : 1/3,
        z : 1/3
    }
};

var light = {
    position : {
        x : 0.75,
        y : 0.5,
        z : 0.5
    },
    color : {
        r : 0.5,
        g : 0.5,
        b : 0.5
    }
};

var rubiksCube;

var piecesTranslations = [
    [0, 0, 0], // middle layer
    [1, 0, 0],
    [-1, 0, 0],
    [0, 0, 1],
    [0, 0, -1],
    [1, 0, 1],
    [1, 0, -1],
    [-1, 0, 1],
    [-1, 0, -1],

    [0, 1, 0], // upper layer
    [1, 1, 0],
    [-1, 1, 0],
    [0, 1, 1],
    [0, 1, -1],
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, 1],
    [-1, 1, -1],

    [0, -1, 0], // bottom layer
    [1, -1, 0],
    [-1, -1, 0],
    [0, -1, 1],
    [0, -1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, -1, 1],
    [-1, -1, -1]
];

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    drawAnimated(0);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    gl.enable(gl.DEPTH_TEST);
    // set the clear color here
    gl.clearColor(0.25,0.25,0.25,1); //-> damit wird alles übermalen (erst wenn clear)
    rubiksCube = new RubiksCube(gl);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMatrix");
    ctx.uModelViewMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMatrix");
    ctx.uNormalMatrixId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMatrix");

    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
}

function drawAnimated(timeStamp) {

    if (isDown(key.LEFT)) {
        light.position.x += 0.1;
    }
    if (isDown(key.RIGHT)) {
        light.position.x -= 0.1;
    }
    if (isDown(key.UP)) {
        light.position.y += 0.1;
    }
    if (isDown(key.DOWN)) {
        light.position.y -= 0.1;
    }
    if (isDown(key.W)) {
        light.position.z += 0.1;
    }
    if (isDown(key.S)) {
        light.position.z -= 0.1;
    }

    console.log("Light X: "+light.position.x+"\nLight Y: "+light.position.y+"\nLight Z: "+light.position.z);

    transformation.rotation.rad += 0.02;
    if (transformation.rotation.rad > 360) {
        transformation.rotation.rad = 0;
    }

    draw();
    // request the next frame
    window.requestAnimationFrame(drawAnimated);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var modelMat = mat4.create();
    var projectionMatrix = mat4.create();
    var normalMatrix = mat3.create();
    var viewMatrix = mat4.create();

    gl.uniform1i(ctx.uEnableLightingId , 1);

    gl.uniform3f(ctx.uLightPositionId, light.position.x, light.position.y, light.position.z);
    gl.uniform3f(ctx.uLightColorId, light.color.r, light.color.g, light.color.b);

    mat4.lookAt(viewMatrix, vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z), vec3.fromValues(camera.center.x, camera.center.y, camera.center.z), vec3.fromValues(camera.up.x, camera.up.y, camera.up.z));
    mat4.perspective(projectionMatrix, glMatrix.toRadian(90), gl.drawingBufferWidth / gl.drawingBufferHeight, 1, 10);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);

    drawCubePieces(modelMat, viewMatrix, normalMatrix);

}

function drawCubePieces(modelMat, viewMatrix, normalMatrix) {
    for (var i = 0; i < piecesTranslations.length; i++) {
        var pieceTranslation = piecesTranslations[i];
        mat4.rotate(modelMat, viewMatrix, transformation.rotation.rad, vec3.fromValues(0, 1,0));
        mat4.translate(modelMat, modelMat, [pieceTranslation[0]*transformation.translation.x, pieceTranslation[1]*transformation.translation.y, pieceTranslation[2]*transformation.translation.z]);
        mat4.scale(modelMat, modelMat, [1/3 - 0.01, 1/3 - 0.01, 1/3 - 0.01]);
        gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelMat);
        mat3.normalFromMat4(normalMatrix, modelMat);
        gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
        rubiksCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
    }
}

// Key Handling
var key = {
    _pressed : {},

    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    W : 87,
    A : 65,
    S : 83,
    D : 68
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}