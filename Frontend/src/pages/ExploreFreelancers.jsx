import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { updateFreelancersFilters } from "../context/freelancersFliterSlice";
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { filterFreelancers } from "../context/freelancersFliterSlice";
import FilterHeading from "../components/FilterHeading";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from "../components/ui/command";
import { MapPin, Star } from "lucide-react";
import Project from "../components/Project";
// import { freelancers } from "../dummydata";
import ReactPaginate from "react-paginate";
import UserCard from "../components/UserCard";

export default function ExploreProjects() {
  const dispatch = useDispatch();
  const freelancers = useSelector(
    (state) => state.freelancerFilters.freelancers
  );
  const freelancerFilters = useSelector(
    (state) => state.freelancerFilters.filters
  );
  const totalPages = useSelector((state) => state.freelancerFilters.totalPages);
  const allSkills = useSelector((state) => state.general.skills);
  const allCountries = useSelector((state) => state.general.countries);
  const allLanguages = useSelector((state) => state.general.languages);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");

  // Update the URL with filters only when they change
  const updateURL = useCallback(
    (filters) => {
      const newParams = new URLSearchParams();

      // Only add key-value pairs where the value is not null, undefined, or 0
      for (let [key, value] of Object.entries(filters)) {
        if (
          !(
            value === "" ||
            value === 0 ||
            (key === "budget" &&
              (value === "0-0" ||
                Number(value.split("-")[0]) > Number(value.split("-")[1])))
          )
        ) {
          newParams.set(key, value);
        }
      }

      // Avoid pushing the same URL again
      if (search !== `?${newParams.toString()}`) {
        navigate({ search: newParams.toString() });
      }
    },
    [search, navigate]
  );

  // Fetch freelancers when filter changes
  useEffect(() => {
    // Only update the URL and fetch freelancers when freelancerFilters actually changes
    // if (freelancerFilters.status.length > 0) {
    updateURL(freelancerFilters); // Update URL with filter values
    dispatch(filterFreelancers()); // Fetch freelancers
    // }
  }, [freelancerFilters, updateURL]); // Only update URL and fetch freelancers when freelancerFilters changes

  // Extract filters from URL only on initial render or URL change
  useEffect(() => {
    const filtersFromURL = {};
    queryParams.forEach((value, key) => {
      filtersFromURL[key] = value;
    });
    dispatch(updateFreelancersFilters(filtersFromURL));
  }, [search, dispatch]);

  useEffect(() => {
    console.log("filter skills: ", freelancerFilters.skills);
    function mergeSkills(arr1, arr2, key) {
      const map = new Map();

      [...arr1, ...arr2].forEach((obj) => {
        map.set(obj[key], obj);
      });

      return Array.from(map.values());
    }
    setSkills(
      mergeSkills(
        freelancerFilters.skills
          .split(",")
          .map((id) => allSkills?.find((obj) => obj.id === Number(id))) // Convert id to number
          .filter(Boolean), // Remove undefined values
        skills,
        "id"
      )
    );
  }, [freelancerFilters.skills]);

  const handleSkillsChange = (event) => {
    const prevSkills =
      freelancerFilters.skills.split(",").filter((s) => s !== "") || [];
    const updatedSkills = event.target.checked
      ? [...new Set([...prevSkills, String(event.target.value)])]
      : prevSkills.filter((v) => v !== String(event.target.value));
    console.log("updatedskills->", updatedSkills);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        skills: updatedSkills.length > 0 ? updatedSkills.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("skills-> ", freelancerFilters.skills);
  };

  const handleSkillsSelection = (skill) => {
    console.log("selected skill->", skill.name);
    const prevSkills = freelancerFilters.skills.split(",") || [];
    let updatedSkills = [];
    if (!prevSkills.includes(skill.id)) {
      updatedSkills = [...new Set([...prevSkills, skill.id])];
    } else {
      updatedSkills = prevSkills.filter((skl) => skl !== skill.id);
    }
    console.log("updatedskills->", updatedSkills);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        skills: updatedSkills.length > 0 ? updatedSkills.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("skills-> ", freelancerFilters.skills);
    setSearchSkill("");
  };

  useEffect(() => {
    console.log("filter countries: ", freelancerFilters.country);
    function mergeCountries(arr1, arr2, key) {
      const map = new Map();

      [...arr1, ...arr2].forEach((obj) => {
        map.set(obj[key], obj);
      });

      return Array.from(map.values());
    }
    setCountries(
      mergeCountries(
        freelancerFilters.country
          .split(",")
          .map((id) => allCountries?.find((obj) => obj.id === Number(id))) // Convert id to number
          .filter(Boolean), // Remove undefined values
        countries,
        "id"
      )
    );
  }, [freelancerFilters.country]);

  const handleCountryChange = (event) => {
    const prevCountries =
      freelancerFilters.country.split(",").filter((s) => s !== "") || [];
    const updatedCountries = event.target.checked
      ? [...new Set([...prevCountries, String(event.target.value)])]
      : prevCountries.filter((v) => v !== String(event.target.value));
    console.log("updated countries->", updatedCountries);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        country: updatedCountries.length > 0 ? updatedCountries.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("countries-> ", freelancerFilters.country);
  };

  const handleCountrySelection = (country) => {
    console.log("selected country->", country.name);
    const prevCountries = freelancerFilters.country.split(",") || [];
    let updatedCountries = [];
    if (!prevCountries.includes(country.id)) {
      updatedCountries = [...new Set([...prevCountries, country.id])];
    } else {
      updatedCountries = prevCountries.filter((cntry) => cntry !== country.id);
    }
    console.log("updated countries->", updatedCountries);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        country: updatedCountries.length > 0 ? updatedCountries.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("countries-> ", freelancerFilters.country);
    setSearchCountry("");
  };

  useEffect(() => {
    console.log("filter languages: ", freelancerFilters.languages);
    function mergeLanguages(arr1, arr2, key) {
      const map = new Map();

      [...arr1, ...arr2].forEach((obj) => {
        map.set(obj[key], obj);
      });

      return Array.from(map.values());
    }
    setLanguages(
      mergeLanguages(
        freelancerFilters.languages
          .split(",")
          .map((id) => allLanguages?.find((obj) => obj.id === Number(id))) // Convert id to number
          .filter(Boolean), // Remove undefined values
        languages,
        "id"
      )
    );
  }, [freelancerFilters.languages]);

  const handleLanguageChange = (event) => {
    const prevLanguages =
      freelancerFilters.languages.split(",").filter((s) => s !== "") || [];
    const updatedLanguages = event.target.checked
      ? [...new Set([...prevLanguages, String(event.target.value)])]
      : prevLanguages.filter((v) => v !== String(event.target.value));
    console.log("updated languages->", updatedLanguages);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        languages:
          updatedLanguages.length > 0 ? updatedLanguages.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("languages-> ", freelancerFilters.languages);
  };

  const handleLanguageSelection = (language) => {
    console.log("selected language->", language.name);
    const prevlanguages = freelancerFilters.languages.split(",") || [];
    let updatedlanguages = [];
    if (!prevlanguages.includes(language.id)) {
      updatedlanguages = [...new Set([...prevlanguages, language.id])];
    } else {
      updatedlanguages = prevlanguages.filter((cntry) => cntry !== language.id);
    }
    // updatedlanguages = updatedlanguages.filter((l) => l.trim() !== "");
    console.log("updated languages->", updatedlanguages);

    dispatch(
      updateFreelancersFilters({
        ...freelancerFilters,
        languages:
          updatedlanguages.length > 0 ? updatedlanguages.join(",") : "",
        page: 0,
      })
    );
    console.log("whole filter->", freelancerFilters);
    console.log("languages-> ", freelancerFilters.languages);
    setSearchLanguage("");
  };

  return (
    <div className="grid grid-cols-12 gap-3 flex-1 px-5 py-3 h-full">
      <div className="overflow-y-auto h-full hidden md:flex flex-col md:col-span-4 lg:col-span-3 border rounded shadow-md p-3 gap-3">
        <header className="font-bold text-xl">Filters</header>
        <div className="flex flex-col gap-1">
          <FilterHeading
            title="Rating"
            prop="rating"
            def=""
            dispatch={dispatch}
            updateFilters={updateFreelancersFilters}
            filters={freelancerFilters}
          />
          <div className="flex gap-x-4 flex-wrap">
            {["1", "2", "3", "4", "5"].map((rating) => {
              return (
                <Star
                  key={rating}
                  size={24}
                  className="cursor-pointer"
                  onClick={() => dispatch(
                    updateFreelancersFilters({
                      ...freelancerFilters,
                      rating: rating,
                      page: 0,
                    })
                  )}
                  fill={rating <= freelancerFilters.rating ? "blue" : "none"}
                  stroke={rating <= freelancerFilters.rating ? "blue" : "blue"}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FilterHeading
            title="Skills"
            prop="skills"
            def=""
            dispatch={dispatch}
            updateFilters={updateFreelancersFilters}
            filters={freelancerFilters}
          />
          <Command className="border rounded-lg shadow-sm">
            <CommandInput
              placeholder="Type a skill..."
              onValueChange={(value) => {
                console.log("search input", value);
                setSearchSkill(value);
              }}
              value={searchSkill}
            />
            <CommandList
              className={`max-h-20 overflow-y-auto shadow-sm 
                ${searchSkill ? "block" : "hidden"}`}
            >
              {allSkills?.map((skill) => (
                <CommandItem
                  key={skill.id}
                  onSelect={() => handleSkillsSelection(skill)}
                  className="cursor-pointer"
                >
                  {skill.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <div className="flex flex-col px-3 gap-1">
            {skills.map((skill) => {
              return (
                <label
                  className="flex items-center"
                  key={skill.id}
                  htmlFor={skill.id}
                >
                  <input
                    type="checkbox"
                    value={skill.id}
                    id={skill.id}
                    className="mr-2 form-checkbox bg-blue-600"
                    checked={freelancerFilters.skills
                      .split(",")
                      .includes(String(skill.id))}
                    onChange={(event) => handleSkillsChange(event)}
                  />
                  {skill.name}
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FilterHeading
            title="Project Location"
            prop="projectLocation"
            def=""
            dispatch={dispatch}
            updateFilters={updateFreelancersFilters}
            filters={freelancerFilters}
          />
          <div className="border shadow rounded-lg flex justify-between items-center p-1 px-2">
            <input
              type="text"
              placeholder="Location"
              className="focus:outline-none focus:ring-0 w-full"
            />
            <button className="p-1">
              <MapPin size={20} color="black" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FilterHeading
            title="Client's Country"
            prop="country"
            def=""
            dispatch={dispatch}
            updateFilters={updateFreelancersFilters}
            filters={freelancerFilters}
          />
          <Command className="border rounded-lg shadow-sm">
            <CommandInput
              placeholder="Type a country..."
              onValueChange={(value) => {
                console.log("search input", value);
                setSearchCountry(value);
              }}
              value={searchCountry}
            />
            <CommandList
              className={`max-h-20 overflow-y-auto shadow-sm 
                ${searchCountry ? "block" : "hidden"}`}
            >
              {allCountries?.map((country) => (
                <CommandItem
                  key={country.id}
                  onSelect={() => handleCountrySelection(country)}
                  className="cursor-pointer"
                >
                  {country.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <div className="flex flex-col px-3 gap-1">
            {countries.map((country) => {
              return (
                <label
                  className="flex items-center"
                  key={country.id}
                  htmlFor={country.id}
                >
                  <input
                    type="checkbox"
                    value={country.id}
                    id={country.id}
                    className="mr-2 form-checkbox bg-blue-600"
                    checked={freelancerFilters.country
                      .split(",")
                      .includes(String(country.id))}
                    onChange={(event) => handleCountryChange(event)}
                  />
                  {country.name}
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <FilterHeading
            title="Language"
            prop="languages"
            def=""
            dispatch={dispatch}
            updateFilters={updateFreelancersFilters}
            filters={freelancerFilters}
          />
          <Command className="border rounded-lg shadow-sm">
            <CommandInput
              placeholder="Type a language..."
              onValueChange={(value) => {
                console.log("search input", value);
                setSearchLanguage(value);
              }}
              value={searchLanguage}
            />
            <CommandList
              className={`max-h-20 overflow-y-auto shadow-sm 
                ${searchLanguage ? "block" : "hidden"}`}
            >
              {allLanguages?.map((language) => (
                <CommandItem
                  key={language.id}
                  onSelect={() => handleLanguageSelection(language)}
                  className="cursor-pointer"
                >
                  {language.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <div className="flex flex-col px-3 gap-1">
            {languages.map((language) => {
              return (
                <label
                  className="flex items-center"
                  key={language.id}
                  htmlFor={language.id}
                >
                  <input
                    type="checkbox"
                    value={language.id}
                    id={language.id}
                    className="mr-2 form-checkbox bg-blue-600"
                    checked={freelancerFilters.languages
                      .split(",")
                      .includes(String(language.id))}
                    onChange={(event) => handleLanguageChange(event)}
                  />
                  {language.name}
                </label>
              );
            })}
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-full col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-2 border rounded shadow-md p-3">
        <header className="flex justify-between items-center">
          <p className="font-bold text-xl">Freelancers</p>
          <div>
            <label>Sort by: </label>
            <select
              value={freelancerFilters.sortBy}
              onChange={(event) => {
                dispatch(
                  updateFreelancersFilters({
                    ...freelancerFilters,
                    sortBy: event.target.value,
                    page: 0,
                  })
                );
              }}
              className="bg-white border p-1"
            >
              <option value="">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="lowprice">Lowest Price</option>
              <option value="highprice">Highest Price</option>
              <option value="lowbids">Lowest Bids</option>
              <option value="highbids">Highest Bids</option>
            </select>
          </div>
        </header>
        <hr />
        {totalPages > 0 ? (
          <div className="flex flex-col justify-center gap-2 p-3">
            {freelancers.map((user) => {
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  // onProjectClick={handleProjectClick}
                />
              );
            })}
            <ReactPaginate
              previousLabel={"← Prev"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={totalPages}
              // forcePage={freelancerFilters.page} // Keeps track of active page
              onPageChange={(event) => {
                dispatch(
                  updateFreelancersFilters({
                    ...freelancerFilters,
                    page: event.selected,
                  })
                );
              }}
              marginPagesDisplayed={1} // Number of pages at the start and end
              pageRangeDisplayed={3} // Number of pages in the middle
              containerClassName="flex justify-center space-x-2 mt-4"
              pageClassName="border rounded-md bg-gray-100 hover:border-blue-500"
              pageLinkClassName="block px-4 py-2 w-full h-full text-center" // FIX: Makes full box clickable
              activeClassName="bg-blue-500 text-white border border-blue-500"
              activeLinkClassName="bg-blue-500 text-white border border-blue-500"
              previousClassName="border rounded-md bg-gray-200 hover:bg-blue-500 hover:text-white"
              previousLinkClassName="block px-4 py-2 w-full h-full text-center" // Ensures full button is clickable
              nextClassName="border rounded-md bg-gray-200 hover:bg-blue-500 hover:text-white"
              nextLinkClassName="block px-4 py-2 w-full h-full text-center" // Ensures full button is clickable
              breakClassName="px-4 py-2"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="font-normal text-gray-500 text-xl">
              No Such Freelancers in Database
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
