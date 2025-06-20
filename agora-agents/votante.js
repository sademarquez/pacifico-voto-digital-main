module.exports = function votanteAgent(req, res) {
  const { action, payload, userConfig } = req.body;
  switch (action) {
    case 'get_location':
      return res.json({ status: 'ok', location: userConfig?.location || 'Ubicación estándar.' });
    case 'receive_message':
      return res.json({ status: 'ok', message: userConfig?.voterMessage || 'Mensaje de campaña recibido.' });
    default:
      return res.status(400).json({ status: 'error', error: 'Acción no reconocida para votante.' });
  }
}; 