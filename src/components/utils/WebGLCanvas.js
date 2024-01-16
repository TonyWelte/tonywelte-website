import React, { useEffect, useRef } from 'react';

const WebGLCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

// Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fragmentShaderSource = `
precision mediump float;

// Function to convert HSV to RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // Define the properties of the Mandelbrot set
  const int maxIterations = 255;
  vec2 center = vec2(-0.5, 0.0);
  float zoom = 2.0;

  // Map the coordinates to the complex plane
  vec2 c = (gl_FragCoord.xy / vec2(800.0, 600.0) - 0.5) * zoom + center;

  // Initialize variables for the Mandelbrot iteration
  vec2 z = vec2(0.0, 0.0);
  int iterations = 0;

  // Iterate using the Mandelbrot formula: z = z^2 + c
  int count = 0;
  for (int i = 0; i < maxIterations; i++) {
    float xtemp = z.x * z.x - z.y * z.y + c.x;
    z.y = 2.0 * z.x * z.y + c.y;
    z.x = xtemp;

    // Check if the point has escaped the Mandelbrot set
    if (length(z) > 2.0) {
      count = i;
      break;
    }

    iterations++;
  }

// Map the iteration count to a rainbow color
  float hue = 0.66 - float(iterations) / float(maxIterations) * 0.66;
  if (hue < 0.0) hue += 1.0; // Wrap around for values less than 0
  vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

  // Set the fragment color
  gl_FragColor = vec4(color, 1.0);
}
    `;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program and link shaders
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Define the position attribute
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set the buffer data (coordinates for a triangle strip covering the canvas)
    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Enable the attribute and point an attribute to the currently bound VBO
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the red circle
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 2);
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default WebGLCanvas;