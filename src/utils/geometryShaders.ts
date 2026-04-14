export const GEOMETRY_VERTEX_SHADER = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform float u_zoom;
    uniform vec2 u_pan;

    void main() {
        // a_position is relative to fractal center (0,0)
        // apply pan in zoomed units and then scale by zoom
        vec2 pos = (a_position + u_pan) * u_zoom;
        
        // Convert to NDC: [-1, 1]
        // Screen center is (0,0) in our logical model space
        vec2 ndcPos = pos / (u_resolution * 0.5);
        
        // WebGL Y is up, our logical space Y is down (matching Canvas 2D)
        gl_Position = vec4(ndcPos.x, -ndcPos.y, 0.0, 1.0);
    }
`;

export const GEOMETRY_FRAGMENT_SHADER = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;
