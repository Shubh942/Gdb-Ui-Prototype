import React, { useState } from "react";

import PrintFolder from "./PrintFolder";

const LeftBar = ({
  data,
  setCode,
  onChange,
  setValue,
  filecode,
  value,
  currentClass,
  setCurrentClass,
}) => {
  return (
    <div className="leftbar">
      <div>
        {data.map((comp) => (
          <div>
            {console.log(comp)}

            <a>
              {
                <PrintFolder
                  data={comp}
                  setCode={setCode}
                  onChange={onChange}
                  setValue={setValue}
                  filecode={filecode}
                  currentClass={currentClass}
                  setCurrentClass={setCurrentClass}
                />
              }
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftBar;
