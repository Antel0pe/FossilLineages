This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Research data

The first curated research pass covers the human lineage from living *Homo sapiens* back to early apes:

- [`data/human-lineage.json`](data/human-lineage.json) — taxa, branching relationships, divergence estimates, fossils, adaptation hypotheses and licensed visual assets.
- [`data/human-lineage-sources.json`](data/human-lineage-sources.json) — museum, primary literature and data-repository citations.
- [`docs/human-lineage-data-notes.md`](docs/human-lineage-data-notes.md) — source evaluation, scientific caveats and next research steps.
- [`docs/image-attribution.md`](docs/image-attribution.md) — attribution for downloaded reconstruction images.

The data intentionally does not present fossil species as a proven linear chain of direct ancestors.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
