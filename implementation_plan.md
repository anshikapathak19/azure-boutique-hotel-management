# Refined Implementation Plan - Core AzureStay Luxury Frontend

Following your refinements, we will prioritize the core hotel search and booking product. We will omit the map, concierge widget, blog, and awards sections to focus on high-fidelity core pages. Images will use a standard local directory structure ready for Azure Blob Storage, and we will build a clean set of mock API services.

---

## Goal Description

Establish a production-ready, highly polished React frontend for **AzureStay**. The implementation will connect components to new API service modules powered by Axios (returning mock data wrappers) to enable a seamless transition to Microsoft Azure Cosmos DB, Blob Storage, Functions, and JWT auth in a later milestone.

---

## User Review Required

> [!IMPORTANT]
> **Priority Core Focus**
> The following core sections will be completely realized:
> - **Landing Page**: Polished spacing, typography, and sections (Hero, Search, Featured, Experience, Testimonials, Newsletter, FAQ, Footer).
> - **Discovery**: Listing page with multi-filter sidebar (price slider, calendar, category, rating, amenities), grid/list toggle, and responsive mobile drawers.
> - **Hotel Detail Page**: Complete gallery carousel, descriptive info, room cards, reviews, policies, and a sticky booking widget.
> - **Auth Flow**: Login, Register, Forgot Password, Reset Password, and Email Verification.
> - **Dashboards**: Guest Dashboard (Profile, Reservations, Wishlist, Reviews, Rewards), Staff Dashboard (Check-ins/outs, Housekeeping, Guest Requests, Messaging), and Admin Dashboard (Revenue/Occupancy metrics, charts, lists).

> [!NOTE]
> **Refined Images & API Services**
> - Images will reference standard local assets under `/src/assets/images/...` with descriptive names (e.g. `santorini-cliffside.jpg`, `overwater-villas.jpg`), preparing the markup for direct Azure Blob Storage endpoints.
> - Services (`AuthService`, `HotelService`, `BookingService`, `ReviewService`, `UserService`, `AdminService`) will be created under `src/services/` wrapping `axios` requests, returning mock data promises for immediate frontend functionality.

---

## Proposed Changes

### Core Integration & Services

We will wrap the application in the `AuthProvider`, add new public routes, and create Axios-based service modules.

#### [NEW] [AuthService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/AuthService.js)
- Methods for `login`, `register`, `forgotPassword`, `resetPassword`, `verifyEmail`, and `getCurrentUser`. Returns promises resolved with mock profiles.

#### [NEW] [HotelService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/HotelService.js)
- Methods for `getHotels` (supporting sorting/filtering) and `getHotelById`.

#### [NEW] [BookingService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/BookingService.js)
- Methods for `createBooking`, `getBookings` (by guest/all), `updateBookingStatus`, and `cancelBooking`.

#### [NEW] [ReviewService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/ReviewService.js)
- Methods for `getReviewsByHotel`, `createReview`, and `deleteReview`.

#### [NEW] [UserService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/UserService.js)
- Methods for `getProfile`, `updateProfile`, `getWishlist`, and `toggleWishlist`.

#### [NEW] [AdminService.js](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/services/AdminService.js)
- Methods for `getAnalytics`, `getUsers`, `getStaff`, `updateSystemSettings`.

#### [MODIFY] [App.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/App.jsx)
- Wrap application layout inside the `AuthProvider`.

#### [MODIFY] [AppRoutes.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/routes/AppRoutes.jsx)
- Register `ForgotPasswordPage`, `ResetPasswordPage`, and `EmailVerificationPage` routes.

#### [MODIFY] [Navbar.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/common/Navbar.jsx)
- Hook into `useAuth()` to display context-aware options (Dashboard link & Logout button) for authenticated roles.

---

### UI Primitives & Common Layouts

#### [NEW] [Modal.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Modal.jsx)
- Accessible dialog modal using Framer Motion.

#### [NEW] [Drawer.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Drawer.jsx)
- Slide-out mobile navigation and filter drawer.

#### [NEW] [Tabs.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Tabs.jsx)
- Luxury tab selection component with smooth exit/enter transition triggers.

#### [NEW] [Breadcrumbs.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Breadcrumbs.jsx)
- Navigation bar indicator.

#### [NEW] [Toast.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Toast.jsx)
- Micro feedback alerts (e.g. success messages on updates).

#### [NEW] [ConfirmationDialog.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/ConfirmationDialog.jsx)
- Modal trigger to confirm bookings cancellation.

#### [NEW] [Textarea.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Textarea.jsx)
- Styled editorial multiline textbox.

#### [NEW] [Badge.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/components/ui/Badge.jsx)
- Colored tags for hotel lists and admin/staff dashboards.

---

### Upgraded Core Pages

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/LandingPage.jsx)
- Integrate new polished sections: [NEW] `Newsletter.jsx` and [NEW] `FAQ.jsx` while updating existing layouts for elegant, asymmetric luxury spacing.

#### [MODIFY] [HotelListingPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/HotelListingPage.jsx)
- Add price slider.
- Add availability date selection filters.
- Integrate responsive filters inside the new mobile `Drawer`.
- Enable Grid/List toggle for matching items.

#### [MODIFY] [HotelDetailPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/HotelDetailPage.jsx)
- Replace placeholder with high-fidelity pages:
  - Header gallery carousel with full thumbnails.
  - Descriptive text layout and room type cards.
  - Reviews, policies (check-in/out guidelines), and nearby destinations.
  - Floating sticky Booking Card that updates price totals based on date inputs.

#### [MODIFY] [LoginPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/LoginPage.jsx)
- Clean responsive login card with credentials input, "Remember Me", forgot password link, and role selections.

#### [MODIFY] [RegisterPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/RegisterPage.jsx)
- Clean registration card with interactive indicators.

#### [NEW] [ForgotPasswordPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/ForgotPasswordPage.jsx)
- Send-link recovery panel with status animations.

#### [NEW] [ResetPasswordPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/ResetPasswordPage.jsx)
- New credentials update panel.

#### [NEW] [EmailVerificationPage.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/public/EmailVerificationPage.jsx)
- UI screen confirming email verify code.

---

### Luxury Dashboards

#### [MODIFY] [GuestDashboard.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/guest/GuestDashboard.jsx)
- Multi-view panel (Profile, Active Reservations, Wishlist, Reviews, Rewards) using the elegant ivory/gold dashboard styling.

#### [MODIFY] [StaffDashboard.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/staff/StaffDashboard.jsx)
- Room status dashboard, check-ins/outs counters, housekeeping updates, guest spa/restaurant orders, and message inbox.

#### [MODIFY] [AdminDashboard.jsx](file:///c:/Users/anshi/Projects/azure-boutique-hotel-management/frontend/src/pages/admin/AdminDashboard.jsx)
- Premium administrator metrics interface, displaying occupancy, revenue tables, SVG-drawn visual graphs, user tables, and settings managers.

---

## Verification Plan

### Automated Tests
- Build verification:
  ```powershell
  npm run build
  ```
- Lint check:
  ```powershell
  npm run lint
  ```

### Manual Verification
- Test direct link transitions across role profiles.
- Verify layout responsiveness on simulated viewport sizes.
- Validate filter behaviors (price slider, dates, categories).
