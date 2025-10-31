import React, { useState } from 'react';



export default function TaskForm({ onCreate }) {

const [title, setTitle] = useState('');

const [description, setDescription] = useState('');

const [priority, setPriority] = useState('Medium');

const [dueDate, setDueDate] = useState('');



async function submit(e) {

console.log("submit called.......");

e.preventDefault();

if (!title || !dueDate) return alert('Title and due date required');

await onCreate({ title, description, priority, due_date: dueDate });

setTitle(''); setDescription(''); setPriority('Medium'); setDueDate('');

 }



return (

<form className="card" onSubmit={submit}>

<h3>Create Task</h3>

<label className='title-label'>Title</label>

<input value={title} onChange={e=>setTitle(e.target.value)} />

<label className='title-label'>Description</label>

<textarea value={description} onChange={e=>setDescription(e.target.value)} />

<label className='title-label'>Priority</label>

<select value={priority} onChange={e=>setPriority(e.target.value)}>

<option>Low</option>

<option>Medium</option>

<option>High</option>

</select>

<label className='title-label'>Due Date</label>

<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />

<div style={{textAlign:'right', marginTop:8}}>

<button className="btn" type='submit'>Add</button>

</div>

</form>

 );

}