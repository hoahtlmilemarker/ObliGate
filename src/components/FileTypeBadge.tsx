import { Box } from '@mui/material';
import { FileIcon } from '@/icons';

export type FileKind = 'PDF' | 'LOG' | 'XLSX' | 'XLS' | 'CSV' | 'IMG' | 'JPG' | 'PNG' | 'DOCX' | 'TIF';

const COLORS: Record<string, string> = {
  PDF: '#B4473A',
  LOG: '#2F7D5B',
  XLSX: '#2F6FB0',
  XLS: '#2F6FB0',
  CSV: '#2F6FB0',
  IMG: '#6B5B95',
  JPG: '#6B5B95',
  PNG: '#6B5B95',
  TIF: '#6B5B95',
  DOCX: '#2F5FA8',
};

/** 40×52 document tile with a coloured file-type label (Document Library rows). */
export function FileTypeBadge({ kind, size = 'md' }: { kind: FileKind | string; size?: 'sm' | 'md' }) {
  const c = COLORS[kind] ?? '#60666C';
  const w = size === 'sm' ? 36 : 40;
  const h = size === 'sm' ? 44 : 52;
  return (
    <Box
      aria-hidden
      sx={(theme) => ({
        width: w,
        height: h,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        borderRadius: '4px',
        color: theme.palette.mode === 'dark' ? `color-mix(in srgb, ${c} 55%, white)` : c,
        backgroundColor: `color-mix(in srgb, ${c} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} 20%, transparent)`,
      })}
    >
      <FileIcon size={16} />
      <Box component="b" sx={{ fontSize: 8.5, fontWeight: 800, letterSpacing: '0.06em' }}>
        {kind}
      </Box>
    </Box>
  );
}
