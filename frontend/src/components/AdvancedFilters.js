import React, { useState, useCallback } from 'react';

const AdvancedFilters = ({
  onFilterChange,
  searchPlaceholder = "Rechercher...",
  filters = [],
  onSort,
  sortOptions = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('');

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    onFilterChange?.({ search: value, ...activeFilters, sort: sortBy });
  }, [activeFilters, onFilterChange, sortBy]);

  const toggleFilter = useCallback((filterKey, value) => {
    setActiveFilters(prev => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      const newFilters = updated.length === 0
        ? { ...prev, [filterKey]: undefined }
        : { ...prev, [filterKey]: updated };
      delete newFilters[filterKey];
      if (updated.length > 0) {
        newFilters[filterKey] = updated;
      }
      onFilterChange?.({ search: searchTerm, ...newFilters, sort: sortBy });
      return newFilters;
    });
  }, [searchTerm, onFilterChange, sortBy]);

  const handleSort = useCallback((value) => {
    setSortBy(value);
    onSort?.(value);
    onFilterChange?.({ search: searchTerm, ...activeFilters, sort: value });
  }, [searchTerm, activeFilters, onFilterChange, onSort]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setActiveFilters({});
    setSortBy('');
    onFilterChange?.({ search: '', sort: '' });
  }, [onFilterChange]);

  const activeFilterCount = Object.values(activeFilters).flat().length;
  const hasActiveFilters = searchTerm || activeFilterCount > 0 || sortBy;

  // Icônes SVG
  const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );

  const SortIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );

  const ClearIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const getFilterIcon = (filterType) => {
    switch(filterType) {
      case 'checkbox':
        return '☑️';
      case 'date':
        return '📅';
      case 'select':
        return '🎯';
      default:
        return '🔍';
    }
  };

  return (
    <div style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <SearchIcon />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            style={styles.clearSearchButton}
            title="Effacer"
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...styles.filterButton,
          ...(hasActiveFilters && styles.filterButtonActive),
          ...(isOpen && styles.filterButtonOpen)
        }}
        title="Filtres avancés"
      >
        <FilterIcon />
        <span>Filtres</span>
        {activeFilterCount > 0 && (
          <span style={styles.badge}>{activeFilterCount}</span>
        )}
      </button>

      {/* Sort Dropdown */}
      {sortOptions.length > 0 && (
        <select
          value={sortBy}
          onChange={(e) => handleSort(e.target.value)}
          style={styles.sortSelect}
          title="Trier"
        >
          <option value="">📊 Trier...</option>
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* Filters Panel */}
      {isOpen && (
        <div style={styles.filterPanel}>
          <div style={styles.filterPanelHeader}>
            <h3 style={styles.filterTitle}>⚙️ Filtres avancés</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={styles.clearButton}>
                Réinitialiser
              </button>
            )}
          </div>

          <div style={styles.filterGrid}>
            {filters.map((filter) => (
              <div key={filter.key} style={styles.filterGroup}>
                <label style={styles.filterLabel}>
                  <span>{getFilterIcon(filter.type)}</span>
                  {filter.label}
                </label>
                {filter.type === 'checkbox' && (
                  <div style={styles.checkboxGroup}>
                    {filter.options.map(option => (
                      <label key={option} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option) || false}
                          onChange={() => toggleFilter(filter.key, option)}
                          style={styles.checkbox}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {filter.type === 'date' && (
                  <div style={styles.dateGroup}>
                    <input
                      type="date"
                      onChange={(e) => toggleFilter(filter.key, e.target.value)}
                      style={styles.dateInput}
                    />
                  </div>
                )}
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key]?.[0] || ''}
                    onChange={(e) => toggleFilter(filter.key, e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="">Tous</option>
                    {filter.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
    padding: '16px',
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    position: 'relative',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: '250px',
    position: 'relative',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    paddingLeft: '10px',
    transition: 'all 0.2s ease',
    color: '#6b7280',
  },
  searchIcon: {
    width: '18px',
    height: '18px',
    color: '#9ca3af',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '10px 8px',
    fontSize: '14px',
    background: 'transparent',
    fontFamily: 'inherit',
    color: '#1f2937',
  },
  clearSearchButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    fontSize: '16px',
    padding: '4px 8px',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    borderColor: '#3b82f6',
    color: '#3b82f6',
    background: '#eff6ff',
  },
  filterButtonOpen: {
    borderColor: '#3b82f6',
    color: '#3b82f6',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#3b82f6',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '700',
  },
  sortSelect: {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#6b7280',
    fontWeight: '500',
  },
  filterPanel: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: '0',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '20px',
    width: '420px',
    zIndex: 1000,
    animation: 'slideDown 0.2s ease',
  },
  filterPanelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  filterTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  clearButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ef4444',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#4b5563',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  dateInput: {
    padding: '8px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'inherit',
    background: '#f9fafb',
  },
  dateGroup: {
    display: 'flex',
    gap: '8px',
  },
  filterSelect: {
    padding: '8px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '13px',
    background: '#f9fafb',
    cursor: 'pointer',
    color: '#4b5563',
  },
};

export default AdvancedFilters;
