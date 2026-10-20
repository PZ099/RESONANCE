/* Only publish HTTPS download URLs for verified release files. No keys belong here. */
window.RESONANCE_RELEASE = Object.freeze({
  version: '2.2.5',
  codename: 'PRISM · 棱镜',
  distribution: 'split',
  installerFilename: 'RESONANCE-2.2.5-Offline.exe',
  binPartCount: 15,
  checksumFilename: 'SHA256SUMS.txt',
  // The three fields below describe only the original complete ZIP, not the EXE/BIN files.
  filename: 'RESONANCE-2.2.5-完整安装包.zip',
  sizeBytes: 28249317950,
  sha256: '92D03B8D80A8873DD24F1EAE8EA7870E1297908A34108C9D9195B012A9858FFB',
  mirrors: []
  // Example shape: { name: '下载线路名称', url: 'https://your-real-download-url', note: '下载说明' }
});
