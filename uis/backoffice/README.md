# HealthCore Operations Dashboard

Internal dashboard for exploring the Milestone 2 denial, no-show, and CME utilities. It imports the functions from the repository's root `src/` directory and uses the sample records from `CONTEXT_milestone2.md`.

## Run locally

```sh
npm install
npm run dev
```

Vite binds to `0.0.0.0:5173`. If that port is in use, start Vite with `npm run dev -- --port 5174`.

## Build

```sh
npm run build
```

The dashboard uses synthetic sample records only; it does not connect to a backend or store patient information.