import { useState, useEffect } from 'react';

// ========================================
// HEADER COMPONENT
// ========================================
function TodoHeader({ totalTasks, completedTasks }) {
  const styles = {
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: 'white',
      textAlign: 'center'
    },
    title: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem'
    },
    stats: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.header}>
      <h1 style={styles.title}>✨ My To-Do List</h1>
      {totalTasks > 0 && (
        <div style={styles.stats}>
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

  const styles = {
    inputSection: {
      padding: '1.5rem',
      borderBottom: '1px solid #f0f0f0'
    },
    inputContainer: {
      display: 'flex',
      gap: '0.75rem'
    },
    input: {
      flex: 1,
      padding: '1rem',
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.2s'
    },
    addButton: {
      backgroundColor: '#667eea',
      color: 'white',
      border: 'none',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    }
  };

  return (
    <div style={styles.inputSection}>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e0e0e0';
            e.target.style.boxShadow = 'none';
          }}
          placeholder="What needs to be done?"
          style={styles.input}
        />
        <button
          onClick={onAddTask}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a67d8';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.transform = 'translateY(0)';
          }}
          style={styles.addButton}
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
  const styles = {
    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap',
      padding: '0 1.5rem 1.5rem'
    },
    filterButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    filterButton: {
      padding: '0.5rem 1rem',
      border: '2px solid #e0e0e0',
      backgroundColor: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s'
    },
    filterButtonActive: {
      backgroundColor: '#667eea',
      borderColor: '#667eea',
      color: 'white'
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem'
    },
    actionButton: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      transition: 'all 0.2s'
    },
    completeAllButton: {
      backgroundColor: '#4caf50',
      color: 'white'
    },
    clearButton: {
      backgroundColor: '#f44336',
      color: 'white'
    }
  };

  if (totalTasks === 0) return null;

  return (
    <div style={styles.controlsContainer}>
      {/* Filter Buttons */}
      <div style={styles.filterButtons}>
        {['all', 'pending', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              ...styles.filterButton,
              ...(filter === filterType ? styles.filterButtonActive : {})
            }}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType === 'all' && ` (${totalTasks})`}
            {filterType === 'pending' && ` (${pendingTasks})`}
            {filterType === 'completed' && ` (${completedTasks})`}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <button
          onClick={onCompleteAll}
          style={{...styles.actionButton, ...styles.completeAllButton}}
          title={allCompleted ? "Mark all as pending" : "Mark all as completed"}
        >
          {allCompleted ? '↩️' : '✅'} All
        </button>
        {completedTasks > 0 && (
          <button
            onClick={onClearCompleted}
            style={{...styles.actionButton, ...styles.clearButton}}
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

  const styles = {
    taskItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '12px',
      border: '2px solid',
      transition: 'all 0.3s',
      position: 'relative'
    },
    taskItemCompleted: {
      backgroundColor: '#f1f8e9',
      borderColor: '#c8e6c9',
      transform: 'scale(0.98)'
    },
    taskItemPending: {
      backgroundColor: '#fafafa',
      borderColor: '#e0e0e0'
    },
    checkButton: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: '2px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'transparent',
      fontSize: '1rem'
    },
    checkButtonCompleted: {
      backgroundColor: '#4caf50',
      borderColor: '#4caf50',
      color: 'white'
    },
    checkButtonPending: {
      borderColor: '#bdbdbd'
    },
    taskContent: {
      flex: 1
    },
    taskText: {
      fontSize: '1rem',
      transition: 'all 0.2s'
    },
    taskTextCompleted: {
      color: '#757575',
      textDecoration: 'line-through'
    },
    taskTextPending: {
      color: '#424242'
    },
    editInput: {
      flex: 1,
      padding: '0.5rem',
      border: '2px solid #667eea',
      borderRadius: '8px',
      fontSize: '1rem',
      outline: 'none'
    },
    dateText: {
      fontSize: '0.75rem',
      color: '#9e9e9e',
      marginTop: '0.25rem'
    },
    taskActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    actionIcon: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '4px',
      transition: 'all 0.2s',
      fontSize: '1.1rem'
    }
  };

  return (
    <div
      style={{
        ...styles.taskItem,
        ...(todo.completed ? styles.taskItemCompleted : styles.taskItemPending)
      }}
      onMouseEnter={(e) => {
        if (!todo.completed) {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
        }
      }}
      onMouseLeave={(e) => {
        if (!todo.completed) {
          e.currentTarget.style.backgroundColor = '#fafafa';
        }
      }}
    >
      {/* Complete/Uncomplete Button */}
      <button
        onClick={() => onToggleComplete(todo.id)}
        style={{
          ...styles.checkButton,
          ...(todo.completed ? styles.checkButtonCompleted : styles.checkButtonPending)
        }}
        onMouseEnter={(e) => {
          if (!todo.completed) {
            e.target.style.borderColor = '#4caf50';
            e.target.style.backgroundColor = '#f1f8e9';
          }
        }}
        onMouseLeave={(e) => {
          if (!todo.completed) {
            e.target.style.borderColor = '#bdbdbd';
            e.target.style.backgroundColor = 'transparent';
          }
        }}
      >
        {todo.completed && '✓'}
      </button>

      {/* Task Content */}
      <div style={styles.taskContent}>
        {editingId === todo.id ? (
          // Edit Mode
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyPress={handleEditKeyPress}
            onBlur={onSaveEdit}
            style={styles.editInput}
            autoFocus
          />
        ) : (
          // Display Mode
          <div>
            <span
              style={{
                ...styles.taskText,
                ...(todo.completed ? styles.taskTextCompleted : styles.taskTextPending)
              }}
              onDoubleClick={() => !todo.completed && onStartEdit(todo.id, todo.text)}
              title="Double-click to edit"
            >
              {todo.text}
            </span>
            <div style={styles.dateText}>
              Created: {new Date(todo.createdAt).toLocaleDateString()}
              {todo.completed && todo.completedAt && (
                <> • Completed: {new Date(todo.completedAt).toLocaleDateString()}</>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Task Actions */}
      <div style={styles.taskActions}>
        {editingId === todo.id ? (
          // Edit Mode Actions
          <>
            <button
              onClick={onSaveEdit}
              style={{...styles.actionIcon, color: '#4caf50'}}
              title="Save changes"
            >
              💾
            </button>
            <button
              onClick={onCancelEdit}
              style={{...styles.actionIcon, color: '#9e9e9e'}}
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
                style={{...styles.actionIcon, color: '#ff9800'}}
                title="Edit task"
              >
                ✏️
              </button>
            )}
            <button
              onClick={() => onDeleteTask(todo.id)}
              onMouseEnter={(e) => e.target.style.color = '#d32f2f'}
              onMouseLeave={(e) => e.target.style.color = '#f44336'}
              style={{...styles.actionIcon, color: '#f44336'}}
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
  const styles = {
    tasksSection: {
      padding: '1.5rem',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    emptyState: {
      textAlign: 'center',
      color: '#9e9e9e',
      padding: '3rem 1rem'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }
  };

  return (
    <div style={styles.tasksSection}>
      {filteredTodos.length === 0 ? (
        // Empty State
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
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
        <div style={styles.tasksList}>
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
  const styles = {
    progressSection: {
      marginTop: '1.5rem',
      paddingTop: '1rem',
      borderTop: '1px solid #f0f0f0'
    },
    progressStats: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: '#757575',
      marginBottom: '0.75rem'
    },
    progressBarContainer: {
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      height: '10px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      transition: 'width 0.5s ease',
      borderRadius: '10px',
      position: 'relative'
    },
    celebration: {
      textAlign: 'center',
      marginTop: '1rem',
      fontSize: '1.2rem',
      color: '#4caf50',
      fontWeight: 'bold'
    }
  };

  if (totalTasks === 0) return null;

  const progressPercentage = (completedTasks / totalTasks) * 100;
  const isAllCompleted = completedTasks === totalTasks;

  return (
    <div style={styles.progressSection}>
      <div style={styles.progressStats}>
        <span>📋 Total: {totalTasks}</span>
        <span>⏳ Pending: {pendingTasks}</span>
        <span>✅ Completed: {completedTasks}</span>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div style={styles.progressBarContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${progressPercentage}%`,
            background: isAllCompleted 
              ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
              : 'linear-gradient(90deg, #667eea, #764ba2)'
          }}
        />
      </div>
      
      {/* Celebration Message */}
      {isAllCompleted && (
        <div style={styles.celebration}>
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

  // Main container styles
  const containerStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    appCard: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      overflow: 'hidden'
    }
  };

  return (
    <div style={containerStyles.container}>
      <div style={containerStyles.appCard}>
        
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
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <ProgressSection
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            pendingTasks={pendingTasks}
          />
        </div>

      </div>
    </div>
  );
}

export default App;