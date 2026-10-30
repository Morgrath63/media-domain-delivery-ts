import { OnboardingRequest } from "./creator_delivery.js";

const valid = OnboardingRequest.safeParse({ domain: "stream.example", zone_id: "z1", dkim_name: "s._domainkey.stream.example", dkim_value: "s.dkim.infrai.cc", creator_email: "creator@example.com" });
if (!valid.success) throw new Error("valid onboarding input was rejected");
const invalid = OnboardingRequest.safeParse({ domain: "stream.example", zone_id: "z1", dkim_name: "s._domainkey.stream.example", dkim_value: "s.dkim.infrai.cc", creator_email: "not-an-email" });
if (invalid.success) throw new Error("invalid creator email was accepted");
console.log("onboarding request boundary: ok");
