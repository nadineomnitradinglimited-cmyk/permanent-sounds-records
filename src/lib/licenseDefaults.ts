export const LICENSE_SLOT_DEFAULTS = [
  {
    name: "MP3 Lease",
    price: "29.99",
    fileFormat: "MP3",
    deliverables: "Tagged MP3",
    usageTerms: "Up to 10,000 streams, non-exclusive.",
    distributionLimit: "10000",
    isExclusive: false,
  },
  {
    name: "WAV Lease",
    price: "49.99",
    fileFormat: "WAV + MP3",
    deliverables: "Untagged WAV + MP3",
    usageTerms: "Up to 100,000 streams, non-exclusive.",
    distributionLimit: "100000",
    isExclusive: false,
  },
  {
    name: "Trackout Lease",
    price: "99.99",
    fileFormat: "WAV + Trackouts",
    deliverables: "Untagged WAV, MP3, and stem trackouts",
    usageTerms: "Unlimited streams, non-exclusive.",
    distributionLimit: "",
    isExclusive: false,
  },
  {
    name: "Exclusive Rights",
    price: "399.99",
    fileFormat: "WAV + Trackouts",
    deliverables:
      "Untagged WAV, MP3, stem trackouts, full ownership transfer",
    usageTerms:
      "Unlimited use. Beat is removed from the store after purchase.",
    distributionLimit: "",
    isExclusive: true,
  },
] as const;
