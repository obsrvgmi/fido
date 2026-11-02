# Fido

**Your business runs. Payroll runs itself.**

Fido is an employee management and private onchain payroll app on NEAR. It pairs private AI agents with [NEAR Intents](https://near.org) so teams can manage people and pay them onchain. The UI is built with [BoardUI](https://www.boardui.com).

> Status: front-end prototype. Auth, data and payroll runs are simulated. See [Current status / limitations](#current-status--limitations).

## Features

- Marketing landing page with a floating navbar, hero, feature sections and product preview
- Login flow with role selection (Admin or Employee) and NEAR wallet, Google, or email + OTP sign-in
- 3-step create-organization wizard for admins
- Admin dashboard with an organization switcher and these pages: Overview, People, Payroll, AI Agents, Settings
- Add Employee and Run Payroll modals
- Employee pay portal
- Brand layer on top of BoardUI (mint accent, near-black primary buttons)

## User flow

1. Open `/login` and choose **Admin** or **Employee**.
2. Sign in with NEAR wallet, Google, or email + OTP.
3. **Admin:** create an organization at `/onboarding`, then land on `/dashboard`. Admins who already have an organization go straight to the dashboard.
4. **Employee:** go to the pay portal at `/employee`.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- [BoardUI](https://www.boardui.com) components, built on React Aria Components
- Motion, Recharts, TanStack Table, Remix Icon
- ESLint (`eslint-config-next`)

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project structure

```
src/
  app/                  Routes: /, /login, /onboarding, /dashboard (+ people, payroll, agents, settings), /employee
  components/
    marketing/          Landing page sections and navbar
    auth/               Role pick and sign-in flow
    onboarding/         Create-org wizard
    dashboard/          Shell, pages, Run Payroll and Add Employee modals
    employee/           Employee pay portal
    brand/              Brand marks
    base/ application/ foundations/   Vendored BoardUI components
  lib/
    session.ts          Mock auth and data store (localStorage)
    use-guard.ts        Client-side role guard
  styles/brand.css      Brand layer on top of BoardUI's theme
public/                 Static assets
```

## BoardUI

The components in `src/components/base`, `application` and `foundations` are vendored BoardUI source, installed with the BoardUI CLI. Add more with:

```bash
npx boardui@latest add <component>
```

Brand colors live in `src/styles/brand.css`. The primary color is mint `#00EC97`, used as an accent. Primary buttons use near-black ink.

## Current status / limitations

- **Auth and data are mocked.** There is no backend. Session, organizations, employees and pay runs are stored in the browser's `localStorage` (`src/lib/session.ts`).
- **Sign-in is simulated.** NEAR wallet, Google and email OTP do not call any real service. Any 6-digit code is accepted.
- **Payroll runs are simulated.** No funds move and nothing touches NEAR or NEAR Intents.
- The role guard (`src/lib/use-guard.ts`) runs on the client only and is not a security boundary.

Next steps:

- Real NEAR wallet connect
- A backend with real auth and persistence
- Real NEAR Intents integration for payroll

## License

MIT. See [LICENSE](LICENSE).
