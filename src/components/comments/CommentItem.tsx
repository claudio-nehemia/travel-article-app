import React, { useState } from 'react';
import { Edit, Trash2, User, Calendar, MoreHorizontal } from 'lucide-react';
import { Comment } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwner = currentUserId === comment.user?.id;

  const handleEdit = async (content: string) => {
    await onEdit(comment.documentId, content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await onDelete(comment.documentId);
    }
  };

  if (isEditing) {
    return (
      <CommentForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        initialValue={comment.content}
        submitText="Update Comment"
        isEditing={true}
      />
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">
              {comment.user?.username || 'Anonymous'}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setShowActions(!showActions)}
              className="p-2"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {comment.content}
      </div>

      {comment.updatedAt !== comment.createdAt && (
        <div className="mt-3 text-xs text-gray-400">
          Edited {new Date(comment.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </Card>
  );
};