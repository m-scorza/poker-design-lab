// Sessions timeline row expansion drawers.
import gsap from 'gsap';

export function initSessions() {
  const sessionRows = document.querySelectorAll('.timeline-row-editorial');
  sessionRows.forEach(row => {
    row.addEventListener('click', () => {
      const drawerId = row.getAttribute('data-drawer');
      if (!drawerId) return;
      const drawer = document.getElementById(drawerId);
      if (!drawer) return;

      const isActive = drawer.classList.contains('active');

      document.querySelectorAll('.editorial-expand-panel').forEach(d => {
        if (d !== drawer && d.classList.contains('active')) {
          gsap.to(d, {
            height: 0, opacity: 0, duration: 0.3, onComplete: () => {
              d.classList.remove('active');
              d.style.display = 'none';
            }
          });
        }
      });

      if (!isActive) {
        drawer.style.display = 'block';
        gsap.fromTo(drawer, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out",
          onStart: () => drawer.classList.add('active')
        });
      } else {
        gsap.to(drawer, {
          height: 0, opacity: 0, duration: 0.3, onComplete: () => {
            drawer.classList.remove('active');
            drawer.style.display = 'none';
          }
        });
      }
    });
  });

  // Render mini cumulative BB charts
  const sessionsData = {
    '37': [0, 2.5, 1.2, 5.0, 3.8, 8.4, 6.2, 10.5, 9.0, 14.2, 12.4],
    '36': [0, -2.1, -5.3, -3.2, -6.8, -10.4, -8.1, -12.3, -7.5, -4.8],
    '35': [0, 4.2, 8.5, 6.1, 10.4, 15.2, 12.0, 18.6, 16.3, 22.1]
  };

  Object.entries(sessionsData).forEach(([sessionNum, data]) => {
    const svg = document.getElementById(`mini-trend-${sessionNum}`);
    if (svg) {
      drawMiniChart(svg, data);
    }
  });

  // Export Modal logic
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportPdf = document.getElementById('btn-export-pdf');
  const exportBackdrop = document.getElementById('export-backdrop');
  const btnCloseExport = document.getElementById('btn-close-export');
  const btnDownloadFile = document.getElementById('btn-download-file');
  
  const progressBar = document.getElementById('export-progress-bar');
  const pctText = document.getElementById('export-pct');
  const statusText = document.getElementById('export-status-text');
  const logsWindow = document.getElementById('export-terminal-logs');
  const successArea = document.getElementById('export-success-msg');
  const progressArea = document.getElementById('export-progress-area');

  let currentExportType = 'CSV';

  function triggerExport(type) {
    currentExportType = type;
    document.getElementById('export-modal-title').innerText = `Exporting Database Ledger (${type})`;
    
    // Reset view states
    successArea.style.display = 'none';
    progressArea.style.display = 'block';
    progressBar.style.width = '0%';
    pctText.innerText = '0%';
    statusText.innerText = 'Initializing compilation sequence...';
    logsWindow.innerHTML = '';
    
    // Show modal
    exportBackdrop.style.display = 'flex';
    
    // Run simulation
    let progress = 0;
    const logMessages = [
      { pct: 5, msg: 'Initializing compilation sequence...' },
      { pct: 15, msg: 'Loading session history entries (3 active sessions)...' },
      { pct: 28, msg: 'Gathering hand history telemetry metrics (2,380 hands)...' },
      { pct: 45, msg: `Tokenizing hand records to local ${type} format buffer...` },
      { pct: 60, msg: 'Validating GTO open compliance metrics...' },
      { pct: 78, msg: 'Calculating BB deltas and positional win rates...' },
      { pct: 90, msg: 'Compressing and validating file buffer integrity...' },
      { pct: 100, msg: `Compilation complete. Prepared ledger.${type.toLowerCase()}` }
    ];

    let currentLogIndex = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Show success state
        setTimeout(() => {
          progressArea.style.display = 'none';
          successArea.style.display = 'block';
        }, 300);
      }
      
      progressBar.style.width = `${progress}%`;
      pctText.innerText = `${progress}%`;

      // Log printing
      while (currentLogIndex < logMessages.length && logMessages[currentLogIndex].pct <= progress) {
        const entry = logMessages[currentLogIndex];
        const logLine = document.createElement('div');
        logLine.style.marginBottom = '4px';
        logLine.innerHTML = `<span style="color:var(--accent-2); font-weight:700;">[INFO]</span> ${entry.msg}`;
        logsWindow.appendChild(logLine);
        logsWindow.scrollTop = logsWindow.scrollHeight;
        statusText.innerText = entry.msg;
        currentLogIndex++;
      }
    }, 120);
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => triggerExport('CSV'));
  }
  if (btnExportPdf) {
    btnExportPdf.addEventListener('click', () => triggerExport('PDF'));
  }
  if (btnCloseExport) {
    btnCloseExport.addEventListener('click', () => {
      exportBackdrop.style.display = 'none';
    });
  }
  if (btnDownloadFile) {
    btnDownloadFile.addEventListener('click', () => {
      // Simulate file download
      const filename = `poker_ledger_export_${new Date().toISOString().slice(0, 10)}.${currentExportType.toLowerCase()}`;
      const dummyContent = `Poker Analyzer Export File\nType: ${currentExportType}\nDate: ${new Date().toLocaleString()}\n`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      
      // Close modal after download
      exportBackdrop.style.display = 'none';
    });
  }
}

function drawMiniChart(svgElement, data) {
  if (!svgElement) return;
  const width = 200;
  const height = 100;
  const padding = 10;
  
  const min = Math.min(...data, 0); // include 0 to show baseline
  const max = Math.max(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    // Invert y because SVG y goes down
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y };
  });
  
  // Build line path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }
  
  // Find y-coordinate of baseline (0)
  const zeroY = height - padding - ((0 - min) / range) * (height - 2 * padding);
  
  // Build area path (closing to baseline zeroY)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${zeroY} L ${points[0].x} ${zeroY} Z`;
  
  const pathEl = svgElement.querySelector('.mini-trend-path');
  const areaEl = svgElement.querySelector('.mini-trend-area');
  const baselineEl = svgElement.querySelector('line');
  
  const isWinning = data[data.length - 1] >= 0;
  const strokeColor = isWinning ? 'var(--accent)' : 'var(--loss)';
  const gradientId = isWinning ? `mini-gradient-win-${svgElement.id.split('-').pop()}` : `mini-gradient-loss-${svgElement.id.split('-').pop()}`;
  
  if (pathEl) {
    pathEl.setAttribute('d', pathD);
    pathEl.setAttribute('stroke', strokeColor);
  }
  if (areaEl) {
    areaEl.setAttribute('d', areaD);
    areaEl.setAttribute('fill', `url(#${gradientId})`);
  }
  if (baselineEl) {
    baselineEl.setAttribute('y1', zeroY);
    baselineEl.setAttribute('y2', zeroY);
  }
}

