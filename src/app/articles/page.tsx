"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  MapPin,
  Calendar,
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useArticles } from "@/hooks/useArticles";
import { useToast } from "@/hooks/useToast";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Article, Category } from "@/lib/types";
import { apiService } from "@/lib/api/apiServices";
import { Navbar } from "@/components/layout/Navbar";
import { Toast } from "@/components/layout/Toast";

export default function ArticlesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { showToast, toastMessage, toastType, hideToast } = useToast();
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  
  // Debounce search inputs to reduce API calls
  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedTitle = useDebounce(titleInput, 500);

  const {
    articleState,
    filters,
    setFilters,
    observerTarget,
    refetchArticles,
  } = useArticles(isAuthenticated && !authLoading);

  const { articles, isLoading, error } = articleState;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Show toast for errors
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);
  
  // Update filters when debounced values change
  useEffect(() => {
    if (filters.search !== debouncedSearch) {
      setFilters(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
    }
  }, [debouncedSearch, filters.search, setFilters]);
  
  useEffect(() => {
    if (filters.titleExact !== debouncedTitle) {
      setFilters(prev => ({ ...prev, titleExact: debouncedTitle, page: 1 }));
    }
  }, [debouncedTitle, filters.titleExact, setFilters]);

  const handleCategoryFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, categoryName: value, page: 1 }));
  };

  const handleSortChange = (sortValue: string) => {
    setFilters(prev => ({ ...prev, sort: sortValue, page: 1 }));
  };
  
  // Use cached categories hook instead of manual fetching
  const { categories: categoryFilters, isLoading: isLoadingCategories, error: categoryError } = useCategories();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Show category load errors
  useEffect(() => {
    if (categoryError) {
      showToast(categoryError, "error");
    }
  }, [categoryError, showToast]);


  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      setDeletingId(id);
      await apiService.deleteArticle(id);
      showToast("Article deleted successfully!", "success");
      await refetchArticles();
    } catch (error) {
      console.error("Failed to delete article", error);
      showToast("Failed to delete article", "error");
    } finally {
      setDeletingId(null);
    }
  };
  
  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    router.push(path);
  };

  if (authLoading) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="page-shell page-transition bg-[var(--background)] text-slate-900 min-h-screen">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={logout}
        variant="translucent"
      />

      <div className="section-appear max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Header with Decorative Elements */}
        <div className="mb-12 relative">
          {/* Decorative blur circles */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-[var(--accent-secondary)]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative space-y-6 text-center">
            <div className="floating-badge inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-600 shadow-lg shadow-slate-200/50 border border-white/60">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              Destinations
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight">
              Travel{" "}
              <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                Destinations
              </span>
            </h2>
            
            <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-light">
              Discover breathtaking places and create unforgettable memories around the globe
            </p>
          </div>
        </div>

        {/* Modern Filter Cards */}
        <div className="section-appear section-appear-delay-1 mb-10">
          <Card className="p-6 md:p-8 backdrop-blur-xl bg-white/70 border-white/60 shadow-xl shadow-slate-200/50">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {/* Search Input */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200/60 bg-white/90 backdrop-blur text-slate-900 placeholder:text-slate-400 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-200"
                />
              </div>

              {/* Exact Title Input */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Exact title search..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200/60 bg-white/90 backdrop-blur text-slate-900 placeholder:text-slate-400 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-200"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors z-10 pointer-events-none">
                  <Filter className="w-5 h-5" />
                </div>
                <select
                  value={filters.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full appearance-none cursor-pointer rounded-2xl border-2 border-slate-200/60 bg-white/90 backdrop-blur pl-12 pr-12 py-3.5 text-slate-900 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-200"
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="createdAt:asc">Oldest First</option>
                  <option value="title:asc">Title A-Z</option>
                  <option value="title:desc">Title Z-A</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Category Dropdown */}
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors z-10 pointer-events-none">
                  <Filter className="w-5 h-5" />
                </div>
                <select
                  value={filters.categoryName}
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  className="w-full appearance-none cursor-pointer rounded-2xl border-2 border-slate-200/60 bg-white/90 backdrop-blur pl-12 pr-12 py-3.5 text-slate-900 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-200"
                  disabled={isLoadingCategories}
                >
                  <option value="">{isLoadingCategories ? "Loading..." : "All categories"}</option>
                  {categoryFilters.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <Card className="section-appear section-appear-delay-2 p-6 mb-8 bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 backdrop-blur-xl">
            <p className="text-red-700 text-center font-medium">{error}</p>
          </Card>
        )}

        {/* Articles Grid with Enhanced Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {articles.map((article: Article, index) => {
            const delayClass = [
              "",
              "section-appear-delay-1",
              "section-appear-delay-2",
              "section-appear-delay-3",
            ][index % 4];

            return (
              <Card 
                key={article.id} 
                hover 
                className={`section-appear overflow-hidden group backdrop-blur-xl bg-white/80 border-white/60 shadow-lg hover:shadow-2xl shadow-slate-200/50 transition-all duration-500 ${delayClass}`}
              >
                {/* Image Container with Overlay Effects */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {article.cover_image_url ? (
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : article.image?.url ? (
                    <img
                      src={article.image.url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
                      <Camera className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-bold text-[var(--accent-primary)] shadow-lg shadow-slate-900/10 border border-white/40 group-hover:scale-105 transition-transform">
                    <MapPin className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    {article.category?.name || "Destination"}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-6 space-y-4">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    {article.author && (
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{article.author.username}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      className="flex-1 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleNavigate(`/articles/${article.documentId}`)}
                      isLoading={isNavigating}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleNavigate(`/articles/edit/${article.documentId}`)}
                      isLoading={isNavigating}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      className="px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleDeleteArticle(article.documentId)}
                      isLoading={deletingId === article.documentId}
                      disabled={deletingId !== null && deletingId !== article.documentId}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {isLoading && articles.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Loading */}
        {isLoading && articles.length > 0 && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-4" />

        {/* No Results - Enhanced Empty State */}
        {!isLoading && articles.length === 0 && (
          <Card className="section-appear section-appear-delay-2 p-12 md:p-16 text-center backdrop-blur-xl bg-white/70 border-white/60 shadow-xl">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-full blur-2xl" />
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-6 inline-block">
                  <MapPin className="w-16 h-16 text-slate-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-slate-900">
                  No destinations found
                </h3>
                <p className="text-slate-600 text-lg">
                  Try adjusting your search filters or create your first destination article
                </p>
              </div>
              
              <Button
                variant="primary"
                className="mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-semibold px-8 py-3"
                onClick={() => handleNavigate("/articles/create")}
                isLoading={isNavigating}
              >
                <Plus className="w-5 h-5" />
                Create First Article
              </Button>
            </div>
          </Card>
        )}
      </div>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={hideToast} />}
    </div>
  );
}