const EVENT_URL = "https://www.livingrent.org/edinburgh_city_conference_2026";
const ACTION_URL = "https://www.livingrent.org/goawaypbsa";
const MEMBER_DEFENCE_URL = "https://www.livingrent.org/events";

export const campaigns = [
  {
    id: "edinburgh-city-conference-2026",
    slug: "edinburgh-city-conference-2026",
    title: "Join the Edinburgh City Conference",
    eyebrow: "Invite to an event",
    description:
      "Invite tenants from across Edinburgh to a day of workshops, strategy and celebration—and help launch Living Rent’s citywide manifesto for 2027.",
    primaryUrl: EVENT_URL,
    imageUrl: "/edinburgh_city_conference_2026.jpg",
    organiserName: "Living Rent Edinburgh",
    campaignType: "mobilise-people",
    status: "active",
    shareCards: [
      {
        id: "city-conference-whatsapp",
        platform: "whatsapp",
        platformLabel: "WhatsApp",
        title: "Invite someone personally",
        guidance:
          "Best for a direct invitation. Add why you would like this person to be there, and offer to go together.",
        defaultText:
          `Living Rent Edinburgh is holding its first City Conference on Saturday 5 December, 10am–2.30pm at Augustine United Church. It’ll be a day of workshops, strategy and celebration, with the launch of our citywide manifesto for 2027. Fancy coming with me? RSVP here: ${EVENT_URL}`,
        urlToShare: EVENT_URL,
        imageUrl: "/edinburgh_city_conference_2026.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse:
          "Send to a member, neighbour or supporter who may come if asked personally.",
      },
      {
        id: "city-conference-facebook",
        platform: "facebook",
        platformLabel: "Facebook",
        title: "Post the full event invitation",
        guidance:
          "Facebook suits the fuller story: what the day is for, what people will do, and the practical details.",
        defaultText:
          `Introducing Living Rent Edinburgh’s first City Conference! Join tenants from across the city on Saturday 5 December for a day of workshops, strategy and celebration. We’ll build our organising and campaigning skills, celebrate the hard-fought campaigns of 2026, and launch our citywide manifesto so we can hit the ground running in 2027. Come together with your neighbours in the fight for safe, secure and affordable housing. 10am–2.30pm at Augustine United Church, EH1 1EL. Reserve your place: ${EVENT_URL}`,
        urlToShare: EVENT_URL,
        imageUrl: "/edinburgh_city_conference_2026.jpg",
        requiresImage: true,
        shareMode: "hybrid",
        recommendedUse: "Use for a public event post with the conference artwork.",
      },
      {
        id: "city-conference-instagram",
        platform: "instagram",
        platformLabel: "Instagram",
        title: "Share the conference artwork",
        guidance:
          "Lead with the occasion and keep the date and venue easy to scan. Instagram requires manual image upload and caption pasting.",
        defaultText:
          `Edinburgh City Conference 2026 💥🎉\n\nJoin Living Rent members from across the city for workshops, strategy and celebration—and the launch of our citywide manifesto for 2027.\n\n📅 Saturday 5 December\n🕙 10am–2.30pm\n📍 Augustine United Church, EH1 1EL\n\nReserve your place: ${EVENT_URL}`,
        urlToShare: EVENT_URL,
        imageUrl: "/edinburgh_city_conference_2026.jpg",
        requiresImage: true,
        shareMode: "manual",
        recommendedUse: "Use for an Instagram grid post or Story reminder.",
      },
      {
        id: "city-conference-signal",
        platform: "signal",
        platformLabel: "Signal",
        title: "Send the details to organising chats",
        guidance:
          "Best for branch and neighbourhood chats. Keep the practical details together and make the invitation direct.",
        defaultText:
          `Edinburgh City Conference: Saturday 5 December, 10am–2.30pm at Augustine United Church. Workshops, strategy, celebration and the launch of our citywide manifesto for 2027. Please RSVP so we know you’re coming: ${EVENT_URL}`,
        urlToShare: EVENT_URL,
        imageUrl: "/edinburgh_city_conference_2026.jpg",
        requiresImage: false,
        shareMode: "manual",
        recommendedUse: "Use for branch, neighbourhood and member chats.",
      },
    ],
  },
  {
    id: "city-plan-2040-petition",
    slug: "city-plan-2040-petition",
    title: "Demand an end to luxury student accommodation",
    eyebrow: "Digital call to action",
    description:
      "Ask people to sign Living Rent Edinburgh’s City Plan 2040 petition for affordable housing requirements, social housing and evidence-led planning.",
    primaryUrl: ACTION_URL,
    imageUrl: "/city_plan_2040_petition.jpg",
    organiserName: "Living Rent Edinburgh",
    campaignType: "drive-action",
    status: "active",
    shareCards: [
      {
        id: "city-plan-whatsapp",
        platform: "whatsapp",
        platformLabel: "WhatsApp",
        title: "Ask someone to sign",
        guidance:
          "A personal ask works best. Say if you have signed already and why the issue matters locally.",
        defaultText:
          `I’ve signed Living Rent Edinburgh’s petition calling on the council to put affordable housing and community need ahead of more luxury student accommodation. Will you add your name too? ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Send to friends, neighbours and people affected by local development.",
      },
      {
        id: "city-plan-facebook",
        platform: "facebook",
        platformLabel: "Facebook",
        title: "Explain the demands and share the petition",
        guidance:
          "Use the extra space to explain the three demands, then end with one clear instruction to sign.",
        defaultText:
          `Edinburgh needs homes that meet community need—not endless luxury student developments that push up local rents and contribute to displacement and student homelessness. Living Rent Edinburgh is calling on the council’s City Plan 2040 to: strengthen affordable housing requirements in student developments; convert underused developments into social housing or student co-operatives; and publish proper occupancy and community-impact data before approving more. Add your name to the petition: ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: true,
        shareMode: "hybrid",
        recommendedUse: "Use for a public post with the petition artwork.",
      },
      {
        id: "city-plan-instagram",
        platform: "instagram",
        platformLabel: "Instagram",
        title: "Post the petition graphic",
        guidance:
          "Keep the demand bold and the action obvious. Instagram requires manual image upload and caption pasting.",
        defaultText:
          `Demand an end to luxury student accommodation.\n\nTell Edinburgh Council to put affordable housing, social housing and community need at the heart of City Plan 2040.\n\nSign the petition: ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: true,
        shareMode: "manual",
        recommendedUse: "Use for a bold visual petition ask.",
      },
      {
        id: "city-plan-twitter",
        platform: "twitter",
        platformLabel: "X",
        title: "Make a concise public ask",
        guidance:
          "Lead with the demand, name the decision-maker, and leave enough room for the petition link.",
        defaultText:
          `Edinburgh Council must put affordable housing and community need ahead of more luxury student accommodation. Tell them to strengthen City Plan 2040—sign the petition: ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Use for a short public call to action.",
      },
      {
        id: "city-plan-bluesky",
        platform: "bluesky",
        platformLabel: "Bluesky",
        title: "Add the policy context",
        guidance:
          "Bluesky audiences often respond to one sentence of context before a clear action link.",
        defaultText:
          `Edinburgh’s City Plan 2040 should require affordable housing, support social housing and student co-ops, and use real occupancy data—not wave through more luxury student blocks. Sign Living Rent’s petition: ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Use for housing, planning and local-politics networks.",
      },
      {
        id: "city-plan-signal",
        platform: "signal",
        platformLabel: "Signal",
        title: "Send to a trusted group",
        guidance:
          "Best for a group likely to act on a straightforward request. Ask people to reply once they have signed.",
        defaultText:
          `Can everyone sign and share this? It asks Edinburgh Council to curb luxury student developments and prioritise affordable and social housing in City Plan 2040: ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: false,
        shareMode: "manual",
        recommendedUse: "Use for branch, neighbourhood and supporter chats.",
      },
      {
        id: "city-plan-sms",
        platform: "sms",
        platformLabel: "SMS",
        title: "Text one person the petition",
        guidance:
          "Keep it short enough to read at a glance: the issue, the ask and the link.",
        defaultText:
          `Will you sign this petition for affordable housing instead of more luxury student blocks in Edinburgh? ${ACTION_URL}`,
        urlToShare: ACTION_URL,
        imageUrl: "/city_plan_2040_petition.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Use for a quick one-to-one ask.",
      },
    ],
  },
  {
    id: "leith-tenants-rent-reduction",
    slug: "leith-tenants-rent-reduction",
    title: "Leith tenants win £900 rent reduction",
    eyebrow: "Victory celebration",
    description:
      "Celebrate Leith members who won £900 in rent reductions and safety checks after organising around illegal entry, a faulty gas appliance and no CO₂ alarm.",
    primaryUrl: MEMBER_DEFENCE_URL,
    imageUrl: "/leith_tenants_900_rent_reduction.jpg",
    organiserName: "Living Rent Edinburgh",
    campaignType: "amplify-story",
    status: "active",
    shareCards: [
      {
        id: "leith-victory-whatsapp",
        platform: "whatsapp",
        platformLabel: "WhatsApp",
        title: "Share the win directly",
        guidance:
          "Send this to someone dealing with unsafe conditions or landlord harassment, and make the route to support clear.",
        defaultText:
          `A brilliant Living Rent win in Leith: tenants who were left without a CO₂ alarm and with a dangerous gas appliance organised and negotiated £900 in rent reductions, plus safety checks. If you’re having problems with your landlord, you don’t have to face them alone: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Send to tenants who may need support or encouragement.",
      },
      {
        id: "leith-victory-facebook",
        platform: "facebook",
        platformLabel: "Facebook",
        title: "Tell the fuller victory story",
        guidance:
          "Give the problem, the result and the organising lesson. Keep the focus on what members achieved together.",
        defaultText:
          `Leith members went nine months without a CO₂ alarm—including six months with a faulty and dangerous gas appliance. Their landlord also entered their flat without the notice and permission required by law. After organising with Living Rent and negotiating together, they won £900 in rent reductions and a programme of safety checks. That’s what member defence can do: turn an isolating problem into collective power and a concrete win. Having trouble with your landlord? Find your next local member defence meeting: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: true,
        shareMode: "hybrid",
        recommendedUse: "Use for a public victory post with the original graphic.",
      },
      {
        id: "leith-victory-instagram",
        platform: "instagram",
        platformLabel: "Instagram",
        title: "Celebrate the result",
        guidance:
          "Use short, strong paragraphs that complement the graphic. Instagram requires manual image upload and caption pasting.",
        defaultText:
          `£900 rent reduction won by Leith tenants 💪💚\n\nAfter months without a CO₂ alarm, a dangerous gas appliance and illegal entry by their landlord, members organised and negotiated £900 in rent reductions plus essential safety checks.\n\nGot an issue with your landlord and feeling powerless? Come to your next member defence meeting: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: true,
        shareMode: "manual",
        recommendedUse: "Use for an Instagram grid post or Story celebrating the win.",
      },
      {
        id: "leith-victory-bluesky",
        platform: "bluesky",
        platformLabel: "Bluesky",
        title: "Share the organising lesson",
        guidance:
          "Connect the concrete result to the wider case for tenant organising, then point people to support.",
        defaultText:
          `Leith tenants endured months without a CO₂ alarm and with a dangerous gas appliance. They organised with Living Rent and won £900 in rent reductions plus safety checks. Tenant organising gets results. Find a member defence meeting: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Use for housing and organising networks.",
      },
      {
        id: "leith-victory-signal",
        platform: "signal",
        platformLabel: "Signal",
        title: "Share the win in organising chats",
        guidance:
          "Useful for showing members that collective casework produces tangible results.",
        defaultText:
          `Member defence win: Leith tenants organised over unsafe conditions and illegal entry, then negotiated £900 in rent reductions and safety checks. A strong example of what we can win together. Meetings: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: false,
        shareMode: "manual",
        recommendedUse: "Use for branch and organising chats.",
      },
      {
        id: "leith-victory-sms",
        platform: "sms",
        platformLabel: "SMS",
        title: "Text someone the result",
        guidance:
          "Keep the result and support route clear for someone who may be facing a similar problem.",
        defaultText:
          `Leith tenants organised and won £900 in rent reductions plus safety checks. Having landlord problems? Living Rent member defence can help: ${MEMBER_DEFENCE_URL}`,
        urlToShare: MEMBER_DEFENCE_URL,
        imageUrl: "/leith_tenants_900_rent_reduction.jpg",
        requiresImage: false,
        shareMode: "direct",
        recommendedUse: "Use for quick one-to-one sharing.",
      },
    ],
    boostContent: {
      enabled: true,
      platform: "instagram",
      contentType: "post",
      url: "https://www.instagram.com/p/DPgJCOtgR2z/",
      title: "Boost the original Living Rent Edinburgh victory post",
      description:
        "A genuine comment, share, save or Story helps this member-defence win reach more tenants.",
      actions: [
        "Open the Instagram post.",
        "Like or save it if you can.",
        "Leave a genuine comment in your own words.",
        "Share it to your Story if appropriate.",
        "Send it to one tenant or group who may need encouragement.",
      ],
      commentStarters: [
        "A brilliant result—well done to everyone who organised.",
        "This is what collective tenant power looks like.",
        "No tenant should have to live with unsafe gas appliances.",
        "Concrete wins like this are why member defence matters.",
      ],
    },
  },
];

export function getCampaignBySlug(slug) {
  return campaigns.find((campaign) => campaign.slug === slug);
}
