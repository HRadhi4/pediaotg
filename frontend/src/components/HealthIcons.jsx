/**
 * Health Icons - From healthicons.org
 * Free, open source health icons for any use
 */

// ==================== UI UTILITY ICONS (healthicons.org style) ====================

// Arrow Left / Back Icon - consistent with healthicons.org stroke style
export const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 12L18 24L30 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Settings / Gear Icon - consistent with healthicons.org stroke style
export const SettingsIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="3"/>
    <path d="M24 6V10M24 38V42M42 24H38M10 24H6M37.5 10.5L34.5 13.5M13.5 34.5L10.5 37.5M37.5 37.5L34.5 34.5M13.5 13.5L10.5 10.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// Close / X Icon - consistent with healthicons.org stroke style
export const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 14L34 34M34 14L14 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Grip / Drag Handle Icon - consistent with healthicons.org stroke style
export const GripIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="14" r="3" fill="currentColor"/>
    <circle cx="30" cy="14" r="3" fill="currentColor"/>
    <circle cx="18" cy="24" r="3" fill="currentColor"/>
    <circle cx="30" cy="24" r="3" fill="currentColor"/>
    <circle cx="18" cy="34" r="3" fill="currentColor"/>
    <circle cx="30" cy="34" r="3" fill="currentColor"/>
  </svg>
);

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

