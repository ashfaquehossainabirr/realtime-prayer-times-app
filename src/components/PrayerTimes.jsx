import React from "react";

export const PrayerTimes = ({ prayerTimes }) => {
  return (
    <div>
      <h2>Today's Prayer Times</h2>
      <ul>
        {Object.keys(prayerTimes).map((prayer, index) => (
          <li key={index}>
            <strong>{prayer}:</strong> {prayerTimes[prayer]}
          </li>
        ))}
      </ul>
    </div>
  );
};