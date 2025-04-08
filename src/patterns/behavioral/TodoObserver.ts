import { Todo } from '../../models/Todo';

// Observer Pattern - Defines a subscription mechanism for notifications

// Observer Interface
export interface TodoObserver {
  update(todo: Todo, action: 'add' | 'update' | 'delete'): void;
}

// Subject Interface
export interface Subject {
  attach(observer: TodoObserver): void;
  detach(observer: TodoObserver): void;
  notify(todo: Todo, action: 'add' | 'update' | 'delete'): void;
}

// Concrete Subject
export class TodoSubject implements Subject {
  private observers: TodoObserver[] = [];

  attach(observer: TodoObserver): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    }
  }

  detach(observer: TodoObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notify(todo: Todo, action: 'add' | 'update' | 'delete'): void {
    for (const observer of this.observers) {
      observer.update(todo, action);
    }
  }
}

// Concrete Observer - Logs todo changes
export class TodoLogger implements TodoObserver {
  update(todo: Todo, action: 'add' | 'update' | 'delete'): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Todo ${action}: ${todo.title} (${todo.id})`);
  }
}

// Concrete Observer - Updates UI or performs specific actions based on todo changes
export class TodoStateManager implements TodoObserver {
  update(todo: Todo, action: 'add' | 'update' | 'delete'): void {
    switch (action) {
      case 'add':
        this.handleTodoAdded(todo);
        break;
      case 'update':
        this.handleTodoUpdated(todo);
        break;
      case 'delete':
        this.handleTodoDeleted(todo);
        break;
    }
  }

  private handleTodoAdded(todo: Todo): void {
    // Logic to handle a new todo (e.g., update UI, trigger notifications)
    console.log(`New todo added: ${todo.title}`);
  }

  private handleTodoUpdated(todo: Todo): void {
    // Logic to handle todo updates (e.g., refresh UI, update statistics)
    console.log(`Todo updated: ${todo.title}`);
  }

  private handleTodoDeleted(todo: Todo): void {
    // Logic to handle todo deletion (e.g., remove from UI, update counts)
    console.log(`Todo deleted: ${todo.title}`);
  }
} 