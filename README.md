<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Ammar Translator

Ammar Translator is a next-generation neural translation engine designed to bridge standard languages with the unique 'Ammar' language. Built with React, Vite, and Express, it offers a seamless translation experience across desktop and mobile devices.

## 🚀 Features

- **Multi-Language Support**: Translate between English, Arabic, French, Turkish, German, Spanish, and Ammar.
- **Hybrid Architecture**: Uses Express for the backend API and Vite for a fast frontend experience.
- **Ammar Neural Engine**: Custom logic for translating to and from the Ammar language, using Arabic as an intermediate step for standard languages.
- **Learn Hub**: Explore and learn more about the language through community-driven content.
- **Responsive Design**: Optimized for all screen sizes, featuring a persistent bottom navigation bar for mobile users.
- **Dynamic Theming**: Futuristic UI with a "Deep Space" aesthetic and neon accents.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.
- **Deployment**: Netlify (via Netlify Functions) and Hugging Face Spaces.
- **APIs**: MyMemory Translation API for standard language pairs.

## 💻 Local Development

**Prerequisites:** Node.js (v18 or higher recommended).

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd ammar-translator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the app**:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## 🌐 Deployment

### Netlify

This project is configured for seamless deployment on Netlify. It uses Netlify Functions to handle API requests and provides redirects for SPA routing.

1.  Push your code to a Git repository (GitHub, GitLab, etc.).
2.  Connect your repository to Netlify.
3.  The build settings are automatically detected from `netlify.toml`:
    - **Build Command**: `npm run build`
    - **Publish Directory**: `dist`
    - **Functions Directory**: `netlify/functions`

### Hugging Face Spaces

To deploy on Hugging Face Spaces using the Docker or Static SDK:

1.  Create a new Space on Hugging Face.
2.  Choose the **Docker** SDK (recommended for the Express backend).
3.  The application is configured to listen on the port provided by the environment variable `$PORT`, which is required by Hugging Face Spaces.

## 📜 Scripts

- `npm run dev`: Starts the development server using `tsx`.
- `npm run build`: Builds the frontend for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript checks.
- `npm run clean`: Removes the `dist` directory.

---

View the app in AI Studio: [https://ai.studio/apps/6b14ca97-ca16-48db-8f17-ab8b5a25f55e](https://ai.studio/apps/6b14ca97-ca16-48db-8f17-ab8b5a25f55e)
