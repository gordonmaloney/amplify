export const boostGuidance = {
  instagram: {
    post: {
      title: "Boost this Instagram post",
      actions: [
        "Open the Instagram post.",
        "Like or save it if you can.",
        "Leave a real comment in your own words.",
        "Share it to your Story if appropriate.",
        "Send it by DM to one person or group who might care.",
      ],
      tip: "Real comments, saves, Story shares and DMs are more useful than silent views.",
      commentPrompt:
        "Pick a starter, then change a few words so it sounds like you.",
    },

    carousel: {
      title: "Boost this Instagram carousel",
      actions: [
        "Open the carousel.",
        "Swipe through the slides before interacting.",
        "Like or save it if it is useful.",
        "Leave a real comment that responds to the point of the post.",
        "Share it to your Story or DM it to someone who might care.",
      ],
      tip: "If it is a carousel, reading or swiping through it properly is better than opening and leaving immediately.",
      commentPrompt:
        "Add a comment that refers to the story, campaign or local issue.",
    },

    reel: {
      title: "Boost this Instagram Reel",
      actions: [
        "Open the Reel.",
        "Watch it all the way through before interacting.",
        "Like or save it if you can.",
        "Leave a real comment in your own words.",
        "Share it to your Story if appropriate.",
        "Send it by DM to someone likely to care.",
      ],
      tip: "For video, watching properly before interacting is usually more useful than clicking away immediately.",
      commentPrompt: "A short, real comment is better than a copied slogan.",
    },
  },

  facebook: {
    post: {
      title: "Boost this Facebook post",
      actions: [
        "Open the Facebook post.",
        "React to it.",
        "Leave a real comment with a local, personal or political angle.",
        "Share it to your timeline if appropriate.",
        "Share it to a relevant group only if it belongs there.",
      ],
      tip: "Facebook is often strongest for local networks, groups, events and longer context. Avoid spamming unrelated groups.",
      commentPrompt: "Add why this matters locally or why you are sharing it.",
    },

    event: {
      title: "Boost this Facebook event",
      actions: [
        "Open the event.",
        "Mark yourself as Going or Interested, if that is true.",
        "Invite people who might genuinely come.",
        "Share the event to a relevant branch, neighbourhood or campaign group.",
        "Add a short note explaining who the event is for.",
      ],
      tip: "Event boosts work best when people invite specific people who might actually attend.",
      commentPrompt: "Mention who should come and why.",
    },

    video: {
      title: "Boost this Facebook video",
      actions: [
        "Open the video.",
        "Watch enough to understand it before reacting.",
        "React to it.",
        "Leave a comment that responds to the video.",
        "Share it to a relevant group or timeline if appropriate.",
      ],
      tip: "For video, meaningful comments and relevant shares are more useful than drive-by reactions.",
      commentPrompt:
        "Respond to the point of the video, not just the campaign slogan.",
    },
  },

  x: {
    post: {
      title: "Boost this X post",
      actions: [
        "Open the post.",
        "Like or repost if useful.",
        "Reply with one clear point.",
        "Quote-post if you have your own angle to add.",
        "Avoid sharing sensitive personal casework details.",
      ],
      tip: "X is most useful for public pressure, journalists, politicians and political networks. Keep it sharp and avoid unnecessary detail.",
      commentPrompt:
        "One clear reply is better than a long thread unless the campaign needs more context.",
    },
  },

  bluesky: {
    post: {
      title: "Boost this Bluesky post",
      actions: [
        "Open the post.",
        "Like or repost if useful.",
        "Reply with a real comment or local angle.",
        "Quote-post if you have useful context to add.",
        "Send it directly to someone who might care.",
      ],
      tip: "Bluesky is useful for public political conversation. Add context rather than just dropping a link.",
      commentPrompt:
        "Say why this matters, who it affects, or what people should do next.",
    },
  },

  tiktok: {
    video: {
      title: "Boost this TikTok video",
      actions: [
        "Open the video.",
        "Watch it all the way through before interacting.",
        "Like or save it if useful.",
        "Leave a short real comment.",
        "Share it with someone who might care.",
      ],
      tip: "TikTok recommendations use interaction and video signals, so watching properly and sharing to relevant people is more useful than briefly opening it.",
      commentPrompt: "Keep comments short, natural and specific.",
    },
  },

  generic: {
    post: {
      title: "Boost this post",
      actions: [
        "Open the post.",
        "Read or watch enough to understand it.",
        "React if the platform allows it.",
        "Leave a real comment in your own words.",
        "Share it somewhere relevant or send it to someone who might care.",
      ],
      tip: "The aim is not to spam a platform. The aim is to add real engagement from real people.",
      commentPrompt: "Pick a starter, then make it sound like you.",
    },
  },
};

export const defaultCommentStarters = {
  supportive: "Huge respect to everyone who organised this.",
  political: "This is why tenants need power, not just promises.",
  personal: "We have seen the same problem locally.",
  local:
    "This is exactly the kind of thing renters around here are dealing with.",
  action: "If you rent, please take a minute to back this.",
  turnout: "Come along if you want to help win more of this.",
};
