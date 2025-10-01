"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Camera,
  Calendar,
  Clock,
  Compass,
  MapPin,
  Plane,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/lib/api/apiServices";

const heroImageUrl =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80";

type LandingArticle = {
  id: number | string;
  documentId: string;
  title: string;
  description: string;
  coverImage: string | null;
  createdAt: string;
  category: string | null;
};

type ArticleApiImage = {
  url?: string;
  data?: {
    attributes?: {
      url?: string;
    };
  };
};

type ArticleApiCategory = {
  name?: string;
  data?: {
    attributes?: {
      name?: string;
    };
  };
};

type ArticleApiAttributes = {
  documentId?: string;
  title?: string;
  description?: string;
  excerpt?: string;
  cover_image_url?: string;
  createdAt?: string;
  category?: ArticleApiCategory;
  image?: ArticleApiImage;
};

type ArticleApiEntity = {
  id?: number | string;
  documentId?: string;
  attributes?: ArticleApiAttributes;
  cover_image_url?: string;
  image?: ArticleApiImage;
  category?: ArticleApiCategory;
};

type FeatureHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type DiscoveryFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

type ExplorationTheme = {
  title: string;
  description: string;
  accent: string;
};

type CommunityStat = {
  label: string;
  icon: LucideIcon;
};

const heroHighlights: Array<{ title: string; description: string }> = [
  {
    title: "Tailor-made itineraries",
    description: "Build journeys from stories that match your vibe.",
  },
  {
    title: "Insider recommendations",
    description: "Tips from travelers who just returned.",
  },
  {
    title: "Plan together",
    description: "Collect favorite spots and share them with friends.",
  },
];

const featureHighlights: FeatureHighlight[] = [
  {
    title: "Destination guides",
    description:
      "Curated itineraries with practical tips for every season and travel style.",
    icon: Compass,
  },
  {
    title: "Local stories",
    description:
      "Authentic experiences shared by our community of explorers worldwide.",
    icon: Camera,
  },
  {
    title: "Travel smarter",
    description:
      "Plan with checklists, best-time-to-go insights, and budget snapshots.",
    icon: Clock,
  },
  {
    title: "Community-first",
    description:
      "Save highlights, follow creators you love, and get notified when new trips drop.",
    icon: Users,
  },
];

const discoveryFeatures: DiscoveryFeature[] = [
  {
    title: "Interactive city breakdowns",
    description:
      "Navigate each neighborhood with must-see spots, local cafés, and hidden gems.",
    icon: Compass,
    accent: "from-emerald-400/70 via-teal-300/70 to-sky-400/70",
  },
  {
    title: "Photo-first storytelling",
    description:
      "Swipe through photo essays that capture the vibe before you even pack.",
    icon: Camera,
    accent: "from-amber-300/80 via-orange-300/70 to-rose-300/70",
  },
  {
    title: "Seamless trip planner",
    description:
      "Smart suggestions to organize your itinerary, bookings, and must-visit spots in one place.",
    icon: MapPin,
    accent: "from-emerald-300/70 via-teal-300/70 to-cyan-300/70",
  },
];

const explorationThemes: ExplorationTheme[] = [
  {
    title: "Slow mornings & café hopping",
    description:
      "Find tranquil neighborhoods, scenic brunch spots, and the perfect midday stroll.",
    accent: "from-sky-100 via-slate-50 to-emerald-100",
  },
  {
    title: "Adventures after sunset",
    description:
      "Plan nightlife routes, safe transport, and night markets brimming with flavor.",
    accent: "from-fuchsia-100 via-rose-50 to-amber-100",
  },
  {
    title: "Soulful solo escapes",
    description:
      "Discover retreats, mindful hikes, and community stays built for solo wanderers.",
    accent: "from-violet-100 via-indigo-50 to-blue-100",
  },
];

const communityStats: CommunityStat[] = [
  {
    label: "Travelers planning now",
    icon: Users,
  },
  {
    label: "Curated guides",
    icon: BookOpen,
  },
  {
    label: "Itinerary builder",
    icon: Sparkles,
  },
  {
    label: "Share-worthy photos",
    icon: Clock,
  },
];

