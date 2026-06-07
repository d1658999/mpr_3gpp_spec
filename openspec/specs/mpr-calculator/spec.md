# mpr-calculator Specification

## Purpose
TBD - created by archiving change mpr-limits-calculator. Update Purpose after archive.
## Requirements
### Requirement: Base MPR Limit Lookup
The system SHALL retrieve and compute the exact transmitter output power limits based on the user's selected E-UTRA Band, Modulation (QPSK, 16QAM, 64QAM, 256QAM), and RB Allocation (Partial vs. Full).

#### Scenario: Lookup limits for standard Band 1 QPSK Full RB
- **WHEN** the user selects Band 1, Modulation QPSK, and Full RB allocation
- **THEN** the system SHALL compute and display the Conformance Test limits as USL = 25.7 dBm and LSL = 19.3 dBm.

#### Scenario: Lookup limits for standard Band 1 256QAM
- **WHEN** the user selects Band 1, Modulation 256QAM (any RB allocation)
- **THEN** the system SHALL compute and display the Conformance Test limits as USL = 25.7 dBm and LSL = 15.3 dBm.

### Requirement: Band-Specific Asymmetric Tolerances
The system MUST retrieve and apply band-specific tolerances and exceptions, including relaxed test tolerances for Band 22/42/43, and asymmetric tolerances for Band 24 and Band 28.

#### Scenario: Lookup limits for Band 22 QPSK Partial RB
- **WHEN** the user selects Band 22, Modulation QPSK, and Partial RB allocation
- **THEN** the system SHALL apply a 1.0 dB Test Tolerance and compute limits as USL = 26.0 dBm and LSL = 18.5 dBm.

#### Scenario: Lookup limits for Band 28 QPSK Partial RB
- **WHEN** the user selects Band 28, Modulation QPSK, and Partial RB allocation
- **THEN** the system SHALL apply the asymmetric tolerance (-3.2 dB lower tolerance) and compute limits as USL = 25.7 dBm and LSL = 19.8 dBm.

### Requirement: Note 1 Band-Edge Relaxation
The system SHALL support applying the 3GPP Note 1 band-edge relaxation, which reduces the Lower Specification Limit (LSL) by an additional 1.5 dB, ONLY if Note 1 is applicable to the selected operating band and configuration according to the database footnotes. If Note 1 is not supported for the selected configuration, the option SHALL be disabled/inactive.

#### Scenario: Note 1 not supported on Band 1 QPSK Full RB
- **WHEN** the user selects Band 1, Modulation QPSK, and Full RB allocation
- **THEN** the system SHALL disable the Note 1 relaxation checkbox.

#### Scenario: Note 1 supported on Band 2 QPSK Full RB
- **WHEN** the user selects Band 2, Modulation QPSK, Full RB allocation, and checks the Note 1 relaxation option
- **THEN** the system SHALL enable the Note 1 checkbox and calculate the relaxed limits as USL = 25.7 dBm and LSL = 17.8 dBm.

### Requirement: Note 2 Configured Power Limits (Table 6.2.5.3-1)
The system SHALL display the configured maximum output power ($P_{CMAX}$) limits and tolerances according to 3GPP TS 36.521-1. If the selected operating band supports Note 2 (i.e. has footnote 2 in the database), the system SHALL relax the tolerance as the target maximum power is reduced by MPR according to Table 6.2.5.3-1. If Note 2 is not supported, the system SHALL apply the standard Clause 6.2.3 tolerances.

#### Scenario: Lookup Note 2 PCMAX limits for Band 1 (No Note 2)
- **WHEN** the user selects Band 1, Modulation QPSK, Full RB allocation (target configured power is 22.0 dBm), and chooses Configured Power (Clause 6.2.5) mode
- **THEN** the system SHALL apply the standard core tolerance of 2.0 dB and compute the lower bound for PCMAX (LSL = 19.3 dBm).

#### Scenario: Lookup Note 2 PCMAX limits for Band 2 (Supports Note 2)
- **WHEN** the user selects Band 2, Modulation 64QAM, Full RB allocation (target configured power is 20.0 dBm), and chooses Configured Power (Clause 6.2.5) mode
- **THEN** the system SHALL apply the relaxed core tolerance of 2.5 dB (0.5 dB relaxation) and compute the lower bound for PCMAX (LSL = 16.8 dBm).

### Requirement: Note 3 Band 18/26 Coexistence Relaxation
The system SHALL support applying the 3GPP Note 3 coexistence relaxation, which reduces the LSL by an additional 1.5 dB, ONLY if the selected band is Band 18 or Band 26.

#### Scenario: Note 3 checkbox hidden on Band 1
- **WHEN** the user selects Band 1
- **THEN** the system SHALL hide the Note 3 checkbox.

#### Scenario: Apply Note 3 relaxation on Band 26 16QAM Full RB
- **WHEN** the user selects Band 26, Modulation 16QAM, Full RB allocation, and checks the Note 3 relaxation option
- **THEN** the system SHALL display the Note 3 checkbox and calculate the relaxed limits as USL = 25.7 dBm and LSL = 16.8 dBm.

### Requirement: User Documentation
The system SHALL provide user documentation in the form of a README.md and GUIDE.md at the project root to detail installation, features, usage guidelines, and note applicability rules.

