import { Todo } from '../../models/Todo';

// Singleton Pattern - Ensures only one instance of the TodoStore exists
export class TodoStore {
  private static instance: TodoStore;
  private todos: Todo[] = [];

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): TodoStore {
    if (!TodoStore.instance) {
      TodoStore.instance = new TodoStore();
    }
    return TodoStore.instance;
  }

  public addTodo(todo: Todo): void {
    this.todos.push(todo);
  }

  public updateTodo(updatedTodo: Todo): void {
    const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todos[index] = updatedTodo;
    }
  }

  public deleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  public getTodos(): Todo[] {
    return [...this.todos]; // Return a copy to prevent direct mutation
  }

  public getTodoById(id: string): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }
} 