# 🌀 Fractal Explorer — High-Performance GPU Rendering

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://fractal-explorer-eight.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://get.webgl.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

An interactive, high-performance web application for visualizing complex geometric and pixel-based fractals. Powered by **WebGL** and **GPU Acceleration**, this explorer allows for deep zooming and high-iteration rendering with buttery-smooth performance.

---

## ✨ Key Features

- **🚀 GPU Accelerated Rendering**: Leverages WebGL shaders to offload heavy calculations (Mandelbrot escape time, geometric vertex buffers) to the GPU.
- **🔍 Seamless Navigation**: Smooth panning and infinite zooming capabilities for all fractal types.
- **🎨 Dynamic Coloring**: Choose from multiple curated color palettes (Fire, Ocean, Psychedelic, Grayscale, etc.) for Mandelbrot and Julia sets.
- **📐 Diverse Fractal Library**:
  - **Geometric**: Koch Snowflake (Siamese & Anti-Siamese), Minkowski Island & Sausage, Sierpinski Triangle & Carpet.
  - **Pixel-Based**: Mandelbrot Set, Julia Set (with interactive Parameter `c` control).
- **📱 Responsive UI**: Sleek, modern control panel for real-time parameter tweaking.

---

## 🛠️ Supported Fractals

### Geometric Fractals (Vector-Based)
*   **Koch Snowflake**: Explore the classic boundary-based fractal with "Inverse" and "Rhombus (Siamese)" modes.
*   **Minkowski Island**: High-iteration rendering of the Minkowski curve with a "Sausage" mode toggle.
*   **Sierpinski Suite**: Instantly switch between the Sierpinski Triangle and the Sierpinski Carpet.

### Pixel-Based Fractals (Fragment Shaders)
*   **Mandelbrot Set**: Infinite escape-time exploration with high-precision shaders.
*   **Julia Set**: Real-time interactive control of the constant `c` for infinite variety.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/thaituanUIT/FractalExplorer.git
    cd FractalExplorer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run locally**:
    ```bash
    npm start
    ```
    The app will be available at `http://localhost:3000`.

---

## 🧪 Technical Implementation

- **WebGL Vertex Buffers**: Geometric fractals are generated on the CPU and efficiently uploaded to GPU buffers for high-speed line and triangle rendering.
- **Fragment Shaders (GLSL)**: Mandelbrot and Julia sets are rendered entirely in the fragment shader, calculating millions of escape-time iterations per frame.
- **Precision Management**: Optimized for `highp` float precision to enable deep zooming before precision limits are reached.

---

## 👤 Author

**Cu Nguyen Huy Thai Tuan**
- MSSV: 23521704
- Email: 23521706@gm.uit.edu.vn
- GitHub: [@thaituanUIT](https://github.com/thaituanUIT)
- LinkedIn: [Tuan Cu Nguyen Huy Thai](https://www.linkedin.com/in/cu-nguyen-huy-thai-tuan-628914336/)

**Tran Trong Duc Tai**
- MSSV: 23521379
- Email: 23521379@gm.uit.edu.vn
- GitHub: [@DucTai2804](https://github.com/DucTai2804)
- LinkedIn: [Tran Trong Duc Tai](https://www.linkedin.com/in/trong-duc-tai/)

**Nguyen Phu Thanh**
- MSSV: 23521452
- Email: 23521452@gm.uit.edu.vn
- GitHub: [@NPTIsMyName](https://github.com/NPTIsMyName)
- LinkedIn: [Thanh Nguyen Phu](https://www.linkedin.com/in/thanhngphu)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
