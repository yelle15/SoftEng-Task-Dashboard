"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./taskspage.module.css";

interface Task {
  id: string;
  title: string;
  description: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
const [editedTitle, setEditedTitle] = useState("");
const [editedDescription, setEditedDescription] = useState("");


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title,
        description,
      },
    ]);
    setTitle("");
    setDescription("");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditClick = (task: Task) => {
  setEditingId(task.id);
  setEditedTitle(task.title);
  setEditedDescription(task.description);
};

const handleSaveEdit = (id: string) => {
  setTasks(tasks.map(task =>
    task.id === id ? { ...task, title: editedTitle, description: editedDescription } : task
  ));
  setEditingId(null);
  setEditedTitle("");
  setEditedDescription("");
};

const handleCancelEdit = () => {
  setEditingId(null);
  setEditedTitle("");
  setEditedDescription("");
};

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        ← Back
      </Link>
      <h1 className={styles.heading}>Task Dashboard</h1>
      <form onSubmit={handleAddTask} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Task description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className={styles.addButton} type="submit">
          Add Task
        </button>
      </form>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {tasks.map((task) => (
    <tr key={task.id}>
      {editingId === task.id ? (
        <>
          <td>
            <input
              className={styles.editInput}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              required
            />
          </td>
          <td>
            <input
              className={styles.editInput}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </td>

          <td>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.saveButton} onClick={() => handleSaveEdit(task.id)}>
                  Save</button>
              <button 
              className={styles.cancelButton} onClick={handleCancelEdit}>
                Cancel
                </button>
            </div>
          </td>

        </>
      ) : (
        <>
          <td>{task.title}</td>
          <td>{task.description}</td>
          <td>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.editButton} onClick={() => handleEditClick(task)}>
                  Edit
              </button>
              <button
                className={styles.deleteButton} onClick={() => handleDeleteTask(task.id)}>
                  Delete
              </button>
            </div>
          </td>

        </>
      )}
    </tr>
  ))}
  {tasks.length === 0 && (
    <tr>
      <td colSpan={3} className={styles.emptyRow}>No tasks yet.</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

