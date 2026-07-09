export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  guest: '/guest',
  staff: '/staff',
  admin: '/admin',
}

export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.home },
  { label: 'Rooms', path: '#rooms' },
  { label: 'Experience', path: '#experience' },
  { label: 'Gallery', path: '#gallery' },
  { label: 'Contact', path: '#contact' },
]

// Footer quick links — anchors point to existing sections for now;
// dedicated routes (About, Partner, Privacy, Terms) arrive in a later milestone.
export const FOOTER_LINKS = [
  { label: 'Explore Hotels', path: '#rooms' },
  { label: 'About', path: '#about' },
  { label: 'Become a Partner Hotel', path: '#partner' },
  { label: 'Contact', path: '#contact' },
  { label: 'Privacy Policy', path: '#privacy' },
  { label: 'Terms & Conditions', path: '#terms' },
]

// Footer "For Hotels" column. Staff Login points to the existing /staff
// route; Partner links are anchors until dedicated partner routes exist.
export const FOR_HOTELS_LINKS = [
  { label: 'Become a Partner', path: '#partner' },
  { label: 'Partner Login', path: '#partner-login' },
  { label: 'Staff Login', path: ROUTES.staff },
]