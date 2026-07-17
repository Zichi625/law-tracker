function getLawData() {
  const data = window.LAW_TRACKER_DATA;
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.items)) {
    return { lastRefreshedAt: null, categories: [], items: [] };
  }
  return data;
}

function getCategoryById(categories, categoryId) {
  return categories.find(category => category.id === categoryId) || null;
}

function sortItemsByDateDesc(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function createSourceLinks(sources) {
  const wrapper = document.createElement('p');
  wrapper.className = 'item-sources';
  wrapper.appendChild(document.createTextNode('參考來源：'));

  sources.forEach((source, index) => {
    if (index > 0) {
      wrapper.appendChild(document.createTextNode('、'));
    }
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.label;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    wrapper.appendChild(link);
  });

  return wrapper;
}

const STATUS_LABELS = {
  effective: '已生效',
  announced: '已公告未生效',
  draft: '草案研議中',
  expired: '已失效／已廢止'
};

function createStatusBadge(status) {
  const label = STATUS_LABELS[status];
  if (!label) return null;
  const badge = document.createElement('span');
  badge.className = `status-badge status-badge--${status}`;
  badge.textContent = label;
  return badge;
}

function createItemCard(item, category) {
  const card = document.createElement('article');
  card.className = 'item-card';

  const titleRow = document.createElement('div');
  titleRow.className = 'item-title-row';

  const title = document.createElement('h3');
  title.className = 'item-title';
  title.textContent = item.title;
  titleRow.appendChild(title);

  const statusBadge = createStatusBadge(item.status);
  if (statusBadge) {
    titleRow.appendChild(statusBadge);
  }

  if (item.isNew) {
    const badge = document.createElement('span');
    badge.className = 'new-badge';
    badge.textContent = 'NEW';
    titleRow.appendChild(badge);
  }

  card.appendChild(titleRow);

  const meta = document.createElement('p');
  meta.className = 'item-meta';
  meta.textContent = category ? `${category.name}｜${item.date}` : item.date;
  card.appendChild(meta);

  const summary = document.createElement('p');
  summary.className = 'item-summary';
  summary.textContent = item.summary;
  card.appendChild(summary);

  const employerNotes = document.createElement('p');
  employerNotes.className = 'item-employer-notes';
  employerNotes.textContent = `雇主要注意：${item.employerNotes}`;
  card.appendChild(employerNotes);

  if (item.appliesTo) {
    const appliesTo = document.createElement('p');
    appliesTo.className = 'item-applies-to';
    appliesTo.textContent = `適用對象：${item.appliesTo}`;
    card.appendChild(appliesTo);
  }

  if (item.penalty) {
    const penalty = document.createElement('p');
    penalty.className = 'item-penalty';
    penalty.textContent = `罰則：${item.penalty}`;
    card.appendChild(penalty);
  }

  card.appendChild(createSourceLinks(item.sources));

  return card;
}

const CATEGORY_GROUP_ORDER = ['假別／請假', '薪資與給付', '健保與保費', '反霸凌與性平', '移工與求職者'];
const FALLBACK_GROUP_NAME = '其他';

function groupCategories(categories) {
  const groups = new Map();
  categories.forEach(category => {
    const groupName = category.group || FALLBACK_GROUP_NAME;
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName).push(category);
  });

  const orderedNames = [
    ...CATEGORY_GROUP_ORDER.filter(name => groups.has(name)),
    ...[...groups.keys()].filter(name => !CATEGORY_GROUP_ORDER.includes(name))
  ];

  return orderedNames.map(name => ({ name, categories: groups.get(name) }));
}

function renderNavMenu(categories, activeCategoryId) {
  const nav = document.getElementById('category-nav');
  if (!nav) return;
  nav.innerHTML = '';

  groupCategories(categories).forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'nav-group';

    const title = document.createElement('span');
    title.className = 'nav-group-title';
    title.textContent = group.name;
    groupEl.appendChild(title);

    const linksWrap = document.createElement('div');
    linksWrap.className = 'nav-group-links';

    group.categories.forEach(category => {
      const link = document.createElement('a');
      link.href = `category.html?cat=${encodeURIComponent(category.id)}`;
      link.textContent = category.name;
      link.className = 'category-nav-link';
      if (category.id === activeCategoryId) {
        link.classList.add('active');
      }
      linksWrap.appendChild(link);
    });

    groupEl.appendChild(linksWrap);
    nav.appendChild(groupEl);
  });
}

function formatLastRefreshed(dateStr) {
  return dateStr ? `最後更新：${dateStr}` : '尚未執行過刷新';
}

function itemMatchesKeyword(item, category, keyword) {
  if (!keyword) return true;
  const haystack = [item.title, item.summary, item.employerNotes, item.appliesTo, item.penalty, category && category.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(keyword.toLowerCase());
}

function renderOverviewPage() {
  const data = getLawData();
  renderNavMenu(data.categories, null);

  document.getElementById('last-refreshed').textContent = formatLastRefreshed(data.lastRefreshedAt);

  const sortedItems = sortItemsByDateDesc(data.items);
  const container = document.getElementById('latest-body');
  const emptyMessage = document.getElementById('latest-empty-message');
  const searchInput = document.getElementById('search-input');

  function renderList(keyword) {
    container.innerHTML = '';
    const filtered = sortedItems.filter(item =>
      itemMatchesKeyword(item, getCategoryById(data.categories, item.categoryId), keyword)
    );
    filtered.forEach(item => {
      const category = getCategoryById(data.categories, item.categoryId);
      container.appendChild(createItemCard(item, category));
    });

    if (sortedItems.length === 0) {
      emptyMessage.textContent = '尚未有資料，請先執行刷新';
      emptyMessage.hidden = false;
    } else if (filtered.length === 0) {
      emptyMessage.textContent = '沒有符合的搜尋結果，換個關鍵字試試';
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
    }
  }

  renderList('');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderList(searchInput.value.trim()));
  }
}

function renderCategoryPage() {
  const data = getLawData();
  const params = new URLSearchParams(window.location.search);
  const categoryId = params.get('cat');
  const category = getCategoryById(data.categories, categoryId);

  renderNavMenu(data.categories, categoryId);

  if (!category) {
    document.getElementById('category-title').textContent = '找不到這個分類';
    document.getElementById('category-notfound').hidden = false;
    return;
  }

  document.getElementById('category-title').textContent = category.name;

  const items = sortItemsByDateDesc(data.items.filter(item => item.categoryId === categoryId));
  const container = document.getElementById('category-body');
  const emptyMessage = document.getElementById('category-empty-message');
  const searchInput = document.getElementById('search-input');

  function renderList(keyword) {
    container.innerHTML = '';
    const filtered = items.filter(item => itemMatchesKeyword(item, category, keyword));
    filtered.forEach(item => container.appendChild(createItemCard(item, category)));

    if (items.length === 0) {
      emptyMessage.textContent = '這個分類尚未有資料';
      emptyMessage.hidden = false;
    } else if (filtered.length === 0) {
      emptyMessage.textContent = '沒有符合的搜尋結果，換個關鍵字試試';
      emptyMessage.hidden = false;
    } else {
      emptyMessage.hidden = true;
    }
  }

  renderList('');
  if (searchInput) {
    searchInput.addEventListener('input', () => renderList(searchInput.value.trim()));
  }
}

function init() {
  const page = document.body.dataset.page;
  if (page === 'overview') {
    renderOverviewPage();
  } else if (page === 'category') {
    renderCategoryPage();
  }
}

document.addEventListener('DOMContentLoaded', init);
