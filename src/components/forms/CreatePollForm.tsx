
'use client';

import { useForm, useFieldArray, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Poll } from '@/types';

const pollOptionSchema = z.object({
  text: z.string().min(1, 'Option text cannot be empty.').max(100, 'Option text is too long.'),
});

const createPollSchema = z.object({
  question: z.string().min(5, 'Poll question must be at least 5 characters.').max(250, 'Poll question is too long.'),
  options: z.array(pollOptionSchema).min(2, 'Please provide at least two options.').max(10, 'You can add a maximum of 10 options.'),
});

type CreatePollFormData = z.infer<typeof createPollSchema>;

export function CreatePollForm() {
  const { toast } = useToast();
  const form = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: '',
      options: [{ text: '' }, { text: '' }], // Start with two empty options
    },
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const processSubmit: SubmitHandler<CreatePollFormData> = async (data) => {
    // In a real app, this would call a server action to save the poll.
    const newPollData: Poll = {
      id: `poll-${Date.now()}`,
      question: data.question,
      options: data.options.map((opt, index) => ({ id: `opt-${index}`, text: opt.text, votes: 0 })),
      creatorId: 'anonymousUser', // Placeholder as login is disabled
      createdAt: new Date().toISOString(),
    };

    console.log('New Poll Data:', newPollData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Poll Created!',
      description: 'Your poll has been successfully created.',
      variant: 'default',
    });
    reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>Ask a question and gather opinions from the community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="pollQuestion">Poll Question</Label>
            <Input
              id="pollQuestion"
              {...register('question')}
              placeholder="e.g., What is the most important issue for the upcoming election?"
            />
            {errors.question && <p className="text-sm text-destructive mt-1">{errors.question.message}</p>}
          </div>

          <div>
            <Label>Poll Options</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mt-2">
                <Input
                  {...register(`options.${index}.text`)}
                  placeholder={`Option ${index + 1}`}
                />
                {fields.length > 2 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="Remove option">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
             {errors.options?.root && <p className="text-sm text-destructive mt-1">{errors.options.root.message}</p>}
             {errors.options?.map((optionError, index) => 
                optionError.text && <p key={index} className="text-sm text-destructive mt-1">Option {index + 1}: {optionError.text.message}</p>
             )}

            {fields.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ text: '' })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>
            )}
          </div>
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
