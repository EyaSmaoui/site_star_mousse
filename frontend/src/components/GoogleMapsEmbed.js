import React from "react";

const GoogleMapsEmbed = () => {
  return (
    <div style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
      <iframe
        title="Google Maps Star Mousse"
        src="https://www.google.com/maps?q=Star%20Mousse%20Tunisie&output=embed"
        width="100%"
        height="320"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default GoogleMapsEmbed;
