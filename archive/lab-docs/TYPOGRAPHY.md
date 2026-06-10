# Typography — what's good, what's not, and why

**The problem you named:** the font dock is a *roulette of 7 frozen triples*. You can pick a bundle but
can't say "this headline font with that body," and nothing tells you which combination is good or why.
The default (`geometric` = Outfit / Inter / JetBrains) is also the *least* characterful option — generic
SaaS, not "THE LEDGER."

**The conclusion the evidence forced (not what I first pitched):** the biggest lever is **treatment, not
font count.** I went looking for the "crazy fonts" in the old sandboxes expecting to harvest them. What I
actually found: the strongest type in the whole archive — the **Broadsheet** dashboard — runs on fonts we
*already have* (Bricolage Grotesque + Hanken + Space Mono). Playfair Display was loaded in two sandboxes
and **barely used**. So adding faces is mostly not the answer; the answer is a small curated set used with
real editorial discipline.

---

## The real lever: treatment

The Broadsheet sandbox reads like a newspaper because of *how* it sets type, not which fonts:

- **Scale & contrast.** The monument number is `clamp(96px, 13vw, 188px)`; labels are 10px. Huge
  dynamic range = editorial drama.
- **Tracking.** Display is tightened hard (`-0.03em` to `-0.055em`); mono kickers are opened wide
  (`0.14em`–`0.22em`, uppercase). That contrast *is* the voice.
- **Mono as the label system.** Every eyebrow / stat label / meta line is uppercase Space Mono. It's
  the connective tissue that says "instrument," and it's already everywhere in our bricks.
- **Italic standfirst.** Lead paragraphs use a styled italic with a mono accent for the number.
- **Tabular numerals** for every stat so columns don't shimmer.

> If we changed *nothing* but adopted this treatment under the current fonts, the lab would already feel
> twice as intentional. Font choice is the second-order win.

---

## Face inventory — honest verdicts

Faces currently loaded: Inter, Hanken Grotesk, Outfit, Space Grotesk, Bricolage Grotesque, Fraunces,
JetBrains Mono, Space Mono. Candidates from the archive: Playfair Display, Source Serif 4.

| Face | Class | Character | Verdict |
|---|---|---|---|
| **Bricolage Grotesque** | optical display sans | Quirky, newspaper energy, great at huge sizes | **KEEP — lead display.** The Ledger face. |
| **Hanken Grotesk** | humanist sans | Warm, readable, friendly | **KEEP — primary body.** |
| **Space Mono** | mono | Characterful, slightly retro; superb for labels | **KEEP — label/kicker system.** |
| **JetBrains Mono** | mono | Neutral, dense, great for data columns | **KEEP — data/numeral mono.** |
| **Fraunces** | high-contrast serif | Dramatic, "soft" magazine display | **OUT** (user call, 2026-06-03). Serif direction dropped for now. |
| **Space Grotesk** | geometric-ish display | Clean, techy, modern | **KEEP — the "data tool" display.** |
| **Inter** | neutral grotesk | Invisible, excellent UI body | **KEEP — neutral body** (pairs with Space Grotesk). |
| **Outfit** | geometric sans | Generic, rounded, forgettable | **DROPPED.** Was the bland default; removed from the payload. |
| **Source Serif 4** | editorial body serif | Serious, legible long-form serif | **OUT** (user call). Briefly added then removed with the serif direction. |
| **Playfair Display** | very-high-contrast serif | Dramatic, fashion-mag | **SKIP.** Serif is out. |

**Decision (2026-06-03): serif is out for now.** No Fraunces, no Source Serif 4. A non-serif display +
body face can be added later to restore a third pairing and widen the mix pool. Net loaded set after
this pass: Bricolage, Hanken, Space Grotesk, Inter, Space Mono, JetBrains — **dropped Outfit, Fraunces,
Source Serif 4** (lighter payload than before).

---

## Recommended system: 3 curated pairings + custom override

Not a menu of 7. **One default + two alternates**, each with a reason. Then an "advanced" mode that lets
you swap display / body / mono independently — so curation is the front door, mixing is the escape hatch.

### 1. Broadsheet — **the default**
`display: Bricolage Grotesque · body: Hanken Grotesk · mono: Space Mono`
Proven in the archive; maximum newspaper identity. This should replace `geometric` as what loads first.

### 2. Terminal — data tool
`display: Space Grotesk · body: Inter · mono: JetBrains Mono`
Clean, neutral, "this is a precise instrument."

### 3. (open slot)
Reserved for a future **non-serif** display+body pairing once we find faces worth adding. Serif is out
for now, so the system ships with two pairings + the advanced mix.

**Retire / fold:** `geometric` (generic default → replaced by Broadsheet), `techno` (mono-as-display is a
novelty — keep mono for labels only), and collapse the overlapping `classic`/`neogrotesk` into the three
above. Seven roulette slots → three opinionated identities.

---

## What the dock becomes (described — not built yet)

- Each curated pairing is a card showing its **name + a live mini-specimen + the one-line rationale**
  ("Broadsheet — newspaper authority, the Ledger voice"). One click applies it.
- An **"Advanced / mix"** disclosure exposes three small pickers — display, body, mono — each face
  tagged with its class (display / body / mono) so you can't, e.g., pick a mono as body by accident.
- Persists to `localStorage` like today (`ledger-font`), but stores the three axes, not a preset id —
  which is what makes mix-and-match possible.

This is the structural change behind your "I want to mix and decide" — the data model moves from
*one preset id* to *three independent axis choices*, with curated presets as named shortcuts over them.

## So what

- **Adopt the treatment first** (scale, tracking, mono kickers, tabular nums) — biggest win, font-agnostic.
- **Default flips to Broadsheet**; dropped Outfit/Fraunces/Source Serif 4 (**serif is out**).
- **Two pairings** (Broadsheet, Terminal) + an advanced display×body×mono override; 3rd slot reserved for a future non-serif pairing.
- Build order when you're ready: refactor `theme-dock.js` font model (preset → 3 axes) → rewrite the
  `body[data-font]` blocks in `theme-system.css` as the 3 pairings → add the rationale UI in the dock.
