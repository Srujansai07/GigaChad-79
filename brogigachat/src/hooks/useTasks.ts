'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseTasksOptions {
    status?: 'active' | 'completed' | 'all';
    autoFetch?: boolean;
}

interface Task {
    id: string;
    title: string;
    description?: string;
    app: string;
    scheduledFor: string;
    completed: boolean;
    status: string;
    skipCount: number;
    auraGained?: number;
    strictModeTriggered: boolean;
}

export function useTasks(options: UseTasksOptions = {}) {
    const { status = 'active', autoFetch = true } = options;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/tasks?status=${status}`);
            if (!response.ok) throw new Error('Failed to fetch tasks');

            const data = await response.json();
            setTasks(data.tasks);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [status]);

    const createTask = async (taskData: Partial<Task>) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) throw new Error('Failed to create task');

            const data = await response.json();
            setTasks((prev) => [...prev, data.task]);
            return data.task;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const completeTask = async (taskId: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete' }),
            });

            if (!response.ok) throw new Error('Failed to complete task');

            const data = await response.json();
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
            );
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const skipTask = async (taskId: string, extendMinutes: number = 10) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'skip', extendMinutes }),
            });

            if (!response.ok) throw new Error('Failed to skip task');

            const data = await response.json();
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId
                        ? { ...t, skipCount: t.skipCount + 1, status: data.task.status }
                        : t
                )
            );
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete task');

            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            return true;
        } catch (err: any) {
            setError(err.message);
            return false;
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchTasks();
        }
    }, [autoFetch, fetchTasks]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        completeTask,
        skipTask,
        deleteTask,
        refetch: fetchTasks,
    };
}
