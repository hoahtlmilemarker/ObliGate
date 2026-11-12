import { Box, Button, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/components';
import { AppShell, PageBody, routes } from '@/layout';
import { FORCE_ACCOUNT, folderFromSlug, folderSamples, forceAccountBanner, forceAccountDocs, queueCounts, type LibraryDoc } from '@/data/documentLibrary';
import { ChecklistCard } from './ChecklistCard';
import { DocumentsPanel } from './DocumentsPanel';
import { LibraryActions } from './DocumentTable';
import { plural, type Classified } from '@/data/classify';
import { confirmPlacement, getResults, isDemoBatch } from '@/data/uploadSession';
import { CheckIcon } from '@/icons';
import { FolderBanner } from './FolderBanner';
import { LibrarySidebar } from './LibrarySidebar';
import { UploadModal, type CommittedFile, type UploadFileLike } from '@/components/UploadModal';

const PROJECT = 'PW-00428';

/** Library row for a file filed from the user's upload (Analysis Report → View / Fix / Confirm Folder). */
export const uploadRowId = (name: string) => `up-${name.replace(/[^\w.-]+/g, '_')}`;
function filedRow(x: Classified): LibraryDoc {
  const f = x.finding;
  return {
    id: uploadRowId(x.name),
    type: typeOf(x.name),
    name: x.name,
    link: 'review',
    kind: x.kind,
    meta: 'Uploaded just now by you',
    period: 'No date found',
    year: 'Add in review',
    initials: '',
    who: 'Not detected',
    value: '—',
    tone: f ? (f.sev === 'c' ? 'risk' : 'warn') : x.tier === 'check' ? 'warn' : 'good',
    status: f ? (f.sev === 'c' ? 'Critical finding' : 'Advisory') : x.tier === 'check' ? `Check placement (${x.conf}%)` : x.tier === 'manual' ? 'Filed by you' : 'Filed automatically',
    action: f ? 'fix' : x.tier === 'check' ? 'confirmFolder' : 'view',
    actionTo: f?.href,
    fromUpload: true,
  };
}
/** "PW-00428 › 2. Equipment Records" → "Equipment Records" (only PW-00428 is in this library). */
const leafOf = (folder: string | null) => (folder?.startsWith(`${PROJECT} › `) ? folder.split(' › ')[1].replace(/^\d+\.\s*/, '') : null);

const sizeLabel = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const typeOf = (name: string) => {
  const e = (name.split('.').pop() || '').toLowerCase();
  if (e === 'pdf') return 'PDF';
  if (e === 'xlsx' || e === 'xls' || e === 'csv') return 'XLSX';
  return e.toUpperCase().slice(0, 4) || 'FILE';
};

let uid = 0;
function uploadedRow(f: UploadFileLike): LibraryDoc {
  return { id: `doc-upload-${++uid}`, type: typeOf(f.name), name: f.name, link: 'review', kind: 'Classifying…', meta: `Uploaded just now · ${sizeLabel(f.size || 0)}`, period: '—', year: '', initials: '', who: 'Detecting…', value: '—', tone: 'proc', status: 'Extracting…', action: 'processing', isNew: true };
}

/** 03 · Document Library — folder view of PW-00428 with the Category C checklist, document table and upload flow. */
export default function DocumentLibrary() {
  const toast = useToast();
  const location = useLocation();
  const [params] = useSearchParams();
  const folder = folderFromSlug(params.get('folder') ?? undefined) ?? FORCE_ACCOUNT;
  const isLabor = folder === FORCE_ACCOUNT;

  // folder rows (uploads are added to the shown folder)
  // The user's own upload (this session): filed files go on top of their folder.
  const [mine] = useState(() => (isDemoBatch() ? [] : getResults().files.filter((x) => x.placed)));
  const [rowsByFolder, setRowsByFolder] = useState<Record<string, LibraryDoc[]>>(() => {
    const base: Record<string, LibraryDoc[]> = { [FORCE_ACCOUNT]: forceAccountDocs, ...Object.fromEntries(Object.entries(folderSamples).map(([k, v]) => [k, v.rows])) };
    for (const x of mine) {
      const leaf = leafOf(x.folder);
      if (leaf) base[leaf] = [filedRow(x), ...(base[leaf] ?? [])];
    }
    return base;
  });
  const mineHere = mine.filter((x) => leafOf(x.folder) === folder);
  const mineElsewhere = mine.filter((x) => leafOf(x.folder) !== folder);
  const [confirmed, setConfirmed] = useState(0);
  const toCheck = (rowsByFolder[folder] ?? []).filter((r) => r.action === 'confirmFolder').length;
  const onConfirmFolder = (d: LibraryDoc) => {
    confirmPlacement(d.name);
    setRowsByFolder((m) => ({ ...m, [folder]: (m[folder] ?? []).map((r) => (r.id === d.id ? { ...r, tone: 'good', status: 'Filed by you', action: 'view' } : r)) }));
    setConfirmed((n) => n + 1);
    toast({ title: d.name, message: 'confirmed in its folder', inline: true, duration: 3500 });
  };
  const docs = rowsByFolder[folder] ?? [];
  const [reviewCount, setReviewCount] = useState(queueCounts.review);

  // skeleton while switching folders (480ms, like the prototype)
  const [loadedFolder, setLoadedFolder] = useState(folder);
  const [enterKey, setEnterKey] = useState(0);
  const loading = loadedFolder !== folder;
  useEffect(() => {
    if (loadedFolder === folder) return;
    const t = window.setTimeout(() => {
      setLoadedFolder(folder);
      setEnterKey((k) => k + 1);
    }, 480);
    return () => window.clearTimeout(t);
  }, [folder, loadedFolder]);

  useEffect(() => {
    document.title = isLabor ? 'ObliGate · Document Library' : `${folder} · Document Library`;
  }, [folder, isLabor]);

  const destination = isLabor ? `${PROJECT} › 1. ${FORCE_ACCOUNT}` : `${PROJECT} › ${folder}`;

  // upload modal
  const [upload, setUpload] = useState<{ open: boolean; files: UploadFileLike[] | null }>({ open: false, files: null });
  const openUpload = useCallback((files?: File[]) => setUpload({ open: true, files: files?.map((f) => ({ name: f.name, size: f.size })) ?? null }), []);
  const [addedNonce, setAddedNonce] = useState(0);

  const commit = (files: CommittedFile[]) => {
    if (!files.length) return;
    const fresh = files.map(uploadedRow);
    const replaced = new Set(files.filter((f) => f.replace).map((f) => f.name));
    setRowsByFolder((m) => ({ ...m, [folder]: [...fresh, ...(m[folder] ?? []).map((r) => (r.isNew ? { ...r, isNew: false } : r)).filter((r) => !replaced.has(r.name))] }));
    setReviewCount((c) => c + files.length);
    setAddedNonce((n) => n + 1);
    toast({ title: `${files.length} file${files.length > 1 ? 's' : ''} uploaded`, message: `to ${destination}`, inline: true, duration: 7000, action: { label: 'View', onClick: () => document.getElementById(fresh[0].id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) } });
    const ids = new Set(fresh.map((r) => r.id));
    window.setTimeout(() => {
      setRowsByFolder((m) => ({ ...m, [folder]: (m[folder] ?? []).map((r) => (ids.has(r.id) ? { ...r, tone: 'warn', status: 'Queued for Review', kind: 'Awaiting classification', action: 'reviewPlain' } : r)) }));
    }, 2600);
  };

  // "View File" and #hash → reveal the row
  const [focusRequest, setFocusRequest] = useState<{ id: string; n: number } | null>(null);
  const reveal = (id: string) => setFocusRequest((r) => ({ id, n: (r?.n ?? 0) + 1 }));
  useEffect(() => {
    const h = decodeURIComponent(location.hash.slice(1));
    const id = h.startsWith('f=') ? uploadRowId(h.slice(2)) : h;
    if (id) window.setTimeout(() => reveal(id), 300);
  }, [location.hash]);

  const navigate = useNavigate();
  const settled = useMemo(() => docs.filter((d) => !d.isNew), [docs]);
  const toReview = useMemo(() => settled.filter((d) => /review needed/i.test(d.status)), [settled]);
  /** Opens the first Needs Review document of this folder in the review screen. */
  const openFirstReview = () => {
    try {
      sessionStorage.setItem('og-doc', String(settled.indexOf(toReview[0])));
    } catch {
      /* storage unavailable */
    }
    navigate(routes.review);
  };

  const deleteDocs = (ids: string[]) => {
    const gone = new Set(ids);
    setRowsByFolder((m) => ({ ...m, [folder]: (m[folder] ?? []).filter((r) => !gone.has(r.id)) }));
    toast({ title: `${ids.length} document${ids.length > 1 ? 's' : ''} deleted`, message: 'recorded in audit log', duration: 5000 });
  };
  const sample = folderSamples[folder];
  const total = docs.length;

  return (
    <AppShell active="library" sidebarLabel="Queues & filing cabinet" sidebar={<LibrarySidebar key={folder} activeFolder={{ project: PROJECT, folder }} reviewCount={reviewCount} showDropzone onFiles={openUpload} />}>
      <FolderBanner
        prefix="Folder View:"
        crumbs={[{ label: 'DR-4683-CA', to: routes.disasters }, { label: 'Public Works', to: routes.disasters }, { label: PROJECT, to: routes.project }, { label: folder }]}
        title={`${isLabor ? forceAccountBanner.title : folder} (${total} Documents)`}
        subtitle={isLabor ? forceAccountBanner.description : sample?.description}
        loading={loading}
        overlap={isLabor}
        actions={
          <>
            {toReview.length > 0 && (
              <Button variant="inverse" onClick={openFirstReview}>
                Review {toReview.length} Document
                {toReview.length > 1 ? 's' : ''}
              </Button>
            )}
            {isLabor && (
              <Tooltip describeChild title="Creates labor records from a payroll export. The spreadsheet is not stored as a document.">
                <Button variant="onDark" component={RouterLink} to={routes.importWizard}>
                  Import Payroll Records (Excel)
                </Button>
              </Tooltip>
            )}
          </>
        }
      />
      <LibraryActions.Provider value={{ onConfirmFolder }}>
        <PageBody overlap={isLabor}>
          {isLabor && <ChecklistCard loading={loading} onViewFile={() => reveal('doc-supervisorlog')} />}
          {mineHere.length + mineElsewhere.length > 0 && (
            <Box role="status" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px', mb: 1, p: '11px 16px', border: 1, borderColor: 'og.line', borderLeft: '3px solid #B08A4E', borderRadius: '4px', bgcolor: 'og.card', fontSize: 13, lineHeight: 1.55, color: 'og.ink', '& b': { color: 'og.head' } }}>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, height: 24, px: '8px', border: 1, borderColor: 'og.good', borderRadius: '4px', bgcolor: 'og.goodTint', color: 'og.good', fontSize: 10.5, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                <CheckIcon size={12} />
                From your upload
              </Box>
              <Box component="span" sx={{ flex: 1, minWidth: 240 }}>
                <b>{plural(mineHere.length, 'file')}</b> from your upload {mineHere.length === 1 ? 'is' : 'are'} in this folder.{' '}
                {mineElsewhere.length > 0 && (
                  <>
                    <b>{mineElsewhere.length}</b> more {mineElsewhere.length === 1 ? 'is' : 'are'} in other folders: {[...new Set(mineElsewhere.map((x) => x.folder))].map((f) => `${f} (${mineElsewhere.filter((x) => x.folder === f).length})`).join(', ')}.{' '}
                  </>
                )}
                {toCheck > 0 && (
                  <>
                    <b>{toCheck}</b> need{toCheck === 1 ? 's' : ''} you to confirm the folder.{' '}
                  </>
                )}
                {mineHere.length > 0 && 'They are at the top, marked New.'}
                {confirmed > 0 && !toCheck && ' All placements confirmed.'}
              </Box>
              <Button component={RouterLink} to={routes.analysisReport} size="small" variant="outlined">
                Back to Analysis Report
              </Button>
            </Box>
          )}
          <DocumentsPanel key={folder} docs={docs} loading={loading} destination={destination} folderPath={`${PROJECT} › ${folder}`} onDelete={deleteDocs} onUploadClick={() => openUpload()} onDropFiles={openUpload} focusRequest={focusRequest} addedNonce={addedNonce} enterKey={enterKey} />
        </PageBody>
      </LibraryActions.Provider>
      <UploadModal open={upload.open} initialFiles={upload.files} destination={destination} existing={docs.map((d) => d.name)} onClose={() => setUpload({ open: false, files: null })} onCommit={commit} />
    </AppShell>
  );
}
