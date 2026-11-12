/**
 * ObliGate icon set — stroke icons drawn on a 24px grid (1.7px stroke, round caps),
 * matching the prototype and the Figma "Icons" page. Tinted shapes use currentColor at low opacity.
 *
 * Usage: <SearchIcon size={16} />. Icons inherit `color` from their parent.
 * Page-specific illustrations stay inside their page folders.
 */
import type { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  size?: number;
  strokeWidth?: number;
}

function make(paths: React.ReactNode, displayName: string, viewBox = '0 0 24 24') {
  const Icon = ({ size = 16, strokeWidth = 1.7, ...rest }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths}
    </svg>
  );
  Icon.displayName = displayName;
  return Icon;
}

export const SearchIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>, 'SearchIcon');
export const ThemeIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" /></>, 'ThemeIcon');
export const MenuIcon = make(<path d="M4 7h16M4 12h16M4 17h10" />, 'MenuIcon');
export const ChevronDownIcon = make(<path d="m6 9 6 6 6-6" />, 'ChevronDownIcon');
export const ChevronRightIcon = make(<path d="m9 6 6 6-6 6" />, 'ChevronRightIcon');
export const ChevronLeftIcon = make(<path d="m15 6-6 6 6 6" />, 'ChevronLeftIcon');
export const ArrowRightIcon = make(<path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />, 'ArrowRightIcon');
export const ArrowLeftIcon = make(<path d="M20 12H5m5.5-5.5L5 12l5.5 5.5" />, 'ArrowLeftIcon');
export const ArrowUpIcon = make(<path d="M12 20V5m-5.5 5.5L12 5l5.5 5.5" />, 'ArrowUpIcon');
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />, 'PlusIcon');
export const CloseIcon = make(<path d="M6 6l12 12M18 6 6 18" />, 'CloseIcon');
export const CheckIcon = make(<path d="m5 12.5 4.5 4.5L19 7.5" />, 'CheckIcon');
export const MoreIcon = make(<><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>, 'MoreIcon');

