# MEELTE — Target Customers

Derived from the `meelte_user` (classico) repository only: the Flutter app (`lib/`), Supabase migrations and edge functions (`supabase/`), the public web pages (`public/`), and the in-app Terms & Conditions (`assets/legal/terms_and_conditions.md`). The admin panel lives in a separate repository and was not analysed; admin-side facts below come only from migrations in this repo.

Statements marked **(inferred)** are reasoned from code and copy, not stated outright. Statements marked **(uncertain)** are gaps the codebase cannot answer. No market research, analytics or user data was available.

---

## 1. Product Overview

MEELTE is a location-based mobile app (Android and iOS, built in Flutter) for India. It combines three things:

- **Local offers.** Businesses post time-boxed advertisements with a price or discount.
- **Local events.** Users host events and approve who joins.
- **A social layer.** Friends, follows, chat, and voice/video calls.

A referral-and-coins scheme rewards growth, and coins can be redeemed for Amazon vouchers. The in-app About screen's tagline is "Real Reach • Real Rapport".

**Core capabilities found in the code**

| Area | What it does |
|---|---|
| Advertisements | Two formats: a **single-product ad** or a **shop ad** (catalogue of up to 100 products). Pricing is either original/final price, "FLAT x% discount" or "UPTO x% discount". An ad runs from 12:00 AM on its start date to 11:59 PM on its end date. Viewers can like, comment, share, get directions (opens Google Maps) and follow the advertiser. |
| Shop-ad tooling | "Import from Photos" reads a photographed menu or price list with an AI vision model (`extract-menu-items`), and AI image generation (`generate-product-image`) fills in product photos the owner did not take. |
| Ad geofencing | The Ads tab is shown only to users whose location falls inside an admin-configured city zone (`ad_city_zones`). If no zone is configured anywhere, every user sees it. |
| Events | Fields: title, category, joining cost in ₹, start/end time, cover image, map location, public/private. Attendees "Request to Join" alone or with a group (they enter the group size), and the host approves, rejects or removes people. |
| Discovery | Ads and events are listed by distance from the user (filter "Max distance", default 60 km), with category and search filters. |
| Social | Friends list, follow a creator (stored as "interests"), block users, 1:1 chat (text, emoji, documents, live or picked location), and Agora audio/video calls with incoming-call screens. "Discover People" is marked **coming soon**. |
| Notifications | Push and in-app notifications, e.g. followers are told when a creator they follow updates a public event or an ad. |
| Growth & rewards | Referral codes, invites via SMS, WhatsApp or the device contact list, and coins. Signup bonus: 30 coins. Referral bonus: 30 coins to the referrer (taken from the dev replica of the live function, `supabase/dev_bootstrap/2.4c_functions_3.sql`). Coins redeem as an **Amazon voucher of ₹100 or ₹500**: minimum 100 coins, maximum ₹500 in total per user, sent by email within 7 business days, and only once the profile is complete. Coin rewards for completed events and ads were switched off by a migration dated 2026-09-22. |
| Trust & safety | Users must be 13 or older. There are report tools, comment moderation and admin approve/reject of content (`admin_status`). There is no identity or background verification (T&C §14). Users can delete their account in the app or on the web (`public/acc-dlt.html`). |
| Sign-in | Phone OTP, email and password, Google, and Apple. |

**What the product is not.** Per the T&C, MEELTE does not sell goods, run events, take payments or broker transactions, and the app contains no payment SDK. Buying happens offline at the shop, and any event fees are settled directly between attendee and organiser.

**Business side visible in the backend.** MEELTE employs ground staff (`field_acquisition` role) who sign up users and shops with their personal referral code. Supervisors, HR and Accounts then verify each referral ("real shop vs fake / AI-generated") and process the staff's payout requests. Per a migration comment, one field referral "almost always means one shopkeeper with one ad". In other words, the supply side (merchants) is acquired in person, not only through self-serve sign-up.

**Revenue model: (uncertain).** No paid ad placement, subscription, commission or in-app purchase exists in the code. Posting an ad appears to be free today. How MEELTE plans to earn money cannot be determined from this repository.

---

## 2. Target Customer Segments

MEELTE is a two-sided local marketplace. Consumers come for nearby deals and events, and businesses and hosts come to reach those consumers.

### Primary segments

**P1. Local consumers ("nearby discoverers").** Smartphone users in India aged 13+ who want to find offers, shops and things to do close to where they are.
- **Evidence:** distance-sorted feeds, ₹ pricing, discount badges, directions to the shop, and the web landing line "connect and meet new people around you".
- **(Inferred)** They live in the specific cities where MEELTE runs ground acquisition and has switched on an ad zone. Which cities these are is not in the repo **(uncertain)**. The company's legal jurisdiction is Gaya, Bihar.

