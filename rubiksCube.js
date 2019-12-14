/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @returns object with draw method
 * @constructor
 */
function RubiksCube(gl) {

    var pieces = [
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

    function getPieceColors(piece) {
        var pieceColors = [[0, 0, 0],  [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
        if (piece[0] == 1) {
            pieceColors[3] = [1, 0.5, 0];
        } else if (piece[0] == -1) {
            pieceColors[2] = [1, 0, 0];
        }
        if (piece[1] == 1) {
            pieceColors[4] = [1, 1, 1];
        } else if (piece[1] == -1) {
            pieceColors[5] = [1, 1, 0];
        }
        if (piece[2] == 1) {
            pieceColors[0] = [0, 0, 1];
        } else if (piece[2] == -1) {
            pieceColors[1] = [0, 1, 0];
        }
        return pieceColors;
    }

    return {

        draw : function(gl, modelMat, viewMatrix, normalMatrix) {
            for (var i = 0; i < pieces.length; i++) {
                var piece = pieces[i];
                mat4.rotate(modelMat, viewMatrix, transformation.rotation.rad, vec3.fromValues(0, 1,0));
                mat4.translate(modelMat, modelMat, [piece[0]*transformation.translation.x, piece[1]*transformation.translation.y, piece[2]*transformation.translation.z]);
                mat4.scale(modelMat, modelMat, [1/3 - 0.01, 1/3 - 0.01, 1/3 - 0.01]);
                gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelMat);
                mat3.normalFromMat4(normalMatrix, modelMat);
                gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
                var pieceColors = getPieceColors(piece);
                var cube = new Cube(gl, pieceColors);
                cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
            }
        }
    }
}
