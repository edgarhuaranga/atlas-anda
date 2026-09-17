import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Button, IconButton, List, ListItem, ListItemText, CircularProgress, CssBaseline } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAdminWords, deleteAdminWord, logout } from '../../api/adminClient';
import BulkImport from './BulkImport';
import PhenomenaList from './PhenomenaList';

function EntityList({ label, fetcher, onDelete }) {
  const [items, setItems] = useState(null);

  const load = () => fetcher().then(setItems);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!items) return <CircularProgress sx={{ mt: 2 }} />;

  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 2 }}>{items.length} {label}</Typography>
      <List dense sx={{ maxHeight: 500, overflow: 'auto' }}>
        {items.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton edge="end" onClick={async () => { await onDelete(item.id); load(); }}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={item.word || item.label} secondary={`${item.recordingsCount} grabaciones`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <Box sx={{ maxWidth: 800, margin: '40px auto', padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Admin</Typography>
          <Button onClick={() => { logout(); navigate('/admin/login'); }}>Salir</Button>
        </Box>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mt: 2 }}>
          <Tab label="Palabras" />
          <Tab label="Fenómenos" />
          <Tab label="Importar" />
        </Tabs>
        {tab === 0 && <EntityList label="palabras" fetcher={getAdminWords} onDelete={deleteAdminWord} />}
        {tab === 1 && <PhenomenaList />}
        {tab === 2 && <BulkImport />}
      </Box>
    </>
  );
};

export default Dashboard;
