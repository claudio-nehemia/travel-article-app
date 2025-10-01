import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitText?: string;
  isEditing?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Write your comment...',
  submitText = 'Post Comment',
  isEditing = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length < 3) {
      setError('Comment must be at least 3 characters long');
      return;
    }

    if (content.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSubmit(content.trim());
      if (!isEditing) {
        setContent('');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit comment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={4}
            error={error}
            disabled={isLoading}
            className="resize-none"
          />
          <div className="mt-1 text-xs text-gray-500 text-right">
            {content.length}/1000 characters
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Share your thoughts about this destination
          </div>
          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={!content.trim()}
              isLoading={isLoading}
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Posting...' : submitText}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};