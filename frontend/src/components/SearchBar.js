import React from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ placeholder, value, onChange, minWidth: _minWidth, onSubmit, isForm = false }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  const content = (
    <>
      <Search size={16} color="#9ca3af" aria-hidden="true" />
      <input
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        type="search"
      />
      {value && (
        <button 
          onClick={handleClear}
          style={styles.clearBtn}
          aria-label="Effacer la recherche"
          type="button"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </>
  );

  if (isForm) {
    return (
      <form style={styles.searchWrap} onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}>
        {content}
      </form>
    );
  }

  return (
    <div style={styles.searchWrap} className="search-bar-wrapper">
      {content}
    </div>
  );
}

const styles = {
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "9px 14px",
    flex: 1,
    minWidth: 220,
    fontFamily: "inherit",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 13,
    color: "#1f2937",
    flex: 1,
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    fontSize: 16,
    padding: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
