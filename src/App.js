import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
const LocationMarker = (props) => {
  const map = useMap();

  map.flyTo([props.lat, props.lng]);
  return (
    <Marker position={[props.lat, props.lng]}>
      <Popup>Your IP Location</Popup>
    </Marker>
  );
};
function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    ip: "",
    location: {
      country: "",
      region: "",
      city: "",
      lat: 0,
      lng: 0,
      postalCode: "",
      timezone: "",
      geonameId: 0,
    },
    isp: "",
  });
  const handleSearch = async () => {
    let url = /([a-zA-Z])\w+/.test(search)
      ? `domain=${search}`
      : `ipAddress=${search}`;
    fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_bZ4mhAVtW5Sg0sZdef5cGhwqI8j4S&${url}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((dat) => {
        setData(dat);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const init = async () => {
    const ip = await fetch("https://api.ipify.org?format=json", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((dat) => dat.ip);
    const setInitial = fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_bZ4mhAVtW5Sg0sZdef5cGhwqI8j4S&ipAddress=${ip}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((dat) => {
        setData(dat);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const renderMap = useMemo(() => {
    return (
      <MapContainer center={[data.location.lat, data.location.lng]} zoom={20}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker lat={data.location.lat} lng={data.location.lng} />
      </MapContainer>
    );
  }, [data.location.lat, data.location.lng]);
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="App h-screen overflow-hidden">
      <div className="top pt-10 pb-32 w-full relative bg-blue-400">
        <h1 className="text-6xl text-white font-bold text-center">
          IP Address Tracker
        </h1>
        <div className="input border border-neutral-500 w-min flex mx-auto my-8  rounded-xl">
          <input
            type="text"
            value={search}
            placeholder="Search for any IP or Domain"
            className="rounded-l-xl  p-3 "
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          ></input>
          <button
            onClick={handleSearch}
            className="p-1 px-4 bg-slate-800 rounded-r-xl text-lime-50 font-bold"
          >
            {" "}
            &gt;{" "}
          </button>
        </div>
        <div className="data flex z-10 p-8 w-3/4 min-h-max  rounded-lg absolute -bottom-20  left-1/4 translate-x-16 bg-white">
          <div>
            <h2> IP Address</h2>
            <h1>{data.ip}</h1>
          </div>

          <div className="flex-grow">
            <h2>Location</h2>
            <h1>
              {data.location.country +
                "\n" +
                data.location.region +
                data.location.city}
            </h1>
          </div>
          <div>
            <h2>Timezone</h2>
            <h1>{data.location.timezone}</h1>
          </div>
          <div>
            <h2>ISP</h2>
            <h1>{data.isp}</h1>
          </div>
        </div>
      </div>
      <div id="map" className="bg-red-300 h-screen">
        {renderMap}
      </div>
    </div>
  );
}

export default App;
