import React, { useState, useEffect } from 'react';
import { Todo } from '../models/Todo';
import { TodoService } from '../services/TodoService';
import { 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit, Undo, Redo, Add, DateRange, Label } from '@mui/icons-material';

// TodoList component - Uses Facade pattern (TodoService) to interact with the various patterns
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'low' | 'medium' | 'high'>('active');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isTagDialogOpen, setTagDialogOpen] = useState(false);
  const [isDueDateDialogOpen, setDueDateDialogOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Create a singleton instance of TodoService
  const todoService = new TodoService();
  
  // Load todos on component mount and whenever filter changes
  useEffect(() => {
    loadTodos();
  }, [filter]);
  
  const loadTodos = () => {
    let filteredTodos: Todo[];
    
    switch (filter) {
      case 'active':
        filteredTodos = todoService.showActiveTodos();
        break;
      case 'completed':
        filteredTodos = todoService.showCompletedTodos();
        break;
      case 'low':
      case 'medium':
      case 'high':
        filteredTodos = todoService.showTodosByPriority(filter);
        break;
      default:
        filteredTodos = todoService.getAllTodos();
    }
    
    setTodos(filteredTodos);
  };
  
  const handleAddTodo = () => {
    if (!title.trim()) return;
    
    if (priority === 'high') {
      todoService.createHighPriorityTodo(title, description);
    } else {
      todoService.createTodo(title, description, priority);
    }
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    loadTodos();
  };
  
  const handleUpdateTodo = () => {
    if (editingTodo && editingTodo.id) {
      todoService.updateTodo(editingTodo.id, editingTodo);
      setEditingTodo(null);
      loadTodos();
    }
  };
  
  const handleToggleComplete = (todoId: string, completed: boolean) => {
    todoService.updateTodo(todoId, { completed: !completed });
    loadTodos();
  };
  
  const handleDeleteTodo = (todoId: string) => {
    todoService.deleteTodo(todoId);
    loadTodos();
  };
  
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo({ ...todo });
  };
  
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };
  
  const handleUndo = () => {
    todoService.undo();
    loadTodos();
  };
  
  const handleRedo = () => {
    todoService.redo();
    loadTodos();
  };
  
  const openTagDialog = (todoId: string) => {
    setSelectedTodoId(todoId);
    setTagDialogOpen(true);
  };
  
  const closeTagDialog = () => {
    setTagDialogOpen(false);
    setSelectedTodoId(null);
    setTags('');
  };
  
  const openDueDateDialog = (todoId: string) => {
    setSelectedTodoId(todoId);
    setDueDateDialogOpen(true);
  };
  
  const closeDueDateDialog = () => {
    setDueDateDialogOpen(false);
    setSelectedTodoId(null);
    setDueDate('');
  };
  
  const handleAddTags = () => {
    if (selectedTodoId && tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      todoService.addTags(selectedTodoId, tagArray);
      closeTagDialog();
      loadTodos();
    }
  };
  
  const handleAddDueDate = () => {
    if (selectedTodoId && dueDate) {
      todoService.addDueDate(selectedTodoId, new Date(dueDate));
      closeDueDateDialog();
      loadTodos();
    }
  };
  
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Todo List - Design Patterns Demo
      </Typography>
      
      {/* Filter controls */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter Todos</InputLabel>
          <Select
            value={filter}
            label="Filter Todos"
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <MenuItem value="all">All Todos</MenuItem>
            <MenuItem value="active">Active Todos</MenuItem>
            <MenuItem value="completed">Completed Todos</MenuItem>
            <MenuItem value="low">Low Priority</MenuItem>
            <MenuItem value="medium">Medium Priority</MenuItem>
            <MenuItem value="high">High Priority</MenuItem>
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            startIcon={<Undo />} 
            onClick={handleUndo}
          >
            Undo
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Redo />} 
            onClick={handleRedo}
          >
            Redo
          </Button>
        </Box>
      </Box>
      
      {/* Add todo form */}
      <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Add New Todo
        </Typography>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            label="Priority"
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAddTodo}
        >
          Add Todo
        </Button>
      </Box>
      
      {/* Edit todo form */}
      {editingTodo && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Edit Todo
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={editingTodo.title}
            onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editingTodo.description || ''}
            onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={editingTodo.priority}
              label="Priority"
              onChange={(e) => setEditingTodo({ ...editingTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              onClick={handleUpdateTodo}
            >
              Update
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Todo list */}
      <List sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
        {todos.length === 0 ? (
          <ListItem>
            <ListItemText primary="No todos found" />
          </ListItem>
        ) : (
          todos.map((todo) => (
            <ListItem
              key={todo.id}
              sx={{ 
                borderBottom: '1px solid #e0e0e0',
                bgcolor: todo.priority === 'high' ? '#fff8e1' : 
                        todo.priority === 'medium' ? '#e8f5e9' : '#f5f5f5'
              }}
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    onClick={() => openTagDialog(todo.id)}
                    title="Add Tags"
                  >
                    <Label />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => openDueDateDialog(todo.id)}
                    title="Add Due Date"
                  >
                    <DateRange />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleEditTodo(todo)}
                    title="Edit Todo"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleDeleteTodo(todo.id)}
                    title="Delete Todo"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              }
            >
              <Checkbox
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                edge="start"
              />
              <ListItemText
                primary={todo.title}
                secondary={
                  <Box>
                    <Typography variant="body2" component="span">
                      {todo.description}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Priority: {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </Typography>
                    {todo.category && (
                      <Typography variant="caption" display="block">
                        Category: {todo.category}
                      </Typography>
                    )}
                    {(todo as any).tags && (
                      <Typography variant="caption" display="block">
                        Tags: {(todo as any).tags.join(', ')}
                      </Typography>
                    )}
                    {(todo as any).dueDate && (
                      <Typography variant="caption" display="block">
                        Due: {new Date((todo as any).dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.7 : 1
                }}
              />
            </ListItem>
          ))
        )}
      </List>
      
      {/* Add Tags Dialog */}
      <Dialog open={isTagDialogOpen} onClose={closeTagDialog}>
        <DialogTitle>Add Tags</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, urgent, meeting, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTagDialog}>Cancel</Button>
          <Button onClick={handleAddTags}>Add Tags</Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Due Date Dialog */}
      <Dialog open={isDueDateDialogOpen} onClose={closeDueDateDialog}>
        <DialogTitle>Add Due Date</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDueDateDialog}>Cancel</Button>
          <Button onClick={handleAddDueDate}>Add Due Date</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList; 