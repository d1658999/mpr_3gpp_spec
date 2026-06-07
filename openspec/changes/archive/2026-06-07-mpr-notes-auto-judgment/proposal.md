## Why

Currently, Note 1, Note 2, and Note 3 relaxations are applied unconditionally or via hardcoded band assumptions in the calculator. In the actual 3GPP specification (TS 36.521-1), these notes only apply to specific operating bands and configurations. This can lead to incorrect calculations (e.g. applying a band-edge relaxation to a band that doesn't permit it). We need the calculator to automatically judge the applicability of these notes based on the database footnotes and dynamically update the UI state.

## What Changes

- **Add** automated applicability checking in the UI controller to disable or enable Note 1, Note 2, and Note 3 controls based on the selected band and configuration's footnotes.
- **Modify** Note 2 calculation logic under Clause 6.2.5 to only relax the configured power limits if Note 2 is applicable to the selected band. If not, standard Clause 6.2.3 tolerances are used.
- **Modify** the UI to display badges or state labels indicating which notes are "Applicable & Active", "Applicable but Inactive", or "Not Applicable".

## Capabilities

### New Capabilities
*None*

### Modified Capabilities
- `mpr-calculator`: Update specification requirements to cover automated footnote/note applicability and UI feedback.

## Impact

- **UI Logic (`index.js`)**: Updates configuration change handlers to inspect the selected band/modulation/allocation footnotes and toggle control state.
- **HTML UI (`index.html`)**: Updates the Note controls container to support status badges/labels.
- **Styling (`style.css`)**: Adds styling for note status badges/indicators.
