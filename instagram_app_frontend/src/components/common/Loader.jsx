import React from "react";

export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner" />
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
