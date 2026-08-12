export const categories = [
  {
    id: 'standards',
    title: 'Standards',
    description: 'Our service and behavior standards.',
    icon: 'shield',
    tone: 'mauve',
  },
  {
    id: 'procedures',
    title: 'Procedures',
    description: 'Step-by-step guides.',
    icon: 'clipboard',
    tone: 'rose',
  },
  {
    id: 'goals',
    title: 'Goals & Responsibilities',
    description: 'What we aim for and your role.',
    icon: 'target',
    tone: 'apricot',
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Learn and grow with us.',
    icon: 'grad',
    tone: 'lavender',
  },
  {
    id: 'scenarios',
    title: 'Issues / Scenarios & Solutions',
    description: 'Common situations and how to handle them.',
    icon: 'help',
    tone: 'mint',
  },
]

export const moreResources = [
  {
    id: 'recent',
    title: 'Recently Updated',
    description: 'Latest handbook updates.',
    icon: 'clock',
    to: '/updates',
  },
  {
    id: 'popular',
    title: 'Popular Topics',
    description: 'Most viewed and helpful.',
    icon: 'star',
    to: '/categories/scenarios',
  },
  {
    id: 'help',
    title: 'Need Help?',
    description: 'Contact HR or get support.',
    icon: 'headset',
    to: '/more',
  },
]

export const articles = {
  standards: [
    {
      id: 'guest-greeting',
      title: 'Guest Greeting Standard',
      summary: 'How every guest should be welcomed at Zura Spa.',
      type: 'article',
      steps: [
        {
          title: 'Make eye contact',
          body: 'Acknowledge the guest within 10 seconds of arrival.',
        },
        {
          title: 'Warm welcome',
          body: 'Greet with a calm smile and introduce yourself by name.',
        },
        {
          title: 'Offer assistance',
          body: 'Confirm their booking and offer water or herbal tea.',
        },
      ],
      remember: 'First impressions set the tone for the entire spa journey.',
    },
    {
      id: 'privacy',
      title: 'Privacy & Discretion',
      summary: 'Protecting guest comfort and confidentiality.',
      type: 'article',
      steps: [
        {
          title: 'Speak softly',
          body: 'Keep conversations private and never discuss guests publicly.',
        },
        {
          title: 'Knock and wait',
          body: 'Always announce yourself before entering treatment rooms.',
        },
        {
          title: 'Secure records',
          body: 'Store intake forms and notes only in approved systems.',
        },
      ],
      remember: 'Discretion is a core part of luxury care.',
    },
  ],
  procedures: [
    {
      id: 'check-in',
      title: 'Guest Check-In Flow',
      summary: 'From arrival to treatment room handover.',
      type: 'article',
      steps: [
        {
          title: 'Verify booking',
          body: 'Confirm name, service, therapist, and duration.',
        },
        {
          title: 'Complete intake',
          body: 'Review health notes and allergies before treatment.',
        },
        {
          title: 'Escort calmly',
          body: 'Guide the guest to the lounge or treatment room.',
        },
      ],
      remember: 'A smooth check-in reduces stress before the service begins.',
    },
    {
      id: 'room-reset',
      title: 'Treatment Room Reset',
      summary: 'How to prepare the room between guests.',
      type: 'article',
      steps: [
        {
          title: 'Refresh linens',
          body: 'Replace used towels and sheets with clean, warm sets.',
        },
        {
          title: 'Restock products',
          body: 'Check oils, creams, and amenity trays before the next guest.',
        },
        {
          title: 'Set the mood',
          body: 'Adjust lighting, scent, music, and temperature.',
        },
      ],
      remember: 'A ready room is part of the welcome.',
    },
  ],
  goals: [
    {
      id: 'daily-goals',
      title: 'Daily Team Goals',
      summary: 'What success looks like on every shift.',
      type: 'article',
      steps: [
        {
          title: 'Guest satisfaction',
          body: 'Aim for calm, personalized care on every booking.',
        },
        {
          title: 'Room readiness',
          body: 'Keep treatment spaces reset, clean, and stocked.',
        },
        {
          title: 'Team support',
          body: 'Communicate delays early and help cover peaks.',
        },
      ],
      remember: 'Shared goals create consistent guest experiences.',
    },
  ],
  courses: [
    {
      id: 'onboarding',
      title: 'New Hire Onboarding',
      summary: 'Core modules for your first two weeks.',
      type: 'article',
      steps: [
        {
          title: 'Brand immersion',
          body: 'Learn the Zura Spa story, values, and service promise.',
        },
        {
          title: 'Service basics',
          body: 'Practice greetings, product knowledge, and room setup.',
        },
        {
          title: 'Shadow shifts',
          body: 'Observe senior team members before independent work.',
        },
      ],
      remember: 'Growth is continuous — revisit modules anytime.',
    },
  ],
  scenarios: [
    {
      id: 'client-arrives-late',
      title: 'Client arrives late',
      summary:
        'A client arrives later than their scheduled appointment time. How should you handle it professionally?',
      type: 'scenario',
      steps: [
        {
          title: 'Greet warmly',
          body: 'Welcome the client with a calm and friendly attitude.',
        },
        {
          title: 'Check availability',
          body: 'Confirm the time available for their service.',
        },
        {
          title: 'Communicate clearly',
          body: 'Let the client know how the delay may impact their service.',
        },
        {
          title: 'Offer options',
          body: 'Suggest rescheduling, a shorter service, or alternative times.',
        },
        {
          title: 'Thank and reassure',
          body: 'Thank the client for understanding and ensure they feel valued.',
        },
      ],
      remember:
        'Empathy and clear communication build trust and great experiences.',
    },
    {
      id: 'service-complaint',
      title: 'Guest has a complaint',
      summary:
        'A guest is unhappy with a recent service. How do you recover the experience?',
      type: 'scenario',
      steps: [
        {
          title: 'Listen fully',
          body: 'Give the guest space to share without interrupting.',
        },
        {
          title: 'Acknowledge feelings',
          body: 'Apologize sincerely and thank them for the feedback.',
        },
        {
          title: 'Clarify needs',
          body: 'Ask what would make the experience right for them.',
        },
        {
          title: 'Resolve promptly',
          body: 'Offer an approved solution and confirm next steps.',
        },
        {
          title: 'Follow up',
          body: 'Check in after resolution and log the issue for the team.',
        },
      ],
      remember: 'A recovered moment often creates a stronger relationship.',
    },
  ],
}

