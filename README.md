# 🌍 Travel Ex## 📸 Preview

Platform ini menawarkan pengalaman visual yang menarik dengan animasi halus, desain modern, dan antarmuka yang responsif untuk semua perangkat.

---

## 🎯 Tentang Proyek

**Travel Explorer** adalah aplikasi web full-stack yang dirancang untuk komunitas travel enthusiast. Platform ini memungkinkan pengguna untuk:

- 📝 **Membuat artikel perjalanan** dengan editor yang intuitif
- 🖼️ **Upload foto destinasi** langsung dari form atau paste URL
- 🗂️ **Kategorisasi artikel** berdasarkan jenis destinasi
- 🔍 **Pencarian advance---

## 🧭 API Integration Guide

### Base Configuration

```typescript
// src/constants/config.ts
export const API_BASE_URL = 'https://your-strapi-backend.com';
export const ARTICLES_PER_PAGE = 9;
```

### API Service Architecture

```typescript
// src/lib/api/apiServices.ts
class ApiService {
  private baseUrl: string;
  
  // Auto-inject JWT token from localStorage
  private getAuthHeaders() {
    const authData = this.getStoredAuth();
    return authData?.jwt 
      ? { 'Authorization': `Bearer ${authData.jwt}` }
      : {};
  }
  
  // Main methods:
  login(identifier, password)          // POST /api/auth/local
  register(username, email, password)  // POST /api/auth/local/register
  getArticles(queryParams)             // GET /api/articles
  getArticleById(id)                   // GET /api/articles/:id
  createArticle(data)                  // POST /api/articles
  updateArticle(id, data)              // PUT /api/articles/:id
  deleteArticle(id)                    // DELETE /api/articles/:id
  uploadImage(file)                    // POST /api/upload
  getCategories()                      // GET /api/categories
}
```

### Strapi Query Examples

```typescript
// Get articles with populated relations
GET /api/articles?populate[category]=*&populate[author]=*

// Filter by category
GET /api/articles?filters[category][name][$eqi]=Beach

// Search articles (case-insensitive)
GET /api/articles?filters[title][$containsi]=bali

// Pagination
GET /api/articles?pagination[page]=1&pagination[pageSize]=9

// Sort
GET /api/articles?sort=createdAt:desc

// Combined
GET /api/articles?populate[category]=*&filters[category][name][$eqi]=Beach&pagination[page]=1&pagination[pageSize]=9&sort=createdAt:desc
```

## 🗂️ Important Files Reference

### Core Application Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, metadata, font config |
| `src/app/page.tsx` | Landing page dengan article highlights |
| `src/app/globals.css` | Global styles, animations, CSS variables |
| `src/constants/config.ts` | API URL & app configuration |

### Authentication

| File | Purpose |
|------|---------|
| `src/app/(auth)/login/page.tsx` | Login form dengan error handling |
| `src/app/(auth)/register/page.tsx` | Registration form dengan validation |
| `src/hooks/useAuth.ts` | Auth hook dengan localStorage persistence |
| `src/lib/store/slices/authSlice.ts` | Redux auth state management |

### Articles Management

| File | Purpose |
|------|---------|
| `src/app/articles/page.tsx` | Articles list dengan filters & infinite scroll |
| `src/app/articles/[id]/page.tsx` | Article detail page |
| `src/app/articles/create/page.tsx` | Create article form |
| `src/app/articles/edit/[id]/page.tsx` | Edit article form |
| `src/hooks/useArticles.ts` | Articles fetching & filtering logic |
| `src/lib/store/slices/articlesSlice.ts` | Redux articles state |

### API & Services

| File | Purpose |
|------|---------|
| `src/lib/api/apiServices.ts` | Centralized API client untuk Strapi |
| `src/lib/types/index.ts` | TypeScript type definitions |
| `src/lib/validation/validators.ts` | Form validation helpers |

### UI Components

| File | Purpose |
|------|---------|
| `src/components/layout/Navbar.tsx` | Navigation dengan auth integration |
| `src/components/layout/Toast.tsx` | Toast notification system |
| `src/components/ui/Button.tsx` | Button dengan variants & loading states |
| `src/components/ui/Card.tsx` | Card container component |
| `src/components/ui/Input.tsx` | Input field component |
| `src/components/ui/Textarea.tsx` | Textarea component |
| `src/components/ui/LoadingSpinner.tsx` | Loading indicator |
| `src/components/ui/SkeletonCard.tsx` | Skeleton loader untuk articles |

