import { TodoAdapter, ExternalTodo } from './TodoAdapter';
import { Todo } from '../../models/Todo';

describe('TodoAdapter', () => {
  it('should adapt from external todo format to internal todo model', () => {
    const externalTodo: ExternalTodo = {
      task_id: '123',
      task_name: 'External Task',
      task_description: 'This is from an external system',
      is_complete: false,
      created: '2023-04-20T10:30:00.000Z',
      importance: 3, // high
      tag: 'external'
    };
    
    const internalTodo = TodoAdapter.adaptFromExternal(externalTodo);
    
    expect(internalTodo.id).toBe('123');
    expect(internalTodo.title).toBe('External Task');
    expect(internalTodo.description).toBe('This is from an external system');
    expect(internalTodo.completed).toBe(false);
    expect(internalTodo.createdAt).toBeInstanceOf(Date);
    expect(internalTodo.createdAt.toISOString()).toBe('2023-04-20T10:30:00.000Z');
    expect(internalTodo.priority).toBe('high');
    expect(internalTodo.category).toBe('external');
  });
  
  it('should handle unknown priority values and default to medium', () => {
    const externalTodo: ExternalTodo = {
      task_id: '123',
      task_name: 'External Task',
      is_complete: false,
      created: '2023-04-20T10:30:00.000Z',
      importance: 10 // invalid value
    };
    
    const internalTodo = TodoAdapter.adaptFromExternal(externalTodo);
    
    expect(internalTodo.priority).toBe('medium');
  });
  
  it('should adapt from internal todo model to external todo format', () => {
    const internalTodo: Todo = {
      id: '456',
      title: 'Internal Task',
      description: 'This is an internal task',
      completed: true,
      createdAt: new Date('2023-04-21T15:45:00.000Z'),
      priority: 'low',
      category: 'internal'
    };
    
    const externalTodo = TodoAdapter.adaptToExternal(internalTodo);
    
    expect(externalTodo.task_id).toBe('456');
    expect(externalTodo.task_name).toBe('Internal Task');
    expect(externalTodo.task_description).toBe('This is an internal task');
    expect(externalTodo.is_complete).toBe(true);
    expect(externalTodo.created).toBe('2023-04-21T15:45:00.000Z');
    expect(externalTodo.importance).toBe(1); // low = 1
    expect(externalTodo.tag).toBe('internal');
  });
  
  it('should handle round-trip conversion without data loss', () => {
    const originalTodo: Todo = {
      id: '789',
      title: 'Round Trip Test',
      description: 'Testing full conversion cycle',
      completed: false,
      createdAt: new Date('2023-05-01T09:00:00.000Z'),
      priority: 'medium',
      category: 'test'
    };
    
    // Convert to external format
    const externalTodo = TodoAdapter.adaptToExternal(originalTodo);
    
    // Convert back to internal format
    const roundTripTodo = TodoAdapter.adaptFromExternal(externalTodo);
    
    // Verify all properties made it through the round trip
    expect(roundTripTodo.id).toBe(originalTodo.id);
    expect(roundTripTodo.title).toBe(originalTodo.title);
    expect(roundTripTodo.description).toBe(originalTodo.description);
    expect(roundTripTodo.completed).toBe(originalTodo.completed);
    expect(roundTripTodo.createdAt.toISOString()).toBe(originalTodo.createdAt.toISOString());
    expect(roundTripTodo.priority).toBe(originalTodo.priority);
    expect(roundTripTodo.category).toBe(originalTodo.category);
  });
}); 