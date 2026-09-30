# Bae-ung (SeeOut) — Life-Ending & Funeral Transparency Platform

> **"When Transparency Becomes Solace"**  
> Korea's first public-data-driven funeral and memorial ecosystem, eliminating prepaid funeral markups and illegal kickbacks through real-time cost disclosure, zero-rebate flat subscriptions, and senior-first accessibility.

[![Verification](https://img.shields.io/badge/Verification-100%25%20Passed-19382C.svg)](#verification)
[![A11y](https://img.shields.io/badge/Senior%20A11y-13px%20Floor%20(N--7)-C2A26A.svg)](#senior-first-accessibility)
[![License](https://img.shields.io/badge/Compliance-7%20Statutes%20Compliant-141618.svg)](#legal-compliance)

---

![Bae-ung Platform Overview](./docs/images/baeung_platform_overview.jpg)

---

## 🌟 Overview & Mission

In South Korea, bereaved families face unexpected average funeral costs exceeding **14,000,000 KRW (~$10,500 USD)**, driven by prepaid funeral company markups, obscure facility fees, and entrenched 20–30% kickbacks paid by funeral homes to referring agents.

**Bae-ung (배웅)** transforms this opaque industry into a dignified, transparent, and fair ecosystem:
1. **Real-Time Cost Disclosure**: Direct synchronization with the Ministry of Health and Welfare's official *e-Haneul* system.
2. **Zero-Rebate Flat Subscription**: Replaces predatory 20~30% introduction cuts with a fixed flat-rate marketing fee ($250/mo), preventing antitrust violations and passing savings directly to families.
3. **Dual-Standby Protocol (二重安心)**: 100% loss-credit vouchers protecting families against unfair cancellation penalties and on-site price gouging.
4. **Senior-Centric UX (50–90 yr)**: Strict 13px minimum font scale (N-7), high-contrast traditional palettes (ink and celadon jade), and zero text truncation.

---

## 🏛️ End-to-End Service Architecture

![Bae-ung 4-Step Transparent Funeral Process](./docs/images/funeral_journey_architecture.jpg)

### 1. Real-Time Cost Diagnostic Engine (Pre-Mortem)
- **AI OCR Receipt Scanner**: Upload any competitor's quote or contract to automatically detect inflated fees across altar flowers, shroud fabrics, caskets, and limousines within 3 seconds.
- **Fair-Trade Formula**: Automatically computes statutory cancellation refund rights and maps quotes to Bae-ung's transparent packages (2.8M & 3.9M KRW).

### 2. Verified Facility Directory (38 Pilot Hall Dataset)
- **Target Pilot Region**: Exhaustive real-world inventory across Southeast Seoul & Seongnam (Gangnam, Seocho, Songpa, Gangdong, Bundang, Sujeong/Jungwon).
- **Public & Incidental Rates**: Comprehensive pricing for mortuary rooms, preparation suites, guest dining, and altar arrangements.
- **Click-to-Call Privacy**: Telecommunications Secrecy Act compliant 6-month log retention with zero voice recording (`recordingDisabled: true`).

### 3. Dual-Standby Protocol (Per-Mortem)
- **Loss Credit Voucher**: 100% compensation for penalties incurred when canceling exploitative legacy funeral plans.
- **Certified Director Dispatch**: Rapid on-site response within 2 hours across covered districts with strict prohibitions on unauthorized extra fees.

### 4. 30-Minute Aftercare Matching (Post-Mortem)
- **Tri-Service Integration**: Optimal geographic pairing with verified indoor columbariums, natural woodland burials, and bio-estate clearing services within a 30-minute radius.
- **Statutory License Parsing**: Rigorous regex parsing of official permits under the Funeral Act (Articles 15 & 16) and Wastes Control Act (Article 25).

---

## 📊 Business Model & Controlled Experiment (Traction)

![Bae-ung Platform Impact & Traction Analysis](./docs/images/traction_business_dashboard.jpg)

### Rigorous A/B Field Experiment (38 Facilities)
To validate the business viability of a zero-rebate flat-rate model, Bae-ung conducted a controlled trial across 38 funeral facilities comparing Bae-ung Verified Partners (8 halls) against the Control Group (30 halls):

| Metric | Control Group | Bae-ung Verified | Pure Lift | Significance |
|---|---|---|---|---|
| **Monthly Inbound Calls** | 11.2 calls | **31.9 calls** | **+185% (2.8x)** | $p = 0.003$ |
| **Online Quote Inquiries** | 4.1 quotes | **13.2 quotes** | **+220% (3.2x)** | $p = 0.002$ |
| **Quote-to-Visit Conversion** | 32.4% | **61.3%** | **+89% Lift** | High Intent |
| **Partner ROI** | Baseline | **800% ROI** | 1 booking covers 8mo ad fees | Target Achieved |

---

## ⚖️ Legal & Regulatory Compliance Matrix

Bae-ung is engineered with a strict legal-defense architecture:

1. **Anti-Rebate Immunity**: 100% compliant with the Fair Trade Commission's anti-rebate crackdowns (March 2026) via uniform flat subscriptions.
2. **e-Haneul Public License**: Full attribution and timestamping under Korea Open Government License (KOGL Type 1).
3. **Telecommunications Secrecy Act**: Article 41-2 compliance with 6-month caller verification storage and complete exclusion of voice recording.
4. **24-Hour Neutral Opt-Out Pipeline**: Unaffiliated funeral facilities can unpublish their public listing with a single click within 24 hours.

---

## 👓 Senior-First Accessibility Rules (`AGENTS.md`)

- **Strict 13px Floor (N-7 Rule)**: Elimination of Tailwind's `text-xs` (12px); all text elements are strictly $\ge 13\text{px}$ to accommodate senior eyesight (50–90 years old).
- **High-Contrast Palette**: Derived from traditional Korean ink (`#141618`, `#151719`), celadon jade (`#19382C`, `#DCE8E2`), and brass gold (`#C2A26A`), maintaining WCAG AAA/AA ratings.
- **Zero Truncation**: No `truncate` ellipsis on critical pricing or package items; word-wrapping (`break-words`) is mandatory.
- **Modal Accessibility Contract**: 100% compliance across `role="dialog"`, `aria-modal="true"`, focus trapping, Tab containment, ESC closure, and scroll unlocking.

---

## 🛠️ Verification & Quality Assurance

Bae-ung mandates full end-to-end verification prior to every git release:

```bash
# Run full verification suite (TypeScript + Vitest 244 tests + Real Browser Audit)
npm run verify

# Unit & integration testing
npm test

# Automated browser UI audit (25 modals & 5 views)
npm run audit:ui
```

### Verification Status
- **TypeScript**: 0 compilation errors (`npx tsc --noEmit`)
- **Vitest**: 23 test suites, **244 / 244 tests passed (100%)**
- **Token Drift**: **0 unregistered hex colors** (`tests/token-drift.test.ts`)
- **Browser Audit**: **0 violations** across 25 modal dialogs and 5 full views.

---

## 🗺️ Roadmap & Expansion

- **Phase 1 (Active)**: Southeast Capital Metropolitan Area (Gangnam, Seocho, Songpa, Gangdong, Seongnam 38 facilities) deployment.
- **Phase 2**: Expansion across Gyeonggi Province and 6 metropolitan cities (500+ facility network).
- **Phase 3**: Municipal public crematorium and cemetery integration with AI-powered digital life archives.

---

## 📄 License & Attribution

Copyright © 2026 SeeOut / Bae-ung Platform. All rights reserved.  
The public funeral facility dataset is adapted from the Korea Ministry of Health and Welfare *e-Haneul* system under KOGL Type 1.
