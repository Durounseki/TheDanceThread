import { Link } from "react-router-dom";

const SearchEvent = () => {
  return (
    <search>
      <form action="/events/search" method="POST" className="search-container">
        <div className="searchbar">
          <div className="search" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            name="country-search"
            id="country-search"
            placeholder="Search by country"
          />
          <button type="reset" className="clear-search">
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <Link href="/events/create" className="create-button">
          <i className="fa-solid fa-plus"></i>
        </Link>
        <div className="filter-container">
          <p>Filter by</p>
          <div className="search-filter">
            <select
              name="style-search"
              id="style-search"
              data-style-value="<%= selectValue %>"
            >
              <option value="" selected>
                Style
              </option>
              <option value="salsa">Salsa</option>
              <option value="bachata">Bachata</option>
              <option value="kizomba">Kizomba</option>
              <option value="zouk">Zouk</option>
              <option value="other">Other</option>
            </select>
            <div className="date-filter">
              <label htmlFor="date">Date:</label>
              <input
                type="month"
                id="date-search"
                name="date-search"
                value="<%= dateValue %>"
              />
            </div>
            <button type="submit" className="submit-search">
              Filter
            </button>
          </div>
        </div>
      </form>
    </search>
  );
};

export default SearchEvent;
