module.exports = function liderAgent(req, res) {
  const { action, payload, userConfig } = req.body;
  switch (action) {
    case 'get_network':
      return res.json({ status: 'ok', network: userConfig?.network || [/* default network */] });
    case 'send_team_message':
      return res.json({ status: 'ok', message: userConfig?.teamMessage || 'Mensaje a equipo enviado.' });
    default:
      return res.status(400).json({ status: 'error', error: 'Acción no reconocida para líder.' });
  }
}; 