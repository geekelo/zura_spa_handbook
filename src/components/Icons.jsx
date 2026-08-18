const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function Icon({ name, size = 22, className = '' }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    className,
    'aria-hidden': true,
    ...stroke,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      )
    case 'grid':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...props}>
          <path d="M8 3h6l4 4v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v4h4M9 12h6M9 16h4" />
        </svg>
      )
    case 'more':
      return (
        <svg {...props}>
          <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...props}>
          <path d="M6.5 17h11M8 17V10a4 4 0 1 1 8 0v7M10 17a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 3.5 3.5" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...props}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      )
    case 'back':
      return (
        <svg {...props}>
          <path d="M15 6 9 12l6 6" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 3 5 6v5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3z" />
        </svg>
      )
    case 'clipboard':
      return (
        <svg {...props}>
          <rect x="6" y="5" width="12" height="15" rx="2" />
          <path d="M9 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M9 11h6M9 15h4" />
        </svg>
      )
    case 'target':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'grad':
      return (
        <svg {...props}>
          <path d="M3 10 12 5l9 5-9 5-9-5z" />
          <path d="M7 12.5v4c2 1.5 8 1.5 10 0v-4" />
          <path d="M21 10v5" />
        </svg>
      )
    case 'help':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 2" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      )
    case 'star':
      return (
        <svg {...props}>
          <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16l-4.8 2.4.9-5.4-3.9-3.8 5.4-.8L12 3.5z" />
        </svg>
      )
    case 'headset':
      return (
        <svg {...props}>
          <path d="M4 13v-1a8 8 0 1 1 16 0v1" />
          <path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2zM18 13v5h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-1z" />
        </svg>
      )
    case 'person':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19.5c1.8-3.2 4.2-4.8 7-4.8s5.2 1.6 7 4.8" />
        </svg>
      )
    case 'sprout':
      return (
        <svg {...props}>
          <path d="M12 20V11" />
          <path d="M12 14c-3-1-5-3.5-5-7 4 0 5 2.5 5 7z" />
          <path d="M12 12c3-.8 5-3 5-6.5-3.5.5-5 2.8-5 6.5z" />
        </svg>
      )
    case 'lotus':
      return (
        <svg {...props}>
          <path d="M12 19c-2-3.5-5.5-5-8-5 1.5-3 4.5-4.5 8-4.5s6.5 1.5 8 4.5c-2.5 0-6 1.5-8 5z" />
          <path d="M12 9.5c-1.5-2-1.8-4.5-1-6.5 2 .8 3.5 3 3.5 5.5 0 .4-.1.7-.2 1" />
          <path d="M12 9.5c1.5-2 1.8-4.5 1-6.5-2 .8-3.5 3-3.5 5.5 0 .4.1.7.2 1" />
        </svg>
      )
    case 'repeat':
      return (
        <svg {...props}>
          <path d="M17 1v4H7a5 5 0 0 0-5 5v1" />
          <path d="M7 5 4.5 2.5M7 5 4.5 7.5" />
          <path d="M7 23v-4h10a5 5 0 0 0 5-5v-1" />
          <path d="m17 19 2.5 2.5M17 19l2.5-2.5" />
        </svg>
      )
    default:
      return null
  }
}
