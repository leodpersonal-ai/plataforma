# VetGuide — Practical Veterinary Clinical Manual

English landing page for the supplied 48-page canine and feline clinical manual, with a visual style based on farmacovet.lovable.app: navy/emerald palette, cream backgrounds, centered product presentation, green calls to action and two opposing preview rows.

## Run and build

Requires Node.js 20 or newer. No package installation or third-party JavaScript dependencies are needed.

```sh
npm run dev
npm test
npm run build
npm run preview
```

The development server defaults to port 5173. Set `PORT` or pass `--port 3000` to change it. Publish the `dist/` directory on any static host; no server-side runtime is required in production. All paths are relative, including assets and offer configuration, so the site also works from a subdirectory. No deployment or hosting account has been configured in this repository.

## Offer configuration

The offer deliberately starts in **prelaunch mode** because no price or checkout URL has been supplied. The availability button opens an explanatory dialog; it never sends a buyer to a different product's checkout.

Set the real HTTPS checkout URL, numeric price and ISO currency in `offer.json` to activate purchasing, for example:

```json
{
  "checkoutUrl": "https://YOUR-REAL-CHECKOUT.example/manual",
  "price": 9.90,
  "currency": "USD",
  "manualLanguage": "Spanish"
}
```

The amount above is only a configuration example, not an approved selling price. A configured checkout must have a positive price. Campaign attribution (`utm_*`, `fbclid`, `gclid`, `ttclid`, `sck`, `xcod`) is preserved; query parameters from the landing page cannot overwrite the checkout's offer identifier.

## Product language and assets

The supplied PDF is in **Spanish**. Website copy is in English; source-page images are authentic Spanish samples and are explicitly identified as such. The hero is an illustrative English cover mockup generated for this landing page, not evidence of an English PDF edition. There is no full PDF or unrestricted product download in this public site.

Before marketing an English edition, translate and review the complete product, replace the Spanish sample assets, update the edition notices/FAQ/metadata and adjust the edition validation in `app.js`. Changing only `manualLanguage` is intentionally rejected to avoid misrepresenting the uploaded product.

Sample assets correspond to source pages 3, 5, 15, 45, 46 and 47. The English case-framework card illustrates the structure and is labeled as a summary, rather than presented as a page from the PDF. The three included reference tools are sections within the supplied manual, not separately valued bonus products.

No testimonials, sales counters, rating, scarcity, refund policy or delivery promises have been invented. Add those only when substantiated and approved for this specific offer.

## Accessibility and performance

Semantic sections, one H1, keyboard-accessible native dialogs, focus restoration, Escape and arrow-key preview navigation, lazy-loaded WebP samples, an image preload, an explicit pause control and reduced-motion support. Fonts are loaded from Google Fonts with local sans-serif fallbacks.

## Asset generation brief

The built-in image generation tool produced `assets/manual-hero.webp`: a cream/mint studio product mockup with an upright navy/emerald manual, tablet, golden retriever and tabby cat, English title “Practical Veterinary Clinical Manual / Dogs & Cats,” and short worksheet labels. No clinical doses, endorsements, price or ratings were requested.
