import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { FaFile } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";

const PrintFolder = ({
  data,
  setCode,
  onChange,
  setValue,
  filecode,
  value,
  currentClass,
  setCurrentClass,
}) => {
  const [open, setOpen] = useState(false);
  const [newTouch, setNewTouch] = useState("");
  const [newType, setNewType] = useState("");
  const [preData, setPreData] = useState(data.data);
  const [hideNew, setHideNew] = useState(false);

  const handleButton = () => {
    setHideNew(!hideNew);
  };

  const handleClick = () => {
    if (data.type === "file") {
      setCurrentClass(data.name);
      onChange("code", data.code);
      setValue(data.code);
      filecode = data.name;
    }
  };

  const handleSave = () => {
    if (newType === "folder") {
      const sampleData = { type: newType, name: newTouch, data: [] };

      data.data.push(sampleData);
      setPreData(data.data);
      setHideNew(!hideNew);
      setNewTouch("");
    } else {
      const sampleData = {
        type: newType,
        name: newTouch,
        code: "//sample code",
      };

      data.data.push(sampleData);
      setPreData(data.data);
      setHideNew(!hideNew);
      setNewTouch("");
    }
  };
  useEffect(() => {}, [preData]);
  return (
    <div>
      <div
        className="flex"
        onClick={handleClick}
        style={{
          cursor: "auto",
          overflowX: "hidden",
          display: "flex",
          padding: "5px 10px",
        }}
      >
        {data.type === "folder" ? (
          <div>
            <a
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "3px",
              }}
              className={currentClass === data.name ? "testclass" : ""}
            >
              <a> 📁 </a>
              <a onClick={() => setOpen(!open)}>{data.name}</a>
              <div
                className="flex"
                style={{ gap: "2px", padding: "2px 2px 2px 2px" }}
              >
                <div
                  className="flex"
                  style={{
                    backgroundColor: "#A0C4E2",
                    padding: "4px",
                  }}
                  onClick={() => {
                    handleButton();
                    setNewType("file");
                  }}
                >
                  <FaFile style={{ color: "white" }} />
                  <FaPlus style={{ color: "white" }} />
                </div>
                <div
                  className="flex"
                  style={{
                    backgroundColor: "#A0C4E2",
                    padding: "4px",
                  }}
                  onClick={() => {
                    handleButton();
                    setNewType("folder");
                  }}
                >
                  <FaFolder style={{ color: "white" }} />
                  <FaPlus style={{ color: "white" }} />
                </div>
              </div>
            </a>
            <div>
              {hideNew ? (
                <div>
                  {setNewTouch.length > 0 ? (
                    <div onClick={handleSave}>
                      <IoIosCloudDone />
                    </div>
                  ) : (
                    ""
                  )}
                  <input
                    onChange={(e) => setNewTouch(e.target.value)}
                    value={newTouch}
                    style={{
                      border: "1px solid black",
                      width: "100%",
                      padding: "1px 1px 1px 1px",
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            {open ? (
              <div style={{ paddingLeft: "12px" }}>
                {preData.map((prop) => (
                  <div>
                    {
                      <PrintFolder
                        data={prop}
                        setCode={setCode}
                        onChange={onChange}
                        setValue={setValue}
                        filecode={filecode}
                        value={value}
                        currentClass={currentClass}
                        setCurrentClass={setCurrentClass}
                      />
                    }
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div
            className={currentClass === data.name ? "testclass" : ""}
            style={{ padding: "3px 6px" }}
          >
            📄 {data.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintFolder;
