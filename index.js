// 3GPP MPR & PCMAX limits calculator logic (LTE & 5G NR FR1)

document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const techSelect = document.getElementById("tech-select");
    const modeSelect = document.getElementById("mode-select");
    
    const pcGroup = document.getElementById("pc-group");
    const pcSelect = document.getElementById("pc-select");
    
    const bandSelectLabel = document.getElementById("band-select-label");
    const bandSelect = document.getElementById("band-select");
    
    const waveformGroup = document.getElementById("waveform-group");
    const waveformSelect = document.getElementById("waveform-select");
    
    const scsGroup = document.getElementById("scs-group");
    const scsSelect = document.getElementById("scs-select");
    
    const bwGroup = document.getElementById("bw-group");
    const bwSelect = document.getElementById("bw-select");
    
    const modulationSelect = document.getElementById("modulation-select");
    const rbAllocGroup = document.getElementById("rb-alloc-group");
    const allocSelect = document.getElementById("alloc-select");
    
    const edgeSizeGroup = document.getElementById("edge-size-group");
    const edgeSizeSelect = document.getElementById("edge-size-select");
    
    const note1Checkbox = document.getElementById("note1-checkbox");
    const note1Text = document.getElementById("note1-text");
    const note1StatusBadge = document.getElementById("note1-status");
    
    const note3Container = document.getElementById("note3-container");
    const note3Checkbox = document.getElementById("note3-checkbox");
    const note3Text = document.getElementById("note3-text");
    const note3StatusBadge = document.getElementById("note3-status");
    
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
    const gaugeScale = document.getElementById("gauge-scale");
    
    const infoBandNominal = document.getElementById("info-band-nominal");
    const infoBaseTol = document.getElementById("info-base-tol");
    const infoMpr = document.getElementById("info-mpr");
    const infoTt = document.getElementById("info-tt");
    
    const infoPcmaxTolItem = document.getElementById("info-pcmax-tol-item");
    const infoPcmaxTol = document.getElementById("info-pcmax-tol");
    
    const appliedNotesSection = document.getElementById("applied-notes-section");
    const appliedNotesList = document.getElementById("applied-notes-list");

    // 5G NR FR1 Transmission Bandwidth Configuration (N_RB) Table 5.3.2-1
    const NRB_LOOKUP = {
        "15": {
            "3": 15, "5": 25, "10": 52, "15": 79, "20": 106, "25": 133, "30": 160, "35": 188, "40": 216, "45": 242, "50": 270
        },
        "30": {
            "5": 11, "10": 24, "15": 38, "20": 51, "25": 65, "30": 78, "35": 92, "40": 106, "45": 119, "50": 133, "60": 162, "70": 189, "80": 217, "90": 245, "100": 273
        },
        "60": {
            "10": 11, "15": 18, "20": 24, "25": 31, "30": 38, "35": 44, "40": 51, "45": 58, "50": 65, "60": 79, "70": 93, "80": 107, "90": 121, "100": 135
        }
    };

    function getNrb(scs, bw) {
        if (NRB_LOOKUP[scs] && NRB_LOOKUP[scs][bw]) {
            return NRB_LOOKUP[scs][bw];
        }
        return null;
    }

    // Dynamic Options updates
    function updateTechMode() {
        const tech = techSelect.value;
        
        if (tech === "lte") {
            pcGroup.style.display = "none";
            waveformGroup.style.display = "none";
            scsGroup.style.display = "none";
            bwGroup.style.display = "none";
            edgeSizeGroup.style.display = "none";
            
            note1Text.textContent = "Note 1 (Band-Edge Relaxation, -1.5 dB LSL)";
            note3Text.textContent = "Note 3 (B18/B26, -1.5 dB LSL)";
        } else {
            pcGroup.style.display = "block";
            waveformGroup.style.display = "block";
            scsGroup.style.display = "block";
            bwGroup.style.display = "block";
            
            note1Text.textContent = "Note 1 (Pi/2 BPSK Power Boosting)";
            note3Text.textContent = "Note 3 (Band-Edge Relaxation, -1.5 dB LSL)";
        }
        
        updateBandOptions();
        updateModulationOptions();
    }

    function updateBandOptions() {
        const tech = techSelect.value;
        const currentVal = bandSelect.value;
        
        bandSelect.innerHTML = "";
        
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select operating band...";
        bandSelect.appendChild(defaultOption);
        
        if (tech === "lte") {
            bandSelectLabel.textContent = "E-UTRA Operating Band";
            const bandsList = Object.keys(MPR_LIMITS_DB).map(Number).sort((a, b) => a - b);
            bandsList.forEach(band => {
                const option = document.createElement("option");
                option.value = band;
                option.textContent = `Band ${band}`;
                bandSelect.appendChild(option);
            });
            
            if (MPR_LIMITS_DB[currentVal]) {
                bandSelect.value = currentVal;
            } else {
                bandSelect.value = "1";
            }
        } else {
            bandSelectLabel.textContent = "5G NR Operating Band";
            const bandsList = Object.keys(MPR_LIMITS_5G_DB).sort((a, b) => {
                const numA = parseInt(a.replace("n", ""));
                const numB = parseInt(b.replace("n", ""));
                return numA - numB;
            });
            
            bandsList.forEach(band => {
                const option = document.createElement("option");
                option.value = band;
                option.textContent = `Band ${band}`;
                bandSelect.appendChild(option);
            });
            
            if (MPR_LIMITS_5G_DB[currentVal]) {
                bandSelect.value = currentVal;
            } else {
                bandSelect.value = "n78";
            }
            updatePowerClassOptions();
        }
    }

    function updatePowerClassOptions() {
        const tech = techSelect.value;
        if (tech !== "nr") return;
        
        const band = bandSelect.value;
        if (!band) return;
        
        const bandData = MPR_LIMITS_5G_DB[band];
        if (!bandData) return;
        
        const supportedPc = bandData.supported_pc;
        const currentVal = pcSelect.value;
        
        pcSelect.innerHTML = "";
        
        if (supportedPc.includes(3)) {
            const option = document.createElement("option");
            option.value = "3";
            option.textContent = "Power Class 3 (23 dBm)";
            pcSelect.appendChild(option);
        }
        if (supportedPc.includes(2)) {
            const option = document.createElement("option");
            option.value = "2";
            option.textContent = "Power Class 2 (26 dBm)";
            pcSelect.appendChild(option);
        }
        if (supportedPc.includes(1)) {
            const option = document.createElement("option");
            option.value = "1";
            option.textContent = "Power Class 1 (31 dBm)";
            pcSelect.appendChild(option);
        }
        
        if (supportedPc.includes(Number(currentVal))) {
            pcSelect.value = currentVal;
        } else {
            pcSelect.value = String(supportedPc[0]);
        }
    }

    function updateModulationOptions() {
        const tech = techSelect.value;
        const waveform = waveformSelect.value;
        const currentVal = modulationSelect.value;
        
        modulationSelect.innerHTML = "";
        
        if (tech === "lte") {
            const options = [
                { value: "qpsk", label: "QPSK" },
                { value: "16qam", label: "16QAM" },
                { value: "64qam", label: "64QAM" },
                { value: "256qam", label: "256QAM" }
            ];
            options.forEach(opt => {
                const el = document.createElement("option");
                el.value = opt.value;
                el.textContent = opt.label;
                modulationSelect.appendChild(el);
            });
            if (["qpsk", "16qam", "64qam", "256qam"].includes(currentVal)) {
                modulationSelect.value = currentVal;
            } else {
                modulationSelect.value = "qpsk";
            }
        } else {
            const options = [];
            if (waveform === "dft-s-ofdm") {
                options.push({ value: "pi2_bpsk", label: "\u03c0/2 BPSK" });
                options.push({ value: "pi2_bpsk_dmrs", label: "\u03c0/2 BPSK w/ DMRS" });
            }
            options.push({ value: "qpsk", label: "QPSK" });
            options.push({ value: "16qam", label: "16QAM" });
            options.push({ value: "64qam", label: "64QAM" });
            options.push({ value: "256qam", label: "256QAM" });
            
            options.forEach(opt => {
                const el = document.createElement("option");
                el.value = opt.value;
                el.textContent = opt.label;
                modulationSelect.appendChild(el);
            });
            
            const validValues = options.map(o => o.value);
            if (validValues.includes(currentVal)) {
                modulationSelect.value = currentVal;
            } else {
                modulationSelect.value = "qpsk";
            }
        }
        updateAllocationOptions();
    }

    function updateAllocationOptions() {
        const tech = techSelect.value;
        const mod = modulationSelect.value;
        const currentVal = allocSelect.value;
        
        allocSelect.innerHTML = "";
        
        if (tech === "lte") {
            rbAllocGroup.style.display = (mod === "256qam") ? "none" : "block";
            edgeSizeGroup.style.display = "none";
            
            const options = [
                { value: "partial", label: "Partial RB (Inner Allocation)" },
                { value: "full", label: "Full RB (Outer Allocation)" }
            ];
            options.forEach(opt => {
                const el = document.createElement("option");
                el.value = opt.value;
                el.textContent = opt.label;
                allocSelect.appendChild(el);
            });
            if (["partial", "full"].includes(currentVal)) {
                allocSelect.value = currentVal;
            } else {
                allocSelect.value = "partial";
            }
        } else {
            rbAllocGroup.style.display = "block";
            
            const options = [
                { value: "inner", label: "Inner RB Allocation" },
                { value: "outer", label: "Outer RB Allocation" },
                { value: "edge", label: "Edge RB Allocation (\u2264 2 RBs)" }
            ];
            options.forEach(opt => {
                const el = document.createElement("option");
                el.value = opt.value;
                el.textContent = opt.label;
                allocSelect.appendChild(el);
            });
            
            const validValues = ["inner", "outer", "edge"];
            if (validValues.includes(currentVal)) {
                allocSelect.value = currentVal;
            } else {
                allocSelect.value = "inner";
            }
            
            edgeSizeGroup.style.display = (allocSelect.value === "edge") ? "block" : "none";
        }
    }

    // Table 6.2.5.3-1 / 6.2.4.3-2 Mapped Configured Power Tolerance
    function getPcmaxTolerance(pcmax) {
        if (pcmax >= 21.0) return 2.0;
        if (pcmax >= 20.0) return 2.5;
        if (pcmax >= 19.0) return 3.5;
        if (pcmax >= 18.0) return 4.0;
        if (pcmax >= 13.0) return 5.0;
        if (pcmax >= 8.0) return 6.0;
        return 7.0;
    }

    // Shared visualizer gauge update
    function updateGauge(usl, lsl, nominal, powerClass) {
        let scaleMin = 10.0;
        let scaleMax = 30.0;
        
        if (powerClass === 1) {
            scaleMin = 15.0;
            scaleMax = 35.0;
        }
        
        const scaleRange = scaleMax - scaleMin;
        
        gaugeScale.innerHTML = "";
        const markings = (powerClass === 1) ? [15, 20, 23, 26, 31, 35] : [10, 15, 20, 23, 26, 30];
        markings.forEach(val => {
            const span = document.createElement("span");
            span.textContent = `${val} dBm`;
            gaugeScale.appendChild(span);
        });
        
        function getPct(val) {
            const pct = ((val - scaleMin) / scaleRange) * 100;
            return Math.max(0, Math.min(100, pct));
        }
        
        const lslPct = getPct(lsl);
        const uslPct = getPct(usl);
        const nomPct = getPct(nominal);
        
        nominalMarker.style.left = `${nomPct}%`;
        nominalMarker.title = `Nominal Power (${nominal.toFixed(1)} dBm)`;
        
        powerBar.style.left = `${lslPct}%`;
        powerBar.style.width = `${uslPct - lslPct}%`;
        
        const measuredValStr = measuredPowerInput.value.trim();
        if (measuredValStr !== "" && !isNaN(measuredValStr)) {
            const measuredVal = parseFloat(measuredValStr);
            const measuredPct = getPct(measuredVal);
            
            measuredMarker.style.display = "block";
            measuredMarker.style.left = `${measuredPct}%`;
            measuredMarker.title = `Your Measured Power (${measuredVal.toFixed(1)} dBm)`;
            legendMeasuredItem.style.display = "flex";
            
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
            measuredMarker.style.display = "none";
            legendMeasuredItem.style.display = "none";
            passFailIndicator.className = "status-indicator-bar";
            passFailIndicator.textContent = "Enter measured output power to verify limits";
        }
    }

    // Calculations
    function calculateLTE() {
        const mode = modeSelect.value;
        const band = bandSelect.value;
        const mod = modulationSelect.value;
        const alloc = allocSelect.value;
        
        if (!band) return;

        const bandData = MPR_LIMITS_DB[band];
        if (!bandData) return;

        const nominal = bandData.nominal;
        
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
        const tt = Math.round((limitsData.tol_upper - 2.0) * 10) / 10;
        
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

        // Note 1 (Band Edge)
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

        // Note 3 (Coexistence)
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

        if (mode === "mpr") {
            document.querySelector(".spec-limits .result-card-title").textContent = "Conformance Test Limits (Clause 6.2.3)";
            infoPcmaxTolItem.style.display = "none";
            
            usl = limitsData.usl;
            lsl = limitsData.lsl;
            coreUsl = nominal + 2.0;
            coreLsl = limitsData.lsl + tt;
        } else {
            document.querySelector(".spec-limits .result-card-title").textContent = "Configured Power Limits (Clause 6.2.5)";
            infoPcmaxTolItem.style.display = "flex";
            
            coreUsl = nominal + 2.0;
            usl = coreUsl + tt;
            
            const pcmaxLTarget = nominal - mprVal;
            const qpskPartialData = bandData["qpsk_partial"];
            const tLc = Math.abs(qpskPartialData.tol_lower) - tt; 
            
            const pcmaxTol = getPcmaxTolerance(pcmaxLTarget);
            let effectiveCoreTol = tLc;
            
            if (footnotes.includes(2)) {
                effectiveCoreTol = Math.max(tLc, pcmaxTol);
                infoPcmaxTol.textContent = `\u00b1${pcmaxTol.toFixed(1)} dB (Note 2 Applied)`;
                notesApplied.push("<strong>Note 2 (Table 6.2.5.3-1)</strong>: Mapped configured power (PCMAX) limits dynamically. Core tolerance relaxed to <strong>&plusmn;" + pcmaxTol.toFixed(1) + " dB</strong>.");
            } else {
                infoPcmaxTol.textContent = `\u00b1${tLc.toFixed(1)} dB (Standard)`;
                notesApplied.push("<strong>Note 2 (Clause 6.2.5)</strong>: Not applicable to this band. Standard tolerances applied.");
            }
            
            coreLsl = pcmaxLTarget - effectiveCoreTol;
            lsl = coreLsl - tt;
        }

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

        testUslVal.textContent = `${usl.toFixed(1)} dBm`;
        testLslVal.textContent = `${lsl.toFixed(1)} dBm`;
        coreUslVal.textContent = `${coreUsl.toFixed(1)} dBm`;
        coreLslVal.textContent = `${coreLsl.toFixed(1)} dBm`;

        infoBandNominal.textContent = `${nominal.toFixed(1)} dBm`;
        
        let baseTolStr = "+2.0 / -2.0 dB";
        if (band === "22" || band === "42" || band === "43") baseTolStr = "+2.0 / -3.0 dB";
        else if (band === "24") baseTolStr = "+2.0 / -3.0 dB";
        else if (band === "28") baseTolStr = "+2.0 / -2.5 dB";
        infoBaseTol.textContent = baseTolStr;
        
        infoMpr.textContent = mprDisplayStr;
        infoTt.textContent = `+${tt.toFixed(1)} / -${tt.toFixed(1)} dB`;

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

        updateGauge(usl, lsl, nominal, 3);
    }

    function calculate5G() {
        const band = bandSelect.value;
        const powerClass = Number(pcSelect.value);
        const waveform = waveformSelect.value;
        const mod = modulationSelect.value;
        const alloc = allocSelect.value;
        const edgeSize = Number(edgeSizeSelect.value);
        const scs = scsSelect.value;
        const bw = bwSelect.value;
        const mode = modeSelect.value;
        
        if (!band) return;
        
        const bandData = MPR_LIMITS_5G_DB[band];
        if (!bandData) return;
        
        const pcKey = "pc" + powerClass;
        const pcData = bandData[pcKey];
        if (!pcData) return;
        
        let nominal = pcData.nominal;
        const tolUpper = pcData.tol_upper;
        const tolLower = pcData.tol_lower;
        
        const isTdd = ["n40", "n41", "n77", "n78", "n79"].includes(band);
        const hasNote1 = isTdd && (powerClass === 3) && (waveform === "dft-s-ofdm") && (mod === "pi2_bpsk");
        let note1Active = false;
        
        if (hasNote1) {
            note1Checkbox.disabled = false;
            if (note1Checkbox.checked) {
                note1Active = true;
                note1StatusBadge.textContent = "Active";
                note1StatusBadge.className = "note-status-badge status-active";
                nominal = 26.0;
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
        
        const hasNote3 = pcData.note3_supported;
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
        
        let tt = 1.0;
        if (["n48", "n77", "n78", "n79"].includes(band)) {
            tt = 1.0;
        } else {
            const bwNum = Number(bw);
            if (bwNum <= 40) {
                tt = 0.7;
            } else {
                tt = 1.0;
            }
        }
        
        let baseMpr = 0.0;
        let mprFormulaUsed = false;
        let nRbVal = getNrb(scs, bw);
        
        if (waveform === "dft-s-ofdm") {
            if (mod === "pi2_bpsk") {
                if (powerClass === 3) {
                    if (note1Active) {
                        if (alloc === "inner") baseMpr = 0.2;
                        else if (alloc === "outer") baseMpr = 1.2;
                        else if (alloc === "edge") baseMpr = 3.5;
                    } else {
                        if (alloc === "inner") baseMpr = 0.0;
                        else if (alloc === "outer") baseMpr = 0.5;
                        else if (alloc === "edge") {
                            baseMpr = (bw === "3") ? 1.0 : 0.5;
                        }
                    }
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 0.0;
                    else if (alloc === "outer") baseMpr = 0.5;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 0.0;
                        else if (alloc === "outer") baseMpr = 0.5;
                        else if (alloc === "edge") baseMpr = 0.5;
                    } else {
                        if (alloc === "inner") baseMpr = 0.0;
                        else if (alloc === "outer") baseMpr = 0.5;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "pi2_bpsk_dmrs") {
                if (alloc === "inner") baseMpr = 0.0;
                else if (alloc === "outer") baseMpr = 0.0;
                else if (alloc === "edge") {
                    if (powerClass === 1 && band !== "n14") {
                        mprFormulaUsed = true;
                    } else {
                        baseMpr = (bw === "3") ? 1.0 : 0.5;
                    }
                }
            } else if (mod === "qpsk") {
                if (powerClass === 3) {
                    if (alloc === "inner") baseMpr = 0.0;
                    else if (alloc === "outer") baseMpr = 1.0;
                    else if (alloc === "edge") baseMpr = 1.0;
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 0.0;
                    else if (alloc === "outer") baseMpr = 1.0;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 0.0;
                        else if (alloc === "outer") baseMpr = 1.0;
                        else if (alloc === "edge") baseMpr = 1.0;
                    } else {
                        if (alloc === "inner") baseMpr = 0.0;
                        else if (alloc === "outer") baseMpr = 1.0;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "16qam") {
                if (powerClass === 3) {
                    if (alloc === "inner") baseMpr = 1.0;
                    else if (alloc === "outer") baseMpr = 2.0;
                    else if (alloc === "edge") baseMpr = 2.0;
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 1.0;
                    else if (alloc === "outer") baseMpr = 2.0;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 1.0;
                        else if (alloc === "outer") baseMpr = 2.0;
                        else if (alloc === "edge") baseMpr = 2.0;
                    } else {
                        if (alloc === "inner") baseMpr = 1.0;
                        else if (alloc === "outer") baseMpr = 2.0;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "64qam") {
                if (powerClass === 3) {
                    if (alloc === "inner") baseMpr = 1.5;
                    else if (alloc === "outer") baseMpr = 2.5;
                    else if (alloc === "edge") baseMpr = 2.5;
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 2.5;
                    else if (alloc === "outer") baseMpr = 2.5;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 1.5;
                        else if (alloc === "outer") baseMpr = 2.5;
                        else if (alloc === "edge") baseMpr = 2.5;
                    } else {
                        if (alloc === "inner") baseMpr = 2.5;
                        else if (alloc === "outer") baseMpr = 2.5;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "256qam") {
                if (powerClass === 1 && band !== "n14" && alloc === "edge") {
                    mprFormulaUsed = true;
                } else {
                    baseMpr = 4.5;
                }
            }
        } else if (waveform === "cp-ofdm") {
            if (mod === "qpsk") {
                if (powerClass === 3) {
                    if (alloc === "inner") baseMpr = 1.5;
                    else if (alloc === "outer") baseMpr = 3.0;
                    else if (alloc === "edge") baseMpr = 3.0;
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 1.5;
                    else if (alloc === "outer") baseMpr = 3.0;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 1.5;
                        else if (alloc === "outer") baseMpr = 3.0;
                        else if (alloc === "edge") baseMpr = 3.0;
                    } else {
                        if (alloc === "inner") baseMpr = 1.5;
                        else if (alloc === "outer") baseMpr = 3.0;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "16qam") {
                if (powerClass === 3) {
                    if (alloc === "inner") baseMpr = 2.0;
                    else if (alloc === "outer") baseMpr = 3.0;
                    else if (alloc === "edge") baseMpr = 3.0;
                } else if (powerClass === 2) {
                    if (alloc === "inner") baseMpr = 2.0;
                    else if (alloc === "outer") baseMpr = 3.0;
                    else if (alloc === "edge") baseMpr = 3.5;
                } else if (powerClass === 1) {
                    if (band === "n14") {
                        if (alloc === "inner") baseMpr = 2.0;
                        else if (alloc === "outer") baseMpr = 3.0;
                        else if (alloc === "edge") baseMpr = 3.0;
                    } else {
                        if (alloc === "inner") baseMpr = 2.0;
                        else if (alloc === "outer") baseMpr = 3.0;
                        else if (alloc === "edge") {
                            mprFormulaUsed = true;
                        }
                    }
                }
            } else if (mod === "64qam") {
                if (powerClass === 1 && band !== "n14" && alloc === "edge") {
                    mprFormulaUsed = true;
                } else {
                    baseMpr = 3.5;
                }
            } else if (mod === "256qam") {
                if (powerClass === 1 && band !== "n14" && alloc === "edge") {
                    mprFormulaUsed = true;
                } else {
                    baseMpr = 6.5;
                }
            }
        }
        
        let mprFormulaDetails = "";
        if (mprFormulaUsed) {
            if (nRbVal) {
                const bwNum = Number(bw);
                if (bwNum <= 50) {
                    baseMpr = 7.2 - 6 * (edgeSize / nRbVal);
                    mprFormulaDetails = `7.2 - 6 * (${edgeSize} / ${nRbVal}) = ${baseMpr.toFixed(3)} dB`;
                } else {
                    baseMpr = 5.35 + 3.15 * (edgeSize / nRbVal);
                    mprFormulaDetails = `5.35 + 3.15 * (${edgeSize} / ${nRbVal}) = ${baseMpr.toFixed(3)} dB`;
                }
                baseMpr = Math.ceil(baseMpr * 2) / 2;
                if (baseMpr < 0.5) baseMpr = 0.5;
            } else {
                baseMpr = 0.5;
                mprFormulaDetails = "N/A (Invalid SCS/BW combination)";
            }
        }
        
        let deltaMpr = 0.0;
        let appliedDeltaMprNote = false;
        
        if (powerClass === 3 || powerClass === 2) {
            if (band === "n28" && (bw === "30" || bw === "40")) {
                deltaMpr = 0.5;
                appliedDeltaMprNote = true;
            } else if (band === "n40" && bw === "100") {
                deltaMpr = 1.0;
                appliedDeltaMprNote = true;
            }
        }
        
        const finalMpr = baseMpr + deltaMpr;
        
        let mprDisplayStr = finalMpr.toFixed(1) + " dB";
        if (deltaMpr > 0) {
            mprDisplayStr += ` (+${deltaMpr.toFixed(1)} dB Table 6.2.2.3-3)`;
        }
        if (mprFormulaUsed) {
            mprDisplayStr += ` (Formula: ${mprFormulaDetails})`;
        }
        
        let usl = 0.0;
        let lsl = 0.0;
        let coreUsl = 0.0;
        let coreLsl = 0.0;
        let notesApplied = [];
        
        if (appliedDeltaMprNote) {
            notesApplied.push(`<strong>Table 6.2.2.3-3 (\u0394MPR)</strong>: Operating band relative channel bandwidth is > 3% (FDD) or > 4% (TDD). Allowed MPR increased by <strong>+${deltaMpr.toFixed(1)} dB</strong>.`);
        }
        
        if (mode === "mpr") {
            document.querySelector(".spec-limits .result-card-title").textContent = "Conformance Test Limits (Clause 6.2.2)";
            infoPcmaxTolItem.style.display = "none";
            
            usl = nominal + tolUpper + tt;
            lsl = nominal - finalMpr + tolLower - tt;
            
            coreUsl = nominal + tolUpper;
            coreLsl = nominal - finalMpr + tolLower;
        } else {
            document.querySelector(".spec-limits .result-card-title").textContent = "Configured Power Limits (Clause 6.2.4)";
            infoPcmaxTolItem.style.display = "flex";
            
            coreUsl = nominal + 2.0;
            usl = coreUsl + tt;
            
            const pcmaxLTarget = nominal - finalMpr;
            const pcmaxTol = getPcmaxTolerance(pcmaxLTarget);
            const tLc = Math.abs(tolLower);
            
            const effectiveCoreTol = Math.max(tLc, pcmaxTol);
            
            coreLsl = pcmaxLTarget - effectiveCoreTol;
            lsl = coreLsl - tt;
            
            infoPcmaxTol.textContent = `\u00b1${effectiveCoreTol.toFixed(1)} dB (MAX{\u00b1${tLc.toFixed(1)}, \u00b1${pcmaxTol.toFixed(1)}})`;
            notesApplied.push(`<strong>Clause 6.2.4 Configured Power Tolerance</strong>: Evaluated based on target PCMAX_L = ${pcmaxLTarget.toFixed(1)} dBm. Core tolerance matches MAX{\u00b1${tLc.toFixed(1)} band tolerance, \u00b1${pcmaxTol.toFixed(1)} configured tolerance} = <strong>\u00b1${effectiveCoreTol.toFixed(1)} dB</strong>.`);
        }
        
        if (hasNote3 && note3Checkbox.checked) {
            lsl = Math.round((lsl - 1.5) * 100) / 100;
            coreLsl = Math.round((coreLsl - 1.5) * 100) / 100;
            notesApplied.push(`<strong>Note 3 (Band Edge relaxation)</strong>: Lower limit (LSL) reduced by 1.5 dB for transmission bandwidths at band edges.`);
        }
        
        testUslVal.textContent = `${usl.toFixed(1)} dBm`;
        testLslVal.textContent = `${lsl.toFixed(1)} dBm`;
        coreUslVal.textContent = `${coreUsl.toFixed(1)} dBm`;
        coreLslVal.textContent = `${coreLsl.toFixed(1)} dBm`;
        
        infoBandNominal.textContent = `${nominal.toFixed(1)} dBm`;
        
        let baseTolStr = `+${tolUpper.toFixed(1)} / -${Math.abs(tolLower).toFixed(1)} dB`;
        infoBaseTol.textContent = baseTolStr;
        infoMpr.textContent = mprDisplayStr;
        infoTt.textContent = `+${tt.toFixed(1)} / -${tt.toFixed(1)} dB`;
        
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
        
        updateGauge(usl, lsl, nominal, powerClass);
    }

    function calculateAndDisplay() {
        if (techSelect.value === "lte") {
            calculateLTE();
        } else {
            calculate5G();
        }
    }

    // Event Listeners
    techSelect.addEventListener("change", () => {
        updateTechMode();
        calculateAndDisplay();
    });
    
    modeSelect.addEventListener("change", calculateAndDisplay);
    
    pcSelect.addEventListener("change", calculateAndDisplay);
    
    bandSelect.addEventListener("change", () => {
        if (techSelect.value === "nr") {
            updatePowerClassOptions();
        }
        calculateAndDisplay();
    });
    
    waveformSelect.addEventListener("change", () => {
        updateModulationOptions();
        calculateAndDisplay();
    });
    
    scsSelect.addEventListener("change", calculateAndDisplay);
    bwSelect.addEventListener("change", calculateAndDisplay);
    
    modulationSelect.addEventListener("change", () => {
        updateAllocationOptions();
        calculateAndDisplay();
    });
    
    allocSelect.addEventListener("change", () => {
        if (techSelect.value === "nr") {
            edgeSizeGroup.style.display = (allocSelect.value === "edge") ? "block" : "none";
        }
        calculateAndDisplay();
    });
    
    edgeSizeSelect.addEventListener("change", calculateAndDisplay);
    
    note1Checkbox.addEventListener("change", calculateAndDisplay);
    note3Checkbox.addEventListener("change", calculateAndDisplay);
    measuredPowerInput.addEventListener("input", calculateAndDisplay);

    // Initial triggers
    updateTechMode();
    calculateAndDisplay();
});
