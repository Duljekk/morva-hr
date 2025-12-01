# Complex Icons Directory

This directory is for documentation purposes only. Complex icons that remain as `.svg` imports are kept in `app/assets/icons/`.

## What Makes an Icon "Complex"?

Icons that should remain as `.svg` imports include:

- **Gradients**: Icons with `<linearGradient>` or `<radialGradient>` elements
- **Filters**: Icons with `<filter>`, `<feGaussianBlur>`, or other filter effects
- **Complex Defs**: Icons with extensive `<defs>` sections
- **Multiple Color Stops**: Icons with multiple color stops in gradients
- **Brand Logos**: Brand-specific logos with special styling requirements

## Example: Logotype

The `logotype.svg` file remains as a `.svg` import because it contains:
- Linear gradients (`<linearGradient>`)
- Radial gradients (`<radialGradient>`)
- Filter effects (`<filter>`, `<feGaussianBlur>`)
- Complex `<defs>` section

## Usage

Complex icons are imported directly from `app/assets/icons/`:

```tsx
import LogotypeIcon from '@/app/assets/icons/logotype.svg';
```

## When to Convert Complex Icons

If you need to customize a complex icon frequently or want better tree-shaking, consider:
1. Simplifying the design in Figma (remove gradients/filters)
2. Creating a simplified version for use as a `.tsx` component
3. Keeping the complex version as `.svg` for special cases


