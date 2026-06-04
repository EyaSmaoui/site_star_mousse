import React from "react";

const Ico = ({ d, size = 16, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);

export default function SearchBar({ placeholder, value, onChange, minWidth = 220, onSubmit, isForm = false }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  const content = (
    <>
      <Ico d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" size={15} color="#9ca3af" />
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
          ×
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

