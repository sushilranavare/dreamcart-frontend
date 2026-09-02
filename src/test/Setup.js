/*
 * Global test setup, loaded automatically before every test file
 * (see vite.config.js test.setupFiles).
 *
 * Adds the jest-dom matchers (toBeInTheDocument, etc.) and clears
 * localStorage between tests so auth state doesn't leak across them.
 */

import "@testing-library/jest-dom";
import { afterEach } from "vitest";

afterEach(() => {
    localStorage.clear();
});