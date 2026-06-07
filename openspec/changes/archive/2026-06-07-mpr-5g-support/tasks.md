## 1. Database Generation and Integration

- [x] 1.1 Implement and run the 5G PDF parser script to generate `mpr_limits_5g.json` and `mpr_limits_5g_data.js`
- [x] 1.2 Verify that the parsed bands database contains accurate power classes, tolerances, and Note 3 applicability

## 2. Web Interface Development

- [x] 2.1 Add the RAT toggle controls and 5G specific configuration fields (Power Class, Waveform, SCS, Channel Bandwidth, Edge Size) in `index.html`
- [x] 2.2 Implement responsive visual layout and input filtering for 5G mode in `style.css`

## 3. Calculation Logic Implementation

- [x] 3.1 Implement the `calculate5G()` function in `index.js` to compute base MPR, Note 1 TDD BPSK Power Boosting, and Note 3 Band Edge Relaxation
- [x] 3.2 Add the dynamic PC1 Edge MPR formula calculations based on subcarrier spacing and transmission bandwidth configuration $N_{RB}$
- [x] 3.3 Implement Table 6.2.2.3-3 $\Delta$MPR limits and configured power $P_{CMAX}$ tolerance limits

## 4. Verification and Documentation

- [x] 4.1 Update `README.md` and `GUIDE.md` to reflect the 5G NR FR1 specifications
- [x] 4.2 Verify implementation calculations against spec tables
