import React, { useState, useEffect } from "react";
import { Graph } from "../graph/graph";
import "./carts.css";

const Country = ({ country: { name, flags, population, languages, capital, currencies } }) => {
  const cure = currencies ? Object.values(currencies)[0].name : "No currencys";
  console.log(cure);
  return (
    <div className="country">
      <div className="country_flag">
        <img src={flags.png} alt={name.common} />
      </div>
      <h3 className="country_name">{name.common}</h3>
      <h3 className="country_capital">
        <span>Capital:</span> {capital}
      </h3>
      <h3 className="country_languajes">
        <span>Languages:</span> {languages ? Object.values(languages).join(", ") : "No languages"}
      </h3>
      <h3 className="country_population">
        <span>Population: </span>
        {population}
      </h3>
      <h3 className="country_currency">
        <span>Currency:</span> {currencies ? Object.values(currencies)[0].name : "No currencys"}
      </h3>
    </div>
  );
};

const Bar = ({ country: { name, population, languages }, displayType }) => {
  const maxPopulation = 1402112000; // Población más alta
  const maxLanguajesLength = 50;
  const barWidth =
    ((displayType === "population" ? population : languages.length) /
      (displayType === "population" ? maxPopulation : maxLanguajesLength)) *
    100; // Ancho del bar en porcentaje

  return (
    <div className="Bars">
      <div>{name.common}</div>
      <div
        className="Bar"
        style={{ borderRadius: "2px", height: "25px", width: `${barWidth}%`, background: "#ffa500" }}
      ></div>
      <div>{displayType === "population" ? population : Object.keys(languages).length}</div>
    </div>
  );
};

export const Carts = (props) => {
  // setting initial state and method to update state
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("population");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter the data based on the search term
    const filteredCountries = data.filter(
      (country) => country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) //searchTerm insert by USER
    );
    setFilteredData(filteredCountries);
  }, [data, searchTerm]); // filteredData se actualiza cada vez que cambia el estado searchTerm, usando un gancho useEffect

  const fetchData = async () => {
    const url = "https://restcountries.com/v3.1/all";
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  //actualiza el estado searchTerm, lo que desencadena una nueva representación del componente.
  // el estado filteredData, que se deriva del estado searchTerm, se actualiza con los países filtrados
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (sortBy) => {
    setSortBy(sortBy);
  };

  const getSortedData = () => {
    return data
      .sort((a, b) => {
        if (sortBy === "population") {
          return b.population - a.population;
        } else if (sortBy === "languages") {
          const aLanguagesLength = a.languages ? Object.keys(a.languages).length : 0;
          const bLanguagesLength = b.languages ? Object.keys(b.languages).length : 0;
          return bLanguagesLength - aLanguagesLength;
        }
        return 0;
      })
      .slice(0, 10);
  };

  return (
    <div className="Carts">
      <div className="header">
        <h1>Fetching Data Using Hook</h1>
        <h1>Calling API Countries</h1>
        <p>There are {data.length} countries that satisfy the search criteria</p>
        {searchTerm !== "" && (
          <p className="textCountCountryFinds">{filteredData.length} countries satisfied the search criteria</p>
        )}
        <input
          className="inputSearch"
          type="text"
          placeholder="Search countries by name, city and languages"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <a href="#stat">
        <Graph />
      </a>
      <div className="countries-wrapper">
        {filteredData.map((country, index) => (
          <Country key={index} country={country} />
        ))}
      </div>
      <div className="graph-wrapper">
        <div className="graph-buttons">
          <button className="population" onClick={() => handleSortChange("population")}>
            Population
          </button>
          <button className="languajes" onClick={() => handleSortChange("languages")}>
            Languages
          </button>
        </div>
        <h4 className="graph-title">
          10 Most {sortBy === "population" ? "populated" : "linguistic"} countries in the world
        </h4>
        <div className="graphs">
          <div className="graph-wrapper" id="stat">
            <div className="graphWrapper">
              {getSortedData().map((country, index) => (
                <Bar key={index} country={country} displayType={sortBy} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
