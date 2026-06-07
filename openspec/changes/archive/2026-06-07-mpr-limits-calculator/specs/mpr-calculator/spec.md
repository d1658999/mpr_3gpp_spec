## ADDED Requirements

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
The system SHALL support applying the 3GPP Note 1 band-edge relaxation, which reduces the Lower Specification Limit (LSL) by an additional 1.5 dB.

#### Scenario: Apply Note 1 relaxation on Band 1 QPSK Full RB
- **WHEN** the user selects Band 1, Modulation QPSK, Full RB allocation, and checks the Note 1 relaxation option
- **THEN** the system SHALL calculate the relaxed limits as USL = 25.7 dBm and LSL = 17.8 dBm.

### Requirement: Note 2 Configured Power Limits (Table 6.2.5.3-1)
The system SHALL display the configured maximum output power ($P_{CMAX}$) limits and tolerances according to 3GPP TS 36.521-1 Table 6.2.5.3-1 (Note 2), which relax the tolerance as the target maximum power is reduced by MPR.

#### Scenario: Lookup Note 2 PCMAX limits for QPSK Full RB (MPR = 1 dB)
- **WHEN** the user selects QPSK Full RB (target configured power is 22.0 dBm)
- **THEN** the system SHALL apply a core tolerance of 2.0 dB and compute the lower bound for PCMAX.

#### Scenario: Lookup Note 2 PCMAX limits for 64QAM Full RB (MPR = 3 dB)
- **WHEN** the user selects 64QAM Full RB (target configured power is 20.0 dBm)
- **THEN** the system SHALL apply a relaxed core tolerance of 2.5 dB (0.5 dB relaxation) and compute the lower bound for PCMAX.

### Requirement: Note 3 Band 18/26 Coexistence Relaxation
The system SHALL support applying the 3GPP Note 3 coexistence relaxation for Bands 18 and 26 (operating within 815 - 818 MHz), which reduces the LSL by an additional 1.5 dB.

#### Scenario: Apply Note 3 relaxation on Band 26 16QAM Full RB
- **WHEN** the user selects Band 26, Modulation 16QAM, Full RB allocation, and checks the Note 3 relaxation option
- **THEN** the system SHALL calculate the relaxed limits as USL = 25.7 dBm and LSL = 16.8 dBm.
