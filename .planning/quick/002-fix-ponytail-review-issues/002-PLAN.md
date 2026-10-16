---
task: 002
name: Fix Ponytail Review Issues
description: Fix five review issues across mobile touch navigation, internal modal anchors, hover-state auto-rotation, modal open/close cycle management, and slide transition CSS.
---

# Quick Task 002: Fix Ponytail Review Issues

## Objective
Address all five review findings in the portfolio's featured spotlight carousel and case study modal: ensure vertical mobile page scrolling does not trigger slides, fix internal modal anchor navigation, maintain proper auto-rotation pause states across hover and modal views, and add a lightweight CSS fade-in animation for active slides.

## Tasks

<task type="auto">
  <name>Fix Mobile Touch Navigation & Auto-Rotation Lifecycle</name>
  <files>js/app.js</files>
  <action>
    Track clientX and clientY for touch events to ensure horizontal swipe delta exceeds vertical delta before changing slides (Issue 1).
    Add pointer hover and focus state tracking to prevent click actions from restarting auto-rotation while hovered (Issue 3).
    Coordinate spotlight timer pause and resume hooks with the case study modal lifecycle to prevent background rotation while the modal is open (Issue 4).
  </action>
  <verify>python -c "with open('js/app.js', encoding='utf-8') as f: content = f.read(); assert 'Math.abs(diffX) > Math.abs(diffY)' in content; assert 'isHovered' in content; assert 'pauseSpotlightAutoCycle' in content; print('JS touch and lifecycle check passed')"</verify>
  <done>Touch gestures require dominant horizontal movement, clicking controls does not restart rotation while hovered, and rotation stays paused while the modal is open.</done>
</task>

<task type="auto">
  <name>Fix Modal Internal Anchor Navigation</name>
  <files>js/app.js, index.html</files>
  <action>
    Update modal live button link handling so that internal anchors (e.g., #achievements) open with target="_self" in the current tab, close the modal, and restore scrollability to reveal the destination section, while preserving target="_blank" and rel attributes for external URLs (Issue 2).
  </action>
  <verify>python -c "with open('js/app.js', encoding='utf-8') as f: content = f.read(); assert 'liveUrl.startsWith(\'#\')' in content; print('Modal internal anchor handling check passed')"</verify>
  <done>Clicking Open Live Experience for internal project anchors closes the modal and navigates in the current tab instead of opening a duplicate tab.</done>
</task>

<task type="auto">
  <name>Implement Lightweight CSS Slide Fade-In Animation</name>
  <files>css/style.css</files>
  <action>
    Replace ineffective opacity/transform transitions on .spotlight-slide with a dedicated keyframe animation on .spotlight-slide.active (spotlightFadeIn) to provide smooth entrance without layout shifts (Issue 5).
  </action>
  <verify>python -c "with open('css/style.css', encoding='utf-8') as f: content = f.read(); assert '@keyframes spotlightFadeIn' in content; print('CSS keyframe animation check passed')"</verify>
  <done>.spotlight-slide.active smoothly fades in using a dedicated keyframe animation that respects prefers-reduced-motion.</done>
</task>

---
*Created: 2026-10-16*
