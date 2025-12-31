/**
 * Health Icons - From healthicons.org
 * Free, open source health icons for any use
 */

// ==================== NAVIGATION BAR ICONS ====================

// Home Icon - from places/home
export const HomeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 9.5L6 22.5V42H18V30H30V42H42V22.5L24 9.5Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Blood Gas Icon - from body/blood-drop
export const BloodGasIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6C24 6 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 6 24 6Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Electrolytes Icon - from devices/clinical-a (test tube)
export const ElectrolytesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6V18L10 38C10 40.2 11.8 42 14 42H34C36.2 42 38 40.2 38 38L30 18V6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 6H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 32H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Blood Products Icon - from blood/blood-bag (healthicons.org) - stroke version for consistency
export const BloodProductsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 10H34V34C34 36.2 32.2 38 30 38H18C15.8 38 14 36.2 14 34V10Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 10V6H28V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 38V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 18H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 28C18 28 22 30 24 30C26 30 30 28 34 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// GIR Icon - from devices/diabetes-measure (glucometer)
export const GIRIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="8" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="3"/>
    <rect x="16" y="12" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 28V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 30H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M18 36H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Jaundice Icon - from conditions/chills-fever (sun/temperature)
export const JaundiceNavIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="3"/>
    <path d="M24 6V12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 36V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M6 24H12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M36 24H42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M11.5 11.5L15.5 15.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32.5 32.5L36.5 36.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M11.5 36.5L15.5 32.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M32.5 15.5L36.5 11.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ==================== CHILDREN DASHBOARD WIDGETS ====================

// Blood Pressure Icon - from devices/blood-pressure
export const BloodPressureIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="3"/>
    <path d="M24 14V24L30 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 8V10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 38V40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M8 24H10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M38 24H40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Infusion Icon - from devices/intravenous-bag
export const InfusionIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 14H34V36C34 38.2 32.2 40 30 40H18C15.8 40 14 38.2 14 36V14Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 14V10C20 8.9 20.9 8 22 8H26C27.1 8 28 8.9 28 10V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 40V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 22H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Intubation Icon - from devices/endotracheal-tube
export const IntubationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H30C32 8 34 10 34 12V16H14V12C14 10 16 8 18 8Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 16V36C20 38.2 21.8 40 24 40C26.2 40 28 38.2 28 36V16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12H14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 12H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Scoring/Calculator Icon - from symbols/diagnostics
export const ScoringIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="3"/>
    <path d="M14 14H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 22H26" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 30H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="34" cy="34" r="6" stroke="currentColor" strokeWidth="3"/>
    <path d="M34 31V37" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M31 34H37" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// CPR/Heart Icon - from symbols/heartbeat
export const HeartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 42L10 28C6 24 4 18 8 12C12 6 20 8 24 14C28 8 36 6 40 12C44 18 42 24 38 28L24 42Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 24H16L20 18L24 30L28 22L32 24H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Approaches Icon - from symbols/clinical-f (document)
export const ApproachesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6H30L38 14V40C38 41.1 37.1 42 36 42H12C10.9 42 10 41.1 10 40V8C10 6.9 10.9 6 12 6Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 6V14H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 22H32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M16 30H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Drugs Icon - from medications/medicines
export const DrugsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14" width="14" height="28" rx="7" stroke="currentColor" strokeWidth="3"/>
    <path d="M8 28H22" stroke="currentColor" strokeWidth="3"/>
    <circle cx="33" cy="22" r="9" stroke="currentColor" strokeWidth="3"/>
    <path d="M33 18V26" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M29 22H37" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ==================== NICU DASHBOARD WIDGETS ====================

// Fluid Icon - from devices/intravenous-bag (same as infusion but smaller drops)
export const FluidIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6C16 6 10 14 10 20C10 23.3 12.7 26 16 26C19.3 26 22 23.3 22 20C22 14 16 6 16 6Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 14C32 14 26 22 26 28C26 31.3 28.7 34 32 34C35.3 34 38 31.3 38 28C38 22 32 14 32 14Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 30C20 30 14 38 14 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// NRP/Baby Icon - from people/baby
export const ResuscitationIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="12" r="6" stroke="currentColor" strokeWidth="3"/>
    <path d="M16 22C16 22 12 26 12 32C12 38 18 42 24 42C30 42 36 38 36 32C36 26 32 22 32 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 28L24 32L28 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Catheter Icon - from devices/syringe
