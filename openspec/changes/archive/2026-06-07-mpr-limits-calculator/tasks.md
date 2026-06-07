## 1. Database Setup

- [x] 1.1 Copy the extracted `mpr_limits.json` database into the source folder.
- [x] 1.2 Convert the JSON data into a clean JavaScript file `mpr_limits_data.js` that declares the database as a global variable to avoid filesystem CORS restrictions.

## 2. User Interface Development

- [x] 2.1 Update `index.html` to include a results section for configured maximum output power ($P_{CMAX}$) limits and tolerances (Note 2).
- [x] 2.2 Refine the stylesheet `style.css` to accommodate the new results section and style Note 2 visual indicators.
- [x] 2.3 Add a toggle or selector to switch between verifying standard Maximum Output Power (Clause 6.2.3) and Configured UE Output Power (Clause 6.2.5).

## 3. Application Logic Implementation

- [x] 3.1 Update `index.js` to handle events for the Clause 6.2.5 configured power verification mode.
- [x] 3.2 Implement Table 6.2.5.3-1 mapping function in JavaScript to return the correct configured power tolerance based on the target maximum power.
- [x] 3.3 Integrate Note 2 calculations to compute $P_{CMAX\_L}$ and $P_{CMAX\_H}$ core and test limits.
- [x] 3.4 Bind calculated Note 2 limits to the results display and visual gauge indicator.

## 4. Verification and Validation

- [x] 4.1 Cross-reference and validate the calculated Note 2 $P_{CMAX}$ limits for key test configurations (e.g. QPSK Full RB, 64QAM Full RB, and 256QAM) against Table 6.2.5.3-1.
- [x] 4.2 Verify that the updated single-page application is fully functional and offline-capable when launched directly from disk via the `file://` protocol.
