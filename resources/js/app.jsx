import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import '../scss/app.scss';

createInertiaApp({
    title: (title) => title ? `${title} — SHOP HUB` : 'SHOP HUB',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#00F0FF',
        showSpinner: true,
    },
});
