// ... kode sebelumnya tetap utuh ...
import React, { useEffect, useState } from 'react';
import ClientSyncEngine from './core/sync/syncEngine';
import { applyTheme } from './core/registry/themeManager';
import ErrorBoundary from './components/ErrorBoundary';

// Gist ID yang diintegrasikan dari tautan pengguna
const GIST_ID = 'baa6c116e4813918192943b16862c93c';

export default function App() {
  const [gistData, setGistData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const syncEngine = new ClientSyncEngine(GIST_ID, 30000); // Polling setiap 30 detik

    syncEngine.startSmartPolling(
      (files, offlineMode = false) => {
        setGistData(files);
        setIsOffline(offlineMode);
        setErrorMessage(null);

        if (files['theme.json']) {
          applyTheme(files['theme.json'].content);
        }
      },
      (error) => {
        setErrorMessage(error);
      }
    );

    return () => {
      syncEngine.stopSmartPolling();
    };
  }, []);

  return (
    <div className="super-app-container" style={{ padding: '2rem', fontFamily: 'var(--font-family, sans-serif)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
        <h1>🚀 Modular Super App</h1>
        <p>Status Sinkronisasi: {isOffline ? '🔴 Mode Offline (Cache Lokal)' : '🟢 Terhubung secara Live (GitHub Gists)'}</p>
        <p><small>Gist Target: <code>{GIST_ID}</code></small></p>
        {isOffline && <small style={{ color: '#faad14' }}>Koneksi ke GitHub terputus. Menggunakan konfigurasi versi terakhir.</small>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </header>

      <main>
        <ErrorBoundary>
          {gistData ? (
            <div>
              <h2>Konfigurasi Aktif dari Gist:</h2>
              <ul>
                {Object.keys(gistData).map((filename) => (
                  <li key={filename} style={{ marginBottom: '0.5rem' }}>
                    <strong>{filename}</strong> ({gistData[filename].language || 'text'})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Memuat konfigurasi awal dari Gist...</p>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
