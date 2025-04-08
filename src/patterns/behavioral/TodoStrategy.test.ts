import {
  TodoFilterStrategy,
  CompletedTodoFilter,
  ActiveTodoFilter,
  PriorityTodoFilter,
  CategoryTodoFilter,
  DateRangeTodoFilter,
  TodoFilterContext
} from './TodoStrategy';
import { Todo } from '../../models/Todo';

describe('TodoStrategy', () => {
  let todos: Todo[];
  
  beforeEach(() => {
    // Set up test data
    todos = [
      {
        id: '1',
        title: 'Active High Priority',
        completed: false,
        createdAt: new Date('2023-05-01'),
        priority: 'high',
        category: 'work'
      },
      {
        id: '2',
        title: 'Active Medium Priority',
        completed: false,
        createdAt: new Date('2023-05-02'),
        priority: 'medium',
        category: 'work'
      },
      {
        id: '3',
        title: 'Completed Low Priority',
        completed: true,
        createdAt: new Date('2023-05-03'),
        priority: 'low',
        category: 'personal'
      },
      {
        id: '4',
        title: 'Completed High Priority',
        completed: true,
        createdAt: new Date('2023-05-04'),
        priority: 'high',
        category: 'personal'
      },
      {
        id: '5',
        title: 'Active Low Priority',
        completed: false,
        createdAt: new Date('2023-05-05'),
        priority: 'low',
        category: 'personal'
      }
    ];
  });
  
  describe('CompletedTodoFilter', () => {
    it('should filter completed todos', () => {
      const strategy = new CompletedTodoFilter();
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.completed)).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['3', '4']);
    });
  });
  
  describe('ActiveTodoFilter', () => {
    it('should filter active (not completed) todos', () => {
      const strategy = new ActiveTodoFilter();
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(3);
      expect(result.every(todo => !todo.completed)).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['1', '2', '5']);
    });
  });
  
  describe('PriorityTodoFilter', () => {
    it('should filter high priority todos', () => {
      const strategy = new PriorityTodoFilter('high');
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.priority === 'high')).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['1', '4']);
    });
    
    it('should filter medium priority todos', () => {
      const strategy = new PriorityTodoFilter('medium');
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(1);
      expect(result.every(todo => todo.priority === 'medium')).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['2']);
    });
    
    it('should filter low priority todos', () => {
      const strategy = new PriorityTodoFilter('low');
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.priority === 'low')).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['3', '5']);
    });
  });
  
  describe('CategoryTodoFilter', () => {
    it('should filter todos by work category', () => {
      const strategy = new CategoryTodoFilter('work');
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.category === 'work')).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['1', '2']);
    });
    
    it('should filter todos by personal category', () => {
      const strategy = new CategoryTodoFilter('personal');
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(3);
      expect(result.every(todo => todo.category === 'personal')).toBe(true);
      expect(result.map(todo => todo.id)).toEqual(['3', '4', '5']);
    });
  });
  
  describe('DateRangeTodoFilter', () => {
    it('should filter todos within a date range', () => {
      const startDate = new Date('2023-05-02');
      const endDate = new Date('2023-05-04');
      const strategy = new DateRangeTodoFilter(startDate, endDate);
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(3);
      expect(result.map(todo => todo.id)).toEqual(['2', '3', '4']);
    });
    
    it('should handle same day range', () => {
      const date = new Date('2023-05-03');
      const strategy = new DateRangeTodoFilter(date, date);
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(1);
      expect(result.map(todo => todo.id)).toEqual(['3']);
    });
    
    it('should return empty array when no todos match the date range', () => {
      const startDate = new Date('2023-06-01');
      const endDate = new Date('2023-06-30');
      const strategy = new DateRangeTodoFilter(startDate, endDate);
      const result = strategy.filter(todos);
      
      expect(result.length).toBe(0);
    });
  });
  
  describe('TodoFilterContext', () => {
    it('should use the specified filter strategy', () => {
      const activeFilter = new ActiveTodoFilter();
      const filterContext = new TodoFilterContext(activeFilter);
      
      const result = filterContext.filterTodos(todos);
      expect(result.length).toBe(3);
      expect(result.every(todo => !todo.completed)).toBe(true);
    });
    
    it('should allow changing strategies', () => {
      const filterContext = new TodoFilterContext(new ActiveTodoFilter());
      
      // Initially using ActiveTodoFilter
      let result = filterContext.filterTodos(todos);
      expect(result.length).toBe(3);
      expect(result.every(todo => !todo.completed)).toBe(true);
      
      // Change to CompletedTodoFilter
      filterContext.setStrategy(new CompletedTodoFilter());
      result = filterContext.filterTodos(todos);
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.completed)).toBe(true);
      
      // Change to PriorityTodoFilter
      filterContext.setStrategy(new PriorityTodoFilter('high'));
      result = filterContext.filterTodos(todos);
      expect(result.length).toBe(2);
      expect(result.every(todo => todo.priority === 'high')).toBe(true);
    });
  });
}); 