import React, { useState } from 'react';
import { Box, Button, MenuItem, Select, Typography, Table, TableHead, TableRow, TableCell, TableBody, Alert, Link } from '@mui/material';
import Papa from 'papaparse';
import { previewImport, commitImport } from '../../api/adminClient';

const COLUMN_HINTS = {
  wordRecordings: 'Columnas: word, postalcode, variation, audioUrl, comment',
  phenomenonRecordings: 'Columnas: key, label, postalcode, category, color, audioUrl, comment',
};

const EXAMPLE_FILES = {
  wordRecordings: '/examples/word-recordings-example.csv',
  phenomenonRecordings: '/examples/phenomenon-recordings-example.csv',
};

const BulkImport = () => {
  const [type, setType] = useState('wordRecordings');
  const [rows, setRows] = useState(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const resetOutcome = () => {
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    resetOutcome();

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const parsedRows = file.name.endsWith('.json')
          ? JSON.parse(text)
          : Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        setRows(parsedRows);
      } catch (err) {
        setError(`No se pudo leer el archivo: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handlePreview = async () => {
    try {
      setPreview(await previewImport(type, rows));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommit = async () => {
    try {
      setResult(await commitImport(type, rows));
      setPreview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Select value={type} onChange={(e) => { setType(e.target.value); setRows(null); setFileName(''); resetOutcome(); }} sx={{ mb: 2, minWidth: 260 }}>
        <MenuItem value="wordRecordings">Grabaciones de palabras</MenuItem>
        <MenuItem value="phenomenonRecordings">Grabaciones de fenómenos</MenuItem>
      </Select>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {COLUMN_HINTS[type]} — <Link href={EXAMPLE_FILES[type]} download>descargar ejemplo</Link>
      </Typography>

      <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Elegir archivo CSV o JSON
        <input type="file" hidden accept=".csv,.json" onChange={handleFile} />
      </Button>
      {fileName && <Typography variant="body2">{fileName} — {rows?.length ?? 0} filas</Typography>}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {rows && !preview && !result && (
        <Box><Button variant="contained" sx={{ mt: 2 }} onClick={handlePreview}>Previsualizar</Button></Box>
      )}

      {preview && (
        <Box sx={{ mt: 2 }}>
          <Alert severity={preview.summary.invalid > 0 ? 'warning' : 'success'}>
            {preview.summary.valid} válidas / {preview.summary.total} totales — {preview.summary.invalid} con error
          </Alert>
          {preview.errors.length > 0 && (
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow><TableCell>Fila</TableCell><TableCell>Error</TableCell></TableRow>
              </TableHead>
              <TableBody>
                {preview.errors.slice(0, 50).map((e, i) => (
                  <TableRow key={i}><TableCell>{e.row}</TableCell><TableCell>{e.message}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button variant="contained" sx={{ mt: 2 }} disabled={preview.summary.valid === 0} onClick={handleCommit}>
            Importar {preview.summary.valid} filas válidas
          </Button>
        </Box>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Importadas {result.committed} filas.{result.failed.length > 0 ? ` ${result.failed.length} fallaron.` : ''}
        </Alert>
      )}
    </Box>
  );
};

export default BulkImport;