#### Scenario: Verify files exist
- **WHEN** the user inspects the repository root
- **THEN** both README.md and GUIDE.md files SHALL exist.

### Requirement: 5G Base MPR Limits
The system SHALL retrieve and compute the exact transmitter output power limits based on the user's selected 5G NR FR1 Band, Power Class (1, 2, 3), Waveform (DFT-s-OFDM, CP-OFDM), Modulation (BPSK to 256QAM), and RB Allocation (Inner, Outer, Edge).

#### Scenario: Lookup limits for standard PC3 Band n1 DFT-s-OFDM QPSK Outer
- **WHEN** the user selects E-UTRA Band n1, Power Class 3, Waveform DFT-s-OFDM, Modulation QPSK, and Outer RB allocation
- **THEN** the system SHALL compute and display the Conformance Test limits as USL = 26.0 dBm and LSL = 19.0 dBm (base MPR = 1.0 dB, test tolerance = 0.7 dB).

### Requirement: 5G Band-Specific Tolerances
The system MUST retrieve and apply 5G band-specific nominal powers and tolerances from the extracted 5G JSON database, including asymmetric tolerances (e.g. Band n28, n71, n105, n24, n48, n77, n78, n79).

#### Scenario: Lookup limits for PC3 Band n28 DFT-s-OFDM QPSK Inner
- **WHEN** the user selects Band n28, Power Class 3, Waveform DFT-s-OFDM, Modulation QPSK, and Inner RB allocation
- **THEN** the system SHALL apply the database base tolerance (+2.0 / -2.5 dB) and test tolerance (0.7 dB) to compute USL = 25.7 dBm and LSL = 19.8 dBm (base MPR = 0.0 dB).

### Requirement: 5G Note 1 TDD BPSK Power Boosting
The system SHALL support 3GPP Note 1 power boosting, which increases the nominal power class target from 23 dBm to 26 dBm and modifies MPR limits (Inner=0.2, Outer=1.2, Edge=3.5 dB), ONLY when operating in PC3 DFT-s-OFDM pi/2 BPSK on TDD bands (n40, n41, n77, n78, n79).

#### Scenario: Note 1 supported on PC3 Band n41
- **WHEN** the user selects Band n41, Power Class 3, Waveform DFT-s-OFDM, Modulation pi/2 BPSK, and checks the Note 1 checkbox
- **THEN** the system SHALL enable the Note 1 relaxation and compute limits as USL = 29.0 dBm and LSL = 22.8 dBm (boosted nominal = 26.0 dBm, base MPR = 1.2 dB for Outer allocation, test tolerance = 1.0 dB).

### Requirement: 5G Note 3 Band Edge Relaxation
The system SHALL support applying the 3GPP Note 3 band-edge relaxation, which reduces the Lower Specification Limit (LSL) by an additional 1.5 dB, ONLY if Note 3 is applicable to the selected operating band and power class according to the database.

#### Scenario: Note 3 supported on PC2 Band n28
- **WHEN** the user selects Band n28, Power Class 2, and checks the Note 3 checkbox
- **THEN** the system SHALL apply the -1.5 dB relaxation to the lower tolerance limit.

### Requirement: 5G PC1 Edge MPR Formula
The system SHALL dynamically compute the Edge MPR for Power Class 1 bands (excluding n14) using the standard formulas based on subcarrier spacing (SCS), channel bandwidth, and edge size (1 or 2 RBs).

#### Scenario: PC1 Band n78 Edge allocation 100MHz SCS 30kHz
- **WHEN** the user selects Band n78, Power Class 1, Waveform DFT-s-OFDM, Modulation QPSK, Edge allocation, Edge Size 2 RBs, SCS 30 kHz, and Bandwidth 100 MHz
- **THEN** the system SHALL calculate the Edge MPR dynamically using the formula `5.35 + 3.15 * (L_CRB / N_RB)` with N_RB = 273, rounding up to the nearest 0.5 dB, resulting in Edge MPR = 5.5 dB.

### Requirement: 5G Delta MPR (Table 6.2.2.3-3)
The system SHALL automatically apply the Table 6.2.2.3-3 Delta MPR offset (+0.5 dB for n28/30-40MHz, +1.0 dB for n40/100MHz) for PC2 and PC3 band configurations.

#### Scenario: PC3 Band n28 at 30 MHz bandwidth
- **WHEN** the user selects Band n28, Power Class 3, Bandwidth 30 MHz, Waveform DFT-s-OFDM, Modulation QPSK, Outer allocation
- **THEN** the system SHALL apply a +0.5 dB Delta MPR to the calculations.

### Requirement: 5G Configured UE Power (PCMAX) Tolerances
The system SHALL display the configured maximum output power ($P_{CMAX}$) limits and tolerances according to 3GPP TS 38.521-1 Table 6.2.4.3-2 in Configured Power mode.

#### Scenario: PCMAX limits for PC3 Band n1 DFT-s-OFDM QPSK Outer
- **WHEN** the user selects Band n1, Power Class 3, Waveform DFT-s-OFDM, Modulation QPSK, Outer allocation, and chooses Configured Power mode
- **THEN** the system SHALL apply the configured power tolerance of ±2.0 dB based on target PCMAX_L = 22.0 dBm.

