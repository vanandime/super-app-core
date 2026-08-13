class ClientSyncEngine {
  constructor(gistId, pollingInterval = 60000) {
    this.gistId = gistId;
    this.pollingInterval = pollingInterval;
    this.etagKey = `super_app_etag_${gistId}`;
    this.cacheKey = `super_app_cache_${gistId}`;
    this.timer = null;
  }

  // Ambil data dengan mekanisme Fallback ke Local Storage
  async fetchWithFallback(onUpdate, onError) {
    try {
      const currentEtag = localStorage.getItem(this.etagKey) || null;
      const headers = { Accept: 'application/vnd.github+json' };
      if (currentEtag) headers['If-None-Match'] = currentEtag;

      const response = await fetch(`https://api.github.com/gists/${this.gistId}`, { headers });

      if (response.status === 304) {
        console.log('[SyncEngine] Data Gist tidak berubah (304 Not Modified). Menggunakan cache lokal.');
        return this.loadFromCache(onUpdate);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newEtag = response.headers.get('ETag');
      const data = await response.json();

      // Simpan ETag dan Cache baru
      if (newEtag) localStorage.setItem(this.etagKey, newEtag);
      localStorage.setItem(this.cacheKey, JSON.stringify(data.files));

      console.log('[SyncEngine] Berhasil menyinkronkan data terbaru dari Gist.');
      onUpdate(data.files);
    } catch (error) {
      console.warn('[SyncEngine] Koneksi terputus atau gagal mengakses GitHub API. Mengaktifkan Fallback Mode...', error);
      
      // Fallback: Muat dari cache lokal agar aplikasi tetap berjalan
      const hasLoadedCache = this.loadFromCache(onUpdate);
      if (!hasLoadedCache && onError) {
        onError('Koneksi terputus dan tidak ada cache lokal yang tersedia.');
      }
    }
  }

  loadFromCache(onUpdate) {
    const cachedData = localStorage.getItem(this.cacheKey);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        onUpdate(parsed, true); // true menandakan mode offline/fallback
        return true;
      } catch (e) {
        console.error('[SyncEngine] Gagal memparsing cache lokal:', e);
      }
    }
    return false;
  }

  startSmartPolling(onUpdate, onError) {
    // Initial fetch
    this.fetchWithFallback(onUpdate, onError);

    // Setup interval polling cerdas
    this.timer = setInterval(() => {
      this.fetchWithFallback(onUpdate, onError);
    }, this.pollingInterval);
  }

  stopSmartPolling() {
    if (this.timer) clearInterval(this.timer);
  }
}

export default ClientSyncEngine;
