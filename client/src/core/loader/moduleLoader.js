export async function loadRemoteModule(codeString, moduleName) {
  try {
    // Membuat Blob URL dari string kode Gist agar aman diimpor secara dinamis via ES Modules
    const blob = new Blob([codeString], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    
    // Import dinamis modul runtime
    const module = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    
    console.log(`[ModuleLoader] Modul "${moduleName}" berhasil dimuat.`);
    return module.default || module;
  } catch (error) {
    console.error(`[ModuleLoader] Gagal mengeksekusi modul ${moduleName}:`, error);
    throw new Error(`Gagal memuat modul ${moduleName}`);
  }
}