**P2. Local small businesses and shopkeepers ("merchants").** Independent shops, restaurants and service businesses that want local visibility without running their own digital marketing.
- **Evidence:** "Brand Name / Shop Name" field, shop ads with up to 100 items, menu/price-list photo import, discount formats, and the field-acquisition flow built around shopkeepers.
- **(Inferred)** Many have low digital skills: the product removes typing (photo import) and photography (AI product images), and staff help them sign up in person.

### Secondary segments

**S1. Community event hosts.** Individuals, clubs and small organisers running local gatherings, activities or paid meet-ups.
- **Evidence:** event creation, joining cost, public/private events, approval-based attendance with group sizes, and follower notifications.
- **(Uncertain)** whether MEELTE targets professional promoters. The T&C deliberately leave ticketing, permits and payments to the host, which fits informal and community events better.

**S2. Referral-driven early adopters ("reward seekers").** Users motivated to invite friends in exchange for coins and Amazon vouchers.
- **Evidence:** referral milestones (10 / 50 / 100 friends), invite channels, and the voucher screen.
- **(Inferred)** This is an acquisition channel more than a long-term segment: total redemption is capped at ₹500 per user.

**S3. Social connectors.** Users who mainly want to meet and talk to people nearby: friends, follows, chat and calls.
- **(Uncertain)** how central this is. The web landing page is titled "MEELTE - Connect & Meet", but people discovery is still "coming soon", and chat and calls work only between users who already found each other through friends, contacts or content.

### Internal users (not customers, but heavy users of the system)

Field acquisition staff, supervisors, HR, accounts and admins use the separate admin panel (admin.meelte.com) for:
- moderation and verification of content and referrals,
- category and city-zone management,
- staff payouts.

They are out of scope for this document except where they shape the customer experience.

---

## 3. Customer Needs and Pain Points

| Segment | Needs | Pain points MEELTE addresses | How the product responds |
|---|---|---|---|
| **P1 Local consumers** | Know what offers and events exist nearby, right now; trust the price; get there easily | Local deals are scattered across WhatsApp forwards, posters and word of mouth; offers are often expired or vague | Distance-sorted feed with a default 60 km radius; explicit start/end dates; original vs final price or % discount; one-tap directions; follow a shop to hear about its updates |
| **P2 Merchants** | Cheap, simple local reach; show the whole menu or stock; repeat customers | No time or skill to build a website or run social ads; digitising a menu is tedious; no product photos | Free self-serve ad posting **(as far as the code shows)**; single or catalogue ads; menu photo → product list via AI; AI product photos; followers notified of ad updates; in-person onboarding by MEELTE staff |
| **S1 Event hosts** | Fill an event with the right people; control who comes; plan for group sizes | Open WhatsApp/Instagram invites give no control over attendance and no headcount | Approval-based join requests with group size; remove attendees; public or private events; share link; followers notified of updates |
| **S2 Reward seekers** | A tangible reward for inviting people | Most apps give nothing for referrals | 30-coin referral bonus; milestones; redeem for an Amazon voucher |
| **S3 Social connectors** | Meet and talk to people around them safely | Fragmented between apps; safety worries | Friends, chat, calls in one app; block and report tools; 13+ age policy |

**Pain points the product does not yet solve (gaps found in code):**
- No in-app payment or booking. Paid events and purchases happen off-platform with no protection (T&C §5–6, §15).
- No identity or merchant verification visible to consumers (T&C §14). Referral verification exists, but only as an internal fraud check on field staff.
- Advertisers see only like and comment counts. No reach, views or footfall analytics exist in the app **(uncertain whether planned)**.
- People discovery is unfinished ("Discover People coming soon").

---

## 4. Website User Personas

MEELTE's consumer product is the mobile app. Its web presence (`public/`) is thin:
- a landing page that points to Google Play,
- privacy, terms and child-safety pages,
- a web account-deletion page,
- a catch-all page that sends people opening a shared `/ad/` or `/event/` link without the app to a download link (`meelte-get.web.app`).

The personas below therefore cover app users plus the few web-only visitors. **Persona names and personal details are illustrative.** Only the goals and journeys are taken from the code.

### Persona A — "Riya", deal-seeking local resident (P1)
- **Goal:** find good offers and something to do nearby this weekend.
- **Motivation:** save money; avoid wasted trips to shops whose offer has ended.
- **Typical journey:**
  1. Receives a shared ad link or a friend's referral and installs the app.
  2. Signs up with phone OTP or Google and gets 30 coins.
  3. Allows location. Lands on the Ads tab if inside an active city zone, otherwise on Events.
  4. Filters by category and distance and opens an ad: sees the discount, the product catalogue and dates.
  5. Taps Directions, shares the ad, follows the shop.
  6. Later gets a notification when the shop updates its ad.

