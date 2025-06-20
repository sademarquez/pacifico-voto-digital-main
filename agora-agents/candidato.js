module.exports = function candidatoAgent(req, res) {
  const { action, payload, userConfig } = req.body;
  // userConfig permite personalización por usuario
  switch (action) {
    case 'get_team':
      // Ejemplo: personalización de estructura de equipo
      return res.json({ status: 'ok', team: userConfig?.team || [/* default team */] });
    case 'send_message':
      // Personalización de mensaje
      const msg = userConfig?.customMessage || 'Mensaje estándar de campaña';
      return res.json({ status: 'ok', message: msg });
    case 'get_reports':
      // Personalización de reportes
      return res.json({ status: 'ok', reports: userConfig?.customReports || [/* default reports */] });
    default:
      return res.status(400).json({ status: 'error', error: 'Acción no reconocida para candidato.' });
  }
}; 