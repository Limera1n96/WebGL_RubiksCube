/**
 *
 * Define a solid cube with methods for drawing it.
 *
 * @param gl
 * @returns object with draw method
 * @constructor
 */
function RubiksCube(gl) {

    var colors = [[0, 0, 1],  [0, 1, 0], [1, 0, 0], [1, 0.5, 0], [1, 1, 1], [1, 1, 0]];
    var cube = new Cube(gl, colors);

    return {
        draw : function(gl, aVertexPositionId, aVertexColorId, aVertexNormalId) {
            cube.draw(gl, aVertexPositionId, aVertexColorId, aVertexNormalId);
        }
    }

}
