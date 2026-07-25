/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ConfigGuard dark operational theme
        'cg-bg':       '#0B1220',
        'cg-surface':  '#111827',
        'cg-success':  '#22C55E',
        'cg-warning':  '#F59E0B',
        'cg-critical': '#EF4444',
        'cg-accent':   '#3B82F6',
        'cg-border':   '#1E293B',
        'cg-text':     '#E2E8F0',
        'cg-muted':    '#64748B',
      },
    },
  },
  plugins: [],
  // Important: let MUI handle its own styles; Tailwind for layout/utilities only
  important: false,
  corePlugins: {
    preflight: false, // Disable Tailwind reset — MUI handles base styles
  },
}
