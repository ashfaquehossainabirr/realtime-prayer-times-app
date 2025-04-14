import React from "react";

export const PastPrayers = ({ prayerTimes }) => {
  const pastPrayers = Object.keys(prayerTimes).filter((prayer) => {
    const now = new Date();
    const prayerTime = new Date(prayerTimes[prayer]);
    return prayerTime < now;
  });

  return (
    <div>
      <h3>Past Prayers</h3>
      <ul>
        {pastPrayers.map((prayer, index) => (
          <li key={index}>
            <strong>{prayer}:</strong> {prayerTimes[prayer]}
          </li>
        ))}
      </ul>
    </div>
  );
};