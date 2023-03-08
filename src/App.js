import "./App.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

import InfoCard from "./components/InfoCard";
import L from "leaflet";

function LocationMarker({ lat, lon, setData }) {
  const [position, setPosition] = useState(null);
  const [init, setInit] = useState(false);
  const [bbox, setBbox] = useState([]);
  const map = useMap();
  useEffect(() => {
    if (!init) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        setData({
          lat: e.latlng.lat,
          lon: e.latlng.lng,
        });
        setInit(true);
        setBbox(e.bounds.toBBoxString().split(","));
      });
    } else {
      map.flyTo([lat, lon]);
    }
  }, [map, setData, init, lat, lon]);

  return position === null ? null : (
    <Marker position={init ? [lat, lon] : position}>
      <Popup>
        You are here. <br />
        Map bbox: <br />
        <b>Southwest lng</b>: {bbox[0]} <br />
        <b>Southwest lat</b>: {bbox[1]} <br />
        <b>Northeast lng</b>: {bbox[2]} <br />
        <b>Northeast lat</b>: {bbox[3]}
      </Popup>
    </Marker>
  );
}
function App() {
  const [search, setSearch] = useState("");
  // const [currentPage, setCurrentPage] = useState("location");
  const [showDetails, setShowDetails] = useState(false);

  const [data, setData] = useState({
    lat: 36.4761,
    lon: -119.4432,
  });
  const [cityDetails, setCityDetails] = useState();
  const [city, setCity] = useState([]);

  const renderMap = useMemo(() => {
    return (
      <MapContainer center={[data.lat, data.lon]} zoom={20}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker lat={data.lat} lon={data.lon} setData={setData} />
      </MapContainer>
    );
  }, [data]);

  const ref = useRef(null);

  //location fetch
  useEffect(() => {
    if (search !== "") {
      let timeout = setTimeout(() => {
        fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=40f8bbe6bdc2ecaf029ad8f6f08286b1`,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .then((dat) => setCity(dat));
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [search]);

  //city details fetch
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=40f8bbe6bdc2ecaf029ad8f6f08286b1`
    )
      .then((res) => res.json())
      .then((dat) => {
        setCityDetails(dat);
      });
  }, [data]);

  //input ref handler
  const eventHandler = useCallback((e) => {
    if (!ref.current) {
      return;
    }

    if (document.contains(e.target) && !ref.current.contains(e.target))
      setShowDetails(false);
  }, []);
  useEffect(() => {
    document.addEventListener("click", eventHandler);
    return () => document.removeEventListener("click", eventHandler);
  }, [eventHandler]);
  return (
    <div className="App h-screen overflow-hidden">
      <div
        className="top pt-10 pb-32 w-full relative bg-blue-400"
        style={{
          backgroundColor: "brown",
        }}
      >
        <div
          // onClick={() => {
          //   setCurrentPage((curr) => (curr === "ip" ? "location" : "ip"));
          // }}
          className="arrow before absolute top-0 font-bold  left-0  h-full px-6 text-white"
        >
          <div className="absolute text-3xl cursor-default top-1/2">&lt;</div>
        </div>
        <h1 className="text-6xl text-white font-bold text-center">
          {"Geo Location"}
        </h1>

        <form
          ref={ref}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="input border border-neutral-500 w-min flex mx-auto my-8 relative rounded-xl"
        >
          <input
            type="text"
            value={search}
            placeholder={"Search for any place"}
            className="rounded-l-xl  p-3 pr-24 "
            onFocus={() => {
              setShowDetails(true);
            }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></input>
          <button className="p-1 px-4 bg-slate-800 rounded-r-xl text-lime-50 font-bold">
            {" "}
            &gt;{" "}
          </button>
          {city.length > 0 && showDetails && (
            <div className="absolute max-h-[20vh] top-[110%] border border-yellow-900 rounded-md bg-white overflow-y-scroll bg-opacity-95  z-50 space-y-5 list-none w-4/5">
              {city?.map((cit, index) => {
                return (
                  <li
                    onClick={() => {
                      setData(cit);
                      setShowDetails(false);
                    }}
                    key={cit + index}
                    className="p-2 hover:bg-[#a52a2a] hover:text-white cursor-default"
                  >
                    {cit.name},{cit.country}
                  </li>
                );
              })}
            </div>
          )}
        </form>

        {cityDetails && <InfoCard data={cityDetails} page={""}></InfoCard>}
        <div
          // onClick={() => {
          //   setCurrentPage((curr) => (curr === "ip" ? "location" : "ip"));
          // }}
          className="arrow after absolute top-0 font-bold  right-0  h-full px-6  text-white"
        >
          <div className="absolute text-3xl cursor-default top-1/2">&gt;</div>
        </div>
      </div>
      <div id="map" className="bg-red-300 h-screen">
        {renderMap}
      </div>
    </div>
  );
}

export default App;
