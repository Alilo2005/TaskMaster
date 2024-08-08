"use client";

import { useState } from "react";
import Link from "next/link";

type CardProps = {
    id: string;
    title: string;
    completed: boolean;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updatedTask: Partial<Task>) => void;
};

type Task = {
    id: string;
    Title: string;
    Completed: boolean;
};

export default function Card({ id, title, completed, onDelete, onUpdate }: CardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(title);
    const [editCompleted, setEditCompleted] = useState(completed);

    const handleEditClick = () => setIsEditing(true);

    const handleSaveClick = () => {
        onUpdate(id, { Title: editTitle, Completed: editCompleted });
        setIsEditing(false);
    };

    const handleCancelClick = () => setIsEditing(false);

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 p-4 flex flex-col h-full transform transition-transform duration-200 hover:scale-105 hover:shadow-xl">
            {isEditing ? (
                <>
                    <input 
                        type="text" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        className="border-2 border-gray-300 rounded-lg p-2 mb-4 w-full"
                    />
                    <label className="flex items-center space-x-2 mb-4">
                        <input 
                            type="checkbox" 
                            checked={editCompleted} 
                            onChange={(e) => setEditCompleted(e.target.checked)} 
                            className="form-checkbox"
                        />
                        <span>Completed</span>
                    </label>
                    <div className="flex-grow"  />
                    <div className="flex space-x-2">
                        <button onClick={handleSaveClick} className="hover:scale-105 hover:shadow-xl px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-150">
                            Save
                        </button>
                        <button onClick={handleCancelClick} className="hover:scale-105 hover:shadow-xl px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-150">
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="font-bold text-xl mb-2">{title}</div>
                    <p className="text-gray-700 text-base mb-4">
                        {completed ? "Completed" : "Not Completed"}
                    </p>
                    <div className="flex-grow" /> {/* This will push the buttons to the bottom */}
                    <div className="flex space-x-2">
                        <button onClick={handleEditClick} className="hover:scale-105 hover:shadow-xl mr-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-150">
                            Edit
                        </button>
                        <button onClick={() => onDelete(id)} className="hover:scale-105 hover:shadow-xl px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-150">
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
