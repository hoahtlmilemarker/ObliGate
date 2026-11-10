import { Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T, index: number) => ReactNode;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  /**
   * Placement in the stacked card layout used below 820px:
   * `title` – full-width first line, `left` / `right` – paired line, `full` – own full-width line, `hidden` – omitted.
   */
  mobile?: 'title' | 'left' | 'right' | 'full' | 'hidden';
  /** Hide this column on desktop widths below 1320px (e.g. secondary date columns). */
  hideBelowXl?: boolean;
}

export interface ResponsiveTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  /** Show a leading selection checkbox. */
  selectable?: boolean;
  selected?: Set<string>;
  onToggleRow?: (key: string) => void;
  onToggleAll?: () => void;
  /** Highlight a row (brass inset rule + warm tint), e.g. the next document to review. */
  isHighlighted?: (row: T) => boolean;
  minWidth?: number;
  sx?: SxProps<Theme>;
  'aria-label'?: string;
}

/**
 * Data table that becomes stacked cards below 820px (tablet portrait / mobile),
 * matching the prototype's responsive behaviour.
 */
export function ResponsiveTable<T>({ columns, rows, rowKey, selectable, selected, onToggleRow, onToggleAll, isHighlighted, minWidth, sx, ...rest }: ResponsiveTableProps<T>) {
  const stacked = useMediaQuery((t: Theme) => t.breakpoints.down('md'));
  const hideXl = useMediaQuery((t: Theme) => t.breakpoints.down('xl'));
  const allSelected = !!selected && rows.length > 0 && rows.every((r, i) => selected.has(rowKey(r, i)));

  const highlight = (theme: Theme) => ({
    backgroundImage: `linear-gradient(90deg, ${theme.palette.og.brassTint}, transparent 55%)`,
    boxShadow: `inset 3px 0 0 ${theme.palette.og.brass}`,
  });

  if (stacked) {
    const order = { title: 0, left: 1, right: 1, full: 2, hidden: 9 } as const;
    return (
      <Box role="list" aria-label={rest['aria-label']} sx={sx}>
        {rows.map((row, i) => {
          const k = rowKey(row, i);
          const cols = columns.filter((c) => (c.mobile ?? 'full') !== 'hidden').sort((a, b) => order[a.mobile ?? 'full'] - order[b.mobile ?? 'full']);
          return (
            <Box
              role="listitem"
              key={k}
              sx={(theme) => ({
                display: 'grid',
                gridTemplateColumns: selectable ? '20px minmax(0,1fr) auto' : 'minmax(0,1fr) auto',
                columnGap: 3,
                rowGap: 2.5,
                alignItems: 'center',
                p: 4,
                borderBottom: `1px solid ${theme.palette.og.lineSoft}`,
                ...(isHighlighted?.(row) && highlight(theme)),
              })}
            >
              {selectable && (
                <Box sx={{ gridRow: 1, gridColumn: 1, alignSelf: 'start', pt: '11px' }}>
                  <Checkbox size="small" checked={!!selected?.has(k)} onChange={() => onToggleRow?.(k)} inputProps={{ 'aria-label': 'Select row' }} />
                </Box>
              )}
              {cols.map((c) => {
                const m = c.mobile ?? 'full';
                const first = selectable ? 2 : 1;
                const gridColumn = m === 'right' ? `${first + 1}` : m === 'left' ? `${first}` : `${first} / -1`;
                return (
                  <Box key={c.key} sx={{ gridColumn, minWidth: 0, justifySelf: m === 'right' ? 'end' : 'stretch', textAlign: m === 'right' ? 'right' : 'left', '@media (max-width:520px)': m === 'right' && c.key === 'action' ? { gridColumn: `${first} / -1`, justifySelf: 'stretch', '& > *': { width: '100%' } } : {} }}>
                    {c.render(row, i)}
                  </Box>
                );
              })}
            </Box>
          );
        })}
      </Box>
    );
  }

  const visible = columns.filter((c) => !(hideXl && c.hideBelowXl));
  return (
    <Box sx={[{ overflowX: 'auto' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Table aria-label={rest['aria-label']} sx={{ minWidth, tableLayout: 'fixed' }}>
        <colgroup>
          {selectable && <col style={{ width: 40 }} />}
          {visible.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <TableHead>
          <TableRow>
            {selectable && (
              <TableCell sx={{ pr: 0 }}>
                <Checkbox size="small" checked={allSelected} indeterminate={!allSelected && !!selected?.size} onChange={() => onToggleAll?.()} inputProps={{ 'aria-label': 'Select all' }} />
              </TableCell>
            )}
            {visible.map((c) => (
              <TableCell key={c.key} align={c.align}>
                {c.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            const k = rowKey(row, i);
            return (
              <TableRow key={k} hover sx={(theme) => ({ '&:hover': { backgroundColor: theme.palette.og.pale }, ...(isHighlighted?.(row) && highlight(theme)) })}>
                {selectable && (
                  <TableCell sx={{ pr: 0 }}>
                    <Checkbox size="small" checked={!!selected?.has(k)} onChange={() => onToggleRow?.(k)} inputProps={{ 'aria-label': 'Select row' }} />
                  </TableCell>
                )}
                {visible.map((c) => (
                  <TableCell key={c.key} align={c.align}>
                    {c.render(row, i)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
