
'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { CreatePostForm } from '@/components/forms/CreatePostForm';
import { CreateCampaignForm } from '@/components/forms/CreateCampaignForm';
import { CreatePollForm } from '@/components/forms/CreatePollForm';
import type { FeedPost, Campaign } from '@/types';
import { FileText, Edit3, BarChart2, PlusCircle } from 'lucide-react'; // Icons for options
import { useRouter } from 'next/navigation';

interface CreateMenuProps {
  children: ReactNode; // This will be the trigger button
  onPostCreated: (newPost: FeedPost) => void;
  onCampaignCreated: (newCampaign: Campaign) => void;
  // onPollCreated might be needed if we handle it here too
}

export function CreateMenu({ children, onPostCreated, onCampaignCreated }: CreateMenuProps) {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const router = useRouter();

  const handlePostSubmitSuccess = (newPost: FeedPost) => {
    onPostCreated(newPost);
    setIsPostDialogOpen(false);
    setIsMainDialogOpen(false); // Close main dialog as well
  };

  const handleCampaignSubmitSuccess = (newCampaign: Campaign) => {
    onCampaignCreated(newCampaign);
    setIsCampaignDialogOpen(false);
    setIsMainDialogOpen(false); // Close main dialog as well
  };
  
  const handlePollSubmitSuccess = () => {
    // For polls, CreatePollForm handles its own toast.
    // We just need to close the dialogs.
    setIsPollDialogOpen(false);
    setIsMainDialogOpen(false);
  };


  const openPostDialog = () => {
    setIsMainDialogOpen(false); // Close main dialog first
    setTimeout(() => setIsPostDialogOpen(true), 0); // Open specific dialog
  };

  const openCampaignDialog = () => {
    setIsMainDialogOpen(false);
    setTimeout(() => setIsCampaignDialogOpen(true), 0);
  };

  const openPollDialog = () => {
    setIsMainDialogOpen(false);
    setTimeout(() => setIsPollDialogOpen(true), 0);
  };

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New...
            </DialogTitle>
            <DialogDescription>
              What would you like to create today?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button variant="outline" onClick={openPostDialog} className="justify-start text-base py-6">
              <Edit3 className="mr-3 h-5 w-5" /> Create Post
            </Button>
            <Button variant="outline" onClick={openCampaignDialog} className="justify-start text-base py-6">
              <FileText className="mr-3 h-5 w-5" /> Create Campaign
            </Button>
            <Button variant="outline" onClick={openPollDialog} className="justify-start text-base py-6">
              <BarChart2 className="mr-3 h-5 w-5" /> Create Poll
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for Create Post */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
            <DialogDescription>Share an update, news, or an announcement.</DialogDescription>
          </DialogHeader>
          <CreatePostForm onSubmitSuccess={handlePostSubmitSuccess} />
        </DialogContent>
      </Dialog>

      {/* Dialog for Create Campaign */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create a New Campaign</DialogTitle>
            <DialogDescription>Fill in the details below to launch your campaign.</DialogDescription>
          </DialogHeader>
          <CreateCampaignForm onSubmitSuccess={handleCampaignSubmitSuccess} onOpenChange={setIsCampaignDialogOpen} />
        </DialogContent>
      </Dialog>

      {/* Dialog for Create Poll */}
      <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create a New Poll</DialogTitle>
            <DialogDescription>Define your question and provide options for users to vote on.</DialogDescription>
          </DialogHeader>
          <CreatePollForm onSubmitSuccess={handlePollSubmitSuccess} onOpenChange={setIsPollDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
