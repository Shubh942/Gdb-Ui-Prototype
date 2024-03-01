import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

const DebugCodeEditor = ({
  onChange,
  language,
  code,
  theme,
  value,
  setValue,
}) => {
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={`blackboard`}
        defaultValue="//Write your code from here"
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default DebugCodeEditor;
