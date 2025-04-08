import { TodoObserver, TodoSubject, TodoLogger, TodoStateManager } from './TodoObserver';
import { Todo } from '../../models/Todo';

describe('TodoObserver', () => {
  let todoSubject: TodoSubject;
  let mockTodo: Todo;
  
  beforeEach(() => {
    todoSubject = new TodoSubject();
    mockTodo = {
      id: '123',
      title: 'Test Todo',
      description: 'A test todo',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
  });
  
  it('should attach and detach observers', () => {
    const observer1 = { update: jest.fn() } as TodoObserver;
    const observer2 = { update: jest.fn() } as TodoObserver;
    
    // Attach observers
    todoSubject.attach(observer1);
    todoSubject.attach(observer2);
    
    // Notify all observers
    todoSubject.notify(mockTodo, 'add');
    
    // Both observers should be notified
    expect(observer1.update).toHaveBeenCalledWith(mockTodo, 'add');
    expect(observer2.update).toHaveBeenCalledWith(mockTodo, 'add');
    
    // Detach one observer
    todoSubject.detach(observer1);
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Notify again
    todoSubject.notify(mockTodo, 'update');
    
    // Only observer2 should be notified
    expect(observer1.update).not.toHaveBeenCalled();
    expect(observer2.update).toHaveBeenCalledWith(mockTodo, 'update');
  });
  
  it('should not allow attaching the same observer multiple times', () => {
    const observer = { update: jest.fn() } as TodoObserver;
    
    // Attach the same observer twice
    todoSubject.attach(observer);
    todoSubject.attach(observer);
    
    // Notify all observers
    todoSubject.notify(mockTodo, 'add');
    
    // Observer should only be called once
    expect(observer.update).toHaveBeenCalledTimes(1);
  });
  
  describe('TodoLogger', () => {
    it('should log todo changes', () => {
      const logger = new TodoLogger();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Test different actions
      logger.update(mockTodo, 'add');
      logger.update(mockTodo, 'update');
      logger.update(mockTodo, 'delete');
      
      // Verify console.log was called with appropriate messages
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy.mock.calls[0][0]).toContain('Todo add: Test Todo');
      expect(consoleSpy.mock.calls[1][0]).toContain('Todo update: Test Todo');
      expect(consoleSpy.mock.calls[2][0]).toContain('Todo delete: Test Todo');
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('TodoStateManager', () => {
    it('should handle different todo actions', () => {
      const stateManager = new TodoStateManager();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Test different actions
      stateManager.update(mockTodo, 'add');
      stateManager.update(mockTodo, 'update');
      stateManager.update(mockTodo, 'delete');
      
      // Verify console.log was called with appropriate messages
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy.mock.calls[0][0]).toBe('New todo added: Test Todo');
      expect(consoleSpy.mock.calls[1][0]).toBe('Todo updated: Test Todo');
      expect(consoleSpy.mock.calls[2][0]).toBe('Todo deleted: Test Todo');
      
      consoleSpy.mockRestore();
    });
  });
  
  it('should work with multiple different observers', () => {
    const logger = new TodoLogger();
    const stateManager = new TodoStateManager();
    
    const loggerSpy = jest.spyOn(logger, 'update');
    const stateManagerSpy = jest.spyOn(stateManager, 'update');
    
    // Attach both observers
    todoSubject.attach(logger);
    todoSubject.attach(stateManager);
    
    // Notify all observers
    todoSubject.notify(mockTodo, 'add');
    
    // Both observers should be notified
    expect(loggerSpy).toHaveBeenCalledWith(mockTodo, 'add');
    expect(stateManagerSpy).toHaveBeenCalledWith(mockTodo, 'add');
    
    loggerSpy.mockRestore();
    stateManagerSpy.mockRestore();
  });
}); 