import { Todo } from '../../models/Todo';

// Strategy Pattern - Defines a family of algorithms that can be interchanged

// Strategy Interface
export interface TodoFilterStrategy {
  filter(todos: Todo[]): Todo[];
}

// Concrete Strategies
export class CompletedTodoFilter implements TodoFilterStrategy {
  filter(todos: Todo[]): Todo[] {
    return todos.filter(todo => todo.completed);
  }
}

export class ActiveTodoFilter implements TodoFilterStrategy {
  filter(todos: Todo[]): Todo[] {
    return todos.filter(todo => !todo.completed);
  }
}

export class PriorityTodoFilter implements TodoFilterStrategy {
  private priority: 'low' | 'medium' | 'high';

  constructor(priority: 'low' | 'medium' | 'high') {
    this.priority = priority;
  }

  filter(todos: Todo[]): Todo[] {
    return todos.filter(todo => todo.priority === this.priority);
  }
}

export class CategoryTodoFilter implements TodoFilterStrategy {
  private category: string;

  constructor(category: string) {
    this.category = category;
  }

  filter(todos: Todo[]): Todo[] {
    return todos.filter(todo => todo.category === this.category);
  }
}

export class DateRangeTodoFilter implements TodoFilterStrategy {
  private startDate: Date;
  private endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  filter(todos: Todo[]): Todo[] {
    return todos.filter(todo => {
      const createdAt = todo.createdAt;
      return createdAt >= this.startDate && createdAt <= this.endDate;
    });
  }
}

// Context
export class TodoFilterContext {
  private strategy: TodoFilterStrategy;

  constructor(strategy: TodoFilterStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: TodoFilterStrategy): void {
    this.strategy = strategy;
  }

  filterTodos(todos: Todo[]): Todo[] {
    return this.strategy.filter(todos);
  }
} 