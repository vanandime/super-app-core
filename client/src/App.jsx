import React, { useEffect, useState } from 'react';
import ClientSyncEngine from './core/sync/syncEngine';
import { applyTheme } from './core/registry/themeManager';
import ErrorBoundary from './components/ErrorBoundary';

const GIST_ID = 'YOUR_GIST_ID_HERE'; // Ganti dengan Gist ID Anda

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

        // Jika Gist memiliki file theme.json, terapkan secara live
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
        {isOffline && <small style={{ color: '#faad14' }}>Koneksi ke GitHub terputus. Menggunakan konfigurasi versi terakhir yang valid.</small>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </header>

      <main>
        <ErrorBoundary>
          {gistData ? (
            <div>
              <h2>Konfigurasi Aktif dari Gist:</h2>
              <ul>
                {Object.keys(gistData).map((filename) => (
                  <li key={filename}>
                    <strong>{filename}</strong> ({gistData[filename].language || 'text'})
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Memuat konfigurasi awal dari Super App...</p>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
