import { TodoFactory } from './TodoFactory';

describe('TodoFactory', () => {
  it('should create a todo with default values', () => {
    const title = 'Test Todo';
    const todo = TodoFactory.createTodo(title);
    
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(title);
    expect(todo.description).toBe('');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.priority).toBe('medium');
  });
  
  it('should create a high priority todo', () => {
    const title = 'High Priority Todo';
    const description = 'This is important';
    const todo = TodoFactory.createHighPriorityTodo(title, description);
    
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(title);
    expect(todo.description).toBe(description);
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.priority).toBe('high');
  });
  
  it('should create a low priority todo', () => {
    const title = 'Low Priority Todo';
    const todo = TodoFactory.createLowPriorityTodo(title);
    
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(title);
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.priority).toBe('low');
  });
  
  it('should create a quick todo', () => {
    const title = 'Quick Todo';
    const todo = TodoFactory.createQuickTodo(title);
    
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe(title);
    expect(todo.description).toBe('Quick task');
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeInstanceOf(Date);
    expect(todo.priority).toBe('medium');
  });
}); 