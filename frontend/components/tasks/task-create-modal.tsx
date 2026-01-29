import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateTaskForm } from '@/lib/validation';
import { TaskFormData } from '@/types/task';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (taskData: TaskFormData) => void;
}

export const TaskCreateModal = ({ isOpen, onClose, onCreate }: TaskCreateModalProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    completed: false,
    dueDate: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      dueDate: value ? new Date(value) : null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateTaskForm(formData.title, formData.description);

    if (!validation.isValid) {
      const newErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        if (error.includes('title')) newErrors.title = error;
        else if (error.includes('description')) newErrors.description = error;
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onCreate(formData);
      setFormData({
        title: '',
        description: '',
        completed: false,
        dueDate: null,
      });
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            label="Task Title"
            id="title"
            name="title"
            type="text"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            fullWidth
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details..."
            className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};