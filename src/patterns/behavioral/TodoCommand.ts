import { Todo } from '../../models/Todo';
import { TodoStore } from '../creational/TodoStore';

// Command Pattern - Encapsulate a request as an object

// Command Interface
export interface Command {
  execute(): void;
  undo(): void;
}

// Concrete Commands
export class AddTodoCommand implements Command {
  private todo: Todo;
  private todoStore: TodoStore;

  constructor(todo: Todo, todoStore: TodoStore = TodoStore.getInstance()) {
    this.todo = todo;
    this.todoStore = todoStore;
  }

  execute(): void {
    this.todoStore.addTodo(this.todo);
  }

  undo(): void {
    this.todoStore.deleteTodo(this.todo.id);
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
    const oldTodoObj = this.todoStore.getTodoById(newTodo.id);
    this.oldTodo = oldTodoObj ? { ...oldTodoObj } : { ...newTodo };
  }

  execute(): void {
    this.todoStore.updateTodo(this.newTodo);
  }

  undo(): void {
    this.todoStore.updateTodo(this.oldTodo);
  }
}

export class DeleteTodoCommand implements Command {
  private todo: Todo;
  private todoStore: TodoStore;

  constructor(todoId: string, todoStore: TodoStore = TodoStore.getInstance()) {
    const todo = todoStore.getTodoById(todoId);
    if (!todo) {
      throw new Error(`Todo with id ${todoId} not found`);
    }
    this.todo = { ...todo }; // Store a copy for undo
    this.todoStore = todoStore;
  }

  execute(): void {
    this.todoStore.deleteTodo(this.todo.id);
  }

  undo(): void {
    this.todoStore.addTodo(this.todo);
  }
}

// Invoker - Manages command history for undo/redo
export class CommandManager {
  private history: Command[] = [];
  private undoneCommands: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.history.push(command);
    // Clear the undone commands since we're now on a new path
    this.undoneCommands = [];
  }

  undo(): void {
    if (this.history.length === 0) {
      return;
    }

    const command = this.history.pop()!;
    command.undo();
    this.undoneCommands.push(command);
  }

  redo(): void {
    if (this.undoneCommands.length === 0) {
      return;
    }

    const command = this.undoneCommands.pop()!;
    command.execute();
    this.history.push(command);
  }

  clearHistory(): void {
    this.history = [];
    this.undoneCommands = [];
  }
} 