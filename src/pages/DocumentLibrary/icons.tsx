/** Page-specific SVGs copied from prototype/03-document-library.html. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const SEAL = 'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z';

/** Scalloped seal used in the checklist: tick (complete) or exclamation (outstanding). */
export function SealIcon({ done, size = 20, ...rest }: P & { done: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...rest}>
      <path d={SEAL} fill="currentColor" />
      <path d={SEAL} fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="1" transform="translate(12 12) scale(.8) translate(-12 -12)" />
      {done ? (
        <path d="m8.6 12.2 2.3 2.3 4.6-4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d="M12 7.6v5" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="12" cy="16.1" r="1.25" fill="#fff" />
        </>
      )}
    </svg>
  );
}

/** Small arrow used inside table / header action buttons. */
export function ArrowIcon({ size = 12, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...rest}>
      <path d="M3 8h9.5M9 4.5 12.5 8 9 11.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CaretIcon({ size = 12, dir = 'down', ...rest }: P & { dir?: 'down' | 'right' | 'left' }) {
  const d = dir === 'down' ? 'M2 3.5 5 6.5l3-3' : 'M3.5 2 6.5 5l-3 3';
  if (dir === 'left')
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...rest}>
        <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" focusable="false" {...rest}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NextIcon({ size = 12, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...rest}>
      <path d="m6 3.5 4.5 4.5L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Cloud with up-arrow (Upload Documents / Upload to this Folder). */
export function UploadCloud({ size = 16, ...rest }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      <path d="M7 18.5a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.7 8.4a4.6 4.6 0 0 1-.2 10.1z" fill="currentColor" fillOpacity=".22" stroke="none" />
      <path d="M8 18.5H7a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.7 8.4 4.6 4.6 0 0 1 17.5 18.5H16" />
      <path d="M12 21v-8.5m-3 3 3-3 3 3" />
    </svg>
  );
}

