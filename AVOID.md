# AVOID.md
## UI/UX Design Anti-Patterns & AI Slop Prevention

This document defines visual and UX patterns that must be avoided when creating, redesigning, or improving interfaces.

**Primary objective:** Build intentional, polished, distinctive, user-friendly interfaces. Avoid generic AI-generated aesthetics, unnecessary decoration, repetitive layouts, and visual clutter.

These rules apply to every page, component, section, and responsive breakpoint.

---

## 1. Generic AI-Generated Design

Avoid interfaces that look like generic AI-generated SaaS templates.

- Do not automatically use purple-blue gradients.
- Avoid glowing backgrounds, neon borders, and excessive glassmorphism.
- Avoid random floating blobs, decorative orbs, and abstract shapes.
- Do not use gradient text simply to make headings look attractive.
- Avoid repetitive hero layouts commonly found in AI-generated landing pages.
- Do not blindly copy popular Dribbble or SaaS design trends.
- Avoid designs that look impressive in screenshots but are confusing to use.

**Rule:** Every visual decision must have a clear design purpose.

## 2. Excessive Card-Based Layouts

Do not put everything inside cards.

Avoid:
- Cards nested inside other cards.
- Separate cards for every feature, paragraph, or statistic.
- Excessively rounded containers.
- Repetitive grids of identical cards.
- Unnecessary borders and shadows around every section.
- Using cards when simple typography, spacing, or dividers would work better.

Prefer:
- Open layouts.
- Editorial-style sections.
- Clear content grouping.
- Subtle dividers.
- Intentional background variations.
- Asymmetric layouts where appropriate.

## 3. Typography Mistakes

Avoid:
- Oversized headings without a clear hierarchy.
- Using too many font families.
- Excessively bold text everywhere.
- Making entire paragraphs bold.
- Extremely small secondary text.
- Excessive uppercase labels and letter spacing.
- Decorative fonts that reduce readability.

Prefer:
- A consistent typography scale.
- Strong but controlled heading hierarchy.
- Comfortable line lengths.
- Readable font sizes.
- Clear distinction between headings, body text, and metadata.

## 4. Color & Visual Effects

Avoid:
- Unnecessary gradients.
- Multiple competing accent colors.
- Randomly changing section backgrounds.
- Excessive shadows and blur effects.
- Neon glows and unnecessary highlights.
- Low-contrast text.
- Decorative colors that conflict with the brand identity.

Prefer:
- The established brand color palette.
- Consistent color roles.
- Neutral backgrounds.
- Controlled accent usage.
- Accessible contrast.
- Subtle visual depth.

Never introduce new brand colors without a valid design reason.

## 5. Layout & Spacing

Avoid:
- Excessive whitespace without purpose.
- Extremely compressed content.
- Inconsistent section spacing.
- Oversized empty hero sections.
- Unnecessary full-width containers.
- Repetitive centered layouts.
- Unbalanced columns.
- Content stretching across the entire screen.

Prefer:
- Consistent spacing.
- Intentional visual rhythm.
- Balanced proportions.
- Appropriate content widths.
- Responsive grid systems.
- Clear alignment and grouping.

## 6. Buttons & Interactive Elements

Avoid:
- Making every button pill-shaped.
- Excessive button variations.
- Unnecessary animated buttons.
- Oversized CTAs.
- Decorative hover effects without feedback value.
- Buttons that do not clearly communicate their actions.

Prefer:
- Clear action labels.
- Consistent button hierarchy.
- Appropriate sizing.
- Accessible interaction states.
- Subtle and purposeful hover/focus feedback.

## 7. Icons & Illustrations

Avoid:
- Mixing different icon libraries or visual styles.
- Using icons purely for decoration.
- Random emoji as interface icons.
- Excessively large icons.
- Unnecessary illustrations.
- Generic AI-generated illustrations that do not communicate anything meaningful.

Prefer:
- A consistent icon library.
- Consistent icon sizing and stroke weight.
- Icons with clear meaning.
- Real photography and product imagery where appropriate.

## 8. Animations & Motion

Avoid:
- Animating every element.
- Excessive scroll-triggered animations.
- Unnecessary parallax effects.
- Constant floating or bouncing elements.
- Long transitions that slow interactions.
- Overcomplicated page transitions.
- Animations that interfere with reading or navigation.

Prefer:
- Subtle entrance animations.
- Smooth hover and focus transitions.
- Purposeful scroll-based reveals.
- Consistent motion timing.
- Respect for `prefers-reduced-motion`.

Motion must improve feedback, hierarchy, or usability.

## 9. Content & UX

Avoid:
- Text-heavy sections.
- Long paragraphs explaining simple features.
- Repeated marketing messages.
- Generic headings such as "Revolutionize Your Experience".
- Unclear calls to action.
- Unnecessary information competing for attention.
- Hiding important information behind decorative elements.

Prefer:
- Short, meaningful copy.
- Descriptive headings.
- Scannable content.
- Clear value propositions.
- Real benefits instead of generic marketing language.
- Obvious navigation and conversion paths.

## 10. Responsive Design

Avoid:
- Desktop layouts simply squeezed onto mobile.
- Horizontal overflow.
- Tiny mobile typography.
- Oversized mobile headings.
- Unusable navigation.
- Touch targets that are too small.
- Excessive stacking of cards.

Prefer:
- Mobile-first thinking.
- Responsive typography.
- Flexible layouts.
- Appropriate spacing at every breakpoint.
- Accessible touch targets.
- Intentional mobile-specific layouts.

## 11. Component & Design Consistency

Avoid:
- Creating new styles for every section.
- Repeating nearly identical components with different styling.
- Inconsistent border radii.
- Random spacing values.
- Inconsistent shadows.
- Multiple button styles serving the same purpose.
- Introducing unnecessary dependencies for simple visual effects.

Prefer:
- Reusable components.
- Design tokens.
- Consistent spacing and sizing.
- Shared interaction patterns.
- A maintainable design system.

## 12. Implementation Rules

Before implementing a design:

1. Inspect the existing project and design system.
2. Understand the brand identity and target audience.
3. Identify the primary user journey.
4. Establish a clear visual hierarchy.
5. Plan the layout before writing components.
6. Reuse existing components and dependencies where appropriate.
7. Verify responsive behavior.
8. Review the final result for visual consistency and usability.

Do not sacrifice accessibility, performance, maintainability, or functionality for visual effects.

---

## Final Design Quality Checklist

Before considering any page complete, verify:

- [ ] Does the interface look intentional rather than AI-generated?
- [ ] Is the visual hierarchy immediately understandable?
- [ ] Is the page easy to scan?
- [ ] Are cards used only when necessary?
- [ ] Are gradients and decorative effects justified?
- [ ] Is the typography consistent?
- [ ] Are brand colors respected?
- [ ] Do animations serve a purpose?
- [ ] Is the interface responsive?
- [ ] Are all interactive elements functional?
- [ ] Is accessibility considered?
- [ ] Does the design feel distinctive rather than template-based?

## Golden Rule

**Simplicity is not the absence of design. It is the result of intentional design decisions.**

Do not add elements just because they make the interface look more visually impressive.

Every section, component, animation, color, and decorative element must earn its place.

When in doubt, remove unnecessary complexity rather than adding more decoration.
