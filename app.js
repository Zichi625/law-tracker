async function loadLawData() {
  try {
    const response = await fetch('data/laws.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch data/laws.json: ${response.status}`);
    }
    const data = await response.json();
    if (!data || !Array.isArray(data.categories) || !Array.isArray(data.items)) {
      return { lastRefreshedAt: null, categories: [], items: [] };
    }
    return data;
  } catch (err) {
    return { lastRefreshedAt: null, categories: [], items: [] };
  }
}

function getCategoryById(categories, categoryId) {
  return categories.find(category => category.id === categoryId) || null;
}

function sortItemsByDateDesc(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function createSourceLinks(sources, prefixText = '參考來源：') {
  const wrapper = document.createElement('p');
  wrapper.className = 'item-sources';
  if (prefixText) {
    wrapper.appendChild(document.createTextNode(prefixText));
  }

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

function createQALabel(iconType, iconChar, text) {
  const label = document.createElement('div');
  label.className = 'qa-label';
  const iconEl = document.createElement('span');
  iconEl.className = `qa-icon qa-icon--${iconType}`;
  iconEl.textContent = iconChar;
  iconEl.setAttribute('aria-hidden', 'true');
  label.appendChild(iconEl);
  label.appendChild(document.createTextNode(text));
  return label;
}

function createQABlock(qa) {
  const block = document.createElement('div');
  block.className = 'qa-block';

  block.appendChild(createQALabel('question', '?', '問題'));

  const question = document.createElement('p');
  question.className = 'qa-question';
  question.textContent = qa.q;
  block.appendChild(question);

  block.appendChild(createQALabel('answer', '✓', '答案'));

  const answer = document.createElement('p');
  answer.className = 'qa-answer';
  answer.textContent = qa.a;
  block.appendChild(answer);

  const lawBlock = document.createElement('div');
  lawBlock.className = 'qa-law-block';
  lawBlock.appendChild(createQALabel('law', '§', '相關法規'));
  const law = document.createElement('p');
  law.className = 'qa-law-text';
  law.textContent = qa.law;
  lawBlock.appendChild(law);
  block.appendChild(lawBlock);

  block.appendChild(createQALabel('source', '↗', '官方來源'));
  block.appendChild(createSourceLinks(qa.sources, ''));

  if (qa.courtOpinion) {
    const courtBlock = document.createElement('div');
    courtBlock.className = 'qa-court-block';
    courtBlock.appendChild(createQALabel('court', '⚖', '法院見解'));
    const court = document.createElement('p');
    court.className = 'qa-court-text';
    court.textContent = qa.courtOpinion;
    courtBlock.appendChild(court);
    block.appendChild(courtBlock);
  }

  return block;
}

function renderScenarioPage(data) {
  const params = new URLSearchParams(window.location.search);
  const scenarioId = params.get('id');
  const scenario = (data.scenarios || []).find(s => s.id === scenarioId);

  renderNavMenu(data.categories, null);

  if (!scenario) {
    document.getElementById('scenario-title').textContent = '找不到這個情境';
    document.getElementById('scenario-notfound').hidden = false;
    return;
  }

  document.getElementById('scenario-title').textContent = scenario.question;

  const container = document.getElementById('scenario-body');
  container.innerHTML = '';
  scenario.qa.forEach(qa => container.appendChild(createQABlock(qa)));

  const category = getCategoryById(data.categories, scenario.categoryId);
  const link = document.createElement('a');
  link.className = 'scenario-full-list-link';
  link.href = `category.html?cat=${encodeURIComponent(scenario.categoryId)}`;
  link.textContent = category ? `查看『${category.name}』完整消息列表 →` : '查看完整消息列表 →';
  container.appendChild(link);
}

const STATUS_LABELS = {
  effective: '● 已生效',
  announced: '◷ 已公告未生效',
  draft: '△ 草案研議中',
  expired: '✕ 已失效／已廢止'
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

  if (item.announcedAt || item.effectiveAt) {
    const dateDetail = document.createElement('div');
    dateDetail.className = 'item-date-detail';

    if (item.announcedAt) {
      const announced = document.createElement('p');
      announced.textContent = `公布：${item.announcedAt}`;
      dateDetail.appendChild(announced);
    }

    if (item.effectiveAt) {
      const effective = document.createElement('p');
      effective.textContent = `施行：${item.effectiveAt}`;
      dateDetail.appendChild(effective);
    }

    const verified = document.createElement('p');
    verified.textContent = `本站查核：${item.addedAt}`;
    dateDetail.appendChild(verified);

    card.appendChild(dateDetail);
  }

  const summary = document.createElement('p');
  summary.className = 'item-summary';
  summary.textContent = item.summary;
  card.appendChild(summary);

  const employerBlock = document.createElement('div');
  employerBlock.className = 'notes-block notes-block--employer';
  const employerTag = document.createElement('span');
  employerTag.className = 'notes-tag';
  employerTag.textContent = '雇主注意';
  const employerText = document.createElement('p');
  employerText.className = 'notes-text';
  employerText.textContent = item.employerNotes;
  employerBlock.appendChild(employerTag);
  employerBlock.appendChild(employerText);
  card.appendChild(employerBlock);

  if (item.employeeNotes) {
    const employeeBlock = document.createElement('div');
    employeeBlock.className = 'notes-block notes-block--employee';
    const employeeTag = document.createElement('span');
    employeeTag.className = 'notes-tag';
    employeeTag.textContent = '勞工注意';
    const employeeText = document.createElement('p');
    employeeText.className = 'notes-text';
    employeeText.textContent = item.employeeNotes;
    employeeBlock.appendChild(employeeTag);
    employeeBlock.appendChild(employeeText);
    card.appendChild(employeeBlock);
  }

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

const CATEGORY_GROUP_ORDER = ['假別／請假', '薪資與給付', '健保與保費', '反霸凌與性平', '移工與求職者', '勞保與勞退', '工時與職災', '就業平等與解僱'];
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

const LATEST_PAGE_SIZE = 6;

function renderPaginationControls(container, totalItems, currentPage, onPageChange) {
  container.innerHTML = '';
  const totalPages = Math.ceil(totalItems / LATEST_PAGE_SIZE);
  if (totalPages <= 1) return;

  for (let page = 1; page <= totalPages; page++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-button';
    if (page === currentPage) {
      button.classList.add('active');
    }
    button.textContent = String(page);
    button.addEventListener('click', () => onPageChange(page));
    container.appendChild(button);
  }
}

function renderScenarioNav(scenarios) {
  const container = document.getElementById('scenario-nav');
  if (!container) return;
  container.innerHTML = '';

  (scenarios || []).forEach(scenario => {
    const link = document.createElement('a');
    link.className = 'scenario-link';
    link.href = `scenario.html?id=${encodeURIComponent(scenario.id)}`;
    link.textContent = scenario.question;
    container.appendChild(link);
  });
}

function renderOverviewPage(data) {
  renderNavMenu(data.categories, null);
  renderScenarioNav(data.scenarios);

  document.getElementById('last-refreshed').textContent = formatLastRefreshed(data.lastRefreshedAt);

  const sortedItems = sortItemsByDateDesc(data.items);
  const container = document.getElementById('latest-body');
  const emptyMessage = document.getElementById('latest-empty-message');
  const paginationContainer = document.getElementById('latest-pagination');
  const searchInput = document.getElementById('search-input');
  let currentPage = 1;

  function renderList(keyword) {
    container.innerHTML = '';
    const filtered = sortedItems.filter(item =>
      itemMatchesKeyword(item, getCategoryById(data.categories, item.categoryId), keyword)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / LATEST_PAGE_SIZE));
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    const pageItems = filtered.slice((currentPage - 1) * LATEST_PAGE_SIZE, currentPage * LATEST_PAGE_SIZE);

    pageItems.forEach(item => {
      const category = getCategoryById(data.categories, item.categoryId);
      container.appendChild(createItemCard(item, category));
    });

    if (paginationContainer) {
      renderPaginationControls(paginationContainer, filtered.length, currentPage, page => {
        currentPage = page;
        renderList(keyword);
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

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
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      renderList(searchInput.value.trim());
    });
  }
}

function renderCategoryPage(data) {
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

async function init() {
  const page = document.body.dataset.page;
  const data = await loadLawData();
  if (page === 'overview') {
    renderOverviewPage(data);
  } else if (page === 'category') {
    renderCategoryPage(data);
  } else if (page === 'scenario') {
    renderScenarioPage(data);
  }
}

document.addEventListener('DOMContentLoaded', init);
