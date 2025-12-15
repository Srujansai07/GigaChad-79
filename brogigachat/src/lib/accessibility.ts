// Accessibility utilities for BroGigaChad
// ARIA helpers, focus management, and keyboard navigation

import { RefObject, useEffect, useCallback } from 'react';

// Screen reader announcement
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Focus trap for modals
export function useFocusTrap(ref: RefObject<HTMLElement>, isActive: boolean) {
    useEffect(() => {
        if (!isActive || !ref.current) return;

        const element = ref.current;
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        };

        element.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();

        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref, isActive]);
}

// Keyboard navigation hook
export function useKeyboardNavigation(
    items: HTMLElement[],
    options: {
        orientation?: 'horizontal' | 'vertical' | 'grid';
        loop?: boolean;
        onSelect?: (index: number) => void;
    } = {}
) {
    const { orientation = 'vertical', loop = true, onSelect } = options;

    const handleKeyDown = useCallback(
        (e: KeyboardEvent, currentIndex: number) => {
            const isVertical = orientation === 'vertical';
            const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
            const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

            let newIndex = currentIndex;

            switch (e.key) {
                case prevKey:
                    e.preventDefault();
                    newIndex = currentIndex - 1;
                    if (newIndex < 0) {
                        newIndex = loop ? items.length - 1 : 0;
                    }
                    break;
                case nextKey:
                    e.preventDefault();
                    newIndex = currentIndex + 1;
                    if (newIndex >= items.length) {
                        newIndex = loop ? 0 : items.length - 1;
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    newIndex = 0;
                    break;
                case 'End':
                    e.preventDefault();
                    newIndex = items.length - 1;
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    onSelect?.(currentIndex);
                    return;
                default:
                    return;
            }

            items[newIndex]?.focus();
        },
        [items, orientation, loop, onSelect]
    );

    return handleKeyDown;
}

// Skip link component props
export interface SkipLinkProps {
    href: string;
    children: React.ReactNode;
}

// ARIA labels for common elements
export const ariaLabels = {
    closeModal: 'Close modal',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    previousPage: 'Go to previous page',
    nextPage: 'Go to next page',
    incrementValue: 'Increase value',
    decrementValue: 'Decrease value',
    toggleDarkMode: 'Toggle dark mode',
    notification: 'Notification',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
} as const;

// Generate unique ID for accessibility
let idCounter = 0;
export function generateA11yId(prefix = 'a11y'): string {
    return `${prefix}-${++idCounter}`;
}

// Check if element is visible
export function isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
    );
}

// Screen reader only class
export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
