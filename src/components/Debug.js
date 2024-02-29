import React, { useState } from "react";

import CodeEditorWindow from "./CodeEditorWindow";
import Terminal from "terminal-in-react";
import axios from "axios";

const sampleCode = `#include <iostream>
using namespace std;

int main()
{

    int i, n;
    bool is_prime = true;

    n = 5;

    // 0 and 1 are not prime numbers
    if (n == 0 || n == 1)
    {
        is_prime = false;
    }

    // loop to check if n is prime
    for (i = 2; i <= n / 2; ++i)
    {
        if (n % i == 0)
        {
            is_prime = false;
            break;
        }
    }

    return 0;
}

`;

const Debug = () => {
  const [value, setValue] = useState(sampleCode);
  const [code, setCode] = useState(sampleCode);
  const onChange = () => {
    setValue(sampleCode);
    setCode(sampleCode);
  };

  return (
    <div className="flex w-full h-full justify-start items-end">
      <div
        className="flex flex-col w-full h-full justify-start items-end"
        style={{
          border: "1px solid #f5f5f5",
          borderRadius: "8px",
          boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)",
          padding: "12px 6px",
          paddingTop: "10px",
          width: "60%",
        }}
      >
        <CodeEditorWindow
          code={code}
          onChange={onChange}
          language={"C++"}
          // theme={theme.value}
          value={value}
          //   setValue={setValue}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Terminal
          color="green"
          backgroundColor="black"
          barColor="black"
          style={{ fontWeight: "bold", fontSize: "1em" }}
          commandPassThrough={(cmd, print) => {
            // do something async
            console.log(cmd);
            const config = {
              headers: {
                "content-type": "application/json",
              },
            };
            let str = "";
            for (let i = 0; i < cmd.length; i++) {
              str += cmd[i];
              str += " ";
            }
            console.log(str);
            // print(`-PassedThrough:${cmd}: command not found`);
            const onExecute = async () => {
              const { data } = await axios.post(
                "http://127.0.0.1:8000/gdb_command",
                { command: str },
                config
              );
              console.log(data);
              print(data.result);
            };
            onExecute();
          }}
          msg="Hello! My name is TErmi, You can write any gdb command here. Example - info breakpoints."
        />
      </div>
    </div>
  );
};

export default Debug;
