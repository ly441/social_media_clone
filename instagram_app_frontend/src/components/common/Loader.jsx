import React from "react";



export const Loader = ({ text = "Loading..." }) => (
  <LoaderContainer>
    <div style={{ textAlign: "center" }}>
      <Spinner />
      {text && <LoaderText>{text}</LoaderText>}
    </div>
  </LoaderContainer>
);



export default Loader;
