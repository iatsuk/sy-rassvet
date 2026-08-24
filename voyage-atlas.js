(() => {
  const atlas = document.querySelector('[data-voyage-atlas]');
  const mapNode = document.querySelector('#voyage-map');
  if (!atlas || !mapNode || typeof window.L === 'undefined') return;

  const inactiveStyle = { color: '#376e73', weight: 2.4, opacity: 0.42 };
  const relatedStyle = { color: '#d69a24', weight: 3.2, opacity: 0.72 };
  const activeStyle = { color: '#f1bb32', weight: 4.8, opacity: 1 };
  const map = L.map(mapNode, {
    zoomControl: false,
    scrollWheelZoom: false,
    preferCanvas: true
  }).setView([56.1, 10.5], 5);

  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const records = [];
  const groups = new Map();
  let selectedRecord = null;
  let selectedGroup = null;
  let activeYear = 'all';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const trackYear = (properties) => {
    const candidate = String(properties.year || properties.start || properties.source || '');
    return candidate.match(/20\d{2}/)?.[0] || 'Undated';
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return String(value);
    return new Intl.DateTimeFormat(document.documentElement.lang || 'en', {
      day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'
    }).format(date);
  };

  const formatDateRange = (start, end) => {
    const first = formatDate(start);
    const last = formatDate(end);
    return last && last !== first ? `${first} – ${last}` : first;
  };

  const formatDistance = (distance) => Number.isFinite(distance)
    ? `${new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 1 }).format(distance)} nm`
    : '';

  const formatDuration = (hours) => {
    if (!Number.isFinite(hours) || hours < 0) return '';
    const minutes = Math.round(hours * 60);
    const wholeHours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return wholeHours ? `${wholeHours} h${remainder ? ` ${remainder} min` : ''}` : `${remainder} min`;
  };

  const visibleRecords = () => records.filter((record) => activeYear === 'all' || record.year === activeYear);

  const updateTotals = () => {
    const visible = visibleRecords();
    const distance = visible.reduce((total, record) => total + (Number(record.properties.distance_nm) || 0), 0);
    const countNode = atlas.querySelector('[data-atlas-track-count]');
    const distanceNode = atlas.querySelector('[data-atlas-distance]');
    if (countNode) countNode.textContent = String(visible.length);
    if (distanceNode) distanceNode.textContent = formatDistance(distance);
  };

  const fitLayers = (layers, maxZoom = 11) => {
    if (!layers.length) return;
    const bounds = L.featureGroup(layers).getBounds();
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30], maxZoom, animate: false });
  };

  const fitVisible = () => fitLayers(visibleRecords().map((record) => record.layer));

  const resetSelection = () => {
    selectedRecord = null;
    selectedGroup = null;
    records.forEach((record) => {
      record.layer.setStyle(inactiveStyle);
      record.details.removeFrom(map);
      record.item.classList.remove('active');
      record.button.setAttribute('aria-pressed', 'false');
    });
    groups.forEach((group) => {
      group.section.classList.remove('active');
      group.button.setAttribute('aria-pressed', 'false');
    });
  };

  const selectGroup = (group, fit = true) => {
    resetSelection();
    selectedGroup = group;
    group.section.classList.add('active');
    group.button.setAttribute('aria-pressed', 'true');
    const visible = group.records.filter((record) => activeYear === 'all' || record.year === activeYear);
    visible.forEach((record) => record.layer.setStyle(relatedStyle));
    if (fit) fitLayers(visible.map((record) => record.layer), 10);
  };

  const selectRecord = (record, fit = true) => {
    resetSelection();
    selectedRecord = record;
    selectedGroup = record.group;
    record.group.section.classList.add('active');
    record.group.records.forEach((candidate) => {
      if (activeYear === 'all' || candidate.year === activeYear) candidate.layer.setStyle(relatedStyle);
    });
    record.layer.setStyle(activeStyle);
    record.item.classList.add('active');
    record.button.setAttribute('aria-pressed', 'true');
    record.details.addTo(map);
    if (fit) fitLayers([record.layer], 12);
  };

  const geometryLines = (geometry) => {
    if (geometry?.type === 'LineString') return [geometry.coordinates || []];
    if (geometry?.type === 'MultiLineString') return geometry.coordinates || [];
    return [];
  };

  const buildDetails = (feature) => {
    const details = L.layerGroup();
    const lines = geometryLines(feature.geometry).filter((line) => line.length);
    if (!lines.length) return details;
    const first = lines[0][0];
    const lastLine = lines[lines.length - 1];
    const last = lastLine[lastLine.length - 1];
    [[first, 'Start', false], [last, 'Finish', true]].forEach(([position, label, filled]) => {
      L.circleMarker([position[1], position[0]], {
        radius: 6,
        color: activeStyle.color,
        weight: 2.5,
        fillColor: filled ? activeStyle.color : '#faf8f2',
        fillOpacity: 1
      }).bindTooltip(label, { direction: 'top' }).addTo(details);
    });
    (feature.properties?.day_marks || []).forEach((mark) => {
      if (!Array.isArray(mark.coordinates)) return;
      L.circleMarker([mark.coordinates[1], mark.coordinates[0]], {
        radius: 4,
        color: activeStyle.color,
        weight: 2,
        fillColor: '#faf8f2',
        fillOpacity: 1
      }).bindTooltip(formatDate(mark.time), { direction: 'top' }).addTo(details);
    });
    return details;
  };

  const applyYear = (year) => {
    activeYear = year;
    resetSelection();
    records.forEach((record) => {
      const visible = year === 'all' || record.year === year;
      if (visible && !map.hasLayer(record.layer)) record.layer.addTo(map);
      if (!visible && map.hasLayer(record.layer)) record.layer.removeFrom(map);
      record.item.hidden = !visible;
    });
    groups.forEach((group) => {
      group.section.hidden = !group.records.some((record) => year === 'all' || record.year === year);
    });
    atlas.querySelectorAll('[data-voyage-year]').forEach((button) => {
      button.classList.toggle('active', button.dataset.voyageYear === year);
      button.setAttribute('aria-pressed', String(button.dataset.voyageYear === year));
    });
    updateTotals();
    fitVisible();
  };

  const renderFilters = () => {
    const container = atlas.querySelector('[data-voyage-year-filters]');
    if (!container) return;
    const years = [...new Set(records.map((record) => record.year))]
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    [['all', 'All years'], ...years.map((year) => [year, year])].forEach(([value, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.voyageYear = value;
      button.setAttribute('aria-pressed', String(value === 'all'));
      button.classList.toggle('active', value === 'all');
      button.textContent = label;
      button.addEventListener('click', () => applyYear(value));
      container.append(button);
    });
  };

  const createRecord = (feature, index) => {
    const properties = feature.properties || {};
    const year = trackYear(properties);
    const groupId = properties.voyage_id || `${year}/other`;
    const layer = L.geoJSON(feature, { style: inactiveStyle }).addTo(map);
    const details = buildDetails(feature);
    const item = document.createElement('article');
    const button = document.createElement('button');
    const title = properties.name || `Voyage ${index + 1}`;
    const summary = [
      formatDateRange(properties.start, properties.end),
      formatDistance(Number(properties.distance_nm)),
      formatDuration(Number(properties.duration_hours))
    ].filter(Boolean).join(' · ');
    item.className = 'voyage-track-item';
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `<strong>${escapeHtml(title)}</strong><small>${escapeHtml(summary)}</small>`;
    item.append(button);
    const record = { properties, year, groupId, layer, details, item, button, title, summary, group: null };
    button.addEventListener('click', () => selectRecord(record));
    layer.on('click', () => selectRecord(record, false));
    layer.bindTooltip(`<strong>${escapeHtml(title)}</strong><br>${escapeHtml(summary)}`, { sticky: true });
    records.push(record);
  };

  const renderGroups = () => {
    const container = atlas.querySelector('[data-voyage-items]');
    if (!container) return;
    records.forEach((record) => {
      if (!groups.has(record.groupId)) {
        groups.set(record.groupId, {
          id: record.groupId,
          year: record.year,
          title: record.properties.voyage_title || record.groupId,
          records: []
        });
      }
      const group = groups.get(record.groupId);
      group.records.push(record);
      record.group = group;
    });

    [...groups.values()]
      .sort((a, b) => String(b.records[0]?.properties.start || b.id).localeCompare(String(a.records[0]?.properties.start || a.id)))
      .forEach((group) => {
        group.records.sort((a, b) => String(a.properties.start || a.properties.source).localeCompare(String(b.properties.start || b.properties.source)));
        const starts = group.records.map((record) => record.properties.start).filter(Boolean).sort();
        const ends = group.records.map((record) => record.properties.end).filter(Boolean).sort();
        const distance = group.records.reduce((total, record) => total + (Number(record.properties.distance_nm) || 0), 0);
        const section = document.createElement('section');
        const button = document.createElement('button');
        const list = document.createElement('div');
        section.className = 'voyage-group';
        button.className = 'voyage-group-button';
        button.type = 'button';
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `
          <span>${escapeHtml(group.year)} · ${group.records.length} <b>${group.records.length === 1 ? 'leg' : 'legs'}</b></span>
          <strong>${escapeHtml(group.title)}</strong>
          <small>${escapeHtml([formatDateRange(starts[0], ends[ends.length - 1]), formatDistance(distance)].filter(Boolean).join(' · '))}</small>`;
        list.className = 'voyage-group-legs';
        group.records.forEach((record) => list.append(record.item));
        section.append(button, list);
        container.append(section);
        group.section = section;
        group.button = button;
        button.addEventListener('click', () => selectGroup(group));
      });
  };

  const init = async () => {
    try {
      const response = await fetch('data/tracks.geojson', { cache: 'no-store' });
      if (!response.ok) throw new Error(`tracks.geojson: ${response.status}`);
      const data = await response.json();
      const features = (data.features || []).filter((feature) => ['LineString', 'MultiLineString'].includes(feature.geometry?.type));
      if (!features.length) return;
      features.forEach(createRecord);
      renderGroups();
      renderFilters();
      atlas.hidden = false;
      document.querySelector('[data-voyage-fallback]')?.setAttribute('hidden', '');
      updateTotals();
      window.setTimeout(() => {
        map.invalidateSize({ pan: false, animate: false });
        tiles.redraw();
        fitVisible();
      }, 80);
    } catch (error) {
      console.warn('Voyage atlas is unavailable:', error);
    }
  };

  atlas.querySelector('[data-map-zoom-in]')?.addEventListener('click', () => map.zoomIn());
  atlas.querySelector('[data-map-zoom-out]')?.addEventListener('click', () => map.zoomOut());
  atlas.querySelector('[data-map-reset]')?.addEventListener('click', () => {
    resetSelection();
    fitVisible();
  });
  init();
})();
