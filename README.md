# Cata site

Marketing site for Cata. A WebGPU still life of glass bottles with light through the wine, built with [vgpu](https://vgpu.sh), plus a mailing list.

## Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mailing list

Signups go to [Resend](https://resend.com). Copy `.env.example` to `.env`, then:

- `RESEND_API_KEY` — a key that can create contacts. Leave it blank for now. Until it is set, signups are written to `data/waitlist.json` (gitignored) on this machine. Import that file into Resend once the key is in place, or those addresses stay local.
- `RESEND_SEGMENT_ID` — the id of a segment (for example, "Waitlist"). New signups are added to it. Send the launch note to that segment from Resend.

Joining does not send a message. The site promises one email, when Cata is ready.
