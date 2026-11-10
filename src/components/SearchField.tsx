import { InputAdornment, OutlinedInput, type OutlinedInputProps } from '@mui/material';
import { SearchIcon } from '@/icons';

/** Filter / search input with leading magnifier (36px). Pass `inputProps={{'aria-label': ...}}`. */
export function SearchField(props: OutlinedInputProps) {
  return (
    <OutlinedInput
      startAdornment={
        <InputAdornment position="start" sx={{ color: 'text.secondary', mr: 0 }}>
          <SearchIcon size={16} />
        </InputAdornment>
      }
      {...props}
      sx={[{ pl: '12px', '& input': { pl: '8px' } }, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    />
  );
}
