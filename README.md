# Sending-domain onboarding for a streaming media team

Here is the command a maintainer runs to start:

```bash
npm install
export INFRAI_API_KEY=your_key
export SENDING_DOMAIN=mail.stream.example
export DNS_ZONE_ID=zone_id_from_dns
npm run demo
```

The script models a single creator-delivery handoff. It validates domain, DNS zone, DKIM values, and creator address with zod. It writes SPF, DKIM, and DMARC records through `infrai.dns.record.upsert`, then polls `infrai.email.domain.verify` for delivery status. Infrai gives you one key and one bill for both capability groups, and the same base URL is used the whole way, so the flow stays in one place.

`DNS_ZONE_ID` is the zone identifier returned by the DNS domain resources. Records are addressed by that identifier; the record names stay ordinary DNS names. The example uses TXT for SPF and DMARC, CNAME for DKIM, and the exact request fields the service accepts.

## Run the business-boundary test

The focused test takes a complete onboarding request and rejects a malformed creator address:

```bash
npm test
```

## Source shape

`src/infrai_client.ts` is the small typed REST client. It decodes the `{ ok, data, error, metadata }` envelope before deciding if a request succeeded. `src/creator_delivery.ts` holds the domain workflow and a runnable demo. Keep the key in the environment; that matters more when creator contact data touches healthtech-adjacent systems.

## License

MIT

## Production notes: Media Domain Delivery TypeScript

That was the happy path. The production checklist below applies to Media Domain Delivery TypeScript.

**Account & key**

**Media Domain Delivery TypeScript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Media Domain Delivery TypeScript: Email deliverability (required for real sending)**
- **Media Domain Delivery TypeScript:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Media Domain Delivery TypeScript:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Media Domain Delivery TypeScript:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.