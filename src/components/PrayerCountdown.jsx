import React from "react";
import Countdown from "react-countdown";

export const PrayerCountdown = ({ countdown }) => {
  return (
    <div>
      <h3>Next Prayer Countdown</h3>
      <Countdown date={Date.now() + countdown * 1000} />
    </div>
  );
};