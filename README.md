# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/16ea2fbe-9b90-4e68-92fa-d8149422df7b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/16ea2fbe-9b90-4e68-92fa-d8149422df7b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/16ea2fbe-9b90-4e68-92fa-d8149422df7b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)


## Portable local build (Windows/macOS/Linux)

Create a static portable package that can be moved to another machine:

```sh
npm install
npm run build:portable
```

This outputs:
- `portable-build/` with:
  - `app/` (compiled application files)
  - `start-windows.bat` (double-click to run on Windows)
  - `start-unix.sh` (run on macOS/Linux)
- `portable-build.zip` so you can copy/download one file and run it on another machine

> Note: This project is a web app, so the portable artifact is a static bundle served locally rather than a native `.exe` desktop binary.


## Step-by-step install and run guide

### Option A: Run directly from source (recommended for development)

1. **Install Node.js 20+**
   - Download from: https://nodejs.org/
2. **Open a terminal in the project folder**
3. **Install dependencies**
   ```sh
   npm install
   ```
4. **Start the app in development mode**
   ```sh
   npm run dev
   ```
5. **Open the URL shown in the terminal** (usually `http://localhost:8080`)

### Option B: Build a portable package (for another machine)

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Create portable build + zip**
   ```sh
   npm run build:portable
   ```
3. You will get:
   - `portable-build/`
   - `portable-build.zip`
4. **Copy `portable-build.zip` to the target machine** and extract it.
5. In the extracted folder:
   - **Windows:** double-click `start-windows.bat`
   - **macOS/Linux:** run `./start-unix.sh`
6. Open `http://localhost:4173`

### Troubleshooting

- If install fails due to dependency resolution, ensure `npm` reads the local `.npmrc` in this repo.
- If a port is already in use, pass a custom port:
  - Windows: `start-windows.bat 5000`
  - macOS/Linux: `./start-unix.sh 5000`
- If Python is missing on the target machine, install Python 3 (the launchers use Python’s built-in HTTP server).
