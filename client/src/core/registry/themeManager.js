export function applyTheme(themeConfig) {
  try {
    const root = document.documentElement;
    let config = themeConfig;

    if (typeof themeConfig === 'string') {
      config = JSON.parse(themeConfig);
    }

    // Terapkan variabel CSS secara live ke root elemen
    Object.entries(config).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });

    console.log('[ThemeManager] Variabel tema berhasil diperbarui secara live.');
  } catch (error) {
    console.error('[ThemeManager] Gagal memparsing atau menerapkan tema:', error);
  }
}
