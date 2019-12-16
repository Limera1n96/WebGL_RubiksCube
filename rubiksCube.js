/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @returns object with draw method
 * @constructor
 */
function RubiksCube(gl) {

    var pieces = {
        position : [
            [0, 1, 0], // upper layer
            [1, 1, 0],
            [-1, 1, 0],
            [0, 1, 1],
            [0, 1, -1],
            [1, 1, 1],
            [1, 1, -1],
            [-1, 1, 1],
            [-1, 1, -1],

            [0, 0, 0], // middle layer
            [1, 0, 0],
            [-1, 0, 0],
            [0, 0, 1],
            [0, 0, -1],
            [1, 0, 1],
            [1, 0, -1],
            [-1, 0, 1],
            [-1, 0, -1],

            [0, -1, 0], // bottom layer
            [1, -1, 0],
            [-1, -1, 0],
            [0, -1, 1],
            [0, -1, -1],
            [1, -1, 1],
            [1, -1, -1],
            [-1, -1, 1],
            [-1, -1, -1]
        ],
        color : []
    };

    function initColors() {
        for (var i = 0; i < pieces.position.length; i++) {
            var pieceColors = [[0, 0, 0],  [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
            var piece = pieces.position[i];
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
            pieces.color.push(pieceColors);
        }
    }

    initColors();

    return {

        draw : function(gl, modelViewMatrix, viewMatrix, normalMatrix) {
            for (var i = 0; i < pieces.position.length; i++) {
                var piece = pieces.position[i];
                mat4.rotate(modelViewMatrix, viewMatrix, transformation.rotation.x, vec3.fromValues(1, 0,0));
                mat4.rotate(modelViewMatrix, modelViewMatrix, transformation.rotation.y, vec3.fromValues(0, 1,0));
                this.rotateSide(gl, piece, modelViewMatrix);
                mat4.translate(modelViewMatrix, modelViewMatrix, [piece[0]*transformation.translation.x, piece[1]*transformation.translation.y, piece[2]*transformation.translation.z]);
                mat4.scale(modelViewMatrix, modelViewMatrix, [1/3 - 0.01, 1/3 - 0.01, 1/3 - 0.01]);
                gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
                mat3.normalFromMat4(normalMatrix, modelViewMatrix);
                gl.uniformMatrix3fv(ctx.uNormalMatrixId, false, normalMatrix);
                var cube = new Cube(gl, pieces.color[i]);
                cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
            }
        },

        rotateSide : function (gl, piece, modelViewMatrix) {
            if (piece[0] == -1 && transformation.rotation.rTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, transformation.rotation.rTurn, vec3.fromValues(1, 0,0));
            }
            if (piece[0] == 1 && transformation.rotation.lTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, -transformation.rotation.lTurn, vec3.fromValues(1, 0,0));
            }
            if (piece[1] == 1 && transformation.rotation.uTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, -transformation.rotation.uTurn, vec3.fromValues(0, 1,0));
            }
            if (piece[1] == -1 && transformation.rotation.dTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, transformation.rotation.dTurn, vec3.fromValues(0, 1,0));
            }
            if (piece[2] == 1 && transformation.rotation.bTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, -transformation.rotation.bTurn, vec3.fromValues(0, 0,1));
            }
            if (piece[2] == -1 && transformation.rotation.fTurn > 0) {
                mat4.rotate(modelViewMatrix, modelViewMatrix, transformation.rotation.fTurn, vec3.fromValues(0, 0,1));
            }
        },

        adjustPiecesPosition : function (turn) {
            switch (turn) {
                case "u":
                    // edges
                    this.movePieces([[1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1]],
                        [[0, 1, 1], [-1, 1, 0], [0, 1, -1], [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [1, 1, 0]],
                        [3, 0, 2, 1, 4, 4, 4, 4], [0, 2, 1, 3, 4, 4, 4, 4]);
                    // corners
                    this.movePieces([[1, 1, -1], [1, 1, -1], [1, 1, -1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, 1, -1], [-1, 1, -1], [-1, 1, -1]],
                        [[1, 1, 1], [1, 1, 1], [1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, 1, -1], [-1, 1, -1], [-1, 1, -1], [1, 1, -1], [1, 1, -1], [1, 1, -1]],
                        [3, 1, 4, 3, 0, 4, 0, 2, 4, 2, 1, 4], [0, 3, 4, 0, 2, 4, 2, 1, 4, 1, 3, 4]);
                    break;
                case "r":
                    //edges
                    this.movePieces([[-1, 1, 0], [-1, 0, 1], [-1, -1, 0], [-1, 0, -1], [-1, 1, 0], [-1, 0, 1], [-1, -1, 0], [-1, 0, -1]],
                        [[-1, 0, 1], [-1, -1, 0], [-1, 0, -1], [-1, 1, 0], [-1, 0, 1], [-1, -1, 0], [-1, 0, -1], [-1, 1, 0]],
                        [4, 0, 5, 1, 2, 2, 2, 2], [0, 5, 1, 4, 2, 2, 2, 2]);
                    //corners
                    this.movePieces([[-1, 1, 1], [-1, 1, 1], [-1, 1, 1], [-1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, 1, -1], [-1, 1, -1], [-1, 1, -1]],
                        [[-1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, 1, -1], [-1, 1, -1], [-1, 1, -1], [-1, 1, 1], [-1, 1, 1], [-1, 1, 1]],
                        [4, 0, 2, 0, 5, 2, 5, 1, 2, 1, 4, 2], [0, 5, 2, 5, 1, 2, 1, 4, 2, 4, 0, 2]);
                    break;
                case "l":
                    // edges
                    this.movePieces([[1, 1, 0], [1, 0, -1], [1, -1, 0], [1, 0, 1], [1, 1, 0], [1, 0, -1], [1, -1, 0], [1, 0, 1]],
                        [[1, 0, -1], [1, -1, 0], [1, 0, 1], [1, 1, 0], [1, 0, -1], [1, -1, 0], [1, 0, 1], [1, 1, 0]],
                        [4, 1, 5, 0, 3, 3, 3, 3], [1, 5, 0, 4, 3, 3, 3, 3]);
                    // corners
                    this.movePieces([[1, 1, -1], [1, 1, -1], [1, 1, -1], [1, -1, -1], [1, -1, -1], [1, -1, -1], [1, -1, 1], [1, -1, 1], [1, -1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
                        [[1, -1, -1], [1, -1, -1], [1, -1, -1], [1, -1, 1], [1, -1, 1], [1, -1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, -1], [1, 1, -1], [1, 1, -1]],
                        [4, 1, 3, 1, 5, 3, 5, 0, 3, 0, 4, 3], [1, 5, 3, 5, 0, 3, 0, 4, 3, 4, 1, 3]);
                    break;
                case "f":
                    // edges
                    this.movePieces([[0, 1, -1], [-1, 0, -1], [0, -1, -1], [1, 0, -1], [0, 1, -1], [-1, 0, -1], [0, -1, -1], [1, 0, -1]],
                        [[-1, 0, -1], [0, -1, -1], [1, 0, -1], [0, 1, -1], [-1, 0, -1], [0, -1, -1], [1, 0, -1], [0, 1, -1]],
                        [4, 2, 5, 3, 1, 1, 1, 1], [2, 5, 3, 4, 1, 1, 1, 1]);
                    // corners
                    this.movePieces([[1, 1, -1], [1, 1, -1], [1, 1, -1], [-1, 1, -1], [-1, 1, -1], [-1, 1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [1, -1, -1], [1, -1, -1], [1, -1, -1]],
                        [[-1, 1, -1], [-1, 1, -1], [-1, 1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [1, -1, -1], [1, -1, -1], [1, -1, -1], [1, 1, -1], [1, 1, -1], [1, 1, -1]],
                        [3, 4, 1, 4, 2, 1, 2, 5, 1, 5, 3, 1], [4, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1]);
                    break;
                case "d":
                    // edges
                    this.movePieces([[0, -1, -1], [-1, -1, 0], [0, -1, 1], [1, -1, 0], [0, -1, -1], [-1, -1, 0], [0, -1, 1], [1, -1, 0]],
                        [[-1, -1, 0], [0, -1, 1], [1, -1, 0], [0, -1, -1], [-1, -1, 0], [0, -1, 1], [1, -1, 0], [0, -1, -1]],
                        [1, 2, 0, 3, 5, 5, 5, 5], [2, 0, 3, 1, 5, 5, 5, 5]);
                    // corners
                    this.movePieces([[1, -1, -1], [1, -1, -1], [1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, 1], [-1, -1, 1], [-1, -1, 1], [1, -1, 1], [1, -1, 1], [1, -1, 1]],
                        [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1], [-1, -1, 1], [-1, -1, 1], [-1, -1, 1], [1, -1, 1], [1, -1, 1], [1, -1, 1], [1, -1, -1], [1, -1, -1], [1, -1, -1]],
                        [3, 1, 5, 1, 2, 5, 2, 0, 5, 0, 3, 5], [1, 2, 5, 2, 0, 5, 0, 3, 5, 3, 1, 5]);
                    break;
                case "b":
                    // edges
                    this.movePieces([[0, 1, 1], [1, 0, 1], [0, -1, 1], [-1, 0, 1], [0, 1, 1], [1, 0, 1], [0, -1, 1], [-1, 0, 1]],
                        [[1, 0, 1], [0, -1, 1], [-1, 0, 1], [0, 1, 1], [1, 0, 1], [0, -1, 1], [-1, 0, 1], [0, 1, 1]],
                        [4, 3, 5, 2, 0, 0, 0, 0], [3, 5, 2, 4, 0, 0, 0, 0]);
                    // corners
                    this.movePieces([[-1, 1, 1], [-1, 1, 1], [-1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, -1, 1], [1, -1, 1], [1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, -1, 1]],
                        [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, -1, 1], [1, -1, 1], [1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, -1, 1], [-1, 1, 1], [-1, 1, 1], [-1, 1, 1]],
                        [2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 0], [4, 3, 0, 3, 5, 0, 5, 2, 0, 2, 4, 0]);
                    break;
            }
        },

        movePieces : function (currentPos, newPos, currentColorIndex, newColorIndex) {
            var currentInd = [];
            for (var i = 0; i < currentPos.length; i++) {
                currentInd.push(this.findPiece(currentPos[i]));
            }
            var newInd = [];
            for (var i = 0; i < newPos.length; i++) {
                newInd.push(this.findPiece(newPos[i]));
            }
            var colors = [];
            for (var i = 0; i < currentInd.length; i++) {
                colors.push(pieces.color[currentInd[i]][currentColorIndex[i]]);
            }
            for (var i = 0; i < newInd.length; i++) {
                pieces.color[newInd[i]][newColorIndex[i]] = colors[i];
            }
        },

        findPiece : function (piece) {
            var index = -1;
            for (var i = 0; i < pieces.position.length; i++) {
                if (pieces.position[i][0] == piece[0] && pieces.position[i][1] == piece[1] && pieces.position[i][2] == piece[2]) {
                    index = i;
                    break;
                }
            }
            return index;
        }

    }
}
