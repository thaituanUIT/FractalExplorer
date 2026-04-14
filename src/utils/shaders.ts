export const VERTEX_SHADER_SOURCE = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

export const FRAGMENT_SHADER_BASE = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_pan;
    uniform float u_zoom;
    uniform int u_maxIter;
    uniform int u_pattern; // 0: Classic, 1: Smooth, 2: Fire, 3: Ocean, 4: Psychedelic, 5: Grayscale
    uniform vec2 u_c; // For Julia set
    uniform bool u_isJulia;

    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
    }

    void main() {
        // Invert Y to match Canvas 2D (0 at top)
        vec2 screenPos = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
        vec2 uv = (screenPos - u_resolution.xy * 0.5) / min(u_resolution.y, u_resolution.x);
        
        // Apply zoom and pan. 
        // u_pan is now expected to be pre-scaled by (min(w,h)/3) to match the fractal space.
        vec2 z = uv * (3.0 / u_zoom) - u_pan;
        
        vec2 c = u_isJulia ? u_c : z;
        if (u_isJulia) {
            // In Julia, z starts as the coordinate
        } else {
            z = vec2(0.0);
        }

        int iter = 0;
        float magnitudeSq = 0.0;
        bool escaped = false;

        for (int i = 0; i < 1000; i++) {
            if (i >= u_maxIter) break;
            
            float x2 = z.x * z.x;
            float y2 = z.y * z.y;
            
            if (x2 + y2 > 4.0) {
                magnitudeSq = x2 + y2;
                iter = i;
                escaped = true;
                break;
            }
            
            z = vec2(x2 - y2 + c.x, 2.0 * z.x * z.y + c.y);
        }

        if (!escaped) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }

        float smoothIter = float(iter) + 1.0 - log(log(sqrt(magnitudeSq))) / log(2.0);
        float t = smoothIter / float(u_maxIter);
        vec3 color;

        if (u_pattern == 1) { // Smooth
            color = hsl2rgb(vec3(mod(smoothIter * 5.0, 360.0) / 360.0, 0.7, 0.5));
        } else if (u_pattern == 2) { // Fire
            color = vec3(min(1.0, t * 2.0), min(1.0, t * t * 4.0), min(1.0, t * t * t * 8.0));
        } else if (u_pattern == 3) { // Ocean
            color = vec3(0.0, min(1.0, t * 0.8 + 0.2), min(1.0, t * 2.0 + 0.4));
        } else if (u_pattern == 4) { // Psychedelic
            color = vec3(
                0.5 + 0.5 * sin(0.1 * smoothIter + 0.0),
                0.5 + 0.5 * sin(0.1 * smoothIter + 2.0),
                0.5 + 0.5 * sin(0.1 * smoothIter + 4.0)
            );
        } else if (u_pattern == 5) { // Grayscale
            color = vec3(1.0 - t);
        } else { // Classic or Default
            color = vec3(0.0, float(iter) / float(u_maxIter), 0.0);
        }

        gl_FragColor = vec4(color, 1.0);
    }
`;
