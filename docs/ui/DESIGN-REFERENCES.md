# Design References

This document provides references to design assets, design system specifications, and the integration between design and development.

---

## Design Assets

### Figma Files

- **Main Prototype:** [Parking Management System - Figma](https://www.figma.com/proto/bS8vZPnivOQEnm5VRc4OfO/Parking-Management-System?node-id=3-388)
- **Design Tokens:** Color palette, typography scale, spacing system
- **Component Library:** Reusable UI components aligned with React implementation

---

## Design System

### Color Palette

Defined in `apps/frontend/src/scss/variables/_colors.scss`:

- Primary colors for actions and navigation
- Neutral colors for backgrounds and text
- Status colors for success, warning, error states

### Typography

Defined in `apps/frontend/src/scss/variables/_typography.scss`:

- Font families: System font stack
- Font sizes: Modular scale from 12px to 48px
- Font weights: Regular (400), Medium (500), Bold (700)

### Spacing System

Defined in `apps/frontend/src/scss/variables/_spacing.scss`:

- Base unit: 8px
- Spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

---

## Design ↔ Development Alignment

Storybook acts as the bridge between Figma design references and implemented components.  
Design tokens and SCSS variables are validated visually through Storybook stories to ensure fidelity to the design system.

---

**Related:**

- [UI Overview](./ui-overview.md)
- [Frontend Architecture](../../FRONTEND_ARCHITECTURE.md)
- [SCSS System](../../apps/frontend/src/scss/README.md)
