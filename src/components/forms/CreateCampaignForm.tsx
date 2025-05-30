
'use client';

import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PlusCircle } from 'lucide-react';
import type { Campaign } from '@/types';

const campaignCategories = ['Local', 'State', 'National'] as const;

const createCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters.').max(100),
  party: z.string().max(50).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(1000),
  location: z.string().min(2, 'Location must be at least 2 characters.').max(100),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  category: z.enum(campaignCategories, { required_error: 'Please select a category.' }),
});

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;

interface CreateCampaignFormProps {
  onSubmitSuccess: (newCampaign: Campaign) => void;
  onOpenChange?: (open: boolean) => void;
}

export function CreateCampaignForm({ onSubmitSuccess, onOpenChange }: CreateCampaignFormProps) {
  const form = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: '',
      party: '',
      description: '',
      location: '',
      imageUrl: '',
      category: undefined,
    },
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = form;

  const processSubmit: SubmitHandler<CreateCampaignFormData> = async (data) => {
    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: data.name,
      party: data.party || undefined,
      description: data.description,
      location: data.location,
      imageUrl: data.imageUrl || undefined,
      dataAiHint: data.imageUrl ? 'campaign image' : undefined,
      category: data.category,
      popularityScore: Math.floor(Math.random() * 50) + 20, // Mock popularity
    };
    onSubmitSuccess(newCampaign);
    reset();
    onOpenChange?.(false); // Close dialog on success
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input id="campaignName" {...register('name')} placeholder="e.g., Better Schools Initiative" />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="campaignParty">Party / Affiliation (Optional)</Label>
        <Input id="campaignParty" {...register('party')} placeholder="e.g., Independent, Green Party" />
        {errors.party && <p className="text-sm text-destructive mt-1">{errors.party.message}</p>}
      </div>
      <div>
        <Label htmlFor="campaignDescription">Description</Label>
        <Textarea id="campaignDescription" {...register('description')} placeholder="Describe the campaign's goals and mission." className="min-h-[100px]" />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div>
        <Label htmlFor="campaignLocation">Location</Label>
        <Input id="campaignLocation" {...register('location')} placeholder="e.g., Springfield, Statewide" />
        {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
      </div>
      <div>
        <Label htmlFor="campaignImageUrl">Image URL (Optional)</Label>
        <Input id="campaignImageUrl" {...register('imageUrl')} type="url" placeholder="https://example.com/campaign-banner.png" />
        {errors.imageUrl && <p className="text-sm text-destructive mt-1">{errors.imageUrl.message}</p>}
      </div>
      <div>
        <Label htmlFor="campaignCategory">Category</Label>
        <Controller
            name="category"
            control={control}
            render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="campaignCategory">
                    <SelectValue placeholder="Select campaign category" />
                </SelectTrigger>
                <SelectContent>
                    {campaignCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            )}
        />
        {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
        {isSubmitting ? 'Creating...' : 'Create Campaign'}
      </Button>
    </form>
  );
}
