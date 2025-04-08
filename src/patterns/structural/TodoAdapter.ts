import { Todo } from '../../models/Todo';

// Define a legacy or external Todo format
export interface ExternalTodo {
  task_id: string;
  task_name: string;
  task_description?: string;
  is_complete: boolean;
  created: string; // ISO date string
  importance: number; // 1-3 (low to high)
  tag?: string;
}

// Adapter Pattern - Converts between incompatible interfaces
export class TodoAdapter {
  // Convert from external format to our internal Todo model
  static adaptFromExternal(externalTodo: ExternalTodo): Todo {
    // Map priority from number to string
    const priorityMap: Record<number, 'low' | 'medium' | 'high'> = {
      1: 'low',
      2: 'medium',
      3: 'high'
    };

    return {
      id: externalTodo.task_id,
      title: externalTodo.task_name,
      description: externalTodo.task_description,
      completed: externalTodo.is_complete,
      createdAt: new Date(externalTodo.created),
      priority: priorityMap[externalTodo.importance] || 'medium',
      category: externalTodo.tag
    };
  }

  // Convert from our internal Todo model to external format
  static adaptToExternal(todo: Todo): ExternalTodo {
    // Map priority from string to number
    const priorityMap: Record<string, number> = {
      'low': 1,
      'medium': 2,
      'high': 3
    };

    return {
      task_id: todo.id,
      task_name: todo.title,
      task_description: todo.description,
      is_complete: todo.completed,
      created: todo.createdAt.toISOString(),
      importance: priorityMap[todo.priority],
      tag: todo.category
    };
  }
} 