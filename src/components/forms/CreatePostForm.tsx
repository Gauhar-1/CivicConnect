
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import type { FeedPost } from '@/types';

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty.').max(1000, 'Post content is too long.'),
  postImageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

interface CreatePostFormProps {
  onSubmitSuccess: (newPost: FeedPost) => void;
}

export function CreatePostForm({ onSubmitSuccess }: CreatePostFormProps) {
  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      postImageUrl: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  const processSubmit: SubmitHandler<CreatePostFormData> = async (data) => {
    // In a real app, this would call a server action.
    // For now, we simulate and update client-side.
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      candidateName: 'Current User (Anonymous)', // Placeholder as login is disabled
      candidateImageUrl: 'https://placehold.co/40x40.png?text=CU',
      dataAiHintCandidate: 'person face',
      timestamp: new Date().toISOString(),
      content: data.content,
      postImageUrl: data.postImageUrl || undefined,
      dataAiHintPost: data.postImageUrl ? 'user uploaded image' : undefined,
      likes: 0,
      comments: 0,
      shares: 0,
    };
    onSubmitSuccess(newPost);
    reset();
  };

  return (
    <Card className="mb-6 shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg">Create a New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="postContent">What's on your mind?</Label>
            <Textarea
              id="postContent"
              {...register('content')}
              placeholder="Share an update, news, or an announcement..."
              className="min-h-[100px]"
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <Label htmlFor="postImageUrl">Image URL (Optional)</Label>
            <Input
              id="postImageUrl"
              {...register('postImageUrl')}
              type="url"
              placeholder="https://example.com/image.png"
            />
            {errors.postImageUrl && <p className="text-sm text-destructive mt-1">{errors.postImageUrl.message}</p>}
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Posting...' : 'Create Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
