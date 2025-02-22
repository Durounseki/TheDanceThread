import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CountrySearch from "./CountrySearch";
import StyleSearch from "./StyleSearch";
import { useEvents } from "../../eventQueries";
import DatePicker from "react-datepicker";
import "../../DatePicker.css";

const SearchEvent = () => {
  const [countryQuery, setCountryQuery] = useState("");
  const [styleQuery, setStyleQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { refetch } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    setCountryQuery(searchParams.get("country") || "");
    setStyleQuery(searchParams.get("style") || "");
    setDateQuery(searchParams.get("date") || null);
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
    if (countryQuery)
      queryParams.set(
        "country",
        countryQuery.name ? countryQuery.name : countryQuery
      );
    if (styleQuery) queryParams.set("style", styleQuery);
    if (dateQuery) queryParams.set("date", dateQuery);
    const queryString = queryParams.toString();
    const url = `/events?${queryString ? `${queryString}` : ""}`;
    navigate(url, { replace: true });
    refetch();
  };

  const handleReset = () => {
    setCountryQuery("");
    setStyleQuery("");
    setDateQuery("");
    navigate("/events");
  };

  return (
    <search className="event-search">
      <form onSubmit={handleSubmit} className="search-container">
        <div className="searchbar">
          <div className="search" aria-label="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <CountrySearch onSelect={handleCountryInput} />
        </div>
        <div className="filter-container">
          <p>Filter by</p>
          <div className="search-filter">
            <StyleSearch onSelect={handleStyleInput} />
            <label htmlFor="date-search">Date:</label>
            <div className="filter-datepicker-container">
              <DatePicker
                id="date-search"
                autoComplete="off"
                name="date-search"
                selected={dateQuery}
                onChange={(date) => setDateQuery(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showIcon
                icon="fa fa-calendar"
                toggleCalendarOnIconClick
                isClearable
                placeholderText="MM/YYYY"
              />
            </div>
            {/* <input
              type="month"
              id="date-search"
              name="date-search"
              className={dateQuery === "" ? "empty" : ""}
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
            /> */}
            <div className="search-buttons">
              <button
                type="reset"
                onClick={handleReset}
                className={
                  "clear-search" +
                  `${
                    countryQuery + styleQuery + dateQuery !== "" ? " show" : ""
                  }`
                }
              >
                Clear
              </button>
              <button type="submit" className="submit-search">
                Filter
              </button>
            </div>
          </div>
        </div>
      </form>
    </search>
  );
};

export default SearchEvent;
