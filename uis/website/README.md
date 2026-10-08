# HealthCore Website

Bilingual (English/Spanish) public website and patient enquiry form for HealthCore. The enquiry form validates in the browser and displays a simulated confirmation; it does not send or store form data.

## Technology

- Semantic HTML5
- Tailwind CSS 4
- Vanilla JavaScript (ES modules)
- Vite development server

## Run locally

From this directory:

```sh
npm install
npm run dev
```

Vite binds to `0.0.0.0:5173` for Codespaces forwarding. Open `index.html` for the landing page or `application.html` for the patient enquiry form.

## GitHub Codespaces preview

Start the development server with `npm run dev`, forward port `5173` in the Ports panel, and set its visibility to **Public** for external review. Verify both pages through the forwarded URL before sharing it; public access is not enabled by this project configuration alone.

## Build

```sh
npm run build
```