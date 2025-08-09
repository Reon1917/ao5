# Cubing Timer Web App – UI & Features Specification

## 1. General Design
- Minimal, sleek, and modern design.
- Responsive for both desktop and mobile.
- Large, easy-to-read timer font.
- Dark mode and light mode with smooth transition.
- Theme switcher icon in the top right.
- Rounded corners, subtle shadows, and clean typography.

---

## 2. Layout
### **Desktop**
1. **Top Section**
   - Scramble text (large, centered).
   - Cube type indicator (e.g., "3x3", "2x2").
   - Theme toggle button (dark/light mode).
2. **Middle Section**
   - Large timer in the center.
   - Inspection countdown (if enabled) shown above timer in smaller font.
3. **Bottom Section**
   - Statistics panel: AO5, AO12, best, worst, total solves.
   - Session selector (dropdown).
   - Solve list with scroll, showing:
     - Time
     - Penalty (+2/DNF)
     - Date
     - Scramble (collapsible)

### **Mobile**
- Full-width layout with stacked sections.
- Timer takes up most of the screen.
- Tap anywhere to start/stop.
- Swipe up for solve history.

---

## 3. Features
### **Core**
- Timer start/stop with spacebar (desktop) or tap (mobile).
- 15-second inspection countdown with WCA beep sounds.
- Fetch scrambles from **WCA Scramble API** based on selected event.
- Save solves locally (IndexedDB or localStorage).
- Show statistics (AO5, AO12, mean, best, worst).
- Apply penalties: +2 seconds, DNF.
- Manage multiple sessions (e.g., 3x3, OH, 4x4).
- Dark/light mode toggle.

### **Extra**
- Graph of solves over time (Chart.js or Recharts).
- Sort and filter solve history.
- Click on a solve to see its scramble again.
- Option to delete solves.
- Custom inspection time (default 15s).
- Offline mode (works without internet after loading).
- Mobile vibration feedback on stop.
- Keyboard shortcuts:
  - **Space**: start/stop
  - **Backspace**: delete last solve
  - **P**: toggle penalty

---

## 4. Styling Details
- **Colors**:
  - Light mode: neutral whites & grays with a primary accent color.
  - Dark mode: dark gray/black with a vibrant accent color.
- **Typography**:
  - Large bold digits for timer.
  - Clean sans-serif font for text.
- **Animations**:
  - Timer fade-in/out.
  - Smooth scramble text change.
  - Theme toggle fade.