export const UploadCloudIcon = make(
  <>
    <path d="M7 18.5a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.7 8.4a4.6 4.6 0 0 1-.2 10.1z" fill="currentColor" fillOpacity=".22" stroke="none" />
    <path d="M8 18.5H7a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.7 8.4 4.6 4.6 0 0 1 17.5 18.5H16" />
    <path d="M12 21v-8.5m-3 3 3-3 3 3" />
  </>,
  'UploadCloudIcon',
);
export const DownloadIcon = make(<><path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5" /><path d="M5 19h14" /></>, 'DownloadIcon');
export const FileIcon = make(<><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></>, 'FileIcon');
export const FolderIcon = make(
  <>
    <path d="M3 7.4A2.4 2.4 0 0 1 5.4 5h3.3c.64 0 1.25.26 1.7.72L11.7 7h6.9A2.4 2.4 0 0 1 21 9.4v8.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 17.6Z" fill="currentColor" fillOpacity=".16" />
    <path d="M3 10.2h18" strokeOpacity=".5" />
  </>,
  'FolderIcon',
);
export const FolderOpenIcon = make(
  <>
    <path d="M3 17.6V7.4A2.4 2.4 0 0 1 5.4 5h3.3c.64 0 1.25.26 1.7.72L11.7 7h5.7A2.4 2.4 0 0 1 19.8 9.4v1.4" fill="currentColor" fillOpacity=".12" />
    <path d="M3.3 18.6 5.6 12.4A2 2 0 0 1 7.5 11.1h13a1.3 1.3 0 0 1 1.24 1.7l-1.9 5.6A2.4 2.4 0 0 1 17.6 20H4.5a1.3 1.3 0 0 1-1.2-1.4Z" fill="currentColor" fillOpacity=".3" />
  </>,
  'FolderOpenIcon',
);
export const ClockIcon = make(<><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".2" stroke="none" /><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>, 'ClockIcon');
export const InboxIcon = make(
  <>
    <path d="M3.5 13.5h4.3l1.6 2.6h5.2l1.6-2.6h4.3V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity=".2" stroke="none" />
    <path d="M8.5 6H7a1.6 1.6 0 0 0-1.5 1.1L3.5 13.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4.5l-2-6.4A1.6 1.6 0 0 0 17 6h-1.5" />
    <path d="M3.5 13.5h4.3l1.6 2.6h5.2l1.6-2.6h4.3" />
    <path d="M12 3.5v7.5m-3-3 3 3 3-3" />
  </>,
  'InboxIcon',
);
export const ShieldIcon = make(<><path d="M12 3 5 6v5.5c0 4.3 3 7.9 7 9.5 4-1.6 7-5.2 7-9.5V6z" fill="currentColor" fillOpacity=".14" /><path d="m9 12 2.2 2.2L15.5 10" /></>, 'ShieldIcon');
export const LockIcon = make(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>, 'LockIcon');
export const UserIcon = make(<><circle cx="12" cy="8.5" r="3.5" fill="currentColor" fillOpacity=".18" /><path d="M5 19.5c1.2-3.2 3.8-5 7-5s5.8 1.8 7 5" /></>, 'UserIcon');
export const UsersIcon = make(<><circle cx="9" cy="8.5" r="3.2" fill="currentColor" fillOpacity=".18" /><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19c.9-2.9 3.2-4.6 6-4.6s5.1 1.7 6 4.6" /><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.6c1.6.6 2.8 2 3.4 4" /></>, 'UsersIcon');
export const SettingsIcon = make(<><circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity=".18" /><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" /></>, 'SettingsIcon');
export const BellIcon = make(<><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15z" fill="currentColor" fillOpacity=".18" /><path d="M10 21h4" /></>, 'BellIcon');
export const KeyboardIcon = make(<><rect x="3" y="6" width="18" height="12" rx="2" fill="currentColor" fillOpacity=".18" /><path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" /></>, 'KeyboardIcon');
export const HelpIcon = make(<><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".18" /><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8h.01" /></>, 'HelpIcon');
export const SignOutIcon = make(
  <>
    <path d="M8.5 8V5.5A1.5 1.5 0 0 1 10 4h7.5A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H10a1.5 1.5 0 0 1-1.5-1.5V16" />
    <path d="M14 12H3.5M6.5 9 3.5 12l3 3" />
  </>,
  'SignOutIcon',
);
export const ColumnsIcon = make(<><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><path d="M9.5 4.5v15M14.5 4.5v15" /></>, 'ColumnsIcon');
export const SortIcon = make(<><path d="M7 4v16m-3-3 3 3 3-3" /><path d="M13 6h7M13 11h5M13 16h3" /></>, 'SortIcon');
export const FilterIcon = make(<path d="M4 5h16l-6 7.5V19l-4-2v-4.5z" />, 'FilterIcon');
export const CalendarIcon = make(<><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M8 3.5v4M16 3.5v4M4 10h16" /></>, 'CalendarIcon');
export const WarningIcon = make(<><path d="M12 3.5 2.8 19.5h18.4z" fill="currentColor" fillOpacity=".14" /><path d="M12 10v4.5M12 17.2h.01" /></>, 'WarningIcon');
export const InfoIcon = make(<><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".14" /><path d="M12 11v5.5M12 7.8h.01" /></>, 'InfoIcon');
export const ExternalIcon = make(<><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>, 'ExternalIcon');
export const EyeIcon = make(<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>, 'EyeIcon');
export const ZoomIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6M11 8v6" /></>, 'ZoomIcon');
export const RotateIcon = make(<><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v4.5h-4.5" /></>, 'RotateIcon');
export const SignatureIcon = make(
  <>
    <path d="M14.6 4.4a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L11 18l-4.6 1 1-4.6Z" fill="currentColor" fillOpacity=".14" />
    <path d="m13.4 5.6 5 5" />
    <path d="M3 21h4.5M11.5 21c1.4 0 2-1.6 3.3-1.6S16.6 21 18 21h3" strokeOpacity=".5" />
  </>,
  'SignatureIcon',
);
export const TrashIcon = make(
  <>
    <path d="M5.5 7.5h13l-1 11.6a1.6 1.6 0 0 1-1.6 1.4H8.1a1.6 1.6 0 0 1-1.6-1.4Z" fill="currentColor" fillOpacity=".14" />
    <path d="M3.5 7.5h17M9 7.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2.5M10.2 11.2v5.6M13.8 11.2v5.6" />
  </>,
  'TrashIcon',
);
export const MoveIcon = make(
  <>
    <path d="M3 7.2A1.7 1.7 0 0 1 4.7 5.5h4.2l2.1 2.2h8.3A1.7 1.7 0 0 1 21 9.4v8.9a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 18.3Z" fill="currentColor" fillOpacity=".14" />
    <path d="M8.5 15h7m-2.4-2.4 2.4 2.4-2.4 2.4" />
  </>,
  'MoveIcon',
);
export const ExportIcon = make(
  <>
    <rect x="3.5" y="3.5" width="13" height="17" rx="1.5" fill="currentColor" fillOpacity=".14" />
    <path d="M3.5 9h13M3.5 14h13M9 9v11.5" strokeOpacity=".45" />
    <path d="M16.5 12.5H21m0 0-2.2-2.2M21 12.5l-2.2 2.2" />
  </>,
  'ExportIcon',
);
export const ReviewQueueIcon = make(
  <>
    <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h6.2l3.8 3.8V12a5 5 0 0 0-5 8H6a1.5 1.5 0 0 1-1.5-1.5Z" fill="currentColor" fillOpacity=".14" stroke="none" />
    <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h6.2l3.8 3.8v1.7M4.5 6.5v12A1.5 1.5 0 0 0 6 20h5" />
    <circle cx="16" cy="16" r="3.6" />
    <path d="m18.7 18.7 2.3 2.3" />
  </>,
  'ReviewQueueIcon',
);
export const CheckCircleIcon = make(<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="m8 12.3 2.8 2.7L16 9.6" stroke="#fff" strokeWidth={2} /></>, 'CheckCircleIcon');
export const AlertCircleIcon = make(<><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" /><path d="M12 7.5v5.5M12 16.4h.01" stroke="#fff" strokeWidth={2.2} /></>, 'AlertCircleIcon');

/** Brand mark (three-part seal) used in the header and loader. */
export function LogoMark({ size = 30, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" {...rest}>
      <path d="M 24 6 A 18 18 0 1 1 6 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      <path d="M 36 24 A 12 12 0 1 1 24 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
      <rect x="19" y="19" width="10" height="10" rx="1.5" fill="currentColor" />
    </svg>
  );
}
