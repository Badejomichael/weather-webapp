import '../../App.css';
import { useState } from "react"
import { Link } from "react-router-dom";
import appLogo from "../../assets/weather-app-logo.jpg";
import searchIcon from "../../assets/search-icon.svg";

export const NavBar = ({ setSelectedCity }) => {
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = (e) => {
      if (searchInput.trim() === "") return;

      localStorage.setItem("lastCity", searchInput); // Save to localStorage
      setSelectedCity({ name: searchInput }); // Trigger city change
      setSearchInput(""); // Optional: Clear input
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }

  return (
    <div>
        <div class="nav-links-container">
          <div class="nav-link-1"><Link class={`nav-link`} aria-current="page" to="/"><img src={appLogo} class="nav-logo"/></Link></div>
          <div class="d-flex flex-sm-row w-100 gap-2 search-bar">
          <input
          type="text"
          class="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search city..."
        />
        <button class="btn btn-dark search-btn js-search-form-btn" type="button" onClick={handleSearch}><img src={searchIcon} class="search-icon"/></button>
      </div>
        </div>

    </div>
  );
}