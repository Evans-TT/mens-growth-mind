# MGM Reading Rewards Prototype

A dynamic, front-end-only prototype for Men's Growth Mind. All member data, reading progress, mock purchases and rewards are stored in the browser's local storage.

## Demo login

- Email: `demo@mgm.co.za`
- Password: `Grow2026!`

## Run locally

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

## Build for GitHub Pages

```bash
npm run build
```

The build creates `dist/` and mirrors the same production output to `docs/`. Configure GitHub Pages to deploy from the `docs` folder on the `main` branch. The included `CNAME` maps the deployment to `dev-tshilidzitechnologies.co.za`.

## Prototype notes

- No backend, real payment, email, voucher, or analytics service is connected.
- The theme switch saves light/dark mode in the browser.
- Section changes include a branded loading transition, and the reader uses animated 3D page turns.
- Reward unlocks include generated visual previews for the microwave, washing machine and store discount.
- Use the **Reset demo** button in the footer to restore the starting state.
- Book reader content is original mock copy created for demonstration purposes.
