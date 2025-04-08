import { Command, AddTodoCommand, UpdateTodoCommand, DeleteTodoCommand, CommandManager } from './TodoCommand';
import { TodoStore } from '../creational/TodoStore';
import { Todo } from '../../models/Todo';

describe('TodoCommand', () => {
  let todoStore: TodoStore;
  let commandManager: CommandManager;
  let testTodo: Todo;
  
  beforeEach(() => {
    // Get a clean TodoStore instance for each test
    todoStore = TodoStore.getInstance();
    const todos = todoStore.getTodos();
    todos.forEach(todo => {
      todoStore.deleteTodo(todo.id);
    });
    
    // Create a command manager
    commandManager = new CommandManager();
    
    // Create a test todo
    testTodo = {
      id: '123',
      title: 'Test Todo',
      description: 'Test description',
      completed: false,
      createdAt: new Date(),
      priority: 'medium'
    };
  });
  
  describe('AddTodoCommand', () => {
    it('should add a todo when executed', () => {
      const command = new AddTodoCommand(testTodo, todoStore);
      command.execute();
      
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].id).toBe('123');
      expect(todos[0].title).toBe('Test Todo');
    });
    
    it('should remove the todo when undone', () => {
      const command = new AddTodoCommand(testTodo, todoStore);
      command.execute();
      command.undo();
      
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(0);
    });
  });
  
  describe('UpdateTodoCommand', () => {
    it('should update a todo when executed', () => {
      // First add a todo
      todoStore.addTodo(testTodo);
      
      // Create updated todo
      const updatedTodo: Todo = {
        ...testTodo,
        title: 'Updated Todo',
        completed: true
      };
      
      // Create and execute update command
      const command = new UpdateTodoCommand(updatedTodo, todoStore);
      command.execute();
      
      // Verify the todo was updated
      const todo = todoStore.getTodoById('123');
      expect(todo).toBeDefined();
      expect(todo?.title).toBe('Updated Todo');
      expect(todo?.completed).toBe(true);
    });
    
    it('should restore the original todo when undone', () => {
      // First add a todo
      todoStore.addTodo(testTodo);
      
      // Create updated todo
      const updatedTodo: Todo = {
        ...testTodo,
        title: 'Updated Todo',
        completed: true
      };
      
      // Create and execute update command
      const command = new UpdateTodoCommand(updatedTodo, todoStore);
      command.execute();
      command.undo();
      
      // Verify the todo was restored
      const todo = todoStore.getTodoById('123');
      expect(todo).toBeDefined();
      expect(todo?.title).toBe('Test Todo');
      expect(todo?.completed).toBe(false);
    });
  });
  
  describe('DeleteTodoCommand', () => {
    it('should delete a todo when executed', () => {
      // First add a todo
      todoStore.addTodo(testTodo);
      expect(todoStore.getTodos().length).toBe(1);
      
      // Create and execute delete command
      const command = new DeleteTodoCommand('123', todoStore);
      command.execute();
      
      // Verify the todo was deleted
      expect(todoStore.getTodos().length).toBe(0);
    });
    
    it('should restore the deleted todo when undone', () => {
      // First add a todo
      todoStore.addTodo(testTodo);
      
      // Create and execute delete command
      const command = new DeleteTodoCommand('123', todoStore);
      command.execute();
      command.undo();
      
      // Verify the todo was restored
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].id).toBe('123');
      expect(todos[0].title).toBe('Test Todo');
    });
    
    it('should throw an error when trying to delete a non-existent todo', () => {
      expect(() => {
        new DeleteTodoCommand('nonexistent', todoStore);
      }).toThrow();
    });
  });
  
  describe('CommandManager', () => {
    it('should execute commands and keep track of history', () => {
      // Create commands
      const addCommand = new AddTodoCommand(testTodo, todoStore);
      const updatedTodo: Todo = {
        ...testTodo,
        title: 'Updated Todo'
      };
      const updateCommand = new UpdateTodoCommand(updatedTodo, todoStore);
      
      // Execute commands
      commandManager.execute(addCommand);
      commandManager.execute(updateCommand);
      
      // Verify todos were added and updated
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Updated Todo');
    });
    
    it('should undo commands in reverse order', () => {
      // Create commands
      const addCommand = new AddTodoCommand(testTodo, todoStore);
      const updatedTodo: Todo = {
        ...testTodo,
        title: 'Updated Todo'
      };
      const updateCommand = new UpdateTodoCommand(updatedTodo, todoStore);
      
      // Execute commands
      commandManager.execute(addCommand);
      commandManager.execute(updateCommand);
      
      // Undo last command (update)
      commandManager.undo();
      
      // Verify update was undone
      let todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Test Todo');
      
      // Undo first command (add)
      commandManager.undo();
      
      // Verify add was undone
      todos = todoStore.getTodos();
      expect(todos.length).toBe(0);
    });
    
    it('should redo undone commands', () => {
      // Create and execute add command
      const addCommand = new AddTodoCommand(testTodo, todoStore);
      commandManager.execute(addCommand);
      
      // Undo the command
      commandManager.undo();
      expect(todoStore.getTodos().length).toBe(0);
      
      // Redo the command
      commandManager.redo();
      
      // Verify the command was redone
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].id).toBe('123');
    });
    
    it('should clear history when commanded', () => {
      // Create and execute commands
      const addCommand = new AddTodoCommand(testTodo, todoStore);
      commandManager.execute(addCommand);
      
      // Clear history
      commandManager.clearHistory();
      
      // Try to undo (should do nothing since history is cleared)
      commandManager.undo();
      
      // Verify todo is still there (undo didn't work)
      expect(todoStore.getTodos().length).toBe(1);
    });
    
    it('should clear undone commands when a new command is executed', () => {
      // Create and execute first command
      const addCommand = new AddTodoCommand(testTodo, todoStore);
      commandManager.execute(addCommand);
      
      // Undo the command
      commandManager.undo();
      
      // Execute a new command
      const newTodo: Todo = {
        id: '456',
        title: 'New Todo',
        completed: false,
        createdAt: new Date(),
        priority: 'low'
      };
      const newAddCommand = new AddTodoCommand(newTodo, todoStore);
      commandManager.execute(newAddCommand);
      
      // Try to redo (should do nothing because undone commands were cleared)
      commandManager.redo();
      
      // Verify only the new todo exists
      const todos = todoStore.getTodos();
      expect(todos.length).toBe(1);
      expect(todos[0].id).toBe('456');
    });
  });
}); 