const pickFirstValue = (
  ...values: Array<string | number | null | undefined>
): string | null => {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const stringified = String(value).trim();
    if (stringified.length > 0) return stringified;
  }
  return null;
};

const normalizeArticle = (raw: ArticleApiEntity): LandingArticle => {
  const attributes: ArticleApiAttributes = raw?.attributes ?? {};
  const documentId =
    pickFirstValue(attributes.documentId, raw?.documentId, raw?.id) ?? "";

  const title = pickFirstValue(attributes.title) ?? "Cerita perjalanan terbaru";

  const description =
    pickFirstValue(attributes.description, attributes.excerpt) ??
    "Highlight perjalanan singkat dari komunitas kami.";

  const imageUrl = pickFirstValue(
    attributes.cover_image_url,
    attributes.image?.data?.attributes?.url,
    raw?.cover_image_url,
    raw?.image?.data?.attributes?.url,
    raw?.image?.url
  );

  const category =
    pickFirstValue(
      attributes.category?.data?.attributes?.name,
      attributes.category?.name,
      raw?.category?.data?.attributes?.name
    ) ?? null;

  const createdAt =
    pickFirstValue(attributes.createdAt) ?? new Date().toISOString();

  return {
    id: raw?.id ?? documentId,
    documentId,
    title,
    description,
    coverImage: imageUrl ? apiService.resolveMediaUrl(imageUrl) : null,
    createdAt,
    category,
  };
};

