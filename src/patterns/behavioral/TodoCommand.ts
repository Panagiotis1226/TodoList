import { Todo } from '../../models/Todo';
import { TodoStore } from '../creational/TodoStore';

// Command Pattern - Encapsulate a request as an object

// Command Interface
export interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

// Concrete Commands
export class AddTodoCommand implements Command {
  private todo: Todo;
  private todoStore: TodoStore;

  constructor(todo: Todo, todoStore: TodoStore = TodoStore.getInstance()) {
    this.todo = todo;
    this.todoStore = todoStore;
  }

  async execute(): Promise<void> {
    await this.todoStore.addTodo(this.todo);
  }

  async undo(): Promise<void> {
    await this.todoStore.deleteTodo(this.todo.id);
  }
}

export class UpdateTodoCommand implements Command {
  private oldTodo: Todo;
  private newTodo: Todo;
  private todoStore: TodoStore;

  constructor(newTodo: Todo, todoStore: TodoStore = TodoStore.getInstance()) {
    this.newTodo = newTodo;
    this.todoStore = todoStore;
    // Store the old state for undo operations
    this.oldTodo = { ...newTodo };
  }

  async execute(): Promise<void> {
    await this.todoStore.updateTodo(this.newTodo);
  }

  async undo(): Promise<void> {
    await this.todoStore.updateTodo(this.oldTodo);
  }
}

export class DeleteTodoCommand implements Command {
  private todo: Todo;
  private todoStore: TodoStore;

  constructor(todoId: string, todoStore: TodoStore = TodoStore.getInstance()) {
    this.todoStore = todoStore;
    // We'll get the todo in execute() since it's async
    this.todo = {
      id: todoId,
      title: '',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
  }

  async execute(): Promise<void> {
    const todo = await this.todoStore.getTodoById(this.todo.id);
    if (!todo) {
      throw new Error(`Todo with id ${this.todo.id} not found`);
    }
    this.todo = { ...todo }; // Store a copy for undo
    await this.todoStore.deleteTodo(this.todo.id);
  }

  async undo(): Promise<void> {
    await this.todoStore.addTodo(this.todo);
  }
}

// Invoker - Manages command history for undo/redo
export class CommandManager {
  private history: Command[] = [];
  private undoneCommands: Command[] = [];

  async execute(command: Command): Promise<void> {
    await command.execute();
    this.history.push(command);
    // Clear the undone commands since we're now on a new path
    this.undoneCommands = [];
  }

  async undo(): Promise<void> {
    if (this.history.length === 0) {
      return;
    }

    const command = this.history.pop()!;
    await command.undo();
    this.undoneCommands.push(command);
  }

  async redo(): Promise<void> {
    if (this.undoneCommands.length === 0) {
      return;
    }

    const command = this.undoneCommands.pop()!;
    await command.execute();
    this.history.push(command);
  }

  clearHistory(): void {
    this.history = [];
    this.undoneCommands = [];
  }
} 