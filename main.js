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
        x : 0.25,
        y : 0.75,
        uTurn : 0,
        rTurn : 0,
        lTurn : 0,
        fTurn : 0,
        dTurn : 0,
        bTurn : 0,
        mTurn : 0,
        angle : {
            u : 0,
            r : 0,
            l : 0,
            f : 0,
            d : 0,
            b : 0,
            m : 0
        }
    },
    translation : {
        x : 1/3,
        y : 1/3,
        z : 1/3
    }
};

var light = {
    position : {
        x : 0.5,
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
    window.requestAnimationFrame (drawAnimated);
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
    updateKeyDown();
    if (isDown(key.LEFT)) {
        transformation.rotation.y -= 0.02;
    }
    if (isDown(key.RIGHT)) {
        transformation.rotation.y += 0.02;
    }
    if (isDown(key.UP)) {
        transformation.rotation.x += 0.02;
    }
    if (isDown(key.DOWN)) {
        transformation.rotation.x -= 0.02;
    }

    if (keyDown.uKey) {
        if (transformation.rotation.angle.u < Math.PI/2) {
            transformation.rotation.angle.u += Math.PI/20;
            transformation.rotation.uTurn = transformation.rotation.angle.u;
        } else {
            rubiksCube.adjustPiecesPosition("u");
            transformation.rotation.angle.u = 0;
            transformation.rotation.uTurn = 0;
            keyDown.uKey = false;
        }
    }
    if (keyDown.rKey) {
        if (transformation.rotation.angle.r < Math.PI/2) {
            transformation.rotation.angle.r += Math.PI/20;
            transformation.rotation.rTurn += Math.PI/20;
        } else {
            rubiksCube.adjustPiecesPosition("r");
            transformation.rotation.angle.r = 0;
            transformation.rotation.rTurn = 0;
            keyDown.rKey = false;
        }
    }
    if (keyDown.lKey) {
        if (transformation.rotation.angle.l < Math.PI/2) {
            transformation.rotation.angle.l += Math.PI/20;
            transformation.rotation.lTurn += Math.PI/20;
        } else {
            rubiksCube.adjustPiecesPosition("l");
            transformation.rotation.angle.l = 0;
            transformation.rotation.lTurn = 0;
            keyDown.lKey = false;
        }
    }
    if (keyDown.fKey) {
        if (transformation.rotation.angle.f < Math.PI/2) {
            transformation.rotation.angle.f += Math.PI/20;
            transformation.rotation.fTurn += Math.PI/20;
        } else {
            rubiksCube.adjustPiecesPosition("f");
            transformation.rotation.angle.f = 0;
            transformation.rotation.fTurn = 0;
            keyDown.fKey = false;
        }
    }
    if (keyDown.dKey) {
        if (transformation.rotation.angle.d < Math.PI/2) {
            transformation.rotation.angle.d += Math.PI/20;
            transformation.rotation.dTurn += Math.PI/20;
        } else {
            rubiksCube.adjustPiecesPosition("d");
            transformation.rotation.angle.d = 0;
            transformation.rotation.dTurn = 0;
            keyDown.dKey = false;
        }
    }
    if (keyDown.bKey) {
        if (transformation.rotation.angle.b < Math.PI/2) {
            transformation.rotation.angle.b += Math.PI/20;
            transformation.rotation.bTurn += Math.PI/20;
        } else {
            rubiksCube.adjustPiecesPosition("b");
            transformation.rotation.angle.b = 0;
            transformation.rotation.bTurn = 0;
            keyDown.bKey = false;
        }
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

    var modelViewMatrix = mat4.create();
    var projectionMatrix = mat4.create();
    var normalMatrix = mat3.create();
    var viewMatrix = mat4.create();

    gl.uniform1i(ctx.uEnableLightingId , 1);

    gl.uniform3f(ctx.uLightPositionId, light.position.x, light.position.y, light.position.z);
    gl.uniform3f(ctx.uLightColorId, light.color.r, light.color.g, light.color.b);

    mat4.lookAt(viewMatrix, vec3.fromValues(camera.eye.x, camera.eye.y, camera.eye.z), vec3.fromValues(camera.center.x, camera.center.y, camera.center.z), vec3.fromValues(camera.up.x, camera.up.y, camera.up.z));
    mat4.perspective(projectionMatrix, glMatrix.toRadian(90), gl.drawingBufferWidth / gl.drawingBufferHeight, 1, 10);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMatrix);

    rubiksCube.draw(gl, modelViewMatrix, viewMatrix, normalMatrix);
}

function updateKeyDown() {
    if (isDown(key.U)) {
        keyDown.uKey = true;
    }
    if (isDown(key.R)) {
        keyDown.rKey = true;
    }
    if (isDown(key.L)) {
        keyDown.lKey = true;
    }
    if (isDown(key.F)) {
        keyDown.fKey = true;
    }
    if (isDown(key.D)) {
        keyDown.dKey = true;
    }
    if (isDown(key.B)) {
        keyDown.bKey = true;
    }
    if (isDown(key.M)) {
        keyDown.mKey = true;
    }
}

var key = {
    _pressed : {},
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40,
    W : 87,
    A : 65,
    S : 83,
    D : 68,
    L : 76,
    R : 82,
    U : 85,
    F : 70,
    M : 77,
    B : 66
};

var keyDown = {
    uKey : false,
    rKey : false,
    lKey : false,
    fKey : false,
    dKey : false,
    bKey : false,
    mKey : false
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