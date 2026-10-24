# Client website template

A starting point for one client website built by Local Cascade. Each client gets their own copy
of this repo on GitHub, deployed by Vercel from the `main` branch.

Open the client's copy in Claude Code and say what you want. Claude reads `CLAUDE.md`, works on a
branch, opens a pull request, gives you the Vercel preview link, and puts it live when you say
"ship it". The review address is the `preview_url` in `site.json` (`https://<project>.vercel.app`)
until the client's own domain is connected at go-live.

To start a new client: copy this template into a new repo, import that repo into Vercel as a new
project (no framework, no build command, output directory `public`; `vercel.json` already sets
this), and fill in `vercel_project` and `preview_url` in `site.json`.

Do not edit this template to fix one client's site; fix it in that client's repo.

## This client: Valezar & Associates Inc.

Accounting and tax firm at 12485 SW 137th Ave., Ste. 206, Miami, FL 33186. Owner Mirtha C. Almanzar, EA, MST.
Everything the site says about the firm is in `site.json`. Every fact the client still has to confirm, and
everything still missing, is in `VERIFY.md`, written so it can be emailed to the client as it is.

**Pages (23 plus 404):** home; services overview plus fractional CFO, tax planning, monthly bookkeeping,
payroll and tax preparation (business and personal share one page); areas we serve plus Kendall, Miami,
South Miami, Homestead, Doral and Fort Lauderdale (Weston and Deerfield Beach are sections of the areas page);
about; how we work; fees; reviews; questions and answers; firm information; contact; privacy; terms.

**Before go-live:**
- Get the three CRM pieces into `site.json` `integrations` (form embed, chat widget, review link). Until then
  the site uses a built-in form that opens the visitor's email app addressed to admin@valezar.com, and a
  built-in chat pop-up with Call, Text and Contact buttons that sends nothing anywhere. Replace both with the
  CRM pieces exactly as given; the form sits in `#contact-form` on every page, the chat lives in the footer block.
  If the CRM form or chat is added, update the privacy policy's "What this website collects on its own" section.
- `public/robots.txt` blocks everything until launch. Swap in the commented launch version in that file.
- `public/_headers` sends noindex for Cloudflare Pages. Delete it at launch if the site is on Cloudflare.
- Canonicals, Open Graph addresses and the sitemap already use `https://www.valezar.com/`.
- The client's Google profile links to Calendly for appointments (`booking_system_current`). The site does
  not link it; that is the agency owner's call.

**Copy rules specific to this client:** never call the firm or anyone in it a CPA. Describe the owner's
credential as "Enrolled Agent" or "enrolled to practice before the IRS", never as "certified" and never in a way
that suggests she works for the IRS (Treasury Circular 230, section 10.30). No promised refunds or savings.
