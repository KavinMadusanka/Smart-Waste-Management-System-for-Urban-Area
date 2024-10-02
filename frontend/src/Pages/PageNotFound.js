import React from "react";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
      <div className="pnf">
        <h1 className="pnf-title">404</h1>
        <h2 className="pnf-heading">OOps ! Page Not Found</h2>
        <Link to="/" className="pnf-btn">
          Go Back
        </Link>
      </div> 
  );
};

export default Pagenotfound;
