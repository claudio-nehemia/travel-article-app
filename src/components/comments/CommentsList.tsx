import React, { useEffect, useRef } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Comment } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentsListProps {
  comments: Comment[];
  currentUserId?: number;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onCreateComment: (content: string) => Promise<void>;
  onEditComment: (commentId: string, content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  currentUserId,
  isLoading,
  hasMore,
  onLoadMore,
  onCreateComment,
  onEditComment,
  onDeleteComment
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll for comments
  useEffect(() => {
    if (!observerTarget.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center gap-3">
        <MessageCircle className="w-6 h-6 text-purple-600" />
        <h3 className="text-2xl font-bold text-gray-800">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <CommentForm
        onSubmit={onCreateComment}
        placeholder="Share your thoughts about this destination..."
        submitText="Post Comment"
      />

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
            />
          ))}

          {/* Loading More Comments */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={onLoadMore}
                className="border border-gray-200"
              >
                <Plus className="w-4 h-4" />
                Load More Comments
              </Button>
            </div>
          )}

          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="h-4" />
        </div>
      ) : (
        !isLoading && (
          <Card className="p-8 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-600">
              Be the first to share your thoughts about this destination!
            </p>
          </Card>
        )
      )}
    </div>
  );
};