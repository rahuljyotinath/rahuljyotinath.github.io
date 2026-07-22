# GTM + GA4 + Clarity setup

## 1. Accounts (one-time)

1. Create **GA4** property → Measurement ID `G-XXXXXXXX`
2. Create **Microsoft Clarity** project → Project ID
3. Create **GTM** web container → `GTM-TZ8DR4CR` (91SkylineWorks site)
4. Link GA4 ↔ Google Ads
5. In GA4 Admin → **Key events**: mark `generate_lead`, `click_phone`, `click_whatsapp`, `click_email`

**This project's GA4 stream:** Measurement ID `G-QXV35C4QCV` · URL `https://91skylineworks.com`

## 2. Site env

Copy `frontend/.env.example` → `frontend/.env`:

```
VITE_GTM_ID=GTM-TZ8DR4CR
```

Run `npm run release` so prerendered HTML also gets GTM.

## 3. GTM container tags

### Consent Mode v2 (default deny)

Already pushed in site bootstrap + `ConsentBanner.jsx`. In GTM:

- Tag: **Consent Initialization** — all storage denied by default
- Trigger: Consent Initialization - All Pages

### GA4 Configuration

- Tag: Google Tag / GA4 Configuration
- Measurement ID: `G-QXV35C4QCV`
- Trigger: **consent_update** where `analytics_storage = granted` OR custom event after Accept

### Microsoft Clarity

- Tag: Custom HTML

```html
<script>
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script","YOUR_CLARITY_ID");
</script>
```

- Trigger: same as GA4 (after consent)

### Click events (data attributes)

Site uses `data-track` on links:

| Attribute | GA4 event |
|-----------|-----------|
| `click_phone` | click_phone |
| `click_email` | click_email |
| `click_whatsapp` | click_whatsapp |

GTM setup:

1. Trigger: **Click - All Elements** → `Click Element` matches CSS selector `[data-track]`
2. Variable: **Data Layer Variable** or read `{{Click Element}}.dataset.track`
3. Tag: GA4 Event — event name = value of `data-track`

### Form conversions (dataLayer)

React pushes on success:

```js
{ event: 'generate_lead', form_name: 'inspection' | 'contact' | 'assessment' | 'analyzer' }
```

GTM:

1. Trigger: Custom Event → `generate_lead`
2. Tag: GA4 Event `generate_lead` with parameter `form_name`

### SPA page views

`GtmLoader.jsx` pushes `page_view` on React route change. Map to GA4 event or use GTM History Change trigger as backup.

## 4. Verify before Ads spend

- GTM Preview mode
- GA4 DebugView
- Test: phone click, WhatsApp, each form
- Clarity: recordings within ~2 hours

## 5. Weekly behavior review (15–20 min)

### Clarity

1. Recordings → last 7 days
2. Watch 5 sessions ending on `/contact` without submit
3. Watch 5 rage/dead click sessions
4. Heatmaps: `/`, `/problems`, `/contact`

### GA4

1. Engagement → Pages (high exit rate pages)
2. Engagement → Events (`click_phone`, `generate_lead`)
3. Explore → Funnel: Home → Problems → Contact → generate_lead
4. Traffic acquisition by source

### Actions

| Signal | Fix |
|--------|-----|
| High `/problems`, low contact | Stronger inspection CTA on problem pages |
| Rage clicks on mobile menu | Nav UX |
| Scroll stops above phone | Move CTA higher on mobile |
| Many phone clicks, few forms | Normal for Guwahati — keep tel visible |

Log findings week over week after UX changes.
