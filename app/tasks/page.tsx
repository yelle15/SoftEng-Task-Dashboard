"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./taskspage.module.css";
import { supabase } from "../../utils/supabaseClient";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);

  // Listen for auth state changes and set session
  useEffect(() => {
 const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
});
supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
return () => {
  subscription.unsubscribe();
};
}, []);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    if (!session?.user) return;
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        return;
      }
      setTasks(data || []);
    };
    fetchTasks();
  }, [session]);

  // Add a new task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !session?.user) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title, description, user_id: session.user.id }])
      .select();
    if (error) {
      console.error(error);
      alert("Failed to save task!");
      return;
    }
    setTasks(prev => [...(data || []), ...prev]);
    setTitle("");
    setDescription("");
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);
    if (error) {
      console.error(error);
      alert("Failed to delete task!");
      return;
    }
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start editing a task
  const handleEditClick = (task: Task) => {
    setEditingId(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  // Save edited task
  const handleSaveEdit = async (id: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ title: editedTitle, description: editedDescription })
      .eq("id", id)
      .select();
    if (error) {
      console.error(error);
      alert("Failed to update task!");
      return;
    }
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editedTitle, description: editedDescription } : task
    ));
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  // If not logged in, show a message
  if (!session?.user) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Task Dashboard</h1>
        <p>Please log in to view your tasks.</p>
        <Link href="/" className={styles.backButton}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backButton}>
        Log Out
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
                          className={styles.saveButton}
                          type="button"
                          onClick={() => handleSaveEdit(task.id)}
                        >
                          Save
                        </button>
                        <button
                          className={styles.cancelButton}
                          type="button"
                          onClick={handleCancelEdit}
                        >
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
                          className={styles.editButton}
                          type="button"
                          onClick={() => handleEditClick(task)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                        >
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