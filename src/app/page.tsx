'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2, Flag, Award } from 'lucide-react';
import { mockFeedPosts } from '@/lib/mockData';
import type { FeedPost } from '@/types';
import { formatDistanceToNow } from 'date-fns';

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
            {post.candidateRole} &bull; {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
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
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <ThumbsUp className="mr-2 h-4 w-4" /> Like ({post.likes})
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <MessageCircle className="mr-2 h-4 w-4" /> Comment ({post.comments})
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <Share2 className="mr-2 h-4 w-4" /> Share ({post.shares})
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="mr-2 h-4 w-4" /> Report
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Live Feed</h1>
      {mockFeedPosts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