### Persona B — "Imran", neighbourhood restaurant / shop owner (P2)
- **Goal:** more walk-in customers at low cost and effort.
- **Motivation:** competitors are visible online and he is not; he has no time to manage social media.
- **Typical journey:**
  1. A MEELTE field agent visits and signs him up with the agent's referral code.
  2. Creates a Shop ad: photographs his menu, "Import from Photos" fills in names and prices, and he reviews them. AI generates photos for items he did not shoot.
  3. Sets a discount and the start/end dates, and pins the shop location.
  4. The ad goes live at midnight on the start date and may be reviewed by admins.
  5. Watches likes and comments; edits the ad (followers are notified); repeats for the next offer.
- **(Inferred)** Low digital confidence: success depends on in-person onboarding and the photo-based tools.

### Persona C — "Aman", community event host (S1)
- **Goal:** run a meet-up, sports game or workshop with a manageable headcount.
- **Motivation:** control who attends and know group sizes in advance.
- **Typical journey:**
  1. Creates an event with category, joining cost in ₹, time, cover image, location, and public or private visibility.
  2. Shares the link.
  3. Reviews "Request to Join" entries, seeing whether each person comes alone or with a group and how many.
  4. Approves or rejects requests and removes attendees if needed.
  5. Collects any fee outside the app.

### Persona D — "Sneha", referral enthusiast / social connector (S2, S3)
- **Goal:** bring friends onto the app and earn rewards; stay in touch with them.
- **Motivation:** an Amazon voucher, and being early on a local app her circle uses.
- **Typical journey:**
  1. Opens "Invite Friend" and invites via contacts, WhatsApp or SMS with her referral code.
  2. Earns 30 coins per referral and tracks the 10 / 50 / 100 milestones.
  3. Completes her profile and redeems ₹100 or ₹500 (₹500 lifetime cap) to her email.
  4. Chats, shares her location and calls friends in the app.
- **(Inferred)** Engagement may drop after the ₹500 cap is reached unless other value keeps her.

### Persona E — web-only visitor
Three types, each served by a page in `public/`:

| Who | Arrives | Need | Journey |
|---|---|---|---|
| **Link recipient without the app** | Opens a shared `meelte.com/ad/…` or `/event/…` link | See the shared offer or event | Redirected to the download page; has to install before seeing the content. **(Inferred)** This is a drop-off point. |
| **Leaving user** | Visits the web account-deletion page | Delete the account without reinstalling the app | Uses `acc-dlt.html` (the same option also exists in the app menu). |
| **Policy reader** (parents, app-store reviewers, partners) | Lands on the policy pages | Check the 13+ age rule, privacy and child-safety commitments | Reads `privacy.html`, `terms.html`, `safety.html`. |

---

## 5. Value Proposition

| Segment | Why they would choose MEELTE | Strength of evidence |
|---|---|---|
| **P1 Local consumers** | One place to see what is on offer and happening **near me, right now**: dated, priced deals and joinable events, with directions, plus friends and chat in the same app and a sign-up bonus on top. | Strong (core feeds, filters, directions, coins are all built) |
| **P2 Merchants** | **Local visibility with almost no effort or cost:** a shop catalogue built from a menu photo, AI product images, discount badges, followers who get update notifications, and a person from MEELTE who helps set it up. | Strong on features; **cost to the merchant is uncertain** (no pricing in code) |
| **S1 Event hosts** | **Controlled attendance** (approve requests, see group sizes) and local reach, without building a ticketing setup. | Moderate (feature built; no payments or check-in) |
| **S2 Reward seekers** | **Real rewards for inviting friends:** coins convertible to Amazon vouchers. | Strong but time-limited (₹500 lifetime cap) |
| **S3 Social connectors** | Chat, location sharing and voice/video calls with people met through local content and contacts. | Weak to moderate (people discovery not built yet) |

**Overall positioning (inferred):** a hyperlocal "discover and connect" app for Indian cities. Its edge over generic social media is relevance by distance and time-boxed offers, and its edge over listing directories is that it is social (follow, chat, call, events). It is defensible locally mainly through **in-person merchant acquisition**, which is hard for online-only competitors to copy.

**Key uncertainties to resolve with the business team:**
1. Revenue model: will merchants or hosts pay, and for what?
2. Launch cities and which city zones are active.
3. The intended core age group. The code only enforces 13+; dating or meeting-strangers use is neither stated nor excluded.
4. Whether professional event organisers and larger brands are targeted, or only local and independent ones.
5. Merchant success metrics: no analytics exist today to show merchants their return.
