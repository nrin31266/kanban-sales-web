import { PAGE } from "@/configurations/configurations";
import { replaceName } from "@/utils/replaceName";
import Search, { SearchProps } from "antd/es/input/Search";
import { useRouter } from "next/router";
import React from "react";

const MainSearch = () => {
  const router = useRouter();

  const onSearch: SearchProps["onSearch"] = (value, _e, _info) => {
    if (value.trim() != "" && value) {
      const v = replaceName(value);
      router.push(`${PAGE.SHOP}?search=${v}`);
    }
  };

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
          onSearch={onSearch}
        />
      </div>
    </div>
  );
};

export default MainSearch;
