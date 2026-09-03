# The Gift Club 🎁

A private four-person birthday wishlist for Snehil, Khushi, Riya and Shibam.

## What it does

- Everyone can browse all four wishlists all year.
- Each person can add wishlist items throughout the year.
- Each item can have a name, price, photo URL, shopping link and optional notes.
- Gift claiming is intended to be active only during the 30 days before a birthday.
- The birthday person is not shown who claimed their gifts.
- Supabase handles accounts/database; Cloudflare Pages can host the website for free.

## One-time setup

1. Create a free Supabase project.
2. In Supabase, create four Auth users (one for each friend). Use the same initial password `1234` if desired, then each person can change it later.
3. Open `schema.sql` in Supabase SQL Editor and run it.
4. The supplied build already contains your Supabase project URL and legacy anon key. The URL is the project root (not `/rest/v1/`).
5. Upload this folder to a GitHub repository.
6. Connect that repository to Cloudflare Pages and deploy it.
7. Share the resulting `*.pages.dev` link in your WhatsApp group.

## Important security note

Only put the Supabase anon/publishable key in `app.js`. Never put a Supabase service-role key in the website.

## Product images

For maximum reliability, the first version intentionally asks for an image URL rather than trying to scrape retailer websites. Retailers frequently block automatic image extraction. A later version can add a richer "paste product link and auto-fill" helper if desired.

## Birthday window

The intended product behavior is: wishlist editing remains available year-round; claiming is available during the 30 days leading up to the relevant birthday. The current frontend is deliberately conservative and should be wired to a server-side rule before public launch so nobody can bypass the window by changing browser code.

## Free hosting

Supabase currently has a $0 Free plan suitable for small projects, and Cloudflare Pages has a free plan for hosting/deployments. See the official documentation for current limits.
