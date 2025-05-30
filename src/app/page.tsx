
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2, Flag, Award } from 'lucide-react';
import { mockFeedPosts as initialMockFeedPosts } from '@/lib/mockData';
import type { FeedPost } from '@/types';
import { formatDistanceToNow } from 'date-fns';
// CreatePostForm import removed
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function FeedPostCard({ post }: { post: FeedPost }) {
  return (
    <Card className="mb-6 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Avatar>
          <AvatarImage src={post.candidateImageUrl} alt={post.candidateName} data-ai-hint={post.dataAiHintCandidate || "person face"} />
          <AvatarFallback>{post.candidateName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold flex items-center">
            {post.candidateName}
            {post.candidateParty && <Award className="ml-2 h-4 w-4 text-yellow-500" />}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {post.candidateRole || 'Community Member'} &bull; {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>
        {post.postImageUrl && (
          <div className="rounded-md overflow-hidden border">
            <Image
              src={post.postImageUrl}
              alt="Post image"
              width={600}
              height={400}
              className="object-cover w-full"
              data-ai-hint={post.dataAiHintPost || "social media image"}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-around p-2 border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <ThumbsUp className="h-5 w-5" />
                <span className="sr-only">Like</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Like ({post.likes})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="h-5 w-5" />
                <span className="sr-only">Comment</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Comment ({post.comments})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share ({post.shares})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Flag className="h-5 w-5" />
                <span className="sr-only">Report</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(initialMockFeedPosts);

  // This function will be passed to CreateMenu, then to CreatePostForm
  const handleCreatePost = (newPost: FeedPost) => {
    setFeedPosts(prevPosts => [newPost, ...prevPosts]);
  };

  // The CreatePostForm is no longer rendered directly here.
  // It will be part of the CreateMenu component triggered from the sidebar.
  // We need to pass `handleCreatePost` to the `AppLayout` or a shared context later if CreateMenu is high up,
  // or make `CreateMenu` a child here if it's simpler. For now, it's in LeftSidebarNav.
  // The actual `handleCreatePost` logic might need to be lifted or passed differently.
  // For this iteration, `CreatePostForm`'s `onSubmitSuccess` will call this if passed down.

  return (
    <div className="max-w-2xl mx-auto">
      {/* CreatePostForm removed from here */}
      <h1 className="text-2xl font-bold mb-6 mt-8">Live Feed</h1>
      {feedPosts.length === 0 && <p className="text-muted-foreground text-center py-4">No posts yet. Be the first to share something!</p>}
      {feedPosts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
