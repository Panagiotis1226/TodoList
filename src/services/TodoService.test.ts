import { TodoService } from './TodoService';
import { TodoStore } from '../patterns/creational/TodoStore';
import { ExternalTodo } from '../patterns/structural/TodoAdapter';

describe('TodoService', () => {
  let todoService: TodoService;
  let todoStore: TodoStore;
  
  beforeEach(() => {
    // Clear the store
    todoStore = TodoStore.getInstance();
    const todos = todoStore.getTodos();
    todos.forEach(todo => {
      todoStore.deleteTodo(todo.id);
    });
    
    // Create a new TodoService instance
    todoService = new TodoService();
  });
  
  describe('Todo Creation (Factory Pattern)', () => {
    it('should create a todo with default properties', () => {
      const todo = todoService.createTodo('Test Todo');
      
      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.priority).toBe('medium');
      
      // Check if todo was added to the store
      const storedTodos = todoStore.getTodos();
      expect(storedTodos.length).toBe(1);
      expect(storedTodos[0].id).toBe(todo.id);
    });
    
    it('should create a high priority todo', () => {
      const todo = todoService.createHighPriorityTodo('Important Task');
      
      expect(todo.priority).toBe('high');
      expect(todo.title).toBe('Important Task');
      
      // Check if todo was added to the store
      const storedTodos = todoStore.getTodos();
      expect(storedTodos.length).toBe(1);
      expect(storedTodos[0].priority).toBe('high');
    });
  });
  
  describe('Todo Updates and Commands', () => {
    it('should update a todo', () => {
      // Create a todo
      const todo = todoService.createTodo('Original Title');
      
      // Update the todo
      const updatedTodo = todoService.updateTodo(todo.id, {
        title: 'Updated Title',
        completed: true
      });
      
      expect(updatedTodo).not.toBeNull();
      expect(updatedTodo?.title).toBe('Updated Title');
      expect(updatedTodo?.completed).toBe(true);
      
      // Verify the update in the store
      const storedTodo = todoStore.getTodoById(todo.id);
      expect(storedTodo?.title).toBe('Updated Title');
      expect(storedTodo?.completed).toBe(true);
    });
    
    it('should handle undo operations', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo');
      
      // Update the todo
      todoService.updateTodo(todo.id, { title: 'Updated Title' });
      
      // Undo the update
      todoService.undo();
      
      // Verify the undo worked
      const storedTodo = todoStore.getTodoById(todo.id);
      expect(storedTodo?.title).toBe('Test Todo');
      
      // Undo the create
      todoService.undo();
      
      // Verify the todo is gone
      expect(todoStore.getTodos().length).toBe(0);
    });
    
    it('should handle redo operations', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo');
      
      // Undo the create
      todoService.undo();
      expect(todoStore.getTodos().length).toBe(0);
      
      // Redo the create
      todoService.redo();
      
      // Verify the redo worked
      expect(todoStore.getTodos().length).toBe(1);
      expect(todoStore.getTodos()[0].title).toBe('Test Todo');
    });
  });
  
  describe('Decorator Pattern Usage', () => {
    it('should add due date to a todo', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo');
      
      // Add due date
      const dueDate = new Date('2023-12-31');
      const decoratedTodo = todoService.addDueDate(todo.id, dueDate);
      
      expect(decoratedTodo).not.toBeNull();
      // Check that dueDate is present in the decorated todo
      expect((decoratedTodo as any).dueDate).toEqual(dueDate);
      
      // Verify it was stored
      const storedTodo = todoStore.getTodoById(todo.id);
      expect((storedTodo as any).dueDate).toEqual(dueDate);
    });
    
    it('should add tags to a todo', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo');
      
      // Add tags
      const tags = ['important', 'work'];
      const decoratedTodo = todoService.addTags(todo.id, tags);
      
      expect(decoratedTodo).not.toBeNull();
      // Check that tags are present in the decorated todo
      expect((decoratedTodo as any).tags).toEqual(tags);
      
      // Verify it was stored
      const storedTodo = todoStore.getTodoById(todo.id);
      expect((storedTodo as any).tags).toEqual(tags);
    });
  });
  
  describe('Adapter Pattern Usage', () => {
    it('should import external todo format', () => {
      // Create an external todo
      const externalTodo: ExternalTodo = {
        task_id: 'ext-123',
        task_name: 'External Task',
        task_description: 'Imported from external system',
        is_complete: false,
        created: new Date().toISOString(),
        importance: 3, // high
        tag: 'external'
      };
      
      // Import the external todo
      const importedTodo = todoService.importExternalTodo(externalTodo);
      
      expect(importedTodo.id).toBe('ext-123');
      expect(importedTodo.title).toBe('External Task');
      expect(importedTodo.description).toBe('Imported from external system');
      expect(importedTodo.priority).toBe('high');
      expect(importedTodo.category).toBe('external');
      
      // Verify it was added to the store
      const storedTodo = todoStore.getTodoById('ext-123');
      expect(storedTodo).toBeDefined();
    });
    
    it('should export todo to external format', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo', 'Test Description', 'medium');
      todo.category = 'test';
      
      // Update it in the store
      todoStore.updateTodo(todo);
      
      // Export to external format
      const externalTodo = todoService.exportTodoToExternalFormat(todo.id);
      
      expect(externalTodo).not.toBeNull();
      expect(externalTodo?.task_id).toBe(todo.id);
      expect(externalTodo?.task_name).toBe('Test Todo');
      expect(externalTodo?.task_description).toBe('Test Description');
      expect(externalTodo?.importance).toBe(2); // medium
      expect(externalTodo?.tag).toBe('test');
    });
  });
  
  describe('Strategy Pattern Usage', () => {
    it('should filter active todos', () => {
      // Create todos with different statuses
      todoService.createTodo('Active Todo 1');
      todoService.createTodo('Active Todo 2');
      const completedTodo = todoService.createTodo('Completed Todo');
      todoService.updateTodo(completedTodo.id, { completed: true });
      
      // Get active todos
      const activeTodos = todoService.showActiveTodos();
      
      expect(activeTodos.length).toBe(2);
      expect(activeTodos.every(todo => !todo.completed)).toBe(true);
      expect(activeTodos.map(todo => todo.title)).toContain('Active Todo 1');
      expect(activeTodos.map(todo => todo.title)).toContain('Active Todo 2');
    });
    
    it('should filter completed todos', () => {
      // Create todos with different statuses
      todoService.createTodo('Active Todo');
      const completedTodo1 = todoService.createTodo('Completed Todo 1');
      const completedTodo2 = todoService.createTodo('Completed Todo 2');
      todoService.updateTodo(completedTodo1.id, { completed: true });
      todoService.updateTodo(completedTodo2.id, { completed: true });
      
      // Get completed todos
      const completedTodos = todoService.showCompletedTodos();
      
      expect(completedTodos.length).toBe(2);
      expect(completedTodos.every(todo => todo.completed)).toBe(true);
      expect(completedTodos.map(todo => todo.title)).toContain('Completed Todo 1');
      expect(completedTodos.map(todo => todo.title)).toContain('Completed Todo 2');
    });
    
    it('should filter todos by priority', () => {
      // Create todos with different priorities
      todoService.createTodo('Medium Todo', '', 'medium');
      todoService.createHighPriorityTodo('High Todo 1');
      todoService.createHighPriorityTodo('High Todo 2');
      
      // Get high priority todos
      const highPriorityTodos = todoService.showTodosByPriority('high');
      
      expect(highPriorityTodos.length).toBe(2);
      expect(highPriorityTodos.every(todo => todo.priority === 'high')).toBe(true);
      expect(highPriorityTodos.map(todo => todo.title)).toContain('High Todo 1');
      expect(highPriorityTodos.map(todo => todo.title)).toContain('High Todo 2');
    });
  });
  
  describe('Delete Operation', () => {
    it('should delete a todo', () => {
      // Create a todo
      const todo = todoService.createTodo('Test Todo');
      expect(todoStore.getTodos().length).toBe(1);
      
      // Delete the todo
      const result = todoService.deleteTodo(todo.id);
      
      expect(result).toBe(true);
      expect(todoStore.getTodos().length).toBe(0);
    });
    
    it('should return false when deleting a non-existent todo', () => {
      const result = todoService.deleteTodo('nonexistent');
      expect(result).toBe(false);
    });
  });
}); 