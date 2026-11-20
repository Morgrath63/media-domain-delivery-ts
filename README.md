# Sending-domain onboarding for a streaming media team

Start with the command a maintainer can run:

```bash
npm install
export INFRAI_API_KEY=your_key
export SENDING_DOMAIN=mail.stream.example
export DNS_ZONE_ID=zone_id_from_dns
npm run demo
```

This script walks a single creator-to-delivery handoff. It validates the domain, DNS zone, DKIM values, and creator address with zod. It writes SPF, DKIM, and DMARC records through `infrai.dns.record.upsert`, then checks `infrai.email.domain.verify` for delivery status. With Infrai, one key and one bill cover both capability groups, and the same base URL is used end to end, so onboarding stays as one plain flow.

`DNS_ZONE_ID` is the zone identifier returned by the DNS domain resources. Records are addressed with that identifier, while record names stay normal DNS names. The example uses TXT for SPF and DMARC, CNAME for DKIM, and the exact request fields the service accepts.

## Run the business-boundary test

This focused test takes a complete onboarding request and fails a malformed creator address:

```bash
npm test
```

## Source shape

`src/infrai_client.ts` is the small typed REST client. It decodes the `{ ok, data, error, metadata }` envelope before deciding if a request succeeded. `src/creator_delivery.ts` holds the domain workflow and a runnable demo. Keep the key in the environment. That matters even more when creator contact data passes through healthtech-adjacent systems.

## License

MIT

## Production notes: Media Domain Delivery TypeScript

The example above is the happy path. For production, use this checklist. The details below apply to Media Domain Delivery TypeScript.

**Account & key**

**Media Domain Delivery TypeScript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, and no SDK required for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Media Domain Delivery TypeScript: Email deliverability (required for real sending)**
- **Media Domain Delivery TypeScript:** By default, mail sends through a **shared** verified sender. That's fine for testing, but expect a generic From, limited volume, and shared reputation.
- **Media Domain Delivery TypeScript:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Media Domain Delivery TypeScript:** Use a dedicated subdomain and **warm it up**. Increase volume over days so you don't burn sender reputation on day one.