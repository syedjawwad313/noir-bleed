import { useState, useEffect } from 'react';
import './App.css';

// ========================================
// HEADER COMPONENT
// ========================================
function TodoHeader({ totalTasks, completedTasks }) {
  return (
    <div className="header">
      <h1 className="headerTitle">✨ My To-Do List</h1>
      {totalTasks > 0 && (
        <div className="headerStats">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      )}
    </div>
  );
}

// ========================================
// ADD TASK COMPONENT
// ========================================
function AddTaskSection({ inputValue, setInputValue, onAddTask }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddTask();
    }
  };

  return (
    <div className="inputSection">
      <div className="inputContainer">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What needs to be done?"
          className="input"
        />
        <button
          onClick={onAddTask}
          className="addButton"
          disabled={inputValue.trim() === ''}
        >
          ➕ Add Task
        </button>
      </div>
    </div>
  );
}

// ========================================
// FILTER CONTROLS COMPONENT
// ========================================
function FilterControls({
  filter,
  setFilter,
  totalTasks,
  pendingTasks,
  completedTasks,
  onCompleteAll,
  onClearCompleted,
  allCompleted
}) {
  if (totalTasks === 0) return null;

  return (
    <div className="controlsContainer">
      {/* Filter Buttons */}
      <div className="filterButtons">
        {['all', 'pending', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`filterButton ${filter === filterType ? 'filterButtonActive' : ''}`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType === 'all' && ` (${totalTasks})`}
            {filterType === 'pending' && ` (${pendingTasks})`}
            {filterType === 'completed' && ` (${completedTasks})`}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="actionButtons">
        <button
          onClick={onCompleteAll}
          className="actionButton completeAllButton"
          title={allCompleted ? "Mark all as pending" : "Mark all as completed"}
        >
          {allCompleted ? '↩️' : '✅'} All
        </button>
        {completedTasks > 0 && (
          <button
            onClick={onClearCompleted}
            className="actionButton clearButton"
            title="Clear completed tasks"
          >
            🧹 Clear
          </button>
        )}
      </div>
    </div>
  );
}

// ========================================
// INDIVIDUAL TASK ITEM COMPONENT
// ========================================
function TaskItem({
  todo,
  onToggleComplete,
  onDeleteTask,
  onStartEdit,
  editingId,
  editValue,
  setEditValue,
  onSaveEdit,
  onCancelEdit
}) {
  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div className={`taskItem ${todo.completed ? 'taskItemCompleted' : 'taskItemPending'}`}>
      {/* Complete/Uncomplete Button */}
      <button
        onClick={() => onToggleComplete(todo.id)}
        className={`checkButton ${todo.completed ? 'checkButtonCompleted' : 'checkButtonPending'}`}
      >
        {todo.completed && '✓'}
      </button>

      {/* Task Content */}
      <div className="taskContent">
        {editingId === todo.id ? (
          // Edit Mode
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={handleEditKeyPress}
            onBlur={onSaveEdit}
            className="editInput"
            autoFocus
          />
        ) : (
          // Display Mode
          <div>
            <span
              className={`taskText ${todo.completed ? 'taskTextCompleted' : 'taskTextPending'}`}
              onDoubleClick={() => !todo.completed && onStartEdit(todo.id, todo.text)}
              title="Double-click to edit"
            >
              {todo.text}
            </span>
            <div className="dateText">
              Created: {new Date(todo.createdAt).toLocaleDateString()}
              {todo.completed && todo.completedAt && (
                <> • Completed: {new Date(todo.completedAt).toLocaleDateString()}</>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Actions */}
      <div className="taskActions">
        {editingId === todo.id ? (
          // Edit Mode Actions
          <>
            <button
              onClick={onSaveEdit}
              className="actionIcon saveIcon"
              title="Save changes"
            >
              💾
            </button>
            <button
              onClick={onCancelEdit}
              className="actionIcon cancelIcon"
              title="Cancel editing"
            >
              ❌
            </button>
          </>
        ) : (
          // Normal Mode Actions
          <>
            {!todo.completed && (
              <button
                onClick={() => onStartEdit(todo.id, todo.text)}
                className="actionIcon editIcon"
                title="Edit task"
              >
                ✏️
              </button>
            )}
            <button
              onClick={() => onDeleteTask(todo.id)}
              className="actionIcon deleteIcon"
              title="Delete task"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ========================================
// TASKS LIST COMPONENT
// ========================================
function TasksList({
  filteredTodos,
  filter,
  onToggleComplete,
  onDeleteTask,
  onStartEdit,
  editingId,
  editValue,
  setEditValue,
  onSaveEdit,
  onCancelEdit
}) {
  return (
    <div className="tasksSection">
      {filteredTodos.length === 0 ? (
        // Empty State
        <div className="emptyState">
          <div className="emptyIcon">
            {filter === 'all' && '📝'}
            {filter === 'pending' && '⏳'}
            {filter === 'completed' && '🎉'}
          </div>
          <p>
            {filter === 'all' && 'No tasks yet. Add one above!'}
            {filter === 'pending' && 'No pending tasks. Great job!'}
            {filter === 'completed' && 'No completed tasks yet.'}
          </p>
        </div>
      ) : (
        // Tasks List
        <div className="tasksList">
          {filteredTodos.map((todo) => (
            <TaskItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onStartEdit={onStartEdit}
              editingId={editingId}
              editValue={editValue}
              setEditValue={setEditValue}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// PROGRESS SECTION COMPONENT
// ========================================
function ProgressSection({ totalTasks, completedTasks, pendingTasks }) {
  if (totalTasks === 0) return null;

  const progressPercentage = (completedTasks / totalTasks) * 100;
  const isAllCompleted = completedTasks === totalTasks;

  return (
    <div className="progressSection">
      <div className="progressStats">
        <span>📋 Total: {totalTasks}</span>
        <span>⏳ Pending: {pendingTasks}</span>
        <span>✅ Completed: {completedTasks}</span>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="progressBarContainer">
        <div
          className="progressBar"
          style={{
            width: `${progressPercentage}%`,
            background: isAllCompleted
              ? 'linear-gradient(90deg, #4caf50, #8bc34a)'
              : 'linear-gradient(90deg, #667eea, #764ba2)'
          }}
        />
      </div>

      {/* Celebration Message */}
      {isAllCompleted && (
        <div className="celebration">
          🎉 All tasks completed! Great job!
        </div>
      )}
    </div>
  );
}

// ========================================
// MAIN TODO APP COMPONENT
// ========================================
function App() {
  // State management - using React state instead of localStorage
  const [todos, setTodos] = useState([
    // Sample data to demonstrate the app
    {
      id: 1,
      text: "Learn React components",
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      priority: 'medium'
    },
    {
      id: 2,
      text: "Build a todo app",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: 3,
      text: "Practice JavaScript",
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Task management functions
  const addTask = () => {
    if (inputValue.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    
    setTodos([newTask, ...todos]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed, 
            completedAt: !todo.completed ? new Date().toISOString() : null 
          }
        : todo
    ));
  };

  const deleteTask = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = () => {
    if (editValue.trim() === '') return;
    
    setTodos(todos.map(todo =>
      todo.id === editingId
        ? { ...todo, text: editValue.trim() }
        : todo
    ));
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const completeAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
      completedAt: !allCompleted ? new Date().toISOString() : null
    })));
  };

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Calculate statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);



  return (
    <div className="container">
      <div className="laptopFrame">
        <div className="screen">
          <div className="appCard">

            {/* Header Section */}
            <TodoHeader
              totalTasks={totalTasks}
              completedTasks={completedTasks}
            />

            {/* Add Task Section */}
            <AddTaskSection
              inputValue={inputValue}
              setInputValue={setInputValue}
              onAddTask={addTask}
            />

            {/* Filter Controls Section */}
            <FilterControls
              filter={filter}
              setFilter={setFilter}
              totalTasks={totalTasks}
              pendingTasks={pendingTasks}
              completedTasks={completedTasks}
              onCompleteAll={completeAll}
              onClearCompleted={clearCompleted}
              allCompleted={allCompleted}
            />

            {/* Tasks List Section */}
            <TasksList
              filteredTodos={filteredTodos}
              filter={filter}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
              onStartEdit={startEdit}
              editingId={editingId}
              editValue={editValue}
              setEditValue={setEditValue}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
            />

            {/* Progress Section */}
            <ProgressSection
              totalTasks={totalTasks}
              completedTasks={completedTasks}
              pendingTasks={pendingTasks}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;