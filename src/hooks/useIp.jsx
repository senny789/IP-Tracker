import React, { useEffect, useState } from "react";

const useIp = () => {
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
  const init = async () => {
    const ip = await fetch("https://api.ipify.org?format=json", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((dat) => dat.ip);
    fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_bZ4mhAVtW5Sg0sZdef5cGhwqI8j4S&ipAddress=${ip}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((dat) => {
        setData(dat);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    init();
  }, []);
  return [data, setData];
};
export default useIp;
