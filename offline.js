(() => {
  'use strict';
  const installer = window.RESONANCE_RELEASE?.offlineDownloadInstaller;
  const autoActions = document.getElementById('offline-auto-actions');
  if (autoActions && installer && Number.isSafeInteger(installer.sizeBytes) && installer.sizeBytes > 0 && /^[a-f0-9]{64}$/i.test(installer.sha256 || '')) {
    try {
      const url = new URL(installer.url);
      if (url.protocol === 'https:' && !url.username && !url.password && url.hostname === 'github.com' && url.pathname === '/PZ099/RESONANCE/releases/download/v2.2.5/RESONANCE-2.2.5-OfflineDownload.exe') {
        const link = document.createElement('a');
        link.className = 'button button-dark offline-auto-button';
        link.href = url.href;
        link.download = 'RESONANCE-2.2.5-OfflineDownload.exe';
        link.append(document.createTextNode('下载完整包下载器'));
        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden','true'); icon.textContent = '↓'; link.append(icon);
        autoActions.replaceChildren(link);
      }
    } catch { /* Keep incomplete or malformed publication disabled. */ }
  }
  const button = document.getElementById('copy-offline-links');
  const status = document.getElementById('offline-copy-status');
  const fallback = document.getElementById('offline-link-fallback');
  if (!button || !status || !fallback) return;
  button.hidden = false;
  button.addEventListener('click', async () => {
    const links = [...document.querySelectorAll('.offline-file-link')].map(link => link.href);
    if (links.length !== 17 || links.some(link => !link.startsWith('https://github.com/PZ099/RESONANCE/releases/download/v2.2.5/'))) {
      status.textContent = '下载清单尚未完整，请刷新页面后重试。';
      return;
    }
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(links.join('\n'));
      status.textContent = '已复制 17 个下载链接，可粘贴到支持批量下载的工具。';
    } catch {
      fallback.value = links.join('\n');
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
      status.textContent = '已列出并选中全部链接，请按 Ctrl+C 或长按复制。';
    }
  });
})();
