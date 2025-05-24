import { User, Task } from '../types';

// User Storage
export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getStoredUsers();
  if (!users.find((u) => u.id === user.id)) {
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getStoredUsers();
  return users.find((user) => user.email === email);
};

// Task Storage
export const getStoredTasks = (): Task[] => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const getUserTasks = (userId: string): Task[] => {
  const tasks = getStoredTasks();
  return tasks.filter((task) => task.userId === userId);
};

export const saveTask = (task: Task): void => {
  const tasks = getStoredTasks();
  const index = tasks.findIndex((t) => t.id === task.id);
  
  if (index >= 0) {
    tasks[index] = { ...task, updatedAt: new Date().toISOString() };
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

export const deleteTask = (taskId: string): void => {
  let tasks = getStoredTasks();
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
};