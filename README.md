# EK Collection

Premium Pakistani women's unstitched suits storefront, built with Next.js 15, Payload CMS 3, PostgreSQL and Supabase S3-compatible storage.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase PostgreSQL project and obtain a server-side connection URI. Use the pooler connection URI if appropriate for the hosting environment.
4. Create a **private** Supabase Storage bucket named `ek-collection` and obtain S3-compatible endpoint and credentials from Supabase Storage settings. Configure the bucket's public delivery strategy / signed image access before launch; a private bucket alone will not expose product images to shoppers.
5. Set `PAYLOAD_SECRET` to a strong random secret.
6. Run `npm run dev`, open `/admin`, create the first administrator, then create categories, products and CMS pages.
7. Run `npm run build` and test the site before deployment.

## Architecture

- `/admin`: Payload dashboard
- `/`, `/shop`, `/product/[slug]`: Storefront
- `/cart`, `/checkout`: Shopping flow
- `/api/checkout`: Server-side price and availability verification
- `/pages/[slug]`: CMS legal and content pages

## Important: development-stage limitations

This is an **initial scaffold**, not a production-ready commerce backend.

- Checkout stores orders but **does not decrement or reserve inventory**. Add an atomic transaction or reservation workflow before taking real orders.
- Checkout shipping is currently 0 as a **placeholder**, not a promise of free delivery. Confirm shipping pricing and implement accurate calculation before accepting payments.
- Manual payment instructions and proof verification are not implemented. Never display or collect unverified bank details.
- Optional customer login and signup are not yet wired to storefront UI. Payload customers collection is an initial model.
- Add rate limiting, bot protection, transactional email, order notifications, customer ownership access controls, and robust form validation.
- Add image handling and public/signed image URLs, CMS seed content, actual logo and photography.
- Review all legal policies before publishing.
- The admin bootstrap and access permissions must be tested; prevent unintended account creation and protect customer data.
- No tests, migrations or deployment verification have been run yet.

Never commit credentials. Set Vercel environment variables separately.
