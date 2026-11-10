import { Box, Dialog, InputBase, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, FileIcon, FolderIcon, SearchIcon } from '@/icons';
import { routes } from './nav';
import { searchIndex } from '@/data/search';

/** ⌘K command palette: jump to screens, projects and documents (sample index in data/search.ts). */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
    }
  }, [open]);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s ? searchIndex.filter((r) => (r.title + ' ' + r.sub).toLowerCase().includes(s)) : searchIndex.slice(0, 8);
    return list.slice(0, 10);
  }, [q]);
  const pick = (i: number) => {
    const r = results[i];
    if (!r) return;
    onClose();
    navigate(r.to);
  };

  return (
    <Dialog open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 'min(640px, calc(100vw - 32px))', alignSelf: 'flex-start', mt: '12vh' } } }} aria-label="Search">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 5, height: 56, borderBottom: 1, borderColor: 'og.line' }}>
        <Box sx={{ color: 'og.gray', display: 'flex' }}>
          <SearchIcon size={18} />
        </Box>
        <InputBase
          autoFocus
          fullWidth
          placeholder="Search documents, projects, disasters…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter') pick(active);
          }}
          inputProps={{ 'aria-label': 'Search' }}
          sx={{ fontSize: 15, fontWeight: 500 }}
        />
        <Box component="kbd" sx={{ px: 1.5, border: 1, borderColor: 'og.line', borderRadius: '4px', fontSize: 11, color: 'og.gray', fontFamily: 'inherit' }}>
          Esc
        </Box>
      </Box>
      <Box role="listbox" sx={{ maxHeight: 420, overflowY: 'auto', p: 1.5 }}>
        {results.length === 0 && <Typography sx={{ p: 6, textAlign: 'center', color: 'og.gray', fontSize: 13.5 }}>No results for “{q}”.</Typography>}
        {results.map((r, i) => (
          <Box
            key={r.title + r.to}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => pick(i)}
            sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 3, py: 2.5, borderRadius: '4px', cursor: 'pointer', bgcolor: i === active ? 'og.blueTint' : 'transparent' }}
          >
            <Box sx={{ color: 'og.blue', display: 'flex' }}>{r.kind === 'doc' ? <FileIcon /> : <FolderIcon />}</Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: 'og.head' }} noWrap>
                {r.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'og.gray' }} noWrap>
                {r.sub}
              </Typography>
            </Box>
            {i === active && (
              <Box sx={{ color: 'og.gray', display: 'flex' }}>
                <ArrowRightIcon size={14} />
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ px: 5, py: 2.5, borderTop: 1, borderColor: 'og.lineSoft', fontSize: 11.5, color: 'og.gray' }}>
        ↑ ↓ to navigate · Enter to open · <Box component="span" sx={{ color: 'og.blue', cursor: 'pointer' }} onClick={() => { onClose(); navigate(routes.library); }}>Open Document Library</Box>
      </Box>
    </Dialog>
  );
}
