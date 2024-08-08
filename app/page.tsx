"use client";  // Ensures this component runs on the client side

import { useEffect, useState } from "react";
import Card from "./components/Card";
import Link from "next/link";

type Task = {
    id: string;
    Title: string;
    Completed: boolean;
};

const getTasks = async (): Promise<Task[]> => {
    const response = await fetch(`https://6683115b4102471fa4c91cfd.mockapi.io/tasks`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const deleteTask = async (id: string) => {
    const response = await fetch(`https://6683115b4102471fa4c91cfd.mockapi.io/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    const response = await fetch(`https://6683115b4102471fa4c91cfd.mockapi.io/tasks/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const addTask = async (newTask: Omit<Task, 'id'>) => {
    const response = await fetch(`https://6683115b4102471fa4c91cfd.mockapi.io/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newTask),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [newCompleted, setNewCompleted] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false); // State for showing/hiding the form
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        getTasks()
            .then(fetchedTasks => setTasks(fetchedTasks))
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    const handleDelete = (id: string) => {
        deleteTask(id)
            .then(() => {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            })
            .catch(error => console.error("Error deleting task:", error));
    };

    const handleUpdate = (id: string, updatedTask: Partial<Task>) => {
        updateTask(id, updatedTask)
            .then((updated) => {
                setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, ...updated } : task));
            })
            .catch(error => console.error("Error updating task:", error));
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const newTask = { Title: newTitle, Completed: newCompleted };
        addTask(newTask)
            .then((addedTask) => {
                setTasks(prevTasks => [...prevTasks, addedTask]);
                setNewTitle('');
                setNewCompleted(false);
                setShowAddForm(false); // Hide the form after adding the task
            })
            .catch(error => console.error("Error adding task:", error));
    };

    const filteredTasks = tasks.filter(task => task.Title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <>
            <div className="bg-gray-100">
                <h1 className="pt-4 text-center text-4xl font-mono text-gray-900 leading-tight mb-6">
                    Welcome to TaskMaster
                </h1>
                <div className="flex space-x-4 justify-center items-center pb-4 rounded-lg shadow-md">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="hover:scale-105 hover:shadow-xl px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {showAddForm ? 'Cancel' : 'Add a task'}
                    </button>
                </div>
                {showAddForm && (
                    <div className="flex justify-center p-4">
                        <form onSubmit={handleAddTask} className="flex flex-col space-y-4 w-full max-w-sm">
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Task Title"
                                className="border-2 border-gray-300 rounded-lg p-2"
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={newCompleted}
                                    onChange={(e) => setNewCompleted(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Completed</span>
                            </label>
                            <button
                                type="submit"
                                className="hover:scale-105 hover:shadow-xl px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                Save Task
                            </button>
                        </form>
                    </div>
                )}
                <div className="flex justify-center p-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Tasks"
                        className="border-2 border-gray-300 rounded-lg p-2 w-full max-w-md"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 p-4">
                {filteredTasks.map(task => (
                    <Card key={task.id} id={task.id} title={task.Title} completed={task.Completed} onDelete={handleDelete} onUpdate={handleUpdate} />
                ))}
            </div>
        </>
    );
}
