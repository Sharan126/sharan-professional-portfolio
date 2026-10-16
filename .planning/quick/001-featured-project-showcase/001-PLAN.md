---
task: 001
name: Responsive Featured Project Spotlight Showcase
description: Add a responsive project spotlight banner to highlight top inventions, reusing existing components and styling conventions, maintaining layout integrity, and verifying mobile responsiveness.
---

# Quick Task 001: Responsive Featured Project Spotlight Showcase

## Objective
Add an interactive, responsive featured project showcase banner at the top of the Projects section (`#work`) highlighting top inventions (Karnataka Biosecurity Network, DocuShield AI, MacroSnap, and Mangaluru Dasara 2026), with slide navigation, system metrics, and deep-dive architecture inspection modal integration.

## Tasks

<task type="auto">
  <name>Add Spotlight HTML markup</name>
  <files>index.html</files>
  <action>Add semantic, accessible markup for the featured projects spotlight showcase banner with tab controls, telemetry badge, slide content, visual HUD widgets, and action CTAs.</action>
  <verify>python -c "with open('index.html', encoding='utf-8') as f: content = f.read(); assert 'featured-spotlight' in content"</verify>
  <done>index.html contains the accessible spotlight showcase structure integrated cleanly above the category filter tabs.</done>
</task>

<task type="auto">
  <name>Implement HUD Spotlight Styling and Responsive Breakpoints</name>
  <files>css/style.css</files>
  <action>Add CSS styles for the spotlight deck, slide transitions, HUD telemetry tags, metrics strip, indicator buttons, and mobile media queries for fluid scaling on screens &lt;= 900px, 768px, and 480px.</action>
  <verify>python -c "with open('css/style.css', encoding='utf-8') as f: content = f.read(); assert '.featured-spotlight' in content"</verify>
  <done>css/style.css contains complete styles for spotlight container, slides, HUD widgets, and responsive layout without horizontal overflow.</done>
</task>

<task type="auto">
  <name>Add Spotlight Carousel and Modal Logic</name>
  <files>js/app.js</files>
  <action>Implement spotlight slide switching with active state synchronization, keyboard accessibility, pause on hover, auto-rotation, and connect the inspect buttons to open the case study drawer modal.</action>
  <verify>python -c "with open('js/app.js', encoding='utf-8') as f: content = f.read(); assert 'initFeaturedSpotlight' in content"</verify>
  <done>Spotlight banner is fully interactive, auto-advances, responds to user clicks/touches, and integrates with the case study modal.</done>
</task>

---
*Created: 2026-10-16*
