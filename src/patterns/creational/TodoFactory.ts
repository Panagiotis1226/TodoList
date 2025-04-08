import { Todo } from '../../models/Todo';
import { v4 as uuidv4 } from 'uuid';

// Factory Pattern - Creates different types of Todo items
export class TodoFactory {
  static createTodo(title: string, description: string = '', priority: 'low' | 'medium' | 'high' = 'medium'): Todo {
    return {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      priority
    };
  }

  static createHighPriorityTodo(title: string, description: string = ''): Todo {
    return this.createTodo(title, description, 'high');
  }

  static createLowPriorityTodo(title: string, description: string = ''): Todo {
    return this.createTodo(title, description, 'low');
  }

  static createQuickTodo(title: string): Todo {
    return this.createTodo(title, 'Quick task', 'medium');
  }
} 