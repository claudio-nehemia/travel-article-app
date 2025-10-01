"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Camera,
  Calendar,
  User,
  MapPin,
  Share2,
  Edit,
  Trash2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useComments } from "@/hooks/useComments";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Navbar } from "@/components/layout/Navbar";
import { CommentsList } from "@/components/comments";
import { Article } from "@/lib/types";
import { apiService } from "@/lib/api/apiServices";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { showToast } = useToast();
  const {
    commentState,
    fetchCommentsForArticle,
    createComment,
    updateComment,
    deleteComment,
    clearComments
  } = useComments();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const articleId = params.id as string;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch article details
  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId || !isAuthenticated) return;

      try {
        setIsLoading(true);
        const response = await apiService.getArticleById(articleId);
        setArticle(response.data);
        
        // Fetch comments for this article
        await fetchCommentsForArticle(articleId, 1, true);
      } catch (error) {
        console.error("Failed to load article details", error);
        showToast("Failed to load article details");
        router.push("/articles");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchArticle();
    }
  }, [articleId, authLoading, isAuthenticated, fetchCommentsForArticle, router, showToast]);

  // Clear comments when component unmounts or article changes
  useEffect(() => {
    return () => {
      clearComments();
    };
  }, [articleId, clearComments]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = (platform: string) => {
    if (!article) return;
    
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(article.title);

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Link copied to clipboard!");
  };

  const handleDeleteArticle = async () => {
    if (!article || !window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      setIsDeleting(true);
      await apiService.deleteArticle(article.documentId);
      showToast("Article deleted successfully!");
      router.push("/articles");
    } catch (error) {
      console.error("Failed to delete article", error);
      showToast("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  // Comment handlers
  const handleCreateComment = async (content: string) => {
    if (!article) return;
    
    try {
      await createComment(content, article.documentId);
      showToast("Comment posted successfully!");
    } catch (error) {
      showToast("Failed to post comment");
      throw error;
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      showToast("Comment updated successfully!");
    } catch (error) {
      showToast("Failed to update comment");
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      showToast("Comment deleted successfully!");
    } catch (error) {
      showToast("Failed to delete comment");
      throw error;
    }
  };

  const handleLoadMoreComments = () => {
    if (!article) return;
    fetchCommentsForArticle(
      article.documentId, 
      commentState.currentPage + 1, 
      false
    );
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

  if (isLoading) {
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

      <div className="section-appear max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/articles")}
          className="mb-6"
        >
          ← Back to Destinations
        </Button>

  <Card className="section-appear section-appear-delay-1 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 bg-gradient-to-br from-purple-200 to-pink-200">
            {article.cover_image_url ? (
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : article.image?.url ? (
              <img
                src={article.image.url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="w-32 h-32 text-purple-400" />
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title and Meta */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(article.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {article.author.username}
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Travel Destination
              </div>
            </div>

            {/* Share Buttons */}
            <div className="section-appear section-appear-delay-2 bg-white/80 rounded-xl p-6 mb-8 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share this destination
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleShare("facebook")}
                  className="flex-1 min-w-[120px]"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleShare("twitter")}
                  className="flex-1 min-w-[120px]"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleShare("linkedin")}
                  className="flex-1 min-w-[120px]"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="flex-1 min-w-[120px]"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About this destination
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {article.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t">
              <Button
                variant="secondary"
                onClick={() => router.push(`/articles/edit/${article.documentId}`)}
                className="flex-1"
                disabled={isDeleting}
              >
                <Edit className="w-4 h-4" />
                Edit Article
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteArticle}
                className="flex-1"
                isLoading={isDeleting}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                Delete Article
              </Button>
            </div>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentsList
            comments={commentState.comments}
            currentUserId={user?.id}
            isLoading={commentState.isLoading}
            hasMore={commentState.currentPage < commentState.totalPages}
            onLoadMore={handleLoadMoreComments}
            onCreateComment={handleCreateComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}