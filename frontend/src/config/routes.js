export const ROUTES = {
  home: '/',
  hotels: '/hotels',
  about: '/about',
  contact: '/contact',

  login: '/login',
  register: '/register',

  guest: '/guest',
  staff: '/staff',
  admin: '/admin',
}

export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.home },
  { label: 'Hotels', path: ROUTES.hotels },
  { label: 'About', path: ROUTES.about },
  { label: 'Contact', path: ROUTES.contact },
]

export const FOOTER_LINKS = [
  { label: 'Explore Hotels', path: ROUTES.hotels },
  { label: 'About', path: ROUTES.about },
  { label: 'Become a Partner Hotel', path: '#partner' },
  { label: 'Contact', path: ROUTES.contact },
  { label: 'Privacy Policy', path: '#privacy' },
  { label: 'Terms & Conditions', path: '#terms' },
]

export const FOR_HOTELS_LINKS = [
  { label: 'Become a Partner', path: '#partner' },
  { label: 'Partner Login', path: '#partner-login' },
  { label: 'Staff Login', path: ROUTES.staff },
]