// Infusion Icon - from devices/intravenous-drip (healthicons.org)
export const InfusionIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.9896 14.0764C18.239 14.0764 20.0626 12.2684 20.0626 10.0382C20.0626 7.80796 18.239 6 15.9896 6C13.7401 6 11.9165 7.80796 11.9165 10.0382C11.9165 12.2684 13.7401 14.0764 15.9896 14.0764ZM15.9896 12.0764C17.1449 12.0764 18.0587 11.1513 18.0587 10.0382C18.0587 8.92506 17.1449 8 15.9896 8C14.8342 8 13.9204 8.92506 13.9204 10.0382C13.9204 11.1513 14.8342 12.0764 15.9896 12.0764Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.27498 16.5754C10.2309 16.0019 11.2881 15.7641 12.3486 15.7641H19.6867C20.7472 15.7641 21.8044 16.0019 22.7603 16.5754C23.7143 17.1478 24.4017 17.955 24.8805 18.8376C25.6925 20.3346 25.9768 22.1796 26.0268 24.0448C28.7669 24.0758 30.9785 26.3024 30.9785 29.0444V34.0444C30.9785 35.149 31.8756 36.0444 32.9823 36.0444C34.089 36.0444 34.9862 35.149 34.9862 34.0444L34.9866 22.7944H33.4117V21.3444H31.694C30.7454 21.3444 29.9764 20.5447 29.9764 19.5582V17.4157L29.933 16.4249L29.9764 16.423V8.89173C29.9764 7.90522 30.7454 7.10549 31.694 7.10549H34.2704L34.7565 6.58553C35.431 5.86407 36.5451 5.86407 37.2195 6.58553L37.7056 7.10549H40.282C41.2306 7.10549 41.9996 7.90522 41.9996 8.89173V19.5582C41.9996 20.5447 41.2306 21.3444 40.282 21.3444H38.5646V22.7944H36.9904L36.9901 34.0444C36.9901 36.2536 35.1957 38.0444 32.9823 38.0444C30.7689 38.0444 28.9746 36.2536 28.9746 34.0444V29.0444C28.9746 27.4058 27.6582 26.0739 26.0233 26.0449C26.0236 26.0698 26.0239 26.095 26.0242 26.1206L26.0242 26.1218L26.0243 26.1257C26.0293 26.5314 26.0353 27.0148 26.0353 27.5372C26.0353 29.0833 24.7795 30.3367 23.2304 30.3367C22.9495 30.3367 22.6782 30.2954 22.4223 30.2187V33.024H22.415L22.415 39.203C22.415 40.6995 21.2358 41.9313 19.738 41.9995C18.2402 42.0677 16.9535 40.9482 16.8169 39.458L16.0629 31.2292H15.9165L15.1624 39.458C15.0259 40.9482 13.7392 42.0677 12.2414 41.9995C10.7436 41.9313 9.56439 40.6995 9.56439 39.203L9.56439 33.024H9.55701V30.2443L9.55691 30.2349C9.31764 30.3012 9.06543 30.3367 8.80485 30.3367C7.25577 30.3367 6 29.0833 6 27.5372C6 27.0145 6.00597 26.531 6.01098 26.1251L6.01101 26.1233C6.01265 25.9901 6.01419 25.8656 6.01539 25.7504C6.01806 25.4948 6.01859 25.3043 6.01728 25.1654C6.0159 25.0181 6.01253 24.9539 6.01101 24.9368L6.00393 24.8573C6.00131 24.8279 6 24.7984 6 24.7688V24.689C6.00002 22.6089 6.24934 20.5069 7.1548 18.8376C7.63361 17.955 8.32098 17.1478 9.27498 16.5754ZM22.4294 27.5372C22.4294 27.1514 22.4261 26.7944 22.4223 26.4664V24.7701C22.4238 24.7418 22.4253 24.7149 22.4271 24.6895C22.4287 24.666 22.4294 24.6424 22.4293 24.6188C22.4288 24.457 22.4264 24.2998 22.4223 24.147V21.6016H20.4184V24.1412L20.4183 24.1565V24.7483L20.4184 24.7636V26.447L20.4183 26.4623V30.1083C20.4135 30.1479 20.4111 30.1883 20.4111 30.2292L20.4111 39.203C20.4111 39.6303 20.0743 39.9821 19.6466 40.0016C19.2189 40.0211 18.8515 39.7014 18.8125 39.2758L17.9751 30.1381C17.9279 29.6232 17.4953 29.2292 16.9773 29.2292H15.002C14.484 29.2292 14.0514 29.6232 14.0042 30.1381L13.1669 39.2758C13.1279 39.7014 12.7604 40.0211 12.3327 40.0016C11.905 39.9821 11.5683 39.6303 11.5683 39.203L11.5683 30.2292C11.5683 30.1879 11.5658 30.1472 11.5609 30.1072V21.6016H9.55701V27.8135C9.44437 28.1192 9.14904 28.3367 8.80485 28.3367C8.36248 28.3367 8.00387 27.9787 8.00387 27.5372C8.00387 27.0277 8.0097 26.555 8.01473 26.1479C8.01636 26.0154 8.01793 25.8885 8.01916 25.7712C8.02435 25.2733 8.02311 24.9405 8.00702 24.7598L7.99994 24.6803C7.99996 22.7002 8.25283 21.0142 8.91699 19.7899C9.25661 19.1638 9.71259 18.6464 10.3074 18.2895C10.9028 17.9323 11.5903 17.7641 12.3486 17.7641H19.6867C20.4449 17.7641 21.1325 17.9323 21.7279 18.2895C22.3227 18.6464 22.7787 19.1638 23.1183 19.7899C23.7824 21.0142 24.0314 22.7089 24.0314 24.689V24.7245L24.0283 24.7598C24.0122 24.9405 24.0109 25.2733 24.0161 25.7712C24.0173 25.8887 24.0189 26.015 24.0205 26.1477L24.0206 26.1502C24.0256 26.5568 24.0314 27.0286 24.0314 27.5372C24.0314 27.9787 23.6728 28.3367 23.2304 28.3367C22.7881 28.3367 22.4294 27.9787 22.4294 27.5372ZM36.2405 8.46991C36.6195 8.87531 37.1501 9.10549 37.7056 9.10549H39.9958V15.2835C39.6723 15.1516 39.3035 15.0602 38.893 15.0463C38.2088 15.0231 37.4866 15.2177 36.7489 15.6738C35.7615 16.2844 34.8372 16.4542 33.7774 16.4779C33.2943 16.4886 32.8002 16.469 32.2467 16.4471L31.9803 16.4367V9.10549H34.2704C34.826 9.10549 35.3566 8.87531 35.7356 8.46991L35.988 8.19986L36.2405 8.46991ZM31.9803 18.4382L32.1651 18.4455C32.7111 18.4673 33.2722 18.4896 33.8221 18.4774C35.1106 18.4486 36.4192 18.2304 37.8042 17.374C38.2527 17.0967 38.5889 17.0371 38.8249 17.0451C39.0666 17.0533 39.2842 17.1355 39.4836 17.264C39.6877 17.3955 39.8555 17.5652 39.9756 17.7112L39.9958 17.7361V19.3444H31.9803V18.4382Z" fill="currentColor"/>
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

