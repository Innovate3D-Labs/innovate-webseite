# Innovate3D Website

Official website for Innovate3D Labs - Next-generation 3D printing solutions.

## 🚀 Overview

This is the frontend website for Innovate3D Labs, built with modern web technologies to showcase our innovative 3D printing solutions and connect with the MakerWorld community.

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Authentication:** NextAuth.js
- **API Integration:** MakerWorld API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MakerWorld API credentials

## 🔧 Installation

1. Clone the repository:
```bash
git clone git@github.com:Innovate3D-Labs/innovate-webseite.git
cd innovate-webseite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp ENV_EXAMPLE.txt .env.local
```

4. Update `.env.local` with your credentials:
- MakerWorld API keys
- NextAuth secret
- Database connection (if applicable)

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 📦 Building for Production

```bash
npm run build
npm run start
```

## 🏗️ Project Structure

```
innovate-webseite/
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/          # Next.js pages
│   ├── styles/         # Global styles
│   └── lib/            # Utility functions
├── public/             # Static assets
├── generated/          # Generated code (GraphQL, etc.)
└── package.json        # Project dependencies
```

## 🔗 Related Repositories

- [Innovate OS](https://github.com/Innovate3D-Labs/innovate-os) - 3D Printer Control System
- [Innovate OS Firmware](https://github.com/Innovate3D-Labs/innovate-os-firmware) - Printer Firmware

## 📄 License

Copyright © 2025 Innovate3D Labs. All rights reserved.

## 🤝 Contributing

Please read our contributing guidelines before submitting pull requests.

## 📞 Contact

- Website: [innovate3d.labs](https://innovate3d-labs.de)
- Email: info@innovate3d.labs

---

Built with ❤️ by Innovate3D Labs 