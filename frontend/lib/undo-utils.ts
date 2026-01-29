// Undo utility functions for the Todo application

export interface UndoAction<T = any> {
  id: string;
  action: string; // e.g., 'create', 'update', 'delete'
  target: string; // e.g., 'task', 'list'
  data: T;
  timestamp: Date;
}

export class UndoManager<T = any> {
  private stack: UndoAction<T>[] = [];
  private redoStack: UndoAction<T>[] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Add an action to the undo stack
   * @param action The action to add
   */
  addAction(action: Omit<UndoAction<T>, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const undoAction: UndoAction<T> = {
      ...action,
      id,
      timestamp: new Date(),
    };

    this.stack.push(undoAction);

    // Limit the stack size
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
    }

    // Clear redo stack when a new action is added
    this.redoStack = [];

    return id;
  }

  /**
   * Get the last action that can be undone
   * @returns The last undoable action or null if none exists
   */
  getLastAction(): UndoAction<T> | null {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }

  /**
   * Undo the last action
   * @returns The undone action or null if no action to undo
   */
  undo(): UndoAction<T> | null {
    if (this.stack.length === 0) {
      return null;
    }

    const action = this.stack.pop();
    if (action) {
      this.redoStack.push(action);
    }
    return action;
  }

  /**
   * Redo the last undone action
   * @returns The redone action or null if no action to redo
   */
  redo(): UndoAction<T> | null {
    if (this.redoStack.length === 0) {
      return null;
    }

    const action = this.redoStack.pop();
    if (action) {
      this.stack.push(action);
    }
    return action;
  }

  /**
   * Clear all actions from the undo and redo stacks
   */
  clear(): void {
    this.stack = [];
    this.redoStack = [];
  }

  /**
   * Check if there are actions that can be undone
   * @returns True if there are undoable actions
   */
  canUndo(): boolean {
    return this.stack.length > 0;
  }

  /**
   * Check if there are actions that can be redone
   * @returns True if there are redoable actions
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Get the number of undoable actions
   * @returns The number of actions in the undo stack
   */
  getUndoCount(): number {
    return this.stack.length;
  }

  /**
   * Get the number of redoable actions
   * @returns The number of actions in the redo stack
   */
  getRedoCount(): number {
    return this.redoStack.length;
  }

  /**
   * Remove an action from the stack by ID
   * @param id The ID of the action to remove
   * @returns True if the action was found and removed
   */
  removeActionById(id: string): boolean {
    const index = this.stack.findIndex(action => action.id === id);
    if (index !== -1) {
      this.stack.splice(index, 1);
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Specific undo actions for tasks
export interface TaskUndoActionData {
  id?: string;
  title?: string;
  description?: string;
  completed?: boolean;
  createdAt?: Date;
  userId?: string;
  dueDate?: Date | null;
}

export type TaskUndoAction = UndoAction<TaskUndoActionData>;

// Create a singleton undo manager for tasks
const taskUndoManager = new UndoManager<TaskUndoActionData>();

export { taskUndoManager };