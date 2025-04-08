import { TodoStore } from './TodoStore';
import { Todo } from '../../models/Todo';

describe('TodoStore', () => {
  // Clear the store before each test
  beforeEach(() => {
    const store = TodoStore.getInstance();
    const todos = store.getTodos();
    todos.forEach(todo => {
      store.deleteTodo(todo.id);
    });
  });

  it('should always return the same instance (Singleton pattern)', () => {
    const instance1 = TodoStore.getInstance();
    const instance2 = TodoStore.getInstance();
    
    expect(instance1).toBe(instance2);
  });

  it('should add a todo to the store', () => {
    const store = TodoStore.getInstance();
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    store.addTodo(todo);
    const todos = store.getTodos();
    
    expect(todos.length).toBe(1);
    expect(todos[0].id).toBe('1');
    expect(todos[0].title).toBe('Test Todo');
  });

  it('should update a todo in the store', () => {
    const store = TodoStore.getInstance();
    const todo: Todo = {
      id: '1',
      title: 'Original Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    store.addTodo(todo);
    
    const updatedTodo: Todo = {
      ...todo,
      title: 'Updated Todo',
      completed: true
    };
    
    store.updateTodo(updatedTodo);
    const result = store.getTodoById('1');
    
    expect(result).toBeDefined();
    expect(result?.title).toBe('Updated Todo');
    expect(result?.completed).toBe(true);
  });

  it('should delete a todo from the store', () => {
    const store = TodoStore.getInstance();
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    store.addTodo(todo);
    expect(store.getTodos().length).toBe(1);
    
    store.deleteTodo('1');
    expect(store.getTodos().length).toBe(0);
  });

  it('should get a todo by id', () => {
    const store = TodoStore.getInstance();
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    store.addTodo(todo);
    const result = store.getTodoById('1');
    
    expect(result).toBeDefined();
    expect(result?.id).toBe('1');
    expect(result?.title).toBe('Test Todo');
  });

  it('should return a copy of todos array to prevent direct mutation', () => {
    const store = TodoStore.getInstance();
    const todo: Todo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
    
    store.addTodo(todo);
    const todos = store.getTodos();
    
    // Attempt to mutate the returned array
    todos.push({
      id: '2',
      title: 'Another Todo',
      completed: false,
      createdAt: new Date(),
      priority: 'low'
    });
    
    // Check if the store's internal array was affected
    expect(store.getTodos().length).toBe(1);
  });
}); 