const axios = require('axios');

class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.gistId = process.env.SUPER_APP_GIST_ID;
  }

  async fetchGist(etag = null) {
    try {
      const headers = {
        Accept: 'application/vnd.github+json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...(etag && { 'If-None-Match': etag })
      };

      const response = await axios.get(`https://api.github.com/gists/${this.gistId}`, {
        headers,
        validateStatus: (status) => status === 200 || status === 304
      });

      if (response.status === 304) {
        return { modified: false };
      }

      return {
        modified: true,
        etag: response.headers['etag'],
        data: response.data.files
      };
    } catch (error) {
      console.error('[GitHubService] Error fetching Gist:', error.message);
      throw new Error('Gagal mengambil data dari GitHub Gists.');
    }
  }
}

module.exports = new GitHubService();
