import { SimpleTodo, DueDateTodoDecorator, TaggedTodoDecorator } from './TodoDecorator';
import { Todo } from '../../models/Todo';

describe('TodoDecorator', () => {
  let baseTodo: Todo;
  
  beforeEach(() => {
    baseTodo = {
      id: '123',
      title: 'Test Todo',
      description: 'A test todo',
      completed: false,
      createdAt: new Date('2023-05-01T12:00:00.000Z'),
      priority: 'medium'
    };
  });
  
  describe('SimpleTodo', () => {
    it('should implement TodoComponent and provide access to Todo properties', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      
      expect(simpleTodo.getId()).toBe('123');
      expect(simpleTodo.getTitle()).toBe('Test Todo');
      expect(simpleTodo.getDescription()).toBe('A test todo');
      expect(simpleTodo.isCompleted()).toBe(false);
      expect(simpleTodo.getCreatedAt().toISOString()).toBe('2023-05-01T12:00:00.000Z');
      expect(simpleTodo.getPriority()).toBe('medium');
      expect(simpleTodo.getCategory()).toBeUndefined();
    });
    
    it('should return a copy of the todo object', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const todoObject = simpleTodo.toObject();
      
      // Verify it's a copy, not the original
      expect(todoObject).not.toBe(baseTodo);
      expect(todoObject).toEqual(baseTodo);
    });
  });
  
  describe('DueDateTodoDecorator', () => {
    it('should add due date functionality while preserving base behavior', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const dueDate = new Date('2023-05-15T12:00:00.000Z');
      const dueDateTodo = new DueDateTodoDecorator(simpleTodo, dueDate);
      
      // Should preserve base functionality
      expect(dueDateTodo.getId()).toBe('123');
      expect(dueDateTodo.getTitle()).toBe('Test Todo');
      
      // Should add new functionality
      expect(dueDateTodo.getDueDate()).toBe(dueDate);
      expect(dueDateTodo.isOverdue()).toBe(false); // Not overdue yet
    });
    
    it('should correctly determine if a todo is overdue', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      
      // A past date
      const pastDueDate = new Date();
      pastDueDate.setDate(pastDueDate.getDate() - 7); // 7 days ago
      
      const overdueTodo = new DueDateTodoDecorator(simpleTodo, pastDueDate);
      expect(overdueTodo.isOverdue()).toBe(true);
      
      // If todo is completed, should not be overdue
      const completedTodo = new SimpleTodo({
        ...baseTodo,
        completed: true
      });
      
      const completedOverdueTodo = new DueDateTodoDecorator(completedTodo, pastDueDate);
      expect(completedOverdueTodo.isOverdue()).toBe(false);
    });
    
    it('should include dueDate in the returned object', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const dueDate = new Date('2023-05-15T12:00:00.000Z');
      const dueDateTodo = new DueDateTodoDecorator(simpleTodo, dueDate);
      
      const todoObject = dueDateTodo.toObject() as Todo & { dueDate: Date };
      expect(todoObject.dueDate).toBe(dueDate);
    });
  });
  
  describe('TaggedTodoDecorator', () => {
    it('should add tags functionality while preserving base behavior', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const tags = ['important', 'work'];
      const taggedTodo = new TaggedTodoDecorator(simpleTodo, tags);
      
      // Should preserve base functionality
      expect(taggedTodo.getId()).toBe('123');
      expect(taggedTodo.getTitle()).toBe('Test Todo');
      
      // Should add new functionality
      expect(taggedTodo.getTags()).toEqual(['important', 'work']);
      expect(taggedTodo.getTags()).not.toBe(tags); // Should be a copy
    });
    
    it('should allow adding and removing tags', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const taggedTodo = new TaggedTodoDecorator(simpleTodo);
      
      expect(taggedTodo.getTags()).toEqual([]);
      
      taggedTodo.addTag('important');
      expect(taggedTodo.getTags()).toEqual(['important']);
      
      taggedTodo.addTag('work');
      expect(taggedTodo.getTags()).toEqual(['important', 'work']);
      
      // Adding a duplicate tag should not change anything
      taggedTodo.addTag('important');
      expect(taggedTodo.getTags()).toEqual(['important', 'work']);
      
      // Remove a tag
      taggedTodo.removeTag('important');
      expect(taggedTodo.getTags()).toEqual(['work']);
    });
    
    it('should include tags in the returned object', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const tags = ['important', 'work'];
      const taggedTodo = new TaggedTodoDecorator(simpleTodo, tags);
      
      const todoObject = taggedTodo.toObject() as Todo & { tags: string[] };
      expect(todoObject.tags).toEqual(['important', 'work']);
    });
  });
  
  describe('Combining Decorators', () => {
    it('should allow stacking multiple decorators', () => {
      const simpleTodo = new SimpleTodo(baseTodo);
      const dueDate = new Date('2023-05-15T12:00:00.000Z');
      
      // Stack decorators: First add due date, then add tags
      const dueDateTodo = new DueDateTodoDecorator(simpleTodo, dueDate);
      // Use type assertion for the combined decorator
      const taggedDueDateTodo = new TaggedTodoDecorator(dueDateTodo, ['important', 'work']) as unknown as 
        TaggedTodoDecorator & { getDueDate(): Date };
      
      // Should have functionality from both decorators
      expect(taggedDueDateTodo.getDueDate()).toBe(dueDate);
      expect(taggedDueDateTodo.getTags()).toEqual(['important', 'work']);
      
      // Base functionality should still work
      expect(taggedDueDateTodo.getTitle()).toBe('Test Todo');
      
      // Check the combined object
      const todoObject = taggedDueDateTodo.toObject() as Todo & { dueDate: Date; tags: string[] };
      expect(todoObject.id).toBe('123');
      expect(todoObject.dueDate).toBe(dueDate);
      expect(todoObject.tags).toEqual(['important', 'work']);
    });
  });
}); 