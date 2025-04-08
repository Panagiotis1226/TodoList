import { Todo } from '../../models/Todo';

// Basic Todo Component interface
export interface TodoComponent {
  getId(): string;
  getTitle(): string;
  getDescription(): string | undefined;
  isCompleted(): boolean;
  getCreatedAt(): Date;
  getPriority(): 'low' | 'medium' | 'high';
  getCategory(): string | undefined;
  toObject(): Todo;
}

// Concrete Todo Component
export class SimpleTodo implements TodoComponent {
  private todo: Todo;

  constructor(todo: Todo) {
    this.todo = todo;
  }

  getId(): string {
    return this.todo.id;
  }

  getTitle(): string {
    return this.todo.title;
  }

  getDescription(): string | undefined {
    return this.todo.description;
  }

  isCompleted(): boolean {
    return this.todo.completed;
  }

  getCreatedAt(): Date {
    return this.todo.createdAt;
  }

  getPriority(): 'low' | 'medium' | 'high' {
    return this.todo.priority;
  }

  getCategory(): string | undefined {
    return this.todo.category;
  }

  toObject(): Todo {
    return { ...this.todo };
  }
}

// Base Decorator
export abstract class TodoDecorator implements TodoComponent {
  protected component: TodoComponent;

  constructor(component: TodoComponent) {
    this.component = component;
  }

  getId(): string {
    return this.component.getId();
  }

  getTitle(): string {
    return this.component.getTitle();
  }

  getDescription(): string | undefined {
    return this.component.getDescription();
  }

  isCompleted(): boolean {
    return this.component.isCompleted();
  }

  getCreatedAt(): Date {
    return this.component.getCreatedAt();
  }

  getPriority(): 'low' | 'medium' | 'high' {
    return this.component.getPriority();
  }

  getCategory(): string | undefined {
    return this.component.getCategory();
  }

  toObject(): Todo {
    return this.component.toObject();
  }
}

// Concrete Decorator - Adds due date functionality
export class DueDateTodoDecorator extends TodoDecorator {
  private dueDate: Date;

  constructor(component: TodoComponent, dueDate: Date) {
    super(component);
    this.dueDate = dueDate;
  }

  getDueDate(): Date {
    return this.dueDate;
  }

  isOverdue(): boolean {
    return new Date() > this.dueDate && !this.isCompleted();
  }

  // Override to include dueDate in the returned object
  toObject(): Todo {
    const todo = super.toObject();
    return {
      ...todo,
      dueDate: this.dueDate
    } as Todo & { dueDate: Date };
  }
}

// Concrete Decorator - Adds labels/tags
export class TaggedTodoDecorator extends TodoDecorator {
  private tags: string[];

  constructor(component: TodoComponent, tags: string[] = []) {
    super(component);
    this.tags = tags;
  }

  getTags(): string[] {
    return [...this.tags];
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  // Override to include tags in the returned object
  toObject(): Todo {
    const todo = super.toObject();
    return {
      ...todo,
      tags: [...this.tags]
    } as Todo & { tags: string[] };
  }
} 