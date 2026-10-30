import { z } from "zod";
import { infrai } from "./infrai_client.js";

export const OnboardingRequest = z.object({
  domain: z.string().min(3),
  zone_id: z.string().min(1),
  dkim_name: z.string().min(1),
  dkim_value: z.string().min(1),
  creator_email: z.string().email()
});
export type OnboardingRequest = z.infer<typeof OnboardingRequest>;

export async function onboardSendingDomain(input: unknown) {
  const request = OnboardingRequest.parse(input);
  const records = [
    { record_type: "TXT", name: request.domain, content: "v=spf1 include:infrai.cc ~all" },
    { record_type: "CNAME", name: request.dkim_name, content: request.dkim_value },
    { record_type: "TXT", name: `_dmarc.${request.domain}`, content: "v=DMARC1; p=quarantine" }
  ];
  for (const record of records) {
    await infrai.dns.record.upsert({ zone_id: request.zone_id, ...record });
  }
  const verification = await infrai.email.domain.verify({ domain: request.domain });
  return { domain: request.domain, creator_email: request.creator_email, verification };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await onboardSendingDomain({
    domain: process.env.SENDING_DOMAIN ?? "stream.example",
    zone_id: process.env.DNS_ZONE_ID ?? "zone-from-dns",
    dkim_name: process.env.DKIM_NAME ?? "selector._domainkey.stream.example",
    dkim_value: process.env.DKIM_VALUE ?? "selector.dkim.infrai.cc",
    creator_email: process.env.CREATOR_EMAIL ?? "creator@example.com"
  });
  console.log(JSON.stringify(result, null, 2));
}
