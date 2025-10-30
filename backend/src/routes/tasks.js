const { parseISO, isValid, format } = require('date-fns');

const PRIORITY = ['Low', 'Medium', 'High'];
const STATUS = ['Open', 'In Progress', 'Done'];

module.exports = (app, db) => {
    console.log("tasks route file loaded.......");
  // GET /tasks
  app.get('/tasks', async (req, res) => {
    console.log("get /tasks api called.......");
    try {
      const { status, priority, sort } = req.query;
      console.log("req.query1 : ", req.query);
      let sql = `SELECT * FROM tasks `;
      console.log("SQL before params : ",sql);
      const params = [];
    console.log("Initial SQL : ",sql);
      if (status) {
        //let finalStatus = status=="All status" ? "" : status;
        console.log("Status param : ",status);
        sql += `WHERE status = ?`; params.push(status);
      }
      if (priority) {
        if(status){
          sql += ` AND priority = ?`; 
        }else{
          sql += ` WHERE priority = ?`; 
        }
         params.push(priority);
      }
      if (sort === 'due_date_asc') sql += ` ORDER BY due_date ASC`;
      else if (sort === 'due_date_desc') sql += ` ORDER BY due_date DESC`;
      else sql += ` ORDER BY created_at DESC`;
      console.log("Final SQL : ",sql);
      console.log("Params : ",params);
      const rows = await db.all(sql, params);
      console.log("rows : ",rows);
      res.json({ tasks: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });



  // GET /tasks/:id 
  app.get('/tasks/:id', async (req, res) => { 
    console.log("get /tasks/:id api called......."); 
    try { 
      const id = Number(req.params.id); 
      const row = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]); 
      if (!row) 
        return res.status(404).json({ error: 'Task not found' }); 
      res.json({ task: row }); 
    } catch (err) { 
      console.error(err); 
      res.status(500).json({ error: 'Failed to fetch task' }); 
    } 
  }); 



  // POST /tasks
  app.post('/tasks', async (req, res) => { 
    console.log("post /tasks api called.......");
    try {
      const { title, description = '', priority = 'Medium', due_date } = req.body;

      if (!title || !due_date) return res.status(400).json({ error: 'title and due_date required' });

      if (!PRIORITY.includes(priority)) return res.status(400).json({ error: 'Invalid priority' });

      const parsed = parseISO(due_date);

      if (!isValid(parsed)) return res.status(400).json({ error: 'Invalid due_date (use YYYY-MM-DD)' });
      const iso = format(parsed, 'yyyy-MM-dd');

      const result = await db.run(
        `INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)`,
        [title, description, priority, iso]
      );

      console.log("Successfully inserted new task.......");

      const id = result.lastID;
      const task = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
      res.status(201).json({ task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // PATCH /tasks/:id   (update status and/or priority and/or title/description/due_date)
  app.patch('/tasks/:id', async (req, res) => {
    console.log("patch /tasks/:id api called.......");
    try {
      const id = Number(req.params.id);
      const prev = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
      if (!prev) return res.status(404).json({ error: 'Task not found' });

      // allowed updates
      const { status, priority, title, description, due_date } = req.body;

      const newStatus = status !== undefined ? status : prev.status;
      const newPriority = priority !== undefined ? priority : prev.priority;
      const newTitle = title !== undefined ? title : prev.title;
      const newDesc = description !== undefined ? description : prev.description;
      const newDue = due_date !== undefined ? due_date : prev.due_date;

      if (!STATUS.includes(newStatus)) return res.status(400).json({ error: 'Invalid status' });
      if (!PRIORITY.includes(newPriority)) return res.status(400).json({ error: 'Invalid priority' });
      const parsed = parseISO(newDue);
      if (!isValid(parsed)) return res.status(400).json({ error: 'Invalid due_date (use YYYY-MM-DD)' });
      const iso = format(parsed, 'yyyy-MM-dd');

      await db.run(
        `UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, status = ? WHERE id = ?`,
        [newTitle, newDesc, newPriority, iso, newStatus, id]
      );

      const updated = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
      res.json({ task: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });



  // DELETE /tasks/:id
  app.delete('/tasks/:id', async (req, res) => {
    console.log("delete /tasks/:id api called.......");
    try {
      const id = Number(req.params.id);
      const prev = await db.get(`SELECT * FROM tasks WHERE id = ?`, [id]);
      if (!prev) return res.status(404).json({ error: 'Task not found' });
      await db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
      res.json({ message: 'Task deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });


};