export const updates = [
  {
    id: 'u1',
    date: 'Aug 10, 2026',
    title: 'Late arrival protocol refreshed',
    body: 'Updated guidance for late clients under Issues / Scenarios.',
    to: '/categories/scenarios/client-arrives-late',
  },
  {
    id: 'u2',
    date: 'Aug 4, 2026',
    title: 'Check-in procedure clarity',
    body: 'Added allergy review reminder to the guest check-in flow.',
    to: '/categories/procedures/check-in',
  },
  {
    id: 'u3',
    date: 'Jul 28, 2026',
    title: 'Onboarding course live',
    body: 'New hire onboarding modules are now available in Courses.',
    to: '/categories/courses/onboarding',
  },
]

export function getCategory(id) {
  return categories.find((item) => item.id === id)
}

export function getArticle(categoryId, articleId) {
  return articles[categoryId]?.find((item) => item.id === articleId)
}

export function searchHandbook(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results = []

  for (const category of categories) {
    if (
      category.title.toLowerCase().includes(q) ||
      category.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'category',
        id: category.id,
        title: category.title,
        description: category.description,
        to: `/categories/${category.id}`,
      })
    }

    for (const article of articles[category.id] || []) {
      if (
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q)
      ) {
        results.push({
          type: article.type,
          id: article.id,
          title: article.title,
          description: article.summary,
          to: `/categories/${category.id}/${article.id}`,
        })
      }
    }
  }

  return results
}
