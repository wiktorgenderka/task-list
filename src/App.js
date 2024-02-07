import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import DOMPurify from 'dompurify';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', completed: false, priority: 'high', dateAdded: new Date() },
    { id: 2, name: 'Task 2', completed: true, priority: 'medium', dateAdded: new Date() },
    { id: 3, name: 'Task 3', completed: false, priority: 'low', dateAdded: new Date() }
  ]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterByPriority, setFilterByPriority] = useState('all');
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [editableTaskName, setEditableTaskName] = useState('');
  const [editableTaskPriority, setEditableTaskPriority] = useState('low');

  const addTask = () => {
    if (newTaskName.trim() !== '') {
      const sanitizedTaskName = DOMPurify.sanitize(newTaskName);
      const sanitizedPriority = DOMPurify.sanitize(newTaskPriority);
      
      const newTask = {
        id: tasks.length + 1,
        name: sanitizedTaskName,
        completed: false,
        priority: sanitizedPriority,
        dateAdded: new Date()
      };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
      setNewTaskPriority('low');
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditableTaskId(taskId);
    setEditableTaskName(taskToEdit.name);
    setEditableTaskPriority(taskToEdit.priority);
  };

  const saveEditedTask = () => {
    setTasks(tasks.map(task =>
      task.id === editableTaskId ? { ...task, name: editableTaskName, priority: editableTaskPriority } : task
    ));
    setEditableTaskId(null);
  };

  const cancelEditTask = () => {
    setEditableTaskId(null);
  };

  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort((a, b) => {
      if (sortBy === 'dateAdded') {
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      } else if (sortBy === 'priority') {
        return a.priority.localeCompare(b.priority);
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  };

  const filterTasksByPriority = (tasksToFilter) => {
    if (filterByPriority === 'all') {
      return tasksToFilter;
    } else {
      return tasksToFilter.filter(task => task.priority === filterByPriority);
    }
  };

  const filteredTasks = filterCompleted ? tasks.filter(task => task.completed) : tasks;
  const filteredAndSortedTasks = sortTasks(filterTasksByPriority(filteredTasks));

  return (
    <div>
      <h1>Task List</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={filterCompleted}
            onChange={(e) => setFilterCompleted(e.target.checked)}
          />
          Show Completed Tasks Only
        </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dateAdded">Date Added</option>
          <option value="priority">Priority</option>
          <option value="name">Name</option>
        </select>
        <select value={filterByPriority} onChange={(e) => setFilterByPriority(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <input
        type="text"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
        placeholder="Enter task name"
      />
      <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {filteredAndSortedTasks.map(task => (
          <li key={task.id}>
            {editableTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editableTaskName}
                  onChange={(e) => setEditableTaskName(e.target.value)}
                />
                <select value={editableTaskPriority} onChange={(e) => setEditableTaskPriority(e.target.value)}>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <button onClick={saveEditedTask}>Save</button>
                <button onClick={cancelEditTask}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskStatus(task.id)}
                  aria-label={`Mark task "${task.name}" as completed`}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.name}</span>
                <button
                  onClick={() => editTask(task.id)}
                  aria-label={`Edit task "${task.name}"`}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete task "${task.name}"`}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;