import { Box, MenuItem, OutlinedInput, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { OgDialog, useToast } from '@/components';
import { incidentTypes, projectDisasterOptions } from '@/data/disasterPortfolio';
import { DialogField } from './parts';

const selectSx = { width: '100%', '& .MuiSelect-select': { height: '36px !important', minHeight: '0 !important', boxSizing: 'border-box', display: 'flex', alignItems: 'center', py: 0, pr: '36px !important' } } as const;

/** "Declare New Event" dialog (prototype: New Declaration). */
export function DeclareEventDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [number, setNumber] = useState('');
  const [type, setType] = useState(incidentTypes[0]);
  const [start, setStart] = useState('');
  useEffect(() => {
    if (open) {
      setNumber('');
      setType(incidentTypes[0]);
      setStart('');
    }
  }, [open]);

  return (
    <OgDialog
      open={open}
      onClose={onClose}
      eyebrow="New Declaration"
      title="Declare New Event"
      confirmLabel="Create Declaration"
      confirmDisabled={!number.trim()}
      onConfirm={() => {
        toast({ title: number, message: 'declared · add projects next', inline: true });
        onClose();
      }}
    >
      <DialogField label="Declaration number" htmlFor="dn-number">
        <OutlinedInput id="dn-number" autoFocus fullWidth placeholder="e.g. DR-0000-CA" value={number} onChange={(e) => setNumber(e.target.value)} />
      </DialogField>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <DialogField label="Incident type" htmlFor="dn-type">
          <Select labelId="dn-type-label" value={type} onChange={(e) => setType(e.target.value)} sx={selectSx} input={<OutlinedInput />}>
            {incidentTypes.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </Select>
        </DialogField>
        <DialogField label="Incident start" htmlFor="dn-start">
          <OutlinedInput id="dn-start" type="date" fullWidth value={start} onChange={(e) => setStart(e.target.value)} />
        </DialogField>
      </Box>
    </OgDialog>
  );
}

/** "New Project" dialog (prototype: Create Project Worksheet). */
export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [disaster, setDisaster] = useState(projectDisasterOptions[0]);
  useEffect(() => {
    if (open) {
      setNumber('');
      setName('');
      setDisaster(projectDisasterOptions[0]);
    }
  }, [open]);

  return (
    <OgDialog
      open={open}
      onClose={onClose}
      eyebrow="New Project"
      title="Create Project Worksheet"
      confirmLabel="Create Project"
      confirmDisabled={!number.trim()}
      onConfirm={() => {
        toast({ title: number, message: 'created under DR-4683-CA', inline: true });
        onClose();
      }}
    >
      <DialogField label="Project number" htmlFor="np-number">
        <OutlinedInput id="np-number" autoFocus fullWidth placeholder="e.g. PW-00436" value={number} onChange={(e) => setNumber(e.target.value)} />
      </DialogField>
      <DialogField label="Project name" htmlFor="np-name">
        <OutlinedInput id="np-name" fullWidth placeholder="Short description" value={name} onChange={(e) => setName(e.target.value)} />
      </DialogField>
      <DialogField label="Disaster" htmlFor="np-disaster">
        <Select labelId="np-disaster-label" value={disaster} onChange={(e) => setDisaster(e.target.value)} sx={selectSx} input={<OutlinedInput />}>
          {projectDisasterOptions.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </DialogField>
    </OgDialog>
  );
}
