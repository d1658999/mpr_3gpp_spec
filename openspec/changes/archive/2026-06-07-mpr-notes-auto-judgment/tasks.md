## 1. User Interface Updates (HTML & CSS)

- [x] 1.1 Update `index.html` to add note status badge placeholders next to Note 1 and Note 3 checkbox labels.
- [x] 1.2 Update `style.css` with layout rules and color indicators for `.note-status-badge`, `.status-active`, `.status-supported`, and `.status-na`.

## 2. Application Logic (JavaScript)

- [x] 2.1 Update `calculateAndDisplay` in `index.js` to retrieve the footnotes list for the selected configuration.
- [x] 2.2 Implement Note 1 applicability logic to enable/disable the `note1Checkbox` dynamically based on footnote `1`.
- [x] 2.3 Implement Note 3 applicability logic to display/hide `note3Container` dynamically when operating in Band 18 or 26.
- [x] 2.4 Update Note 2 (Clause 6.2.5 Configured Power) logic in `index.js` to only apply Table 6.2.5.3-1 relaxation if footnote `2` is present.
- [x] 2.5 Implement visual badge rendering function in `index.js` to update status class and text for Note 1, Note 2, and Note 3 based on their states.

## 3. Verification & Validation

- [x] 3.1 Verify that selecting Band 1 QPSK Full RB disables Note 1 checkbox and uses standard Clause 6.2.3 LSL in Clause 6.2.5 mode.
- [x] 3.2 Verify that selecting Band 2 QPSK Full RB enables Note 1 checkbox and applies Note 2 configured power relaxation in Clause 6.2.5 mode.