/** Document with upload badge (drop zones, empty folder). `search` swaps the arrow for a magnifier (no results). */
export function DocUpload({ size = 34, search, badgeFill = 'var(--og-badge, #FFFFFF)', ...rest }: P & { search?: boolean; badgeFill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...rest}>
      <path d="M26.5 6H12a3 3 0 0 0-3 3v28a3 3 0 0 0 3 3h11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26.5 6 35 14.5V23" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 16h8M15 21.5h11M15 27h6" stroke="currentColor" strokeOpacity=".32" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="35" cy="35" r="9.5" fill={badgeFill} stroke="currentColor" strokeOpacity=".32" strokeWidth="2.4" />
      {search ? (
        <>
          <circle cx="34" cy="34" r="3.6" stroke="currentColor" strokeWidth="2.2" />
          <path d="m36.7 36.7 2.6 2.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <path d="M35 40v-10m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function FileGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function SparkleIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z" />
      <path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z" opacity=".6" />
    </svg>
  );
}

export function LockSmall({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

const s = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false };

/** Batch-action menu icons (review queue, signature, move, export, delete). */
export const BatchIcons = {
  review: () => (
    <svg {...s}>
      <path d="M7 3.5h6.5l4 4V11" strokeOpacity=".45" />
      <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h6.2l3.8 3.8v1.7" />
      <path d="M4.5 6.5v12A1.5 1.5 0 0 0 6 20h5" />
      <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h6.2l3.8 3.8V12a5 5 0 0 0-5 8H6a1.5 1.5 0 0 1-1.5-1.5Z" fill="currentColor" fillOpacity=".14" stroke="none" />
      <path d="M8 10h4M8 13.5h2.5" strokeOpacity=".5" />
      <circle cx="16" cy="16" r="3.6" fill="var(--og-menu-bg, #fff)" />
      <path d="m18.7 18.7 2.3 2.3" />
    </svg>
  ),
  signature: () => (
    <svg {...s}>
      <path d="M14.6 4.4a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L11 18l-4.6 1 1-4.6Z" fill="currentColor" fillOpacity=".14" />
      <path d="m13.4 5.6 5 5" />
      <path d="M3 21h4.5" strokeOpacity=".5" />
      <path d="M11.5 21c1.4 0 2-1.6 3.3-1.6S16.6 21 18 21h3" strokeOpacity=".5" />
    </svg>
  ),
  move: () => (
    <svg {...s}>
      <path d="M3 7.2A1.7 1.7 0 0 1 4.7 5.5h4.2l2.1 2.2h8.3A1.7 1.7 0 0 1 21 9.4v8.9a1.7 1.7 0 0 1-1.7 1.7H4.7A1.7 1.7 0 0 1 3 18.3Z" fill="currentColor" fillOpacity=".14" />
      <path d="M3 10.5h18" strokeOpacity=".35" />
      <path d="M8.5 15h7m-2.4-2.4 2.4 2.4-2.4 2.4" />
    </svg>
  ),
  export: () => (
    <svg {...s}>
      <rect x="3.5" y="3.5" width="13" height="17" rx="1.5" fill="currentColor" fillOpacity=".14" />
      <path d="M3.5 9h13M3.5 14h13M9 9v11.5" strokeOpacity=".45" />
      <path d="M16.5 12.5H21m0 0-2.2-2.2M21 12.5l-2.2 2.2" />
    </svg>
  ),
  delete: () => (
    <svg {...s}>
      <path d="M5.5 7.5h13l-1 11.6a1.6 1.6 0 0 1-1.6 1.4H8.1a1.6 1.6 0 0 1-1.6-1.4Z" fill="currentColor" fillOpacity=".14" />
      <path d="M3.5 7.5h17" />
      <path d="M9 7.5V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2.5" />
      <path d="M10.2 11.2v5.6M13.8 11.2v5.6" strokeOpacity=".6" />
    </svg>
  ),
};

/* ---------- Filing cabinet ---------- */
export function FolderClosed() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 7.4A2.4 2.4 0 0 1 5.4 5h3.3c.64 0 1.25.26 1.7.72L11.7 7h6.9A2.4 2.4 0 0 1 21 9.4v8.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 17.6Z" fill="currentColor" fillOpacity=".16" />
      <path d="M3 10.2h18v7.4a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 17.6Z" fill="currentColor" fillOpacity=".22" />
      <path d="M3 7.4A2.4 2.4 0 0 1 5.4 5h3.3c.64 0 1.25.26 1.7.72L11.7 7h6.9A2.4 2.4 0 0 1 21 9.4v8.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 17.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 10.2h18" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.5" />
    </svg>
  );
}

export function FolderOpened() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M3 17.6V7.4A2.4 2.4 0 0 1 5.4 5h3.3c.64 0 1.25.26 1.7.72L11.7 7h5.7A2.4 2.4 0 0 1 19.8 9.4v1.4" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3.3 18.6 5.6 12.4A2 2 0 0 1 7.5 11.1h13a1.3 1.3 0 0 1 1.24 1.7l-1.9 5.6A2.4 2.4 0 0 1 17.6 20H4.5a1.3 1.3 0 0 1-1.2-1.4Z" fill="currentColor" fillOpacity=".3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function ReviewQueueGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity=".2" stroke="none" />
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
      <path d="M12 3v1.2M21 12h-1.2M12 21v-1.2M3 12h1.2" strokeOpacity=".55" />
    </svg>
  );
}

export function InboxGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3.5 13.5h4.3l1.6 2.6h5.2l1.6-2.6h4.3V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" fill="currentColor" fillOpacity=".2" stroke="none" />
      <path d="M8.5 6H7a1.6 1.6 0 0 0-1.5 1.1L3.5 13.5V18a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-4.5l-2-6.4A1.6 1.6 0 0 0 17 6h-1.5" />
      <path d="M3.5 13.5h4.3l1.6 2.6h5.2l1.6-2.6h4.3" />
      <path d="M12 3.5v7.5m-3-3 3 3 3-3" />
    </svg>
  );
}
