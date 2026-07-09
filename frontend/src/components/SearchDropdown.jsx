import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const SearchDropdown = ({ onClose, onSelectCategory }) => {
  const categories = [
    'Action','Animation','Comedy','Crime','Documentary','Drama','Horror','Romance','Sci-Fi','Thriller','Western'
  ];

  return (
    <div className="search-dropdown" onMouseLeave={onClose}>
      <div className="search-dropdown-panel">
        <div className="search-dropdown-column">
          <h4>Explore</h4>
          <Link to="/Home" onClick={onClose}>Movies & TV Shows</Link>
          <Link to="/Home" onClick={onClose}>Most Popular</Link>
          <Link to="/local" onClick={onClose}>Local Movies</Link>
        </div>

        <div className="search-dropdown-column">
          <h4>Categories</h4>
          <div className="categories-grid">
            {categories.map((c) => (
              <button key={c} className="dropdown-category-btn" onClick={() => { onSelectCategory && onSelectCategory(c); onClose(); }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="search-dropdown-column">
          <h4>Learn More</h4>
          <Link to="/collections" onClick={onClose}>Free Movies & TV Shows</Link>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
