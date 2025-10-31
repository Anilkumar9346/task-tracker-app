import React from 'react';

function priorityClass(p) {
  if (p === 'High') return 'p-high';
  if (p === 'Medium') return 'p-medium';
  return 'p-low';
}

export default function TaskList({ tasks, onUpdate, onDelete }) {
  return (
    <div className="card">
      <h3>Tasks</h3>

      {tasks.length === 0 ? (
        <div>No tasks</div>
      ) : (
        <div className="task-list">
          {tasks.map((t) => (
            <div className="task" key={t.id}>
              <div className="task-main">
                <div className="task-title">{t.title}</div>
                <div className="task-desc">{t.description}</div>

                <div className="task-meta">
                  <span className={`badge ${priorityClass(t.priority)}`}>
                    {t.priority}
                  </span>
                  <span>Due: {t.due_date}</span>
                  <span>Status: {t.status}</span>
                </div>
              </div>

              <div className="task-actions">
                <select
                  value={t.status}
                  onChange={(e) => onUpdate(t.id, { status: e.target.value })}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>

                <select
                  value={t.priority}
                  onChange={(e) => onUpdate(t.id, { priority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <button onClick={() => onDelete(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
