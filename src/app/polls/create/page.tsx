
import { ListPlus } from 'lucide-react';
import { CreatePollForm } from '@/components/forms/CreatePollForm';

export default function CreatePollPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <ListPlus className="mr-3 h-7 w-7 text-primary" />
        Create a New Poll
      </h1>
      <p className="text-muted-foreground mb-6">
        Engage the community by creating a poll. Define your question and provide options for users to vote on.
      </p>
      <CreatePollForm />
    </div>
  );
}
