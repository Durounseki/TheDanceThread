import { Link } from "react-router-dom";
import { useState } from "react";

const SearchEvent = ({ setFeaturedEventId, setEventIds }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [danceStyle, setDanceStyle] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleInput = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append("country", searchQuery);
    if (danceStyle) queryParams.append("style", danceStyle);
    if (dateQuery) queryParams.append("date", dateQuery);
    const queryString = queryParams.toString();
    const url = `${apiUrl}/events?${queryString ? `${queryString}` : ""}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEventIds(data.map((event) => event.id));

      if (data.length > 0) {
        setFeaturedEventId(data[0].id);
      } else {
        setFeaturedEventId(null);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
  };

  return (
    <search>
      <form onSubmit={handleSubmit} className="search-container">
        <div className="searchbar">
          <div className="search" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            name="country-search"
            id="country-search"
            placeholder="Search by country"
            value={searchQuery}
            onChange={handleInput}
          />
          <button
            type="reset"
            className={"clear-search" + `${searchQuery !== "" ? " show" : ""}`}
            onClick={handleReset}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <Link to="/events/create" className="create-button">
          <i className="fa-solid fa-plus"></i>
        </Link>
        <div className="filter-container">
          <p>Filter by</p>
          <div className="search-filter">
            <select
              name="style-search"
              id="style-search"
              value={danceStyle}
              onChange={(e) => setDanceStyle(e.target.value)}
            >
              <option value="">Style</option>
              <option value="salsa">Salsa</option>
              <option value="bachata">Bachata</option>
              <option value="kizomba">Kizomba</option>
              <option value="zouk">Zouk</option>
              <option value="other">Other</option>
            </select>
            <div className="date-filter">
              <label htmlFor="date-search">Date:</label>
              <input
                type="month"
                id="date-search"
                name="date-search"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
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
