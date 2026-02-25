import { manufacturersData, guides } from './data.js';

const itemsPerPage = 11;
let currentPage = 1;

function renderManufacturers(filters = {}, page = 1) {
  const container = document.getElementById('manufacturers-container');
  container.innerHTML = '';

  let filteredManufacturers = [];
  
  Object.entries(manufacturersData).forEach(([category, manufacturers]) => {
    manufacturers.forEach(manufacturer => {
      if (matchesFilters(manufacturer, category, filters)) {
        filteredManufacturers.push({ ...manufacturer, category });
      }
    });
  });

  if (filters.sortBy) {
    filteredManufacturers.sort((a, b) => {
      const valueA = a[filters.sortBy] || '';
      const valueB = b[filters.sortBy] || '';
      return valueA.localeCompare(valueB);
    });
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedManufacturers = filteredManufacturers.slice(startIndex, endIndex);

  paginatedManufacturers.forEach(manufacturer => {
    const card = createManufacturerCard(manufacturer);
    container.appendChild(card);
  });

  renderPagination(filteredManufacturers.length, page);
}

function renderPagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById('pagination-container');
  paginationContainer.innerHTML = '';

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Previous';
  prevBtn.classList.add('pagination-btn');
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      const activeFilters = getActiveFilters();
      renderManufacturers(activeFilters, newPage);
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page Number Buttons with Smart Display
  const pageList = document.createElement('div');
  pageList.classList.add('pagination-page-list');

  // Complex pagination logic
  const range = 2; // Number of pages to show on each side of current page
  const pageNumbers = [];

  // Always include first page
  if (currentPage > range + 1) {
    const firstPageBtn = createPageButton(1, currentPage);
    pageList.appendChild(firstPageBtn);
    
    if (currentPage > range + 2) {
      const ellipsis1 = document.createElement('span');
      ellipsis1.textContent = '...';
      ellipsis1.classList.add('pagination-ellipsis');
      pageList.appendChild(ellipsis1);
    }
  }

  // Calculate start and end pages
  const startPage = Math.max(1, currentPage - range);
  const endPage = Math.min(totalPages, currentPage + range);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createPageButton(i, currentPage);
    pageList.appendChild(pageBtn);
  }

  // Always include last page
  if (currentPage < totalPages - range) {
    if (currentPage < totalPages - range - 1) {
      const ellipsis2 = document.createElement('span');
      ellipsis2.textContent = '...';
      ellipsis2.classList.add('pagination-ellipsis');
      pageList.appendChild(ellipsis2);
    }

    const lastPageBtn = createPageButton(totalPages, currentPage);
    pageList.appendChild(lastPageBtn);
  }

  paginationContainer.appendChild(pageList);

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.classList.add('pagination-btn');
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      const activeFilters = getActiveFilters();
      renderManufacturers(activeFilters, newPage);
    }
  });
  paginationContainer.appendChild(nextBtn);

  // Page Number Input
  const pageInputContainer = document.createElement('div');
  pageInputContainer.classList.add('page-input-container');
  
  const pageLabel = document.createElement('label');
  pageLabel.textContent = 'Go to page:';
  
  const pageInput = document.createElement('input');
  pageInput.type = 'number';
  pageInput.min = 1;
  pageInput.max = totalPages;
  pageInput.value = currentPage;
  pageInput.classList.add('page-input');
  
  const goToPageBtn = document.createElement('button');
  goToPageBtn.textContent = 'Go';
  goToPageBtn.classList.add('pagination-btn');
  
  goToPageBtn.addEventListener('click', () => {
    let inputPage = parseInt(pageInput.value, 10);
    if (inputPage >= 1 && inputPage <= totalPages) {
      const activeFilters = getActiveFilters();
      renderManufacturers(activeFilters, inputPage);
    } else {
      alert(`Please enter a page number between 1 and ${totalPages}`);
    }
  });
  
  pageInputContainer.appendChild(pageLabel);
  pageInputContainer.appendChild(pageInput);
  pageInputContainer.appendChild(goToPageBtn);
  
  paginationContainer.appendChild(pageInputContainer);

  // Results Counter
  const resultsCounter = document.getElementById('results-counter');
  if (resultsCounter) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    resultsCounter.textContent = `Showing ${startItem}-${endItem} of ${totalItems} results (Page ${currentPage} of ${totalPages})`;
  }
}

function createPageButton(pageNumber, currentPage) {
  const pageBtn = document.createElement('button');
  pageBtn.textContent = pageNumber;
  pageBtn.classList.add('pagination-btn');
  
  if (pageNumber === currentPage) {
    pageBtn.classList.add('active');
  }
  
  pageBtn.addEventListener('click', () => {
    const activeFilters = getActiveFilters();
    renderManufacturers(activeFilters, pageNumber);
  });
  
  return pageBtn;
}

function getActiveFilters() {
  const activeFilters = {
    letter: document.querySelector('.alphabet-filter-btn.active')?.dataset.letter || null,
    category: document.getElementById('category-filter').value,
    country: document.getElementById('country-filter').value,
    employeeScale: document.getElementById('employee-scale-filter').value,
    serviceScope: document.getElementById('service-scope-filter').value,
    sortBy: document.getElementById('sort-by-filter').value,
    search: document.getElementById('search-input').value
  };
  return activeFilters;
}

