
/**
 * CT and MRI Specification Definitions
 * 
 * This file defines the strict type definitions for technical specifications
 * of CT Scanners and MRI Machines. It aims to standardize the data structure
 * across the application, replacing loose key-value pairs with typed interfaces.
 */

// ==========================================
// Common Specifications
// ==========================================

export interface PhysicalDimensions {
  width: number; // cm
  depth: number; // cm
  height: number; // cm
  weight: number; // kg
}

export interface PowerRequirements {
  voltage: number; // V
  phase: number; // 1 or 3
  frequency: number; // Hz (50/60)
  consumption: number; // kVA
}

export interface InstallationRequirements {
  minRoomSize: {
    length: number; // m
    width: number; // m
    height: number; // m
  };
  shieldingType?: string; // e.g., "Lead", "RF Cage"
  coolingSystem?: 'Air' | 'Water' | 'Chiller';
}

export interface CommonDeviceSpecs {
  dimensions?: PhysicalDimensions;
  power?: PowerRequirements;
  installation?: InstallationRequirements;
  connectivity?: string[]; // e.g., "DICOM 3.0", "HL7"
  certifications?: string[]; // e.g., "FDA", "CE", "NMPA"
}

// ==========================================
// CT Scanner Specifications
// ==========================================

export type CTDetectorType = 'Solid State' | 'Ceramic' | 'Gemstone' | 'Stellar';
export type CTScanMode = 'Helical' | 'Axial' | 'Cine' | 'Fluoroscopy';

export interface CTSpecs extends CommonDeviceSpecs {
  // Core Imaging Parameters
  sliceCount: number; // e.g., 16, 64, 128, 256, 320, 640
  detectorRows: number; // Physical rows of detectors
  rotationSpeed: number; // Seconds per full rotation (e.g., 0.28, 0.35, 0.5)
  boreSize: number; // Gantry aperture in cm (e.g., 70, 78, 80)
  fov: number; // Field of View in cm
  
  // X-Ray Generator & Tube
  generatorPower: number; // kW (e.g., 50, 80, 100)
  tubeHeatCapacity: number; // MHU (Million Heat Units)
  tubeVoltageSteps: number[]; // kV settings (e.g., [70, 80, 100, 120, 140])
  
  // Advanced Features
  spectralImaging: boolean; // Dual Energy / Spectral CT capability
  cardiacCapability: boolean; // Suitable for cardiac imaging
  perfusionCapability: boolean; // Brain/Body perfusion support
  fluoroscopy: boolean; // CT Fluoroscopy support
  aiReconstruction: boolean; // Deep Learning Reconstruction (DLIR)
  
  // Performance
  spatialResolution?: number; // lp/cm
  contrastResolution?: string; // e.g., "2mm @ 0.3%"
}

// ==========================================
// MRI Scanner Specifications
// ==========================================

export type MRIMagnetType = 'Superconducting' | 'Permanent' | 'Resistive';
export type MRIArchitecture = 'Closed Bore' | 'Wide Bore' | 'Open';

export interface MRISpecs extends CommonDeviceSpecs {
  // Magnet System
  fieldStrength: number; // Tesla (e.g., 0.35, 1.5, 3.0, 7.0)
  magnetType: MRIMagnetType;
  architecture: MRIArchitecture;
  boreSize: number; // cm (e.g., 60, 70, 75)
  homogeneity: string; // ppm @ dsv (e.g., "0.1 ppm @ 40cm DSV")
  zeroBoilOff: boolean; // Helium consumption technology
  
  // Gradient System
  gradientStrength: number; // mT/m (e.g., 33, 45, 80)
  slewRate: number; // T/m/s (e.g., 120, 200)
  
  // RF System
  rfChannels: number; // Number of independent RF channels (e.g., 32, 64, 128)
  digitalReceiver: boolean; // Direct Digital Sampling
  
  // Clinical Capabilities
  cardiacImaging: boolean;
  neuroImaging: boolean;
  breastImaging: boolean;
  quietSuite: boolean; // Noise reduction technology
  compressedSensing: boolean; // Accelerated scanning technology
}

// ==========================================
// Unified Specification Type
// ==========================================

export type DeviceSpecificSpecs = 
  | { type: 'ct'; specs: CTSpecs }
  | { type: 'mri'; specs: MRISpecs };
