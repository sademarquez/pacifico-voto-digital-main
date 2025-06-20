module.exports = function publicidadAgent(req, res) {
  const { action, payload, userConfig } = req.body;
  switch (action) {
    case 'generate_copy':
      return res.json({ status: 'ok', copy: userConfig?.adCopy || 'Copy publicitario estándar.' });
    case 'get_stats':
      return res.json({ status: 'ok', stats: userConfig?.adStats || { clicks: 0, views: 0 } });
    default:
      return res.status(400).json({ status: 'error', error: 'Acción no reconocida para publicidad.' });
  }
}; 