'use client';

import React, { useState, useEffect } from 'react';
import { TaskCard } from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Task } from '@/types/task';
import { taskService } from '@/services/task-service';

export default function CompletedPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view'); // For completed tasks, we'll mainly use 'view' mode

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await taskService.getTasks();
        // Filter to show only completed tasks
        const completedTasks = allTasks.filter(task => task.completed);
        setTasks(completedTasks);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleModalClose = () => {
    setShowTaskModal(false);
    setCurrentTask(null);
    setModalMode('view'); // Reset to default mode
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);
      // Update the tasks array with the updated task
      setTasks(tasks.map(task =>
        task.id.toString() === id.toString() ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id.toString() === id.toString());
    if (task) {
      setCurrentTask(task);
      setModalMode('view'); // For completed tasks, start in view mode
      setShowTaskModal(true);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this completed task?')) {
      try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter(task => task.id.toString() !== id.toString()));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSaveTask = async () => {
    const titleInput = document.getElementById('task-title') as HTMLInputElement;
    const descriptionTextarea = document.getElementById('task-description') as HTMLTextAreaElement;

    if (!titleInput?.value.trim()) {
      alert('Title is required');
      return;
    }

    const formData = {
      title: titleInput.value,
      description: descriptionTextarea?.value || '',
      completed: currentTask?.completed || false,
    };

    try {
      if (currentTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(currentTask.id, formData);
        setTasks(tasks.map(task =>
          task.id.toString() === currentTask.id.toString() ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await taskService.createTask(formData);
        setTasks([...tasks, newTask]);
      }

      setShowTaskModal(false);
      setCurrentTask(null);
      setModalMode('view'); // Reset to default mode
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Completed Tasks</h1>
          <p className="text-muted-foreground mt-1">Tasks you've successfully finished</p>
        </div>
      </div>

      {/* Completed Tasks Count */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-300">Completed Tasks</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">{tasks.length}</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg">
            <span className="text-2xl">🏆</span>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">No completed tasks yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't completed any tasks yet. Keep going and celebrate your achievements!
          </p>
          <p className="text-sm text-muted-foreground">
            Complete tasks to see them appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-green-50/30">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  className="mt-1 h-5 w-5 rounded border-input bg-transparent focus:ring-0 focus:ring-offset-0 text-primary"
                  aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-lg mb-2 truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setCurrentTask(task);
                      setModalMode('view'); // Set to view mode initially
                      setShowTaskModal(true);
                    }}
                  >
                    View Detail
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={handleModalClose}
        title={
          modalMode === 'view'
            ? 'Task Details'
            : modalMode === 'edit'
              ? 'Edit Task'
              : 'Create New Task'
        }
      >
        <div className="space-y-6">
          {modalMode === 'view' ? (
            // View Task Details (read-only form)
            <div className="space-y-6">
              <div>
                <label htmlFor="task-title-view" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="task-title-view"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                  value={currentTask?.title || ''}
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="task-description-view" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="task-description-view"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed resize-none text-gray-900 dark:text-gray-100"
                  rows={4}
                  value={currentTask?.description || ''}
                  readOnly
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                    value={currentTask?.completed ? 'Completed' : 'Pending'}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Created</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                    value={currentTask?.createdAt ? new Date(currentTask.createdAt).toLocaleString() : 'N/A'}
                    readOnly
                  />
                </div>
              </div>

              {currentTask?.dueDate && (
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-900 dark:text-gray-100"
                    value={new Date(currentTask.dueDate).toLocaleString()}
                    readOnly
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleModalClose}
                  className="px-4 py-2"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setModalMode('edit')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-500/90 transition-all"
                >
                  Edit Task
                </Button>
              </div>
            </div>
          ) : (
            // Edit/Create Task Form
            <>
              <div>
                <label htmlFor="task-title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="task-title"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 dark:text-gray-100"
                  defaultValue={currentTask?.title || ''}
                  placeholder="Enter task title"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="task-description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="task-description"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none text-gray-900 dark:text-gray-100"
                  rows={4}
                  defaultValue={currentTask?.description || ''}
                  placeholder="Enter task description (optional)"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleModalClose}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-green-500 hover:bg-green-500/90 transition-all"
                >
                  {modalMode === 'edit' ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}