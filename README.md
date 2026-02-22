# 💊 MedEncyclopedia - Medicine & Compound Information Platform

A comprehensive, production-ready educational platform providing structured information about medicines, compounds, uses, and safety notes. Built with Next.js 14, MongoDB, and TailwindCSS.

> ⚠️ **Important:** This platform is for **educational purposes only**. It does NOT provide medical advice, diagnosis, or treatment recommendations.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [SEO & Discoverability](#seo--discoverability)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Admin Panel](#admin-panel)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Safety Features](#safety-features)

---

## ✨ Features

### Frontend
- 🏠 **Homepage** with search, categories, and popular items
- 📦 **Compound Pages** with detailed information, mechanism of action, side effects
- 💊 **Medicine Pages** with brand names, usage info, dosage guidelines
- 🔍 **Advanced Search** across compounds and medicines
- 📱 **Fully Responsive** design with mobile-first approach
- ⚡ **Optimized Performance** with Next.js 14 App Router
- 🎨 **Beautiful UI** with TailwindCSS

### Admin Panel
- 🔐 **Secure Authentication** with NextAuth.js
- ➕ **CRUD Operations** for compounds and medicines
- 📊 **Dashboard** with statistics
- ✅ **Content Validation** to prevent harmful information
- 🔄 **Auto-slug Generation** for SEO-friendly URLs

### SEO & Discoverability
- 📈 **Full SEO stack**: metadata, Open Graph, Twitter cards, canonical URLs
- 🗺️ **XML Sitemap** including all compounds, medicines, and static pages
- 🤖 **robots.txt** with sitemap reference and admin/api disallow
- 📋 **JSON-LD** (Organization, WebSite, MedicalWebPage, Drug) for rich results
- 🔍 **SearchAction** for sitelinks search box
- 📱 **Web app manifest** for PWA-style discoverability
- 📄 **Per-page metadata** on every public route

### Safety Features
- ⛔ **Content Validation** prevents synthesis instructions
- 📝 **Educational Focus** - no personalized medical advice
- ⚠️ **Clear Disclaimers** on all pages
- 🔒 **Admin-only Modifications** with authentication

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** TailwindCSS
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js
- **Validation:** Custom content safety validators
- **Icons:** React Icons
- **Notifications:** React Hot Toast
- **Language:** TypeScript

---

## 📁 Project Structure

```
medicine-encyclopedia/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # NextAuth configuration
│   │   │   ├── compounds/            # Compound CRUD endpoints
│   │   │   ├── medicines/            # Medicine CRUD endpoints
│   │   │   └── search/               # Search endpoint
│   │   ├── admin/                    # Admin panel pages
│   │   │   ├── login/                # Admin login
│   │   │   ├── dashboard/            # Admin dashboard
│   │   │   ├── compounds/            # Compound management
│   │   │   └── medicines/            # Medicine management
│   │   ├── compound/[slug]/          # Dynamic compound pages
│   │   ├── medicine/[slug]/          # Dynamic medicine pages
│   │   ├── compounds/                # All compounds list
│   │   ├── medicines/                # All medicines list
│   │   ├── search/                   # Search page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable components
│   │   ├── AdminNav.tsx              # Admin navigation
│   │   ├── Card.tsx                  # Card component
│   │   ├── Footer.tsx                # Site footer
│   │   ├── Navbar.tsx                # Site navigation
│   │   └── SearchBar.tsx             # Search input
│   ├── lib/                          # Utility libraries
│   │   ├── mongodb.ts                # MongoDB connection
│   │   └── utils.ts                  # Helper functions
│   ├── models/                       # Mongoose models
│   │   ├── AdminUser.ts              # Admin user model
│   │   ├── Compound.ts               # Compound model
│   │   └── Medicine.ts               # Medicine model
│   ├── types/                        # TypeScript types
│   │   ├── global.d.ts               # Global type definitions
│   │   └── next-auth.d.ts            # NextAuth type extensions
│   └── middleware.ts                 # Route protection middleware
├── scripts/
│   └── seed.js                       # Database seeding script
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies
├── tailwind.config.js                # TailwindCSS configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd Pharmacology
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and configure your variables (see [Environment Variables](#environment-variables) section).

4. **Start MongoDB** (if using local installation):

```bash
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
net start MongoDB

# On Linux:
sudo systemctl start mongodb
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/medicine-encyclopedia
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medicine-encyclopedia

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Public site URL (required for SEO: sitemap, robots, canonical URLs, Open Graph)
# Use your production domain, e.g. https://medencyclopedia.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Credentials (for seeding)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🔍 SEO & Discoverability

The site is set up for search engine and social discoverability:

- **Sitemap:** `/sitemap.xml` — all public URLs (home, compounds, medicines, compound/medicine detail pages, contribute, search, disclaimer, privacy).
- **Robots:** `/robots.txt` — allows crawling of public pages; disallows `/admin/` and `/api/`.
- **Canonical URLs:** Every page has a canonical URL to avoid duplicate content.
- **Structured data:** Organization and WebSite (with SearchAction) on the site; MedicalWebPage + Drug on each compound and medicine page.
- **Metadata:** Title, description, Open Graph, and Twitter cards on all public pages.

**Production:** Set `NEXT_PUBLIC_SITE_URL` to your live domain (e.g. `https://medencyclopedia.com`) so sitemap, robots, and Open Graph URLs are absolute and correct.

---

## 💾 Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/medicine-encyclopedia`

### Option 2: MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and update `.env`

### Seed the Database

Run the seed script to populate initial data:

```bash
npm run seed
```

This will create:
- 1 admin user
- 2 sample compounds (Acetaminophen, Ibuprofen)
- 2 sample medicines (Tylenol, Advil)

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123` (or what you set in `.env`)

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 🔒 Admin Panel

Access the admin panel at `/admin/login`

### Default Credentials (after seeding)
- Email: `admin@example.com`
- Password: `admin123`

### Admin Features

1. **Dashboard** (`/admin/dashboard`)
   - View statistics
   - Quick access to management pages

2. **Compound Management** (`/admin/compounds`)
   - Create, read, update, delete compounds
   - Auto-generate SEO-friendly slugs
   - Content safety validation

3. **Medicine Management** (`/admin/medicines`)
   - Create, read, update, delete medicines
   - Link medicines to compounds
   - Manage brand names

---

## 🔌 API Routes

### Public Endpoints

#### Get All Compounds
```
GET /api/compounds
Query: ?search=query&limit=50
```

#### Get Single Compound
```
GET /api/compounds/[id]
```

#### Get All Medicines
```
GET /api/medicines
Query: ?search=query&compound=compoundId&limit=50
```

#### Get Single Medicine
```
GET /api/medicines/[id]
```

#### Search
```
GET /api/search?q=query
```

### Protected Endpoints (Require Authentication)

#### Create Compound
```
POST /api/compounds
Body: { name, description, chemical_class, mechanism_of_action, ... }
```

#### Update Compound
```
PUT /api/compounds/[id]
Body: { name, description, ... }
```

#### Delete Compound
```
DELETE /api/compounds/[id]
```

#### Create Medicine
```
POST /api/medicines
Body: { name, description, compound, brand_names, ... }
```

#### Update Medicine
```
PUT /api/medicines/[id]
Body: { name, description, ... }
```

#### Delete Medicine
```
DELETE /api/medicines/[id]
```

---

## 🛡️ Safety Features

### Content Validation

The platform includes automatic validation to prevent:
- Synthesis instructions
- Laboratory procedures
- Molecular step-by-step guides
- Harm-enabling content

### Disclaimers

All pages include clear disclaimers that:
- Information is for educational purposes only
- No medical advice is provided
- Users should consult healthcare professionals

### Admin-Only Modifications

- Only authenticated admins can modify content
- All changes are tracked with timestamps
- Session-based authentication with secure cookies

---

## 📝 License

This project is provided as-is for educational purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues or questions, please open an issue on the GitHub repository.

---

## ⚠️ Medical Disclaimer

**IMPORTANT:** This application provides general educational information about medicines and compounds. It is NOT intended to:

- Provide medical advice
- Replace consultation with healthcare professionals
- Diagnose any condition
- Recommend specific treatments or dosages

Always consult qualified healthcare professionals for:
- Medical advice
- Diagnosis
- Treatment decisions
- Medication dosages
- Drug interactions
- Health concerns

---

## 🎯 Features Roadmap

- [ ] Advanced filtering and sorting
- [ ] User favorites and bookmarks
- [ ] Print-friendly pages
- [ ] Multi-language support
- [ ] Drug interaction checker
- [ ] Medication reminders (educational)
- [ ] Blog/articles section
- [ ] Newsletter subscription

---

Made with ❤️ for educational purposes
