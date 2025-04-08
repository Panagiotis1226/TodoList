import { Todo } from '../models/Todo';
import { TodoFactory } from '../patterns/creational/TodoFactory';
import { TodoStore } from '../patterns/creational/TodoStore';
import { TodoAdapter, ExternalTodo } from '../patterns/structural/TodoAdapter';
import { SimpleTodo, DueDateTodoDecorator, TaggedTodoDecorator } from '../patterns/structural/TodoDecorator';
import { TodoSubject, TodoLogger, TodoStateManager } from '../patterns/behavioral/TodoObserver';
import { TodoFilterContext, ActiveTodoFilter, CompletedTodoFilter, PriorityTodoFilter } from '../patterns/behavioral/TodoStrategy';
import { CommandManager, AddTodoCommand, UpdateTodoCommand, DeleteTodoCommand } from '../patterns/behavioral/TodoCommand';

// TodoService - Facade Pattern that provides a simplified interface to the complex subsystems
export class TodoService {
  private todoStore: TodoStore;
  private todoSubject: TodoSubject;
  private commandManager: CommandManager;
  private filterContext: TodoFilterContext;

  constructor() {
    this.todoStore = TodoStore.getInstance();
    this.todoSubject = new TodoSubject();
    this.commandManager = new CommandManager();
    
    // Default to showing active todos
    this.filterContext = new TodoFilterContext(new ActiveTodoFilter());
    
    // Add observers
    this.todoSubject.attach(new TodoLogger());
    this.todoSubject.attach(new TodoStateManager());
  }

  // Create methods using Factory pattern
  createTodo(title: string, description: string = '', priority: 'low' | 'medium' | 'high' = 'medium'): Todo {
    const todo = TodoFactory.createTodo(title, description, priority);
    const command = new AddTodoCommand(todo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(todo, 'add');
    return todo;
  }

  createHighPriorityTodo(title: string, description: string = ''): Todo {
    const todo = TodoFactory.createHighPriorityTodo(title, description);
    const command = new AddTodoCommand(todo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(todo, 'add');
    return todo;
  }

  // Update methods
  updateTodo(todoId: string, updates: Partial<Todo>): Todo | null {
    const existingTodo = this.todoStore.getTodoById(todoId);
    if (!existingTodo) {
      console.error(`Todo with id ${todoId} not found`);
      return null;
    }

    const updatedTodo: Todo = { ...existingTodo, ...updates };
    const command = new UpdateTodoCommand(updatedTodo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(updatedTodo, 'update');
    return updatedTodo;
  }

  // Decorator usage
  addDueDate(todoId: string, dueDate: Date): Todo | null {
    const todo = this.todoStore.getTodoById(todoId);
    if (!todo) {
      console.error(`Todo with id ${todoId} not found`);
      return null;
    }

    // Use decorators to add functionality
    const simpleTodo = new SimpleTodo(todo);
    const dueDateTodo = new DueDateTodoDecorator(simpleTodo, dueDate);
    
    // Update with decorated todo
    const updatedTodo = dueDateTodo.toObject();
    const command = new UpdateTodoCommand(updatedTodo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(updatedTodo, 'update');
    
    return updatedTodo;
  }

  addTags(todoId: string, tags: string[]): Todo | null {
    const todo = this.todoStore.getTodoById(todoId);
    if (!todo) {
      console.error(`Todo with id ${todoId} not found`);
      return null;
    }

    // Use decorators to add functionality
    const simpleTodo = new SimpleTodo(todo);
    const taggedTodo = new TaggedTodoDecorator(simpleTodo, tags);
    
    // Update with decorated todo
    const updatedTodo = taggedTodo.toObject();
    const command = new UpdateTodoCommand(updatedTodo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(updatedTodo, 'update');
    
    return updatedTodo;
  }

  // Delete method
  deleteTodo(todoId: string): boolean {
    const todo = this.todoStore.getTodoById(todoId);
    if (!todo) {
      console.error(`Todo with id ${todoId} not found`);
      return false;
    }

    const command = new DeleteTodoCommand(todoId, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(todo, 'delete');
    return true;
  }

  // Adapter usage
  importExternalTodo(externalTodo: ExternalTodo): Todo {
    const todo = TodoAdapter.adaptFromExternal(externalTodo);
    const command = new AddTodoCommand(todo, this.todoStore);
    this.commandManager.execute(command);
    this.todoSubject.notify(todo, 'add');
    return todo;
  }

  exportTodoToExternalFormat(todoId: string): ExternalTodo | null {
    const todo = this.todoStore.getTodoById(todoId);
    if (!todo) {
      console.error(`Todo with id ${todoId} not found`);
      return null;
    }
    return TodoAdapter.adaptToExternal(todo);
  }

  // Strategy pattern usage for filtering
  getTodos(): Todo[] {
    return this.filterContext.filterTodos(this.todoStore.getTodos());
  }

  showActiveTodos(): Todo[] {
    this.filterContext.setStrategy(new ActiveTodoFilter());
    return this.getTodos();
  }

  showCompletedTodos(): Todo[] {
    this.filterContext.setStrategy(new CompletedTodoFilter());
    return this.getTodos();
  }

  showTodosByPriority(priority: 'low' | 'medium' | 'high'): Todo[] {
    this.filterContext.setStrategy(new PriorityTodoFilter(priority));
    return this.getTodos();
  }

  // Command pattern usage for undo/redo
  undo(): void {
    this.commandManager.undo();
  }

  redo(): void {
    this.commandManager.redo();
  }

  // Clear history
  clearCommandHistory(): void {
    this.commandManager.clearHistory();
  }

  // Get all todos regardless of filter
  getAllTodos(): Todo[] {
    return this.todoStore.getTodos();
  }
} 