import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editMode, setEditMode] = useState(false);
  const [editTaskText, setEditTaskText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) setTasks(savedTasks);

    // Load dark mode preference from localStorage
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleAddTask = () => {
    if (taskInput) {
      setTasks([
        ...tasks,
        { text: taskInput, completed: false, priority, id: Date.now() },
      ]);
      setTaskInput('');
    }
  };

  const handleEditTask = (index) => {
    setEditMode(true);
    setEditTaskText(tasks[index].text);
  };

  const handleSaveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editTaskText;
    setTasks(updatedTasks);
    setEditMode(false);
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all' filter
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <h1>To-Do List</h1>

      <button onClick={toggleDarkMode} className="toggle-dark-mode">
        Toggle Dark Mode
      </button>

      <div>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {editMode && (
        <div>
          <input
            type="text"
            value={editTaskText}
            onChange={(e) => setEditTaskText(e.target.value)}
          />
          <button
            onClick={() =>
              handleSaveEdit(tasks.findIndex((task) => task.text === editTaskText))
            }
          >
            Save Edit
          </button>
        </div>
      )}

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>

      <div className="task-list">
        {filteredTasks.map((task, index) => (
          <div key={task.id} className="todo-item">
            <span
              onClick={() => toggleTaskCompletion(index)}
              className={task.completed ? 'completed' : ''}
            >
              {task.text}
            </span>
            <div>
              <button
                className="edit-btn"
                onClick={() => handleEditTask(index)}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(index)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
