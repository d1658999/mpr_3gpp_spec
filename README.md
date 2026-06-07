# 3GPP E-UTRA (LTE) MPR Limits Calculator

A highly responsive, zero-dependency, and offline-first web application designed for RF design and test validation engineers to look up and calculate E-UTRA Maximum Power Reduction (MPR) transmitter output power limits according to **3GPP TS 36.521-1 (Clause 6.2.3 and 6.2.5)**.

---

## 🚀 Key Features

*   **Comprehensive Band Database**: Mapped core parameters, nominal power classes, test tolerances, and allowed MPR limits for all 51 LTE operating bands.
*   **Two Verification Modes**:
    *   **Max Output Power (Clause 6.2.3)**: Standard conformance limits.
    *   **Configured Power (Clause 6.2.5)**: Dynamic tolerances for configured output power ($P_{CMAX}$).
*   **Automated Footnote Applicability**:
    *   **Note 1 (Band Edge)**: Dynamically checks applicability and applies -1.5 dB LSL relaxation at band edges.
    *   **Note 2 ($P_{CMAX}$ Tolerances)**: Dynamically maps core configured power tolerances from Table 6.2.5.3-1 (e.g. relaxing to $\pm 2.5\text{ dB}$ or $\pm 4.0\text{ dB}$ depending on target power).
    *   **Note 3 (B18/B26 Coexistence)**: Dynamically detects and applies coexistence relaxations of -1.5 dB.
*   **Real-time Power Bar Gauge**: Interactive graphical visualizer showing allowed transmission margins (USL, Nominal, LSL) and pass/fail state for your measured transmitter power.
*   **100% Offline Capable**: Encapsulates the entire database as a JS variable inside `mpr_limits_data.js` to bypass browser CORS constraints, allowing engineers to double-click `index.html` and use it on the lab bench without an internet connection.

---

## 📁 Project Structure

```bash
├── index.html            # Calculator User Interface structure
├── style.css             # Layout, responsive grids, and dark-mode styling
├── index.js              # Calculation, event-listeners, and UI controller logic
├── mpr_limits_data.js    # Database containing all band parameters wrapped as a JS variable
├── mpr_limits.json       # Original structured JSON database (for reference and automation scripts)
├── README.md             # Project overview (this file)
└── GUIDE.md              # Detailed step-by-step user guide
```

---

## 🛠️ How to Run

1.  **Direct Execution (Offline)**:
    *   Simply double-click [index.html](file:///C:/Users/d1658/Documents/project/mpr_3gpp_spec/index.html) in your file system to open it in any web browser. No server, node packages, or internet access required.
2.  **Local Dev Server (Optional)**:
    *   If you wish to serve it locally, you can run:
        ```bash
        npx serve .
        ```
        And open `http://localhost:3000` in your browser.
