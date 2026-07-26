# Dyno Health

Dyno Health is a static health-information and tracking app for:

- Arthritis
- Diabetes
- High blood pressure
- Psoriasis
- Eczema / atopic dermatitis

It is designed for GitHub Pages and has no server, account system, analytics, or third-party tracker. Health entries and care-plan notes are stored only in the current browser using `localStorage` unless the user exports them.

## Features

- Evidence-based condition guides and urgent warning signs
- Blood-pressure tracker with AHA category feedback
- Blood-glucose tracker with CDC low-glucose and DKA safety prompts
- Joint, skin, and general flare tracker
- Local care-plan notes and visit-preparation checklist
- CSV and JSON export
- Print-friendly summary
- Dark mode
- Responsive, accessible, no-build interface

## Medical safety

This project is educational. It is not a diagnosis service, medical device, insulin calculator, medication recommender, or substitute for licensed care. Health targets and emergency plans must come from the user's own clinical team.

The app deliberately does **not**:

- diagnose a rash from an image
- recommend starting, stopping, or changing medicine
- calculate insulin doses
- promise that browser data is secure against other users of the same device

Content was reviewed on July 26, 2026 and cites CDC, NIH/NIAMS, the American Heart Association, the American Academy of Dermatology, and NHS guidance in the app's Sources tab.

## Run locally

No build step is required.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to GitHub Pages

A GitHub Actions workflow is included.

1. Open **Settings → Pages** in this repository.
2. Set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow manually.

The site will be available at:

`https://coachdinosaur.github.io/dyno-health/`

## Privacy model

Data is stored in browser `localStorage`. This means:

- it is not uploaded by this app
- another person using the same browser profile may see it
- clearing site/browser data can erase it
- entries do not automatically sync across devices

Use the JSON export for backups.

## License

MIT
