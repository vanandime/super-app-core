const githubService = require('../services/githubService');

class SyncController {
  // Handler untuk GitHub Webhook (Real-time push)
  handleWebhook(req, res) {
    const event = req.headers['x-github-event'];
    
    if (event === 'ping') {
      return res.status(200).json({ message: 'Webhook connected successfully' });
    }

    if (event === 'gists') {
      const payload = req.body;
      console.log(`[Webhook] Gist ${payload.gist.id} telah diperbarui.`);
      
      // Di sini Anda bisa memicu WebSocket broadcast ke client yang terhubung
      // global.io.emit('gist-updated', payload.gist);
      
      return res.status(200).json({ status: 'success', message: 'Sync triggered' });
    }

    res.status(400).json({ error: 'Unsupported event type' });
  }

  // Handler untuk Smart Polling dengan ETag Cache
  async pollGist(req, res) {
    try {
      const clientEtag = req.headers['if-none-match'];
      const result = await githubService.fetchGist(clientEtag);

      if (!result.modified) {
        return res.status(304).send();
      }

      res.setHeader('ETag', result.etag);
      return res.status(200).json({
        status: 'success',
        data: result.data
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new SyncController();
