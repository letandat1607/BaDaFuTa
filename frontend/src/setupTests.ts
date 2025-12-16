import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi, expect } from 'vitest'

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn(),
};

globalThis.localStorage = localStorageMock as Storage;

globalThis.alert = vi.fn();
console.error = vi.fn();