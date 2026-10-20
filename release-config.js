/* Fill onlineInstaller.url, sizeBytes and sha256 only after the final EXE is verified.
   All three are required to enable the direct-file download. Never use a release page URL. */
window.RESONANCE_RELEASE = Object.freeze({
  version: '2.2.5',
  codename: 'PRISM · 棱镜',
  distribution: 'online-installer',
  onlineInstaller: {
    filename: 'RESONANCE-2.2.5-Setup.exe',
    url: 'https://github.com/PZ099/RESONANCE/releases/download/v2.2.5/RESONANCE-2.2.5-Setup.exe',
    sizeBytes: 71697703,
    sha256: '95D60B7C635044AEDFFC9762519F31DA0168FC251A40647B67BDEC1892DEB9B4'
  },
  // Complete EXE/BIN installation data; the small installer does not remove models/features.
  payloadSizeBytes: 28239346608,
  offline: {
    installerFilename: 'RESONANCE-2.2.5-Offline.exe',
    binPartCount: 15,
    checksumFilename: 'SHA256SUMS.txt'
  },
  // This original archive is separate from both the small Setup EXE and offline EXE/BIN parts.
  archive: {
    filename: 'RESONANCE-2.2.5-完整安装包.zip',
    sizeBytes: 28249317950,
    sha256: '92D03B8D80A8873DD24F1EAE8EA7870E1297908A34108C9D9195B012A9858FFB'
  }
});
