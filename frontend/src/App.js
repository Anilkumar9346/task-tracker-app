import React, { useEffect, useState } from 'react'

import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', sort: '' });

  const API_BASE = 'http://localhost:3003';

  async function loadTasks() {
    console.log('loadTasks called.......');
    console.log('filters : ', filters);

    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;

    const qs = new URLSearchParams(params).toString();
    console.log(qs, 'qs...........');
    console.log('API : ', `${API_BASE}/tasks${qs ? '?' + qs : ''}`);

    const res = await fetch(`${API_BASE}/tasks${qs ? '?' + qs : ''}`);
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  useEffect(() => {
    console.log('useEffect called.......');
    loadTasks();
  }, [filters]);

  async function onCreate(payload) {
    console.log('onCreate called.......');
    console.log('payload : ', payload);

    await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await loadTasks();
  }

  async function onUpdate(id, payload) {
    console.log('onUpdate called.......');
    console.log('payload : ', payload);

    await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await loadTasks();
  }

  async function onDelete(id) {
    await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    await loadTasks();
  }

  return (
    <div className="container">
      <header>
        <h1 className="heading">Task Tracker</h1>
      </header>

      <main>
        <section className="left">
          <TaskForm onCreate={onCreate} />

          <div className="filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="">Sort: Newest</option>
              <option value="due_date_asc">Due date ↑</option>
              <option value="due_date_desc">Due date ↓</option>
            </select>
          </div>

          <TaskList tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} />
        </section>
      </main>
    </div>
  )
};

export default App;