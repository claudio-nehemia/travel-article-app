import { useState, useCallback } from 'react';
import { CommentState } from '@/lib/types';
import { apiService } from '@/lib/api/apiServices';

export const useComments = () => {
  const [commentState, setCommentState] = useState<CommentState>({
    comments: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null
  });

  const fetchCommentsForArticle = useCallback(async (articleId: string, page = 1, reset = false) => {
    setCommentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiService.getCommentsForArticle(articleId, page);
      
      setCommentState(prev => ({
        ...prev,
        comments: reset ? response.data : [...prev.comments, ...response.data],
        totalPages: response.meta.pagination.pageCount,
        currentPage: response.meta.pagination.page,
        isLoading: false
      }));
    } catch (error) {
      setCommentState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comments'
      }));
      throw error;
    }
  }, []);

  const createComment = useCallback(async (content: string, articleId: string) => {
    try {
      const response = await apiService.createComment({
        content,
        article: articleId
      });
      
      // Add the new comment to the beginning of the list
      setCommentState(prev => ({
        ...prev,
        comments: [response.data, ...prev.comments]
      }));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const response = await apiService.updateComment(commentId, { content });
      
      // Update the comment in the list
      setCommentState(prev => ({
        ...prev,
        comments: prev.comments.map(comment => 
          comment.documentId === commentId 
            ? { ...comment, ...response.data }
            : comment
        )
      }));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await apiService.deleteComment(commentId);
      
      // Remove the comment from the list
      setCommentState(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.documentId !== commentId)
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  const clearComments = useCallback(() => {
    setCommentState({
      comments: [],
      totalPages: 1,
      currentPage: 1,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    commentState,
    fetchCommentsForArticle,
    createComment,
    updateComment,
    deleteComment,
    clearComments
  };
};