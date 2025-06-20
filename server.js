const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const candidatoAgent = require('./agora-agents/candidato');
const masterAgent = require('./agora-agents/master');
const liderAgent = require('./agora-agents/lider');
const publicidadAgent = require('./agora-agents/publicidad');
const votanteAgent = require('./agora-agents/votante');
const desarrolladorAgent = require('./agora-agents/desarrollador');

app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8082',
    'http://localhost:5678', // n8n local
    // Agrega aquí otros orígenes permitidos
  ],
  credentials: true
}));
app.use(express.json());

// Endpoints para cada agente
app.post('/api/agent/candidato', candidatoAgent);
app.post('/api/agent/master', masterAgent);
app.post('/api/agent/lider', liderAgent);
app.post('/api/agent/publicidad', publicidadAgent);
app.post('/api/agent/votante', votanteAgent);
app.post('/api/agent/desarrollador', desarrolladorAgent);

app.get('/', (req, res) => {
  res.send('API de Agora Node/Express corriendo.');
});

app.listen(PORT, () => {
  console.log(`Servidor Node/Express escuchando en http://localhost:${PORT}`);
}); 