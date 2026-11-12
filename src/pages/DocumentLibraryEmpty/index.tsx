import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useToast } from '@/components';
import { AppShell, routes } from '@/layout';
import { FORCE_ACCOUNT, folderFromSlug, folderSamples, forceAccountBanner, LEAF_FOLDERS } from '@/data/documentLibrary';
import { FolderBanner } from '../DocumentLibrary/FolderBanner';
import { LibrarySidebar } from '../DocumentLibrary/LibrarySidebar';
import { UploadModal, type CommittedFile, type UploadFileLike } from '@/components/UploadModal';
import { DocUpload, SparkleIcon, UploadCloud } from '../DocumentLibrary/icons';

const dashed = (stroke: string, opacity: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect x='.5' y='.5' width='calc(100%25 - 1px)' height='calc(100%25 - 1px)' rx='4' fill='none' stroke='%23${stroke}' stroke-opacity='${opacity}' stroke-width='1' stroke-dasharray='6 5'/%3E%3C/svg%3E")`;

/** 03b · Document Library — empty folder (e.g. PW-00429 › Force-Account Labor). */
export default function DocumentLibraryEmpty() {
  const toast = useToast();
  const { projectId = 'PW-00429', folder: slug } = useParams();
  const folder = folderFromSlug(slug) ?? FORCE_ACCOUNT;
  const isLabor = folder === FORCE_ACCOUNT;
  const destination = `${projectId} › ${LEAF_FOLDERS.indexOf(folder as (typeof LEAF_FOLDERS)[number]) + 1}. ${folder}`;
  const [upload, setUpload] = useState<{ open: boolean; files: UploadFileLike[] | null }>({ open: false, files: null });
  const openUpload = (files?: File[]) => setUpload({ open: true, files: files?.map((f) => ({ name: f.name, size: f.size })) ?? null });

  useEffect(() => {
    document.title = 'ObliGate · Document Library (Empty)';
  }, []);

  // dropping files anywhere on the page opens the upload dialog
  useEffect(() => {
    const has = (e: DragEvent) => !!e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files');
    const over = (e: DragEvent) => has(e) && e.preventDefault();
    const drop = (e: DragEvent) => {
      if (!has(e) || !e.dataTransfer?.files.length) return;
      if ((e.target as Element | null)?.closest?.('[role="dialog"]')) return;
      e.preventDefault();
      setUpload({ open: true, files: Array.from(e.dataTransfer.files).map((f) => ({ name: f.name, size: f.size })) });
    };
    document.addEventListener('dragover', over);
    document.addEventListener('drop', drop);
    return () => {
      document.removeEventListener('dragover', over);
      document.removeEventListener('drop', drop);
    };
  }, []);

  const commit = (files: CommittedFile[]) => {
    if (!files.length) return;
    toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: `to ${destination} · auto-classifying`, inline: true, duration: 6000 });
  };

  const importBtn = (variant: 'onDark' | 'outlined') => (
    <Tooltip describeChild title="Creates labor records from a payroll export. The spreadsheet is not stored as a document.">
      <Button variant={variant} component={RouterLink} to={routes.importWizard}>
        Import Payroll Records (Excel)
      </Button>
    </Tooltip>
  );

  return (
    <AppShell active="library" sidebarLabel="Queues & filing cabinet" sidebar={<LibrarySidebar key={`${projectId}/${folder}`} activeFolder={{ project: projectId, folder }} />}>
      <FolderBanner
        prefix="Folder View:"
        crumbs={[
          { label: 'DR-4683-CA', to: routes.disasters },
          { label: 'Public Works', to: routes.disasters },
          { label: projectId, to: `/projects/${projectId}` },
          { label: folder },
        ]}
        title={`${isLabor ? forceAccountBanner.title : folder} (0 Documents)`}
        subtitle={isLabor ? forceAccountBanner.description : folderSamples[folder]?.description}
        overlap={false}
        actions={isLabor ? importBtn('onDark') : undefined}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: { xs: 4, md: 7 }, pt: 6, pb: 14 }}>
        <Box
          component="section"
          aria-label="No documents"
          sx={(t) => {
            const dark = t.palette.mode === 'dark';
            return {
              position: 'relative',
              overflow: 'hidden',
              flex: '1 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: { xs: 420, sm: 564 },
              p: { xs: '36px 16px', sm: '40px 24px' },
              borderRadius: '4px',
              background: `${dashed(dark ? '5A7896' : '8FA9C6', dark ? 0.8 : 0.55)}, linear-gradient(180deg, ${dark ? '#13202C 0%, #101B26 100%' : '#FFFFFF 0%, #F6F9FD 100%'})`,
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${dark ? 'rgba(140,180,230,.16)' : 'rgba(0,90,156,.16)'} 1px, transparent 1.2px)`,
                backgroundSize: '18px 18px',
                maskImage: 'radial-gradient(ellipse 46% 52% at 50% 46%, #000 0%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(ellipse 46% 52% at 50% 46%, #000 0%, transparent 75%)',
              },
              '& > *': { position: 'relative' },
            };
          }}
        >
          <Box
            aria-hidden
            sx={(t) => {
              const dark = t.palette.mode === 'dark';
              return {
                width: 112,
                height: 112,
                mb: '22px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                border: `1px solid ${dark ? 'rgba(140,180,230,.18)' : 'rgba(0,90,156,.12)'}`,
                background: dark ? 'radial-gradient(circle at 50% 35%, rgba(120,170,230,.16), rgba(120,170,230,.04) 70%)' : 'radial-gradient(circle at 50% 35%, rgba(0,90,156,.10), rgba(0,90,156,.03) 70%)',
                boxShadow: `0 0 0 10px ${dark ? 'rgba(140,180,230,.04)' : 'rgba(0,90,156,.035)'}`,
                color: t.palette.og.blue,
                '--og-badge': dark ? '#162536' : '#EEF3F9',
                '& svg': { ml: '4px', mt: '4px' },
              };
            }}
          >
            <DocUpload size={54} />
          </Box>
          <Typography component="h2" sx={{ m: 0, font: '700 24px/1.3 Manrope, Arial, sans-serif', letterSpacing: '-.01em', color: 'og.ink' }}>
            No documents in this folder yet
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', mt: 6 }}>
            <Button variant="contained" startIcon={<UploadCloud />} onClick={() => openUpload()}>
              Upload to this Folder
            </Button>
            {isLabor && importBtn('outlined')}
          </Box>
          <Box component="p" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, m: '18px 0 0', fontSize: 12.5, color: 'og.gray', '& svg': { color: '#C9A45C', flex: 'none' } }}>
            <SparkleIcon />
            Documents are auto-classified by the AI placement engine.
          </Box>
        </Box>
      </Box>
      <UploadModal open={upload.open} initialFiles={upload.files} destination={destination} onClose={() => setUpload({ open: false, files: null })} onCommit={commit} />
    </AppShell>
  );
}
