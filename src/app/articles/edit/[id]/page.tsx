"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit, Loader2 } from "lucide-react";
import { validateTitle, validateDescription } from "@/lib/validation/validators";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { Article, Category } from "@/lib/types";
import { apiService } from "@/lib/api/apiServices";

type CategoryApiEntity = {
  id?: number;
  attributes?: {
    id?: number;
    name?: string;
  };
  name?: string;
};

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { showToast } = useToast();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImageUrl: "",
    categoryName: ""
  });
  const [errors, setErrors] = useState({ 
    title: "", 
    description: "",
    coverImageUrl: "",
    categoryName: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  
  // Use cached categories hook
  const { categories, isLoading: isLoadingCategories, error: categoryError } = useCategories();
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const articleId = params.id as string;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);
  
  // Show category load errors
  useEffect(() => {
    if (categoryError) {
      showToast(categoryError, "error");
    }
  }, [categoryError, showToast]);

  // Fetch article details
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId || !isAuthenticated) return;

      try {
        setIsLoadingArticle(true);
        const response = await apiService.getArticleById(articleId);
        const articleData = response.data;
        setArticle(articleData);

        const coverUrl = articleData.cover_image_url
          ? apiService.resolveMediaUrl(articleData.cover_image_url)
          : "";

        setFormData({
          title: articleData.title,
          description: articleData.description,
          coverImageUrl: coverUrl,
          categoryName: articleData.category?.name ?? ""
        });
      } catch (error) {
        console.error("Failed to load article details", error);
        const message = error instanceof Error 
          ? error.message 
          : "Gagal memuat detail artikel.";
        showToast(message);
        router.push("/articles");
      } finally {
        setIsLoadingArticle(false);
      }
    };

    if (!authLoading) {
      fetchArticle();
    }
  }, [articleId, authLoading, isAuthenticated, router, showToast]);

  const handleCoverImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const response = await apiService.uploadImage(file);
      const uploadedUrl = apiService.extractUploadUrl(response);

      if (!uploadedUrl) {
        throw new Error("Upload response missing URL");
      }

      setFormData(prev => ({ ...prev, coverImageUrl: uploadedUrl }));
      setErrors(prev => ({ ...prev, coverImageUrl: "" }));
      showToast("Gambar berhasil diunggah ✓");
    } catch (error) {
      console.error("Failed to upload cover image", error);
      const message = error instanceof Error 
        ? error.message 
        : "Gagal mengunggah gambar. Silakan coba lagi.";
      showToast(message);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void handleCoverImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!article) return;

    const titleError = validateTitle(formData.title);
    const descriptionError = validateDescription(formData.description);
    const coverImageError = formData.coverImageUrl ? "" : "Cover image URL is required";
    const categoryError = formData.categoryName ? "" : "Category is required";

    if (titleError || descriptionError || coverImageError || categoryError) {
      setErrors({
        title: titleError || "",
        description: descriptionError || "",
        coverImageUrl: coverImageError || "",
        categoryName: categoryError || "",
      });
      return;
    }

    const selectedCategory = categories.find(category => category.name === formData.categoryName);

    if (!selectedCategory) {
      setErrors(prev => ({ ...prev, categoryName: "Please select a valid category" }));
      return;
    }

    setErrors({ title: "", description: "", coverImageUrl: "", categoryName: "" });
    setIsLoading(true);
    try {
      await apiService.updateArticle(article.documentId, {
        title: formData.title,
        description: formData.description,
        cover_image_url: formData.coverImageUrl,
        category: selectedCategory.id
      });
      showToast("Artikel berhasil diperbarui! ✓");
      router.push("/articles");
    } catch (error) {
      console.error("Failed to update article", error);
      const message = error instanceof Error 
        ? error.message 
        : "Gagal memperbarui artikel. Silakan coba lagi.";
      showToast(message);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoadingArticle) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center bg-[var(--background)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-shell flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Card className="section-appear p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h2>
          <Button onClick={() => router.push("/articles")}>
            Back to Articles
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell page-transition bg-[var(--background)] text-slate-900">
      <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={logout} variant="translucent" />

      <div className="section-appear max-w-3xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/articles")}
          className="mb-6"
        >
          ← Back to Destinations
        </Button>

        <Card className="section-appear section-appear-delay-1 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full mb-4 floating-badge">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Edit Article</h2>
            <p className="text-gray-600 mt-2">Update your travel story</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Title
              </label>
              <Input
                type="text"
                placeholder="Enter article title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={errors.title}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/your-image.jpg"
                value={formData.coverImageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, coverImageUrl: e.target.value })
                }
                error={errors.coverImageUrl}
              />
              {formData.coverImageUrl && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img
                    src={formData.coverImageUrl}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Or Upload Cover Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isUploadingImage}
              />
              <p className="text-xs text-gray-500 mt-2">
                Accepted formats: JPG, PNG, GIF. Max size depends on server configuration.
              </p>
              {isUploadingImage && (
                <div className="flex items-center gap-2 text-sm text-purple-600 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading image...
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Enter article description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                error={errors.description}
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.categoryName ? 'border-red-500' : 'border-gray-200'
                }`}
                disabled={isLoadingCategories}
              >
                <option value="" disabled>
                  {isLoadingCategories ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryName && (
                <p className="mt-2 text-sm text-red-600">{errors.categoryName}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoadingCategories || isUploadingImage}
                isLoading={isLoading}
                className="flex-1"
              >
                {isLoading ? "Updating..." : "Update Article"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/articles")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}