// Fluid Icon - from devices/intravenous-drip (healthicons.org)
export const FluidIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.9896 14.0764C18.239 14.0764 20.0626 12.2684 20.0626 10.0382C20.0626 7.80796 18.239 6 15.9896 6C13.7401 6 11.9165 7.80796 11.9165 10.0382C11.9165 12.2684 13.7401 14.0764 15.9896 14.0764ZM15.9896 12.0764C17.1449 12.0764 18.0587 11.1513 18.0587 10.0382C18.0587 8.92506 17.1449 8 15.9896 8C14.8342 8 13.9204 8.92506 13.9204 10.0382C13.9204 11.1513 14.8342 12.0764 15.9896 12.0764Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.27498 16.5754C10.2309 16.0019 11.2881 15.7641 12.3486 15.7641H19.6867C20.7472 15.7641 21.8044 16.0019 22.7603 16.5754C23.7143 17.1478 24.4017 17.955 24.8805 18.8376C25.6925 20.3346 25.9768 22.1796 26.0268 24.0448C28.7669 24.0758 30.9785 26.3024 30.9785 29.0444V34.0444C30.9785 35.149 31.8756 36.0444 32.9823 36.0444C34.089 36.0444 34.9862 35.149 34.9862 34.0444L34.9866 22.7944H33.4117V21.3444H31.694C30.7454 21.3444 29.9764 20.5447 29.9764 19.5582V17.4157L29.933 16.4249L29.9764 16.423V8.89173C29.9764 7.90522 30.7454 7.10549 31.694 7.10549H34.2704L34.7565 6.58553C35.431 5.86407 36.5451 5.86407 37.2195 6.58553L37.7056 7.10549H40.282C41.2306 7.10549 41.9996 7.90522 41.9996 8.89173V19.5582C41.9996 20.5447 41.2306 21.3444 40.282 21.3444H38.5646V22.7944H36.9904L36.9901 34.0444C36.9901 36.2536 35.1957 38.0444 32.9823 38.0444C30.7689 38.0444 28.9746 36.2536 28.9746 34.0444V29.0444C28.9746 27.4058 27.6582 26.0739 26.0233 26.0449C26.0236 26.0698 26.0239 26.095 26.0242 26.1206L26.0242 26.1218L26.0243 26.1257C26.0293 26.5314 26.0353 27.0148 26.0353 27.5372C26.0353 29.0833 24.7795 30.3367 23.2304 30.3367C22.9495 30.3367 22.6782 30.2954 22.4223 30.2187V33.024H22.415L22.415 39.203C22.415 40.6995 21.2358 41.9313 19.738 41.9995C18.2402 42.0677 16.9535 40.9482 16.8169 39.458L16.0629 31.2292H15.9165L15.1624 39.458C15.0259 40.9482 13.7392 42.0677 12.2414 41.9995C10.7436 41.9313 9.56439 40.6995 9.56439 39.203L9.56439 33.024H9.55701V30.2443L9.55691 30.2349C9.31764 30.3012 9.06543 30.3367 8.80485 30.3367C7.25577 30.3367 6 29.0833 6 27.5372C6 27.0145 6.00597 26.531 6.01098 26.1251L6.01101 26.1233C6.01265 25.9901 6.01419 25.8656 6.01539 25.7504C6.01806 25.4948 6.01859 25.3043 6.01728 25.1654C6.0159 25.0181 6.01253 24.9539 6.01101 24.9368L6.00393 24.8573C6.00131 24.8279 6 24.7984 6 24.7688V24.689C6.00002 22.6089 6.24934 20.5069 7.1548 18.8376C7.63361 17.955 8.32098 17.1478 9.27498 16.5754ZM22.4294 27.5372C22.4294 27.1514 22.4261 26.7944 22.4223 26.4664V24.7701C22.4238 24.7418 22.4253 24.7149 22.4271 24.6895C22.4287 24.666 22.4294 24.6424 22.4293 24.6188C22.4288 24.457 22.4264 24.2998 22.4223 24.147V21.6016H20.4184V24.1412L20.4183 24.1565V24.7483L20.4184 24.7636V26.447L20.4183 26.4623V30.1083C20.4135 30.1479 20.4111 30.1883 20.4111 30.2292L20.4111 39.203C20.4111 39.6303 20.0743 39.9821 19.6466 40.0016C19.2189 40.0211 18.8515 39.7014 18.8125 39.2758L17.9751 30.1381C17.9279 29.6232 17.4953 29.2292 16.9773 29.2292H15.002C14.484 29.2292 14.0514 29.6232 14.0042 30.1381L13.1669 39.2758C13.1279 39.7014 12.7604 40.0211 12.3327 40.0016C11.905 39.9821 11.5683 39.6303 11.5683 39.203L11.5683 30.2292C11.5683 30.1879 11.5658 30.1472 11.5609 30.1072V21.6016H9.55701V27.8135C9.44437 28.1192 9.14904 28.3367 8.80485 28.3367C8.36248 28.3367 8.00387 27.9787 8.00387 27.5372C8.00387 27.0277 8.0097 26.555 8.01473 26.1479C8.01636 26.0154 8.01793 25.8885 8.01916 25.7712C8.02435 25.2733 8.02311 24.9405 8.00702 24.7598L7.99994 24.6803C7.99996 22.7002 8.25283 21.0142 8.91699 19.7899C9.25661 19.1638 9.71259 18.6464 10.3074 18.2895C10.9028 17.9323 11.5903 17.7641 12.3486 17.7641H19.6867C20.4449 17.7641 21.1325 17.9323 21.7279 18.2895C22.3227 18.6464 22.7787 19.1638 23.1183 19.7899C23.7824 21.0142 24.0314 22.7089 24.0314 24.689V24.7245L24.0283 24.7598C24.0122 24.9405 24.0109 25.2733 24.0161 25.7712C24.0173 25.8887 24.0189 26.015 24.0205 26.1477L24.0206 26.1502C24.0256 26.5568 24.0314 27.0286 24.0314 27.5372C24.0314 27.9787 23.6728 28.3367 23.2304 28.3367C22.7881 28.3367 22.4294 27.9787 22.4294 27.5372ZM36.2405 8.46991C36.6195 8.87531 37.1501 9.10549 37.7056 9.10549H39.9958V15.2835C39.6723 15.1516 39.3035 15.0602 38.893 15.0463C38.2088 15.0231 37.4866 15.2177 36.7489 15.6738C35.7615 16.2844 34.8372 16.4542 33.7774 16.4779C33.2943 16.4886 32.8002 16.469 32.2467 16.4471L31.9803 16.4367V9.10549H34.2704C34.826 9.10549 35.3566 8.87531 35.7356 8.46991L35.988 8.19986L36.2405 8.46991ZM31.9803 18.4382L32.1651 18.4455C32.7111 18.4673 33.2722 18.4896 33.8221 18.4774C35.1106 18.4486 36.4192 18.2304 37.8042 17.374C38.2527 17.0967 38.5889 17.0371 38.8249 17.0451C39.0666 17.0533 39.2842 17.1355 39.4836 17.264C39.6877 17.3955 39.8555 17.5652 39.9756 17.7112L39.9958 17.7361V19.3444H31.9803V18.4382Z" fill="currentColor"/>
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
