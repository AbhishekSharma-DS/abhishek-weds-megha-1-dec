# Abhishek & Megha Wedding Invitation

A static Vite invitation for the wedding on 1 December 2026 in Agra.

## Run Locally

Requires Node.js 22.12 or newer and npm.

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite. Press `Ctrl+C` to stop the server.

## Build

```powershell
npm run build
npm run preview
```

Vite generates the deployable site in `dist/`. Do not edit or commit that generated folder.

## Edit the Invitation

- Invitation text and page structure: [index.html](index.html)
- Calendar events and times: [src/invitation.mjs](src/invitation.mjs)
- Countdown, navigation, music, and film behavior: [src/main.js](src/main.js)
- Styling and responsive layout: [src/style.css](src/style.css)
- Images, music, and video: [public](public)

Calendar data is separate from the visible schedule, so update both when event details change. Keep the event IDs used by the countdown and calendar links consistent.

## Deploy

See [DEPLOY.md](DEPLOY.md) for Vercel deployment steps. The deployed invitation is public unless hosting access control is configured; a private source repository does not make the site private.
