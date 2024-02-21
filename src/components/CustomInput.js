import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      {" "}
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className={classnames(
          "focus:outline-none w-full  z-10 rounded-md px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
        )}
        style={{
          border: "1px solid #f5f5f5",
          borderRadius: "8px",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)",
          padding: "6px",
        }}
      ></textarea>
    </>
  );
};

export default CustomInput;
