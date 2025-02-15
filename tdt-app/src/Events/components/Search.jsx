import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CountrySearch from "./CountrySearch";
import StyleSearch from "./StyleSearch";

const SearchEvent = ({ setFeaturedEventId, setEventIds }) => {
  const [countryQuery, setCountryQuery] = useState("");
  const [styleQuery, setStyleQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setCountryQuery(searchParams.get("country") || "");
    setStyleQuery(searchParams.get("style") || "");
    setDateQuery(searchParams.get("date") || "");
  }, [searchParams]);

  const handleCountryInput = (option) => {
    setCountryQuery(option);
  };
  const handleStyleInput = (option) => {
    setStyleQuery(option);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const queryParams = new URLSearchParams();
    if (countryQuery) queryParams.append("country", countryQuery.name);
    if (styleQuery) queryParams.append("style", styleQuery);
    if (dateQuery) queryParams.append("date", dateQuery);
    const queryString = queryParams.toString();
    const url = `/events?${queryString ? `${queryString}` : ""}`;
    navigate(url);
  };

  const handleReset = () => {
    setCountryQuery("");
    setStyleQuery("");
    setDateQuery("");
    navigate("/events");
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryString = searchParams.toString();
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
    fetchData();
  }, [searchParams, apiUrl, setEventIds, setFeaturedEventId]);

  return (
    <search className="event-search">
      <form onSubmit={handleSubmit} className="search-container">
        <div className="searchbar">
          <div className="search" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <CountrySearch onSelect={handleCountryInput} />
          <button
            type="reset"
            className={"clear-search" + `${countryQuery !== "" ? " show" : ""}`}
            onClick={handleReset}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        </div>
        <div className="filter-container">
          <p>Filter by</p>
          <div className="search-filter">
            <StyleSearch onSelect={handleStyleInput} />
            <label htmlFor="date-search">Date:</label>
            <input
              type="month"
              id="date-search"
              name="date-search"
              className={dateQuery === "" ? "empty" : ""}
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
            />
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