function matchesFilters(manufacturer, category, filters) {
  const name = manufacturer["Manufacturer Name"].toLowerCase();
  const country = manufacturer["Country/Region"];
  const employeeScale = manufacturer["Employee Scale"];
  const serviceScope = manufacturer["Service Scope"];
  
  if (filters.letter && name.charAt(0).toLowerCase() !== filters.letter.toLowerCase()) {
    return false;
  }
  
  if (filters.category && filters.category !== 'all' && category !== filters.category) {
    return false;
  }
  
  if (filters.country && filters.country !== 'all' && country !== filters.country) {
    return false;
  }

  if (filters.employeeScale && filters.employeeScale !== 'all' && employeeScale !== filters.employeeScale) {
    return false;
  }

  if (filters.serviceScope && filters.serviceScope !== 'all' && serviceScope !== filters.serviceScope) {
    return false;
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    const searchFields = [
      manufacturer["Manufacturer Name"],
      manufacturer["Country/Region"],
      manufacturer["Product Features"],
      manufacturer["Technical Advantages"]
    ];
    return searchFields.some(field => field.toLowerCase().includes(searchTerm));
  }
  
  return true;
}

function createManufacturerCard(manufacturer) {
  const card = document.createElement('div');
  card.classList.add('manufacturer-card');
  
  const website = manufacturer["Company Website"] !== "-" 
    ? `<a href="${manufacturer["Company Website"]}" class="website-link" target="_blank">Visit Website</a>`
    : '';

  const marketShare = manufacturer["Market Share"] !== "-"
    ? `<div class="stat-box"><strong>Market Share:</strong> ${manufacturer["Market Share"]}</div>`
    : '';

  card.innerHTML = `
    <h3 class="manufacturer-name">${manufacturer["Manufacturer Name"]}</h3>
    <div class="manufacturer-details">
      <p><strong>Category:</strong> ${manufacturer.category}</p>
      <p><strong>Country/Region:</strong> ${manufacturer["Country/Region"]}</p>
      <p><strong>Product Features:</strong> ${manufacturer["Product Features"]}</p>
      <p><strong>Technical Advantages:</strong> ${manufacturer["Technical Advantages"]}</p>
      <p><strong>Service Scope:</strong> ${manufacturer["Service Scope"]}</p>
      <p><strong>Customer Reviews:</strong> ${manufacturer["Customer Reviews"]}</p>
      ${marketShare}
      <p><strong>Employee Scale:</strong> ${manufacturer["Employee Scale"]}</p>
      <p><strong>Annual Sales:</strong> ${manufacturer["Annual Sales"]}</p>
      <p><strong>Patent Quantity:</strong> ${manufacturer["Patent Quantity"]}</p>
      ${website}
    </div>
  `;
  
  return card;
}

function setupFilters() {
  const alphabetFilter = document.getElementById('alphabet-filter');
  const countryFilter = document.getElementById('country-filter');
  const employeeScaleFilter = document.getElementById('employee-scale-filter');
  const serviceScopeFilter = document.getElementById('service-scope-filter');
  const sortByFilter = document.getElementById('sort-by-filter');
  const searchInput = document.getElementById('search-input');
  
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach(letter => {
    const button = document.createElement('button');
    button.classList.add('alphabet-filter-btn');
    button.textContent = letter;
    button.dataset.letter = letter;
    alphabetFilter.appendChild(button);
  });
  
  const countries = new Set();
  const employeeScales = new Set();
  const serviceScopes = new Set();
  
  Object.values(manufacturersData).forEach(manufacturers => {
    manufacturers.forEach(m => {
      countries.add(m["Country/Region"]);
      employeeScales.add(m["Employee Scale"]);
      serviceScopes.add(m["Service Scope"]);
    });
  });
  
  [
    { filter: countryFilter, values: countries },
    { filter: employeeScaleFilter, values: employeeScales },
    { filter: serviceScopeFilter, values: serviceScopes }
  ].forEach(({ filter, values }) => {
    Array.from(values).sort().forEach(value => {
      if (value !== '-') {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        filter.appendChild(option);
      }
    });
  });
  
  const filters = {
    letter: null,
    category: 'all',
    country: 'all',
    employeeScale: 'all',
    serviceScope: 'all',
    sortBy: null,
    search: ''
  };
  
  alphabetFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('alphabet-filter-btn')) {
      alphabetFilter.querySelectorAll('.alphabet-filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      if (filters.letter === e.target.dataset.letter) {
        filters.letter = null;
      } else {
        e.target.classList.add('active');
        filters.letter = e.target.dataset.letter;
      }
      
      renderManufacturers(filters);
    }
  });
  
  document.getElementById('category-filter').addEventListener('change', (e) => {
    filters.category = e.target.value;
    renderManufacturers(filters);
  });
  
  countryFilter.addEventListener('change', (e) => {
    filters.country = e.target.value;
    renderManufacturers(filters);
  });

  employeeScaleFilter.addEventListener('change', (e) => {
    filters.employeeScale = e.target.value;
    renderManufacturers(filters);
  });

  serviceScopeFilter.addEventListener('change', (e) => {
    filters.serviceScope = e.target.value;
    renderManufacturers(filters);
  });

  sortByFilter.addEventListener('change', (e) => {
    filters.sortBy = e.target.value;
    renderManufacturers(filters);
  });

  searchInput.addEventListener('input', (e) => {
    filters.search = e.target.value;
    renderManufacturers(filters);
  });
}

function renderGuides() {
  document.getElementById('ct-scanner-guide-content').innerHTML = guides.general;
  document.getElementById('ct-scanner-5w1h-content').innerHTML = guides.analysis;
}

function init() {
  setupFilters();
  renderManufacturers();
  renderGuides();
}

document.addEventListener('DOMContentLoaded', init);