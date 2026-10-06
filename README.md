# GetIt 🚀

A modern freelancing platform designed specifically for college students to connect with opportunities and build their professional careers while studying.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

GetIt is a comprehensive platform that bridges the gap between talented college students and businesses looking for skilled freelancers. The platform provides a structured environment for students to showcase their skills, find relevant projects, and build professional relationships while earning money during their studies.

## ✨ Features

### For Students

- **Profile Creation**: Build comprehensive profiles showcasing skills, education, and portfolio
- **Skill-based Matching**: AI-powered matching system to find relevant opportunities
- **Project Discovery**: Browse and apply to various projects across different domains
- **Secure Agreements**: Digital contract system with built-in terms and conditions
- **Payment Integration**: Secure payment processing through Razorpay
- **Portfolio Management**: Showcase work and build professional reputation

### For Recruiters/Companies

- **Talent Discovery**: Find skilled students based on specific requirements
- **Project Posting**: Create detailed project listings with requirements and compensation
- **Agreement Management**: Digital contract creation and management
- **Communication Tools**: Direct messaging and collaboration features
- **Review System**: Rate and review student work

### Core Platform Features

- **Modern UI/UX**: Built with shadcn/ui components and Tailwind CSS
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live notifications and status updates
- **Search & Filtering**: Advanced search capabilities with multiple filters
- **Analytics Dashboard**: Track performance and engagement metrics

## 🛠 Tech Stack

### Frontend

- **Next.js 15.1.0** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Headless UI components
- **shadcn/ui** - Pre-built component library

### Backend & Services

- **Firebase** - Authentication and real-time database
- **Firebase Admin** - Server-side Firebase operations
- **Google Generative AI** - AI-powered features

### Payment & External Services

- **Razorpay** - Payment processing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### UI Components & Libraries

- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Day Picker** - Date selection
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Firebase account for backend services
- Razorpay account for payment processing

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/praneeth622/GetIt.git
   cd GetIt
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Copy the template and fill in the values (see `.env.example` for the full list):

   ```bash
   cp .env.example .env.local
   ```

   ```env
   # Firebase web app (public — guarded by Firestore security rules)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (server only — from Service Accounts → Generate new private key)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # Razorpay (server only)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

   # Google Gemini (server only)
   GEMINI_API_KEY=your_gemini_api_key

   # Sentry (optional — errors are dropped silently when unset)
   NEXT_PUBLIC_SENTRY_DSN=
   SENTRY_DSN=
   SENTRY_AUTH_TOKEN=
   SENTRY_ORG=
   SENTRY_PROJECT=
   ```

   Deploy the security rules and composite indexes before pointing real data at the project:

   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application.

6. **Run the quality gates**

   ```bash
   npm run lint          # ESLint (next/core-web-vitals)
   npm run typecheck     # tsc --noEmit
   npm run format:check  # Prettier
   npm test              # Vitest unit tests
   npm run build         # production build (lint + types enforced)
   ```

   All five run in CI on every push and pull request (`.github/workflows/ci.yml`).

## 📁 Project Structure

```
GetIt/
├── app/                   # Next.js app router
│   ├── api/               # Route handlers (auth, payments, AI, uploads, webhooks)
│   ├── loading.tsx        # Root route-segment loading skeleton
│   ├── error.tsx          # Route-segment error boundary
│   ├── global-error.tsx   # Root-layout error boundary
│   └── not-found.tsx      # 404
├── components/            # UI components
│   ├── ui/                # shadcn/ui primitives
│   ├── feed/              # Feed (types, cards, comments, composer)
│   ├── agreement/         # Contract and agreement components
│   ├── explore/           # Recruiter discovery components
│   ├── profile/           # Profile editing sections
│   └── ai/                # Interview analysis UI
├── lib/                   # Auth, payments, Firebase, validation, rate limiting
├── middleware.ts          # Session-cookie UX gate for app routes
├── firestore.rules        # Firestore security rules (the real auth boundary)
├── firestore.indexes.json # Composite indexes
├── storage.rules          # Cloud Storage security rules
└── .github/workflows/     # CI (format, lint, typecheck, test, build)
```

### Key Components

#### Agreement System

- **AgreementContainer**: Main container for managing agreements
- **AgreementHeader**: Contract header with company and student info
- **AgreementDetails**: Project details and compensation info
- **AgreementTerms**: Terms and conditions management
- **AgreementSignature**: Digital signature functionality

#### Exploration Features

- **Student directory**: recruiter-facing list, filters, detail and contact modals
- **Search & Filter**: filtering by skills, location, and availability
- **Skill Matching**: `calculateMatchScore()` ranks students against a job

#### UI Components

- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern Animations**: Smooth transitions and micro-interactions
- **Accessible Components**: WCAG compliant UI elements

## 🔄 How It Works

### For Students

1. **Create Profile**: Sign up and build a comprehensive professional profile
2. **Discover Opportunities**: Browse projects or receive AI-matched recommendations
3. **Connect & Collaborate**: Apply to projects and communicate with clients
4. **Complete Work**: Deliver quality work and build professional reputation
5. **Get Paid**: Receive secure payments through integrated payment system

### For Recruiters

1. **Create Account**: Set up company profile and requirements
2. **Post Projects**: List opportunities with detailed requirements
3. **Review Applications**: Browse student applications and portfolios
4. **Create Agreements**: Generate digital contracts with terms
5. **Manage Projects**: Track progress and provide feedback

## 🤝 Contributing

We welcome contributions to GetIt! Here's how you can help:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Update documentation for any new features
- Ensure all tests pass before submitting
- Add tests for new functionality

### Areas for Contribution

- **UI/UX Improvements**: Enhance user experience and design
- **Backend Features**: Implement new API endpoints and services
- **Testing**: Add unit and integration tests
- **Documentation**: Improve code documentation and guides
- **Performance**: Optimize application performance
- **Accessibility**: Improve accessibility features

## 🐛 Known Issues

- Agreements are still backed by client-side mock data — they need a Firestore collection
- The feed's _Upcoming Events_ and _Learning Resources_ sidebar cards are static editorial content, not app data
- "People You May Know" lists every student; there is no connections graph yet
- Rate limiting is per-process — swap `lib/rate-limit.ts` for a shared store when running multiple replicas

## 📞 Support

For support, email support@getit.com or create an issue in the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**GetIt** - Empowering college students to build their professional careers through meaningful freelancing opportunities. 🎓💼
