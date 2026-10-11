import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemButton, CircularProgress, TextField, Collapse, Switch, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAdminPhenomena, deleteAdminPhenomenon, getAdminPhenomenon, updateAdminPhenomenon } from '../../api/adminClient';

function PhenomenonRow({ item, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    if (!open && comment === null) {
      const full = await getAdminPhenomenon(item.id);
      setComment(full.comment || '');
    }
    setOpen(!open);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateAdminPhenomenon(item.id, { comment });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <Tooltip title={item.published ? 'Publicado' : 'Oculto'}>
              <Switch
                size="small"
                checked={item.published}
                onChange={async () => { await updateAdminPhenomenon(item.id, { published: !item.published }); onDeleted(); }}
              />
            </Tooltip>
            <IconButton
              edge="end"
              onClick={async () => {
                if (!window.confirm(`¿Borrar "${item.label}" y sus ${item.recordingsCount} grabaciones? Esta acción no se puede deshacer.`)) return;
                await deleteAdminPhenomenon(item.id);
                onDeleted();
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        }
        disablePadding
      >
        <ListItemButton onClick={toggle}>
          <ListItemText primary={item.label} secondary={`${item.recordingsCount} grabaciones`} sx={{ opacity: item.published ? 1 : 0.5 }} />
        </ListItemButton>
      </ListItem>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            label="Aclaración general (se muestra debajo del mapa)"
            value={comment || ''}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button size="small" variant="contained" onClick={save} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Collapse>
    </>
  );
}

const PhenomenaList = () => {
  const [items, setItems] = useState(null);

  const load = () => getAdminPhenomena().then(setItems);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) return <CircularProgress sx={{ mt: 2 }} />;

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>{items.length} fenómenos</Typography>
      <Typography variant="body2" color="text.secondary">Toca un fenómeno para editar su aclaración general.</Typography>
      <List dense sx={{ maxHeight: 500, overflow: 'auto' }}>
        {items.map((item) => (
          <PhenomenonRow key={item.id} item={item} onDeleted={load} />
        ))}
      </List>
    </Box>
  );
};

export default PhenomenaList;
