
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp, MessageCircle, Share2, Flag, Award,
  Edit3, BarChart2, Search as CampaignIcon, Video as VideoIcon, PlusCircle
} from 'lucide-react';
import { mockFeedPosts as initialMockFeedPosts } from '@/lib/mockData';
import type { FeedItem, TextPostFeedItem, ImagePostFeedItem, VideoPostFeedItem, CampaignFeedItem, PollFeedItem, Campaign, Poll, OldFeedPost } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreatePostForm } from '@/components/forms/CreatePostForm';
import { CreateCampaignForm } from '@/components/forms/CreateCampaignForm';
import { CreatePollForm } from '@/components/forms/CreatePollForm';
import { CreateVideoForm } from '@/components/forms/CreateVideoForm'; // New form
import { Separator } from '@/components/ui/separator';


function FeedItemCard({ item }: { item: FeedItem }) {
  const renderMedia = () => {
    if (item.itemType === 'image_post' && item.mediaUrl) {
      return (
        <div className="rounded-md overflow-hidden border aspect-video relative">
          <Image
            src={item.mediaUrl}
            alt="Post image"
            layout="fill"
            objectFit="cover"
            data-ai-hint={item.mediaDataAiHint || "social media image"}
          />
        </div>
      );
    }
    if (item.itemType === 'video_post' && item.mediaUrl) {
      return (
        <div className="rounded-md overflow-hidden border">
          <video src={item.mediaUrl} controls className="w-full aspect-video" data-ai-hint={item.mediaDataAiHint || "social media video"}/>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (item.itemType) {
      case 'text_post':
        return <p className="text-sm mb-3 whitespace-pre-wrap">{item.content}</p>;
      case 'image_post':
      case 'video_post':
        return item.content ? <p className="text-sm mb-3 whitespace-pre-wrap">{item.content}</p> : null;
      case 'campaign_created':
        return (
          <div className="text-sm mb-3 p-3 bg-secondary/30 rounded-md border">
            <p className="font-semibold">New Campaign Created: {item.campaignName}</p>
            {item.campaignLocation && <p className="text-xs text-muted-foreground">Location: {item.campaignLocation}</p>}
            {item.campaignDescription && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.campaignDescription}</p>}
             <Button variant="link" size="sm" className="px-0 h-auto mt-1 text-primary">View Campaign</Button>
          </div>
        );
      case 'poll_created':
        return (
          <div className="text-sm mb-3 p-3 bg-secondary/30 rounded-md border">
            <p className="font-semibold">New Poll Created: {item.pollQuestion}</p>
            {item.pollOptions && item.pollOptions.length > 0 && (
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-1">
                {item.pollOptions.slice(0,2).map(opt => <li key={opt.text}>{opt.text}</li>)}
                {item.pollOptions.length > 2 && <li>...and more</li>}
              </ul>
            )}
            <Button variant="link" size="sm" className="px-0 h-auto mt-1 text-primary">View Poll</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Avatar>
          <AvatarImage src={item.creatorImageUrl} alt={item.creatorName} data-ai-hint={item.creatorDataAiHint || "person face"} />
          <AvatarFallback>{item.creatorName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold flex items-center">
            {item.creatorName}
            {/* Placeholder for candidate badge if needed */}
            {/* <Award className="ml-2 h-4 w-4 text-yellow-500" /> */}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {/* Placeholder for role */}
            Posted {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {renderContent()}
        {renderMedia()}
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
              <p>Like (0)</p> {/* Placeholder likes */}
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
              <p>Comment (0)</p> {/* Placeholder comments */}
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
              <p>Share (0)</p> {/* Placeholder shares */}
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

// Convert OldFeedPost from mockData to new FeedItem structure
const initialFeedItems: FeedItem[] = initialMockFeedPosts.map((post: OldFeedPost): FeedItem => {
  if (post.postImageUrl) {
    return {
      id: post.id,
      timestamp: post.timestamp,
      creatorName: post.candidateName,
      creatorImageUrl: post.candidateImageUrl,
      creatorDataAiHint: post.dataAiHintCandidate,
      itemType: 'image_post',
      content: post.content,
      mediaUrl: post.postImageUrl,
      mediaDataAiHint: post.dataAiHintPost,
    };
  }
  return {
    id: post.id,
    timestamp: post.timestamp,
    creatorName: post.candidateName,
    creatorImageUrl: post.candidateImageUrl,
    creatorDataAiHint: post.dataAiHintCandidate,
    itemType: 'text_post',
    content: post.content,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


export default function HomePage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  const addNewFeedItem = (newItem: FeedItem) => {
    setFeedItems(prevItems =>
      [newItem, ...prevItems].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  };

  const handleCreatePost = (newPost: TextPostFeedItem | ImagePostFeedItem) => {
    addNewFeedItem(newPost);
    setIsPostDialogOpen(false);
  };

  const handleCreateCampaign = (newCampaignData: Campaign) => {
    const campaignFeedItem: CampaignFeedItem = {
      id: `feed-camp-${newCampaignData.id}`,
      timestamp: new Date().toISOString(),
      itemType: 'campaign_created',
      creatorName: 'Current User', // Placeholder
      campaignName: newCampaignData.name,
      campaignLocation: newCampaignData.location,
      campaignDescription: newCampaignData.description,
    };
    addNewFeedItem(campaignFeedItem);
    // Note: This doesn't add to the actual /campaigns page list, only to this feed.
    // The CreateCampaignForm on /campaigns page handles its own list update.
    setIsCampaignDialogOpen(false);
  };

  const handleCreatePoll = (newPollData: Poll) => {
     const pollFeedItem: PollFeedItem = {
      id: `feed-poll-${newPollData.id}`,
      timestamp: new Date().toISOString(),
      itemType: 'poll_created',
      creatorName: 'Current User', // Placeholder
      pollQuestion: newPollData.question,
      pollOptions: newPollData.options.map(opt => ({ text: opt.text })),
    };
    addNewFeedItem(pollFeedItem);
    // Note: This doesn't add to a global poll list, only to this feed.
    setIsPollDialogOpen(false);
  };
  
  const handleCreateVideo = (newVideo: VideoPostFeedItem) => {
    addNewFeedItem(newVideo);
    setIsVideoDialogOpen(false);
  };


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6 shadow-md rounded-lg p-4">
        <div className="flex items-center justify-around">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setIsPostDialogOpen(true)} className="flex flex-col h-auto p-2">
                  <Edit3 className="h-6 w-6 text-primary" />
                  <span className="text-xs mt-1">Post</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Create a new Post</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                 <Button variant="ghost" onClick={() => setIsVideoDialogOpen(true)} className="flex flex-col h-auto p-2">
                  <VideoIcon className="h-6 w-6 text-red-500" />
                  <span className="text-xs mt-1">Video</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Upload a Video</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setIsCampaignDialogOpen(true)} className="flex flex-col h-auto p-2">
                  <CampaignIcon className="h-6 w-6 text-green-500" />
                  <span className="text-xs mt-1">Campaign</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Start a Campaign</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setIsPollDialogOpen(true)} className="flex flex-col h-auto p-2">
                  <BarChart2 className="h-6 w-6 text-purple-500" />
                  <span className="text-xs mt-1">Poll</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Create a Poll</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>

      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Create a New Post</DialogTitle></DialogHeader>
          <CreatePostForm onSubmitSuccess={handleCreatePost} onOpenChange={setIsPostDialogOpen} />
        </DialogContent>
      </Dialog>

      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="sm:max-w-[520px]"> {/* Slightly wider for video preview */}
          <DialogHeader><DialogTitle>Upload a Video</DialogTitle></DialogHeader>
          <CreateVideoForm onSubmitSuccess={handleCreateVideo} onOpenChange={setIsVideoDialogOpen} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Create a New Campaign</DialogTitle></DialogHeader>
          <CreateCampaignForm onSubmitSuccess={handleCreateCampaign} onOpenChange={setIsCampaignDialogOpen} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader><DialogTitle>Create a New Poll</DialogTitle></DialogHeader>
          <CreatePollForm onSubmitSuccess={handleCreatePoll} onOpenChange={setIsPollDialogOpen} />
        </DialogContent>
      </Dialog>


      <h1 className="text-2xl font-bold mb-6 mt-8">Live Feed</h1>
      {feedItems.length === 0 && <p className="text-muted-foreground text-center py-4">No items in the feed yet. Be the first to share something!</p>}
      {feedItems.map((item) => (
        <FeedItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
