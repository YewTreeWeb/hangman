import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// Imported after the DOM exists; React Testing Library reads document on load
const { cleanup } = await import("@testing-library/react");
const { afterEach } = await import("bun:test");

afterEach(cleanup);
