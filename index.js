// 3GPP MPR & PCMAX limits calculator logic

document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const modeSelect = document.getElementById("mode-select");
    const bandSelect = document.getElementById("band-select");
    const modulationSelect = document.getElementById("modulation-select");
    const allocSelect = document.getElementById("alloc-select");
    const rbAllocGroup = document.getElementById("rb-alloc-group");
    
    const note1Checkbox = document.getElementById("note1-checkbox");
    const note3Container = document.getElementById("note3-container");
    const note3Checkbox = document.getElementById("note3-checkbox");
    
    const measuredPowerInput = document.getElementById("measured-power");
    
    const testUslVal = document.getElementById("test-usl");
    const testLslVal = document.getElementById("test-lsl");
    const coreUslVal = document.getElementById("core-usl");
    const coreLslVal = document.getElementById("core-lsl");
    
    const passFailIndicator = document.getElementById("pass-fail-indicator");
    const powerBar = document.getElementById("power-bar");
    const nominalMarker = document.getElementById("nominal-marker");
    const measuredMarker = document.getElementById("measured-marker");
    const legendMeasuredItem = document.getElementById("legend-measured-item");
    
    const infoBandNominal = document.getElementById("info-band-nominal");
    const infoBaseTol = document.getElementById("info-base-tol");
    const infoMpr = document.getElementById("info-mpr");
    const infoTt = document.getElementById("info-tt");
    
    const infoPcmaxTolItem = document.getElementById("info-pcmax-tol-item");
    const infoPcmaxTol = document.getElementById("info-pcmax-tol");
    
    const appliedNotesSection = document.getElementById("applied-notes-section");
    const appliedNotesList = document.getElementById("applied-notes-list");
    
    const note1StatusBadge = document.getElementById("note1-status");
    const note3StatusBadge = document.getElementById("note3-status");

    // Populate Band Select dropdown
    const bandsList = Object.keys(MPR_LIMITS_DB).map(Number).sort((a, b) => a - b);
    bandsList.forEach(band => {
        const option = document.createElement("option");
        option.value = band;
        option.textContent = `Band ${band}`;
        bandSelect.appendChild(option);
    });

    // Handle initial state and default selections
    bandSelect.value = "1"; // Default to Band 1
    
    // Event Listeners
    modeSelect.addEventListener("change", calculateAndDisplay);
    
    bandSelect.addEventListener("change", calculateAndDisplay);
    
    modulationSelect.addEventListener("change", () => {
        handleModulationChange();
        calculateAndDisplay();
    });
    
    allocSelect.addEventListener("change", calculateAndDisplay);
    note1Checkbox.addEventListener("change", calculateAndDisplay);
    note3Checkbox.addEventListener("change", calculateAndDisplay);
    measuredPowerInput.addEventListener("input", calculateAndDisplay);

    // Initial triggers
    calculateAndDisplay();

    // Toggle visibility of RB allocation based on Modulation
    function handleModulationChange() {
        const mod = modulationSelect.value;
        if (mod === "256qam") {
            rbAllocGroup.style.display = "none"; // 256QAM has only one allocation type in spec
        } else {
            rbAllocGroup.style.display = "block";
        }
    }

    // Table 6.2.5.3-1: Mapped Core Configured Power Tolerance
    function getPcmaxTolerance(pcmax) {
        if (pcmax >= 21.0) return 2.0;
        if (pcmax >= 20.0) return 2.5;
        if (pcmax >= 19.0) return 3.5;
        if (pcmax >= 18.0) return 4.0;
        if (pcmax >= 13.0) return 5.0;
        if (pcmax >= 8.0) return 6.0;
        return 7.0;
    }

    // Main calculation and UI update logic
    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const band = bandSelect.value;
        const mod = modulationSelect.value;
        const alloc = allocSelect.value;
        
        if (!band) return;

        const bandData = MPR_LIMITS_DB[band];
        if (!bandData) return;

        const nominal = bandData.nominal; // Nominal power class (23.0 dBm)
        
        // 1. Identify modulation/allocation key
        let targetKey = "";
        if (mod === "256qam") {
            targetKey = "256qam";
        } else {
            targetKey = `${mod}_${alloc}`;
        }

        const limitsData = bandData[targetKey];
        if (!limitsData) {
            testUslVal.textContent = "-- dBm";
            testLslVal.textContent = "-- dBm";
            coreUslVal.textContent = "-- dBm";
            coreLslVal.textContent = "-- dBm";
            return;
        }

        const footnotes = limitsData.footnotes || [];

        // 2. Extract base test limits and test tolerance (TT)
        const tt = Math.round((limitsData.tol_upper - 2.0) * 10) / 10; // Test Tolerance
        
        // Derive standard MPR value (allowed max reduction)
        let mprVal = 0.0;
        let mprDisplayStr = "0 dB";
        if (mod === "qpsk" && alloc === "full") { mprVal = 1.0; mprDisplayStr = "1 dB"; }
        else if (mod === "16qam" && alloc === "partial") { mprVal = 1.0; mprDisplayStr = "1 dB"; }
        else if (mod === "16qam" && alloc === "full") { mprVal = 2.0; mprDisplayStr = "2 dB"; }
        else if (mod === "64qam" && alloc === "partial") { mprVal = 2.0; mprDisplayStr = "2 dB"; }
        else if (mod === "64qam" && alloc === "full") { mprVal = 3.0; mprDisplayStr = "3 dB (+0.5 dB core relaxation)"; }
        else if (mod === "256qam") { mprVal = 5.0; mprDisplayStr = "5 dB"; }

        let usl = 0.0;
        let lsl = 0.0;
        let coreUsl = 0.0;
        let coreLsl = 0.0;
        let notesApplied = [];

        // 3. Dynamic Note Applicability & Badges Updates
        // 3.1 Note 1 (Band Edge)
        const hasNote1 = footnotes.includes(1);
        if (hasNote1) {
            note1Checkbox.disabled = false;
            if (note1Checkbox.checked) {
                note1StatusBadge.textContent = "Active";
                note1StatusBadge.className = "note-status-badge status-active";
            } else {
                note1StatusBadge.textContent = "Supported";
                note1StatusBadge.className = "note-status-badge status-supported";
            }
        } else {
            note1Checkbox.disabled = true;
            note1Checkbox.checked = false;
            note1StatusBadge.textContent = "N/A";
            note1StatusBadge.className = "note-status-badge status-na";
        }

        // 3.2 Note 3 (Coexistence)
        const hasNote3 = (band === "18" || band === "26" || footnotes.includes(3));
        if (hasNote3) {
            note3Container.style.display = "flex";
            note3Checkbox.disabled = false;
            if (note3Checkbox.checked) {
                note3StatusBadge.textContent = "Active";
                note3StatusBadge.className = "note-status-badge status-active";
            } else {
                note3StatusBadge.textContent = "Supported";
                note3StatusBadge.className = "note-status-badge status-supported";
            }
        } else {
            note3Container.style.display = "none";
            note3Checkbox.disabled = true;
            note3Checkbox.checked = false;
            note3StatusBadge.textContent = "N/A";
            note3StatusBadge.className = "note-status-badge status-na";
        }

        // 4. Perform calculations based on Verification Mode
        if (mode === "mpr") {
            // Standard Maximum Output Power Mode (Clause 6.2.3)
            infoPcmaxTolItem.style.display = "none";
            document.querySelector(".spec-limits .result-card-title").textContent = "Conformance Test Limits (Clause 6.2.3)";
            
            usl = limitsData.usl;
            lsl = limitsData.lsl;
            coreUsl = nominal + 2.0;
            coreLsl = limitsData.lsl + tt;
            
        } else {
            // Configured UE Output Power Mode (Clause 6.2.5 - Note 2)
            infoPcmaxTolItem.style.display = "flex";
            document.querySelector(".spec-limits .result-card-title").textContent = "Configured Power limits (Clause 6.2.5)";
            
            // P_CMAX_H = Nominal Power (23.0 dBm)
            // Core tolerance for P_CMAX_H = 2.0 dB
            coreUsl = nominal + 2.0;
            usl = coreUsl + tt;
            
            // P_CMAX_L = Nominal Power - MPR
            const pcmaxLTarget = nominal - mprVal;
            
            // Base lower band tolerance T_L,c
            const qpskPartialData = bandData["qpsk_partial"];
            const tLc = Math.abs(qpskPartialData.tol_lower) - tt; 
            
            // Core tolerance T(PCMAX_L) mapped from Table 6.2.5.3-1
            const pcmaxTol = getPcmaxTolerance(pcmaxLTarget);
            
            let effectiveCoreTol = tLc;
            
            if (footnotes.includes(2)) {
                effectiveCoreTol = Math.max(tLc, pcmaxTol);
                infoPcmaxTol.textContent = `±${pcmaxTol.toFixed(1)} dB (Note 2 Applied)`;
                notesApplied.push("<strong>Note 2 (Table 6.2.5.3-1)</strong>: Mapped configured power (PCMAX) limits dynamically. Core tolerance relaxed to <strong>&plusmn;" + pcmaxTol.toFixed(1) + " dB</strong>.");
            } else {
                infoPcmaxTol.textContent = `±${tLc.toFixed(1)} dB (Standard)`;
                notesApplied.push("<strong>Note 2 (Clause 6.2.5)</strong>: Not applicable to this band. Standard tolerances applied.");
            }
            
            coreLsl = pcmaxLTarget - effectiveCoreTol;
            lsl = coreLsl - tt;
        }

        // 5. Apply Spec Note 1 and Note 3 relaxations (-1.5 dB)
        if (note1Checkbox.checked && hasNote1) {
            lsl = Math.round((lsl - 1.5) * 100) / 100;
            coreLsl = Math.round((coreLsl - 1.5) * 100) / 100;
            notesApplied.push("<strong>Note 1 (Band Edge)</strong>: Lower limit (LSL) relaxed at band edges by an additional 1.5 dB.");
        }

        if (note3Checkbox.checked && hasNote3) {
            lsl = Math.round((lsl - 1.5) * 100) / 100;
            coreLsl = Math.round((coreLsl - 1.5) * 100) / 100;
            notesApplied.push("<strong>Note 3 (B18/B26 coexistence)</strong>: Lower limit (LSL) relaxed by 1.5 dB for bandwidths confined within 815 - 818 MHz.");
        }

        // 5. Update numerical display elements
        testUslVal.textContent = `${usl.toFixed(1)} dBm`;
        testLslVal.textContent = `${lsl.toFixed(1)} dBm`;
        coreUslVal.textContent = `${coreUsl.toFixed(1)} dBm`;
        coreLslVal.textContent = `${coreLsl.toFixed(1)} dBm`;

        // Update parameters panel
        infoBandNominal.textContent = `${nominal.toFixed(1)} dBm`;
        
        let baseTolStr = "+2.0 / -2.0 dB";
        if (band === "22" || band === "42" || band === "43") baseTolStr = "+2.0 / -3.0 dB";
        else if (band === "24") baseTolStr = "+2.0 / -3.0 dB";
        else if (band === "28") baseTolStr = "+2.0 / -2.5 dB";
        infoBaseTol.textContent = baseTolStr;
        
        infoMpr.textContent = mprDisplayStr;
        infoTt.textContent = `+${tt.toFixed(1)} / -${tt.toFixed(1)} dB`;

        // Update active notes list
        if (notesApplied.length > 0) {
            appliedNotesSection.style.display = "block";
            appliedNotesList.innerHTML = "";
            notesApplied.forEach(noteText => {
                const li = document.createElement("li");
                li.innerHTML = noteText;
                appliedNotesList.appendChild(li);
            });
        } else {
            appliedNotesSection.style.display = "none";
        }

        // 6. Update Visualizer Gauge
        // Visualizer scale is 10 dBm (0%) to 30 dBm (100%)
        const scaleMin = 10.0;
        const scaleMax = 30.0;
        const scaleRange = scaleMax - scaleMin;

        function getPct(val) {
            const pct = ((val - scaleMin) / scaleRange) * 100;
            return Math.max(0, Math.min(100, pct)); // clamp 0-100
        }

        const lslPct = getPct(lsl);
        const uslPct = getPct(usl);
        const nomPct = getPct(nominal);

        // Position nominal marker
        nominalMarker.style.left = `${nomPct}%`;

        // Position and size green pass range bar
        powerBar.style.left = `${lslPct}%`;
        powerBar.style.width = `${uslPct - lslPct}%`;

        // Evaluate Measured Power
        const measuredValStr = measuredPowerInput.value.trim();
        if (measuredValStr !== "" && !isNaN(measuredValStr)) {
            const measuredVal = parseFloat(measuredValStr);
            const measuredPct = getPct(measuredVal);
            
            // Show measured marker and legend
            measuredMarker.style.display = "block";
            measuredMarker.style.left = `${measuredPct}%`;
            legendMeasuredItem.style.display = "flex";

            // Evaluate Pass/Fail
            const isPass = (measuredVal >= lsl) && (measuredVal <= usl);
            if (isPass) {
                measuredMarker.className = "gauge-marker measured pass";
                passFailIndicator.className = "status-indicator-bar pass";
                
                const marginLsl = (measuredVal - lsl).toFixed(1);
                const marginUsl = (usl - measuredVal).toFixed(1);
                passFailIndicator.textContent = `PASS (Margin: +${marginLsl} dB above LSL, -${marginUsl} dB below USL)`;
            } else {
                measuredMarker.className = "gauge-marker measured fail";
                passFailIndicator.className = "status-indicator-bar fail";
                
                if (measuredVal < lsl) {
                    const margin = (lsl - measuredVal).toFixed(1);
                    passFailIndicator.textContent = `FAIL (Power too low: -${margin} dB below LSL)`;
                } else {
                    const margin = (measuredVal - usl).toFixed(1);
                    passFailIndicator.textContent = `FAIL (Power too high: +${margin} dB above USL)`;
                }
            }
        } else {
            // Hide measured marker and legend
            measuredMarker.style.display = "none";
            legendMeasuredItem.style.display = "none";
            
            // Reset status bar
            passFailIndicator.className = "status-indicator-bar";
            passFailIndicator.textContent = "Enter measured output power to verify limits";
        }
    }
});
