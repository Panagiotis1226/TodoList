import { Todo } from '../../models/Todo';
import TodoModel, { ITodo } from '../../models/TodoModel';

// Singleton Pattern - Ensures only one instance of the TodoStore exists
export class TodoStore {
  private static instance: TodoStore;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  public static getInstance(): TodoStore {
    if (!TodoStore.instance) {
      TodoStore.instance = new TodoStore();
    }
    return TodoStore.instance;
  }

  public async addTodo(todo: Todo): Promise<void> {
    const todoDoc = new TodoModel(todo);
    await todoDoc.save();
  }

  public async updateTodo(updatedTodo: Todo): Promise<void> {
    await TodoModel.findOneAndUpdate({ id: updatedTodo.id }, updatedTodo, { new: true });
  }

  public async deleteTodo(id: string): Promise<void> {
    await TodoModel.findOneAndDelete({ id });
  }

  public async getTodos(): Promise<Todo[]> {
    const todos = await TodoModel.find();
    return todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      priority: todo.priority,
      category: todo.category
    }));
  }

  public async getTodoById(id: string): Promise<Todo | null> {
    const todo = await TodoModel.findOne({ id });
    if (!todo) return null;
    
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      priority: todo.priority,
      category: todo.category
    };
  }
} 