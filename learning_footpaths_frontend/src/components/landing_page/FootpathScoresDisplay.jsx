// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const FootpathScores = () => {
//   const [scores, setScores] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const response = await axios.get('http://localhost:8888/api/user/footpath-scores', {
//           withCredentials: true
//         });
//         setScores(response.data);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch scores');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchScores();
//   }, []);

//   if (loading) return <div className="text-gray-600">Loading scores...</div>;
//   if (error) return <div className="text-red-500">Error: {error}</div>;
//   if (!scores.length) return <div className="text-gray-600">No scores yet</div>;

//   return (
//     <div className="mt-4 p-4 bg-white rounded-lg shadow">
//       <h3 className="text-lg font-semibold mb-3">Your Footpath Progress</h3>
//       <div className="space-y-2">
//         {scores.map((score) => (
//           <div key={score.footpath_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//             <span className="font-medium">{score.footpath_name}</span>
//             <span className="text-blue-600">{score.total_score} points</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FootpathScores;

import React, { useState, useEffect } from "react";

const FootpathScores = () => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(
          "http://localhost:8888/api/user/footpath-scores",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please log in to view scores"
              : "Failed to load scores"
          );
        }

        const data = await response.json();
        setScores(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return <div className="text-gray-600">Loading scores...</div>;
  if (error) return null; // Don't show error message, just hide the component
  if (!scores.length) return <div className="text-gray-600">No scores yet</div>;

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Your Footpath Progress</h3>
      <div className="space-y-2">
        {scores.map((score) => (
          <div
            key={score.footpath_id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="font-medium">{score.footpath_name}</span>
            <span className="text-blue-600">{score.total_score} points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FootpathScores;
