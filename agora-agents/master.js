module.exports = function masterAgent(req, res) {
  const { action, payload, userConfig } = req.body;
  switch (action) {
    case 'manage_users':
      return res.json({ status: 'ok', users: userConfig?.users || [/* default users */] });
    case 'run_automation':
      return res.json({ status: 'ok', result: userConfig?.automationResult || 'Automatización ejecutada.' });
    case 'get_audit':
      return res.json({ status: 'ok', audit: userConfig?.audit || 'Auditoría estándar.' });
    default:
      return res.status(400).json({ status: 'error', error: 'Acción no reconocida para master.' });
  }
}; 