const formatDateParts = (
  value: string
): { date: string; time: string | null } => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return {
      date: "Tanggal tidak diketahui",
      time: null,
    };
  }

  return {
    date: date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [latestArticles, setLatestArticles] = useState<LandingArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestArticles = async () => {
      try {
        setArticlesError(null);
        setArticlesLoading(true);
        const response = await apiService.getArticles({ page: 1 });
        const entries: ArticleApiEntity[] = Array.isArray(response?.data)
          ? response.data
          : [];

        const normalized = entries
          .map(normalizeArticle)
          .filter((article) => article.documentId && article.title)
          .slice(0, 6);

        if (isMounted) {
          setLatestArticles(normalized);
        }
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat artikel.";
        setArticlesError(message);
      } finally {
        if (isMounted) {
          setArticlesLoading(false);
        }
      }
    };

    fetchLatestArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  const primaryCta = isAuthenticated
    ? {
        label: "Buka dasbor",
        action: () => router.push("/dashboard"),
      }
    : {
        label: "Mulai rencanakan",
        action: () => router.push("/register"),
      };

  const secondaryCta = {
    label: "Lihat destinasi terbaru",
    action: () => router.push("/articles"),
  };

  return (
    <div className="page-shell page-transition bg-[var(--background)] text-slate-900">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        variant="translucent"
      />

      <main className="flex flex-col gap-20">
        <section className="section-appear px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative h-[440px] overflow-hidden rounded-[32px] shadow-lg shadow-slate-900/10 pb-8">
              <Image
                src={heroImageUrl}
                alt="Scenic coastal destination"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-8 text-white sm:p-12 lg:p-16">
                <div className="max-w-xl space-y-5">
                  <span className="floating-badge inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em]">
                    Discover
                  </span>
                  <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                    Explore the world at your own pace
                  </h1>
                  <p className="text-base text-white/80 sm:text-lg">
                    Temukan panduan destinasi, cerita lokal, dan tips perjalanan
                    profesional dalam satu tempat yang rapi dan mudah
                    dinavigasi. Simpan favoritmu dan rancang petualangan
                    berikutnya tanpa ribet.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
                    <Button
                      variant="primary"
                      className="px-6 py-3 text-base"
                      onClick={primaryCta.action}
                    >
                      {primaryCta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-6 py-3 text-base text-white hover:bg-white/15"
                      onClick={secondaryCta.action}
                    >
                      {secondaryCta.label}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
                  {heroHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-white/70">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-appear section-appear-delay-1 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-10">
            <header className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Destinations
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 md:text-4xl">
                  Cerita terbaru dari komunitas
                </h2>
                <p className="mt-2 max-w-2xl text-base text-slate-600">
                  Baca highlight perjalanan terbaru—setiap artikel dikurasi
                  dengan foto autentik, tips praktis, dan insight kapan waktu
                  terbaik untuk pergi.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push("/articles")}
              >
                Telusuri semua artikel
              </Button>
            </header>

            {articlesError && (
              <Card className="border-red-200 bg-red-50/80 p-6 text-red-700">
                {articlesError}
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articlesLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={`skeleton-${index}`}
                    className="h-full animate-pulse bg-white/70 p-6"
                  >
                    <div className="mb-4 h-48 w-full rounded-2xl bg-slate-200/70" />
                    <div className="mb-2 h-6 w-3/4 rounded bg-slate-200/80" />
                    <div className="h-4 w-2/3 rounded bg-slate-200/60" />
                  </Card>
                ))}

              {!articlesLoading &&
                latestArticles.length === 0 &&
                !articlesError && (
                  <Card className="p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      <Camera className="h-8 w-8" />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                      Belum ada cerita terbaru
                    </h3>
                    <p className="mt-3 text-slate-600">
                      Jadilah yang pertama menulis pengalamanmu dan bantu
                      traveler lain merencanakan petualangan mereka.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => router.push("/register")}
                    >
                      Bagikan perjalananmu
                    </Button>
                  </Card>
                )}

              {!articlesLoading &&
                latestArticles.map((article, index) => {
                  const { date, time } = formatDateParts(article.createdAt);
                  const delayClass = [
                    "",
                    "section-appear-delay-1",
                    "section-appear-delay-2",
                    "section-appear-delay-3",
                  ][index % 4];

                  return (
                    <Card
                      key={article.documentId}
                      hover
                      className={`section-appear flex h-full flex-col overflow-hidden ${delayClass}`}
                    >
                      <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                        {article.coverImage ? (
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                            <Camera className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-3">
                          <MapPin className="h-4 w-4" />
                          {article.category || "Travel"}
                        </div>
                        <div className="flex-1 flex flex-col space-y-2">
                          <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 min-h-[56px]">
                            {article.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-3 min-h-[63px]">
                            {article.description}
                          </p>
                        </div>
                        <div className="mt-auto space-y-3 pt-4">
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span>{date}</span>
                            {time && (
                              <div className="flex items-center gap-1 text-slate-400">
                                <Calendar className="h-4 w-4" />
                                <span>{time}</span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="primary"
                            className="w-full justify-between px-4 py-2 text-xs"
                            onClick={() =>
                              router.push(`/articles/${article.documentId}`)
                            }
                          >
                            Baca cerita
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        </section>

        <section className="section-appear section-appear-delay-2 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Card className="flex flex-col gap-12 bg-white/85 p-10 lg:flex-row">
              <div className="flex-1 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Why travelers love us
                </p>
                <h2 className="text-3xl font-semibold text-slate-900">
                  Rencanakan perjalanan dengan panduan yang tenang dan rapi
                </h2>
                <p className="text-base text-slate-600">
                  Kami merapikan konten menjadi highlight penting: kapan harus
                  pergi, apa yang harus dicoba, dan tips lokal yang biasanya
                  cuma diketahui warga sekitar. Semua tersaji dalam tampilan
                  grid yang ringan dan mudah dibaca.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                    Filter berdasar musim
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                    Simpan artikel favorit
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-4 py-2">
                    Map & checklist otomatis
                  </span>
                </div>
              </div>

              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                {featureHighlights.map((feature) => (
                  <Card key={feature.title} className="h-full bg-white p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="section-appear section-appear-delay-3 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Everything you need for effortless exploration
            </h2>
            <p className="mt-4 max-w-3xl text-base text-slate-600">
              Plan smarter with curated stories, destination deep dives, and
              collaborative tools designed untuk traveler yang mengutamakan
              keaslian pengalaman.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {discoveryFeatures.map((feature) => (
                <Card
                  key={feature.title}
                  hover
                  className="group h-full p-8 border border-white/60 bg-white/90 backdrop-blur-sm"
                >
                  <div
                    className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${feature.accent} text-white p-4 shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105`}
                  >
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-slate-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-appear section-appear-delay-2 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                  Bangun perjalanan berdasarkan hal yang paling menginspirasimu
                </h2>
                <p className="mt-4 text-slate-600">
                  Ubah ide menjadi liburan nyata. Mulai dari tema kurasi,
                  padukan tips komunitas, lalu bagikan dengan kru perjalananmu.
                </p>

                <div className="mt-8 space-y-4">
                  {explorationThemes.map((theme) => (
                    <Card
                      key={theme.title}
                      className={`p-6 border border-white/60 bg-gradient-to-r ${theme.accent} backdrop-blur-sm`}
                    >
                      <h3 className="text-xl font-semibold text-slate-900">
                        {theme.title}
                      </h3>
                      <p className="mt-2 text-slate-600">{theme.description}</p>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Button onClick={() => router.push("/register")}>
                    Buat papan perjalanan
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(isAuthenticated ? "/articles" : "/login")
                    }
                  >
                    {isAuthenticated
                      ? "Telusuri inspirasi baru"
                      : "Sudah punya akun? Masuk"}
                  </Button>
                </div>
              </div>

              <div>
                <Card className="border border-white/60 bg-white/90 p-6 shadow-xl shadow-purple-400/10 lg:p-8">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Timeline traveler sungguhan
                  </h3>
                  <p className="mt-2 text-slate-600">
                    Lihat bagaimana komunitas kami mengatur waktu, mengelola
                    budget, dan memaksimalkan setiap perhentian.
                  </p>

                  <div className="mt-6 space-y-5">
                    {[
                      "Morning markets in Marrakech",
                      "Scenic rail from Lucerne",
                      "Night kayaking in Phuket",
                    ].map((item, index) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item}</p>
                          <p className="text-sm text-slate-500">
                            Rekomendasi waktu kunjungan, insight budget, dan
                            spot foto terbaik dari para kontributor.
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/register")}
                    className="mt-6 inline-flex items-center gap-2 text-[var(--accent-primary)] font-semibold transition-all hover:gap-3"
                  >
                    Buka itinerary lengkap
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="section-appear bg-gradient-to-r rounded-3xl px-15 from-[var(--accent-primary)] via-[var(--accent-secondary)] to-sky-500 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Powered by explorers like you
                </h2>
                <p className="mt-3 max-w-2xl text-white/80">
                  Komunitas kami berbagi cerita jujur, tips terverifikasi, dan
                  highlight yang membantu setiap traveler merasa siap.
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-[var(--accent-primary)] hover:opacity-90"
                onClick={() => router.push("/register")}
              >
                Jadi kontributor
              </Button>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {communityStats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border border-white/30 bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                    <stat.icon className="h-5 w-5" />
                    {stat.label}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-appear bg-slate-900 text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Plane className="h-4 w-4" />
              Cerita berikutnya dimulai di sini
            </div>
            <h2 className="mt-6 text-3xl font-semibold md:text-4xl">
              Siap memetakan pelarian sempurnamu?
            </h2>
            <p className="mt-3 text-white/70">
              TravelExplore menjaga semuanya tetap rapi—dari wish list hingga
              packing list—agar kamu bisa fokus menciptakan memori terbaik.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="primary"
                className="px-8 py-4 text-lg"
                onClick={() =>
                  router.push(
                    isAuthenticated ? "/articles/create" : "/register"
                  )
                }
              >
                {isAuthenticated
                  ? "Tulis artikel pertamamu"
                  : "Buat akun gratis"}
              </Button>
              <Button
                variant="ghost"
                className="px-8 py-4 text-lg border border-white/20 text-white hover:bg-white/10"
                onClick={() =>
                  router.push(isAuthenticated ? "/articles" : "/login")
                }
              >
                {isAuthenticated
                  ? "Telusuri artikel komunitas"
                  : "Saya sudah punya akun"}
              </Button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                TravelExplore © {new Date().getFullYear()} — Crafted for modern
                explorers.
              </div>
              <p>
                Discover destinations, record your adventures, and inspire a
                global community of travelers.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
