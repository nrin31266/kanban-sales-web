
import Search from "antd/es/input/Search";
import React from "react";

const MainSearch = () => {
  return (
    <div className="d-flex" style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Search
          style={{ width: "90%", padding: "10px 0" }}
          size="large"
          placeholder="Search products"
          enterButton="Search"
        />
      </div>
    </div>
  );
};

export default MainSearch;
