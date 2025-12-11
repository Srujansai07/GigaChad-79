'use client';

import { useState, useCallback, useEffect } from 'react';

interface UseLocalStorageOptions<T> {
    initialValue: T;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
}

export function useLocalStorage<T>(
    key: string,
    options: UseLocalStorageOptions<T>
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const {
        initialValue,
        serialize = JSON.stringify,
        deserialize = JSON.parse,
    } = options;

    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(deserialize(item));
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
        } finally {
            setIsInitialized(true);
        }
    }, [key, deserialize]);

    // Set value
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, serialize(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, serialize, storedValue]);

    // Remove value
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

// Hook for debounced value
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Hook for throttled callback
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const [lastCall, setLastCall] = useState(0);

    const throttledCallback = useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            setLastCall(now);
            return callback(...args);
        }
    }, [callback, delay, lastCall]) as T;

    return throttledCallback;
}

// Hook for previous value
export function usePrevious<T>(value: T): T | undefined {
    const [prev, setPrev] = useState<T | undefined>(undefined);
    const [current, setCurrent] = useState<T>(value);

    if (value !== current) {
        setPrev(current);
        setCurrent(value);
    }

    return prev;
}

// Hook for mounted state
export function useMounted(): boolean {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted;
}
