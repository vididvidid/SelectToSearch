
<div align="center">
  <img src="https://placehold.co/150x150/7c3aed/ffffff?text=S&font=source-sans-pro" alt="Searchit Logo" width="120" />
  <h1>Searchit: The Intelligent Visual Search Tool</h1>
  <p><em>Unlock the power of visual search. Analyze, query, and explore images with AI-driven insights, right from your browser or web app.</em></p>
  <p>
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/vididvidid/SelectToSearch?style=for-the-badge&color=eab308" />
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/vididvidid/SelectToSearch?style=for-the-badge&color=6366f1" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Cloudflare" src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white" />
  </p>
</div>

---

## 🚀 Overview

Searchit is a **powerful visual search application** for the modern web, combining a sleek web interface with a fully integrated Chrome Extension to deliver seamless image querying experiences. Upload images, capture screenshots, or snap photos using your camera, then ask questions and receive intelligent AI-driven insights powered by Cloudflare AI. Instantly perform reverse image searches via Google Lens with a single click.

This repository contains the complete codebase for both the web app (hosted on Cloudflare Pages/Workers) and the Chrome Extension.

---

## ✨ Key Features

- **Dual Platform Experience**  
  Standalone website and an integrated Chrome Extension built for flexible use.

- **Multiple Image Input Options**  
  - 📤 **Upload:** Drag & drop or browse your files.  
  - 📸 **Camera:** Capture real-time images.  
  - 🖼️ **Screenshot (Extension):** Right-click any webpage to capture screenshots for instant analysis in the side panel.

- **Interactive Image Analysis**  
  - ✏️ **Draw & Crop:** Annotate images and select regions of interest for precise queries.  
  - 🔍 **Zoom & Pan:** Navigate images confidently to focus on details.

- **AI-Powered Queries**  
  Cloudflare’s AI analyzes image content based on text prompts.

- **Google Lens Integration**  
  Perform reverse image search on uploaded or selected image areas instantly.

- **Modern UI/UX**  
  Developed with React and Motion for a smooth, responsive, and visually appealing user interface with simulated haptic feedback.

---

## 🛠️ Tech Stack & Architecture

| Layer                | Technology                              |
|----------------------|---------------------------------------|
| **Frontend**         | React, Vite, TypeScript                |
| **Styling**          | CSS Modules, Custom Theming            |
| **Animation**        | Motion                                |
| **Backend & Deployment** | Cloudflare Pages, Cloudflare Workers, Cloudflare AI |
| **Browser Extension** | Chrome Manifest V3, React Side Panel  |

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)  
- npm or yarn  
- Cloudflare account (for deployment)

### Installation & Setup

Clone the repository
git clone https://github.com/your-username/searchit.git
cd searchit

Install dependencies
npm install

### Environment Variables

Create a `.env` file in the project root with the following keys:

VITE_ANALYZE_API_URL="your-cloudflare-worker-url"
VITE_IMGBB_API_KEY="your-imgbb-api-key"

---

## 💻 Usage

### Development

Start the local development server for the website:

npm run dev

Access the app at: `http://localhost:5173`

### Build

- Build the optimized website:

npm run build:website

- Build the Chrome Extension:

npm run build:extension

---

## 🌐 Deployment

Deploy the website to Cloudflare Pages using Wrangler CLI:

npx wrangler login
npm run deploy

This command builds and deploys your app automagically.

---

## 🧩 Installing the Chrome Extension Locally

1. Build the extension:

npm run build:extension

2. In Chrome, open: `chrome://extensions`  
3. Enable **Developer mode** (top-right corner)  
4. Click **Load unpacked** and select the `extension/` folder  
5. The "Search IT" extension is now active. Right-click on any webpage to access **Visual Search**.

---

## 🤝 Contributing

Contributions fuel open source! Welcome your suggestions and improvements:

1. Fork the repo  
2. Create a feature branch:  
`git checkout -b feature/AmazingFeature`  
3. Commit your changes:  
`git commit -m 'Add some AmazingFeature'`  
4. Push to your branch:  
`git push origin feature/AmazingFeature`  
5. Open a Pull Request

Feel free to open issues tagged **enhancement**.

---

## 📜 License

Distributed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by Yash Kumar</p>