export const CatheterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 6L42 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M36 12L24 24L12 36L6 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 16L32 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 24L24 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M34 8L40 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Growth Chart Icon - from symbols/height
export const GrowthChartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 6L20 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 6L8 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 14H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 22H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 30H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M14 38H18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="32" cy="14" r="4" stroke="currentColor" strokeWidth="3"/>
    <path d="M28 22V38H36V22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Blood Drop Icon - from body/blood-drop
export const BloodDropIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6C24 6 10 20 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 20 24 6 24 6Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 36C28.4 36 32 32.4 32 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Exchange Transfusion Icon - from blood/blood-bag with arrows
export const ExchangeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 24C10 15.2 17.2 8 26 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M38 24C38 32.8 30.8 40 22 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M22 8L26 4L30 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 40L22 44L18 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Activity/Pulse Icon - from symbols/heartbeat (simplified)
export const ActivityIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 24H12L16 14L24 34L32 20L36 24H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Stethoscope Icon - from devices/stethoscope
export const StethoscopeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8C14 8 8 14 8 22C8 28 12 32 16 32H20C22.2 32 24 30.2 24 28V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M34 8C34 8 40 14 40 22C40 28 36 32 32 32H28C25.8 32 24 30.2 24 28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="14" cy="8" r="2" stroke="currentColor" strokeWidth="3"/>
    <circle cx="34" cy="8" r="2" stroke="currentColor" strokeWidth="3"/>
    <circle cx="24" cy="40" r="4" stroke="currentColor" strokeWidth="3"/>
    <path d="M24 32V36" stroke="currentColor" strokeWidth="3"/>
  </svg>
);

// Syringe Icon - from devices/syringe
export const SyringeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4L44 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M38 10L14 34L10 38L6 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="18" y="18" width="16" height="8" rx="1" transform="rotate(45 18 18)" stroke="currentColor" strokeWidth="3"/>
    <path d="M36 6L42 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Brain Icon - from body/neurology
export const BrainIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 42V26" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M12 22C8 22 6 18 8 14C10 10 14 8 18 8C18 8 18 4 24 4C30 4 30 8 30 8C34 8 38 10 40 14C42 18 40 22 36 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22C12 26 16 28 20 26C22 28 26 28 28 26C32 28 36 26 36 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Defibrillator Icon - from devices/defibrillator
export const DefibrillatorIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="12" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="3"/>
    <path d="M14 26H20L22 20L26 32L28 26H34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="34" r="2" fill="currentColor"/>
    <circle cx="36" cy="34" r="2" fill="currentColor"/>
  </svg>
);

// Lungs Icon - from body/lungs
export const LungsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8V24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 16H18C14 16 8 20 8 30C8 38 12 42 18 42C24 42 24 36 24 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 16H30C34 16 40 20 40 30C40 38 36 42 30 42C24 42 24 36 24 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Baby Icon - from people/baby
export const BabyIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="14" r="8" stroke="currentColor" strokeWidth="3"/>
    <path d="M16 22C16 22 10 28 10 34C10 40 16 44 24 44C32 44 38 40 38 34C38 28 32 22 32 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="28" cy="12" r="1.5" fill="currentColor"/>
    <path d="M22 16C22 16 23 17 24 17C25 17 26 16 26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default {
  // Navigation
  HomeIcon,
  BloodGasIcon,
  ElectrolytesIcon,
  BloodProductsIcon,
  GIRIcon,
  JaundiceNavIcon,
  // Children Dashboard
  BloodPressureIcon,
  InfusionIcon,
  IntubationIcon,
  ScoringIcon,
  HeartIcon,
  ApproachesIcon,
  DrugsIcon,
  // NICU Dashboard
  FluidIcon,
  ResuscitationIcon,
  CatheterIcon,
  GrowthChartIcon,
  BloodDropIcon,
  ExchangeIcon,
  ActivityIcon,
  StethoscopeIcon,
  SyringeIcon,
  BrainIcon,
  DefibrillatorIcon,
  LungsIcon,
  BabyIcon
};
