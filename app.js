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
  if (release) {
    if (typeof release.filename === 'string') document.getElementById('release-filename').textContent = release.filename;
    if (Number.isSafeInteger(release.sizeBytes) && release.sizeBytes > 0) document.getElementById('release-bytes').textContent = release.sizeBytes.toLocaleString('en-US');
    if (/^[a-f0-9]{64}$/i.test(release.sha256 || '')) document.getElementById('release-hash').textContent = release.sha256;
    const mirrors = (Array.isArray(release.mirrors) ? release.mirrors : []).filter((mirror) => {
      try {
        const url = new URL(mirror.url);
        return url.protocol === 'https:' && !url.username && !url.password && typeof mirror.name === 'string' && mirror.name.trim();
      } catch { return false; }
    });
    if (mirrors.length) {
      const actions = document.getElementById('download-actions');
      actions.replaceChildren();
      mirrors.forEach((mirror, index) => {
        const link = document.createElement('a');
        link.className = 'button button-dark download-button' + (index ? ' download-mirror' : '');
        link.href = mirror.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.append(document.createTextNode(mirror.name.trim()));
        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '↗';
        link.append(icon);
        actions.append(link);
        if (typeof mirror.note === 'string' && mirror.note.trim()) {
          const note = document.createElement('p');
          note.className = 'mirror-note';
          note.textContent = mirror.note;
          actions.append(note);
        }
      });
      document.getElementById('download-status').textContent = '下载页面将在新标签页打开。分卷发布请下载 EXE 与全部 15 个 BIN，放在同一文件夹；完整 ZIP 请先解压。GitHub 的 Source code 不是安装包。';
    }
  }

  const copyButton = document.getElementById('copy-hash');
  copyButton.addEventListener('click', async () => {
    const value = document.getElementById('release-hash').textContent.trim();
    const status = document.getElementById('copy-status');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      status.textContent = '完整 ZIP 的校验值已复制；分卷请使用 SHA256SUMS.txt。';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('release-hash'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = '已选中完整 ZIP 的校验值，请按 Ctrl+C 或长按复制。分卷请使用 SHA256SUMS.txt。';
    }
  });
})();
