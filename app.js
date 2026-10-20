(() => {
  'use strict';

  const menu = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('site-nav');
  function closeMenu() {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
  menu.addEventListener('click', () => {
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });

  const tabs = [...document.querySelectorAll('.preview-tab')];
  function activateTab(tab, focus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !selected;
      panel.classList.toggle('active', selected);
    }
    if (focus) tab.focus();
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let index = tabs.indexOf(tab);
      if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[index], true);
    });
  }

  const release = window.RESONANCE_RELEASE;
  const validHash = (value) => typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value);
  if (release) {
    const archive = release.archive || {};
    if (typeof archive.filename === 'string') document.getElementById('release-filename').textContent = archive.filename;
    if (Number.isSafeInteger(archive.sizeBytes) && archive.sizeBytes > 0) document.getElementById('release-bytes').textContent = archive.sizeBytes.toLocaleString('en-US');
    if (validHash(archive.sha256)) document.getElementById('release-hash').textContent = archive.sha256;

    const installer = release.onlineInstaller || {};
    let directUrl = null;
    try {
      const candidate = new URL(installer.url);
      if (candidate.protocol === 'https:' && !candidate.username && !candidate.password &&
          decodeURIComponent(candidate.pathname.split('/').pop()) === 'RESONANCE-2.2.5-Setup.exe') directUrl = candidate;
    } catch { /* Missing or invalid final file URL: keep the download disabled. */ }

    // A final URL alone must not enable a partially verified or placeholder release.
    const ready = directUrl && Number.isSafeInteger(installer.sizeBytes) && installer.sizeBytes > 0 && validHash(installer.sha256);
    if (ready) {
      document.getElementById('download-size-value').textContent = (installer.sizeBytes / 1000000).toFixed(1);
      document.getElementById('installer-size-note').textContent = '安装器文件 · ' + installer.sizeBytes.toLocaleString('en-US') + ' 字节';
      document.getElementById('installer-bytes').textContent = installer.sizeBytes.toLocaleString('en-US') + ' 字节';
      document.getElementById('installer-hash').textContent = installer.sha256.toUpperCase();
      document.getElementById('copy-installer-hash').disabled = false;
      const actions = document.getElementById('download-actions');
      actions.replaceChildren();
      const link = document.createElement('a');
      link.className = 'button button-dark download-button';
      link.href = directUrl.href;
      link.download = 'RESONANCE-2.2.5-Setup.exe';
      // No window.open or target=_blank: request the EXE directly in the current browsing context.
      // Cross-origin download behavior is ultimately controlled by the server response headers.
      link.setAttribute('aria-describedby', 'download-status');
      link.append(document.createTextNode('下载 Windows 安装器'));
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '↓';
      link.append(icon);
      actions.append(link);
      document.getElementById('download-status').textContent = '点击直接下载 EXE。运行后自动下载约 28.24 GB 完整安装数据，再进入安装向导；中国大陆访问速度与可用性尚未验证。';
    }
  }

  function wireHashCopy(buttonId, valueId, statusId, label) {
    document.getElementById(buttonId).addEventListener('click', async () => {
      const valueNode = document.getElementById(valueId);
      const value = valueNode.textContent.trim();
      const status = document.getElementById(statusId);
      if (!validHash(value)) {
        status.textContent = '最终校验值尚未发布。';
        return;
      }
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(value);
        status.textContent = label + '的校验值已复制。';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(valueNode);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = '已选中' + label + '的校验值，请按 Ctrl+C 或长按复制。';
      }
    });
  }
  wireHashCopy('copy-installer-hash', 'installer-hash', 'installer-copy-status', '联网安装器 EXE');
  wireHashCopy('copy-hash', 'release-hash', 'copy-status', '原始完整 ZIP');
})();
