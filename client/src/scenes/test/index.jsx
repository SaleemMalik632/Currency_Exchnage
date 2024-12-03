import React, { useEffect, useState } from "react";

const AllApiData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://server-6zpktt1pb-saleem-maliks-projects.vercel.app/client/products"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All API Data</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <strong>Product:</strong> {item.name || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllApiData;