---ter kategori dan exact title match
- 👥 **Autentikasi aman** dengan session persistence
- ♾️ **Infinite scroll** untuk browsing artikel tanpa batas
- 🎨 **UI/UX modern** dengan animasi smooth dan feedback visual
- 📱 **Responsive design** untuk semua ukuran layar

---

## 🛠️ Technology Stack

### Core Framework & Language
- **[Next.js 15.5.4](https://nextjs.org/)** - React framework dengan App Router
- **[React 19.1.0](https://react.dev/)** - Library UI terbaru dengan React Compiler
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety untuk development

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library modern dan customizable
- **[next/font](https://nextjs.org/docs/app/api-reference/components/font)** - Font optimization (Poppins & Lato)

### State Management
- **[Redux Toolkit 2.3.0](https://redux-toolkit.js.org/)** - State management dengan modern patterns
- **[React-Redux 9.2.0](https://react-redux.js.org/)** - Official React bindings untuk Redux

### Backend Integration
- **[Strapi CMS](https://strapi.io/)** - Headless CMS untuk content management
- **REST API** - Communication dengan backend Strapi

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting dengan Next.js config
- **[Turbopack](https://turbo.build/pack)** - Fast bundler untuk development & build
- **[PostCSS](https://postcss.org/)** - CSS processing

---Modern Travel Article Platform

Travel Explorer adalah platform berbagi cerita perjalanan berbasis web yang dibangun dengan teknologi modern. Aplikasi ini memungkinkan pengguna untuk membuat, mengedit, dan berbagi artikel perjalanan lengkap dengan foto, kategori destinasi, dan sistem autentikasi yang aman.

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat&logo=tailwind-css)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.3.0-764abc?style=flat&logo=redux)

## 📸 Preview

Platform ini menawarkan pengalaman visual yang menarik dengan animasi halus, desain modern, dan antarmuka yang responsif untuk semua perangkat.

## ✨ Key Features

- **Rich landing page** highlighting community stats, curated themes, and the latest travel stories.
- **Secure authentication** with persistent sessions handled via custom `useAuth` hook.
- **Article management** including creation, editing, deletion, and infinite scrolling lists.
- **Advanced filters** supporting search, exact title matches, and case-insensitive category filtering through Strapi query params (`filters[title][$eqi]`, `filters[category][name][$eqi]`).
- **Category-aware layout** with populated category metadata via `populate[category]=*`.
- **Cover image uploads** that post directly to Strapi’s `/api/upload` endpoint and auto-fill the article form.
- **Global toast notifications** and animated UI components for responsive feedback.

---

## ✨ Fitur Utama

### 🏠 Landing Page
- **Hero section** dengan background image dinamis
- **Latest articles showcase** dengan animasi stagger
- **Feature highlights** menampilkan keunggulan platform
- **Discovery features** dengan icon dan accent colors
- **Community stats** untuk engagement metrics
- **Smooth animations** dengan custom keyframes

### 🔐 Authentication System
- **Register/Login forms** dengan validasi client-side
- **JWT token management** dengan localStorage persistence
- **Auto-redirect** ke login untuk protected routes
- **Session restoration** saat reload page
- **Error handling** dengan toast notifications berwarna

### 📝 Article Management
- **Create articles** dengan rich form (title, description, content, category)
- **Upload cover images** via URL paste atau file upload ke Strapi
- **Edit existing articles** dengan pre-filled data
- **Delete articles** dengan confirmation dialog
- **View article detail** dengan metadata lengkap

### 🔍 Advanced Filtering
- **Search by keyword** (case-insensitive)
- **Exact title match** dengan operator `$eqi`
- **Category filter** dropdown dengan dynamic loading
- **Sort options** (newest, oldest, popular)
- **Real-time filter** tanpa page reload

### 🎨 UI/UX Excellence
- **Toast notifications** dengan 3 variants (success, error, info)
- **Loading states** di semua API operations
- **Skeleton loaders** untuk better UX
- **Hover effects** dan smooth transitions
- **Consistent card layouts** dengan aligned CTAs
- **Backdrop blur effects** untuk modern glassmorphism
- **Gradient accents** menggunakan CSS variables

### ♾️ Infinite Scroll
- **Intersection Observer API** untuk lazy loading
- **Automatic pagination** saat scroll ke bottom
- **No jarring reloads** - seamless experience

---

---

## � Struktur Proyek

```
travel-article-app/
├── public/                          # Static assets
│   ├── app_icon.png                # App logo/favicon
│   └── *.svg                       # SVG icons
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                # Auth route group
│   │   │   ├── login/            # Login page
│   │   │   └── register/         # Register page
│   │   │
│   │   ├── articles/              # Articles routes
│   │   │   ├── [id]/             # Article detail (dynamic)
│   │   │   ├── create/           # Create article form
│   │   │   ├── edit/[id]/        # Edit article form (dynamic)
│   │   │   └── page.tsx          # Articles listing with filters
│   │   │
│   │   ├── favicon.ico           # Browser favicon
│   │   ├── globals.css           # Global styles & animations
│   │   ├── layout.tsx            # Root layout dengan metadata
│   │   └── page.tsx              # Landing page
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx       # Navigation bar dengan auth
│   │   │   └── Toast.tsx        # Toast notification system
│   │   │
│   │   └── ui/                   # Reusable UI components
│   │       ├── Button.tsx       # Button dengan variants
│   │       ├── Card.tsx         # Card container
│   │       ├── Input.tsx        # Input field
│   │       ├── Textarea.tsx     # Textarea field
│   │       ├── LoadingSpinner.tsx  # Spinner component
│   │       └── SkeletonCard.tsx    # Skeleton loader
│   │
│   ├── constants/
│   │   └── config.ts             # App configuration (API URL, pagination)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useArticles.ts       # Article fetching & filtering
│   │   ├── useAuth.ts           # Authentication logic
│   │   └── useToast.ts          # Toast notification manager
│   │
│   └── lib/
│       ├── api/
│       │   └── apiServices.ts   # Centralized API client
│       │
│       ├── store/                # Redux store
│       │   ├── store.ts         # Store configuration
│       │   ├── hooks.ts         # Typed Redux hooks
│       │   ├── ReduxProvider.tsx # Provider component
│       │   └── slices/
│       │       ├── authSlice.ts    # Auth state slice
│       │       └── articlesSlice.ts # Articles state slice
│       │
│       ├── types/
│       │   └── index.ts         # TypeScript type definitions
│       │
│       └── validation/
│           └── validators.ts     # Form validation helpers
│
├── .eslintrc.json                # ESLint configuration
├── eslint.config.mjs             # ESLint modern config
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation (this file)
```

---

---

## 📦 Dependencies & Packages

### Production Dependencies

```json
{
  "next": "^15.5.4",                    // Next.js framework
  "react": "^19.1.0",                   // React library
  "react-dom": "^19.1.0",               // React DOM renderer
  "react-redux": "^9.2.0",              // Redux React bindings
  "@reduxjs/toolkit": "^2.3.0",         // Redux state management
  "lucide-react": "^0.468.0"            // Icon library
}
```

### Development Dependencies

```json
{
  "typescript": "^5",                    // TypeScript compiler
  "@types/node": "^20",                 // Node.js type definitions
  "@types/react": "^19",                // React type definitions
  "@types/react-dom": "^19",            // React DOM type definitions
  "@types/react-redux": "^7.1.34",      // Redux type definitions
  "eslint": "^9",                       // Code linter
  "eslint-config-next": "^15.5.4",      // Next.js ESLint config
  "tailwindcss": "^4.0.0",              // Tailwind CSS framework
  "postcss": "^9",                      // CSS processor
  "@eslint/eslintrc": "^3"              // ESLint configuration
}
```

### Special Libraries & Tools

#### 🎨 **Custom Animation System**
- **File**: `src/app/globals.css`
- **Features**:
  - `page-transition` - Page fade-in animation (0.7s)
  - `section-appear` - Section rise animation (0.8s)
  - `floating-badge` - Floating pulse effect (4s loop)
  - Staggered delays (`section-appear-delay-1/2/3`)
  - Background drift animations

#### 🔄 **Redux Toolkit Setup**
- **Store**: `src/lib/store/store.ts`
- **Slices**: 
  - `authSlice` - User authentication state
  - `articlesSlice` - Articles data & filters
- **Typed Hooks**: `useAppDispatch`, `useAppSelector`
- **Persistence**: localStorage sync untuk auth

#### 🌐 **API Service Layer**
- **File**: `src/lib/api/apiServices.ts`
- **Features**:
  - Centralized fetch wrapper
  - JWT token auto-injection
  - Error handling dengan custom messages
  - Strapi-specific query builders
  - Image upload to `/api/upload`
  - Pagination support

#### 🎯 **Custom Hooks**
- **`useAuth`** - Authentication with localStorage persistence
- **`useArticles`** - Article fetching dengan infinite scroll
- **`useToast`** - Toast notification dengan auto-dismiss

#### 🎨 **CSS Variables Theme**
```css
--background: radial-gradient(...)    // Animated background
--accent-primary: #3b82f6           // Primary blue accent
--accent-secondary: #10b981         // Secondary green accent
--card-bg: rgba(255, 255, 255, 0.8) // Card background
--card-border: rgba(226, 232, 240, 0.6) // Card border
```

---

## 🚀 Getting Started

### Prerequisites

Pastikan sistem Anda memiliki:

- ✅ **Node.js** versi 18 LTS atau lebih tinggi
- ✅ **npm** (included dengan Node.js) atau package manager lain
- ✅ **Git** untuk clone repository
- ✅ **Akses ke Strapi backend** (URL dikonfigurasi di `src/constants/config.ts`)

### Installation

#### 1. Clone Repository

```powershell
git clone https://github.com/claudio-nehemia/travel-article-app.git
cd travel-article-app
```

#### 2. Install Dependencies

```powershell
npm install
```

Ini akan menginstall semua packages yang diperlukan dari `package.json`.

#### 3. Configure API Backend

Edit file `src/constants/config.ts`:

```typescript
export const API_BASE_URL = 'https://your-strapi-instance.com';
export const ARTICLES_PER_PAGE = 9;
```

**Alternatif dengan Environment Variables:**

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_API_URL=https://your-strapi-instance.com
```

Lalu update `config.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
```

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
```

#### 4. Run Development Server

```powershell
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

**Ports:**
- Frontend: `http://localhost:3000`
- Backend Strapi (default): `http://localhost:1337`

#### 5. Open in Browser

- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Articles List**: [http://localhost:3000/articles](http://localhost:3000/articles) (requires login)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Register**: [http://localhost:3000/register](http://localhost:3000/register)

---

## 📜 Available Scripts

### Development

```powershell
npm run dev
```
- Menjalankan development server dengan Turbopack
- Hot reload untuk perubahan code
- Optimized untuk development speed

### Production Build

```powershell
npm run build
```
- Build optimized production bundle
- Type checking dan lint validation
- Output ke folder `.next/`

### Start Production Server

```powershell
npm run start
```
- Jalankan production server dari build output
- Harus run `npm run build` terlebih dahulu

### Linting

```powershell
npm run lint
```
- Check code quality dengan ESLint
- Auto-fix minor issues
- Enforce Next.js best practices

---

## 🎯 Key Features Implementation

### 🔐 Authentication Flow

1. **Registration** (`/register`):
   ```typescript
   // Validasi client-side
   - Username (min 3 chars)
   - Email (valid format)
   - Password (min 6 chars)
   - Confirm password match
   
   // API call
   POST /api/auth/local/register
   Body: { username, email, password }
   
   // Success: Save JWT + user to Redux & localStorage
   ```

2. **Login** (`/login`):
   ```typescript
   // API call
   POST /api/auth/local
   Body: { identifier, password }
   
   // Error handling
   - 400: "Email/username atau password salah"
   - 429: "Terlalu banyak percobaan login"
   - 500: "Server sedang bermasalah"
   
   // Success: Redirect to /articles
   ```

3. **Session Persistence**:
   ```typescript
   // useAuth hook automatically:
   - Saves auth to localStorage on login
   - Restores auth on page reload
   - Clears auth on logout
   - Injects JWT token to all API calls
   ```

### 📝 Article CRUD Operations

#### Create Article

```typescript
// Form: /articles/create
1. Fill form (title, description, content, category)
2. Upload cover image (optional):
   - Paste URL OR
   - Upload file → POST /api/upload → Get URL
3. Select category from dropdown
4. Submit → POST /api/articles
5. Redirect to articles list
```

#### Read Articles

```typescript
// List: /articles
- GET /api/articles?populate[category]=*&pagination[page]=1&pagination[pageSize]=9
- Filters applied via query params:
  - Search: filters[title][$containsi]=keyword
  - Exact: filters[title][$eqi]=exact
  - Category: filters[category][name][$eqi]=category
- Infinite scroll loads next page automatically
```

#### Update Article

```typescript
// Form: /articles/edit/[id]
1. Fetch existing article → GET /api/articles/:id?populate=*
2. Pre-fill form with current data
3. Allow edits (including new image upload)
4. Submit → PUT /api/articles/:id
5. Show success toast
```

#### Delete Article

```typescript
// From articles list
1. Click delete button
2. Confirmation dialog
3. DELETE /api/articles/:id
4. Remove from UI
5. Show success toast
```

### 🔍 Advanced Filtering System

```typescript
// useArticles hook manages:
const [filters, setFilters] = useState({
  search: '',           // Keyword search (containsi)
  titleExact: '',       // Exact title match (eqi)
  categoryName: '',     // Category filter (eqi)
  sort: 'createdAt:desc', // Sort order
  page: 1               // Current page
});

// Strapi query construction:
const queryParams = [
  `populate[category]=*`,
  `pagination[page]=${filters.page}`,
  `pagination[pageSize]=9`,
  filters.search && `filters[title][$containsi]=${filters.search}`,
  filters.titleExact && `filters[title][$eqi]=${filters.titleExact}`,
  filters.categoryName && `filters[category][name][$eqi]=${filters.categoryName}`,
  `sort=${filters.sort}`
].filter(Boolean).join('&');
```

### 🎨 Toast Notification System

```typescript
// Usage in any component:
const { showToast } = useToast();

// Success toast
showToast("Article created successfully!", "success");

// Error toast
showToast("Failed to delete article", "error");

// Info toast
showToast("Loading categories...", "info");

// Features:
- Auto-dismiss after 4 seconds
- Manual close button
- Color-coded variants (green/red/blue)
- Icon indicators (CheckCircle/AlertCircle/Info)
- Smooth fade-in animation
```

### ♾️ Infinite Scroll Implementation

```typescript
// useArticles hook:
const observerTarget = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading && hasMore) {
        setFilters(prev => ({ ...prev, page: prev.page + 1 }));
      }
    },
    { threshold: 0.1 }
  );
  
  if (observerTarget.current) {
    observer.observe(observerTarget.current);
  }
  
  return () => observer.disconnect();
}, [isLoading, hasMore]);

// In component:
<div ref={observerTarget} className="h-10" />
```

---

## 🧭 Working with Articles

- **Fetching** uses `apiService.getArticles()` with `populate[category]` to ensure each article carries category metadata.
- **Filtering** is handled in `useArticles` and `articles/page.tsx`; the UI exposes search, exact-title, and category-name inputs that map directly to Strapi’s query operators.
- **Cover images** can be pasted as URLs or uploaded directly. Uploads use `apiService.uploadImage`, which stores the returned absolute URL back into the form state for preview and submission.
- **Categories** are referenced by name in the UI; IDs are resolved internally before sending create/update requests so authors never interact with raw IDs.

## 🗂️ Useful References

- **API client:** `src/lib/api/apiServices.ts`
- **Article creation form:** `src/app/articles/create/page.tsx`
- **Article edit form:** `src/app/articles/edit/[id]/page.tsx`
- **Filtering logic:** `src/hooks/useArticles.ts`
- **Type definitions:** `src/lib/types/index.ts`

## 📊 Performance Optimization

### Implemented Optimizations

✅ **Next.js Image Optimization**
- Automatic image resizing
- WebP format conversion
- Lazy loading images
- Priority loading untuk hero images

✅ **Code Splitting**
- Automatic route-based splitting
- Dynamic imports untuk heavy components
- Tree shaking untuk unused code

✅ **Caching Strategy**
- localStorage untuk auth persistence
- Redux untuk client-side state
- Strapi cache headers

✅ **Bundle Optimization**
- Turbopack untuk faster builds
- Minification di production
- CSS purging dengan Tailwind

✅ **Loading States**
- Skeleton loaders untuk better UX
- Optimistic UI updates
- Loading indicators pada buttons

### Recommended Improvements

🔄 **Future Optimizations:**

```typescript
// 1. Add React Query for better caching
npm install @tanstack/react-query

// 2. Implement service worker for offline support
// next.config.ts
const withPWA = require('next-pwa');

// 3. Add image CDN
// Use Cloudinary/Imgix for image optimization

// 4. Implement virtual scrolling
npm install react-virtual

// 5. Add error boundary
// For better error handling
```