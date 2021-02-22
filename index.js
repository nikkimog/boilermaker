import React from "react";
import ReactDOM from "react-dom";

const element = <div>Hello, world!</div>;
ReactDOM.render(
  element,
  document.getElementById("app")
  // make sure this is the same as the id of the div in your index.html
);
