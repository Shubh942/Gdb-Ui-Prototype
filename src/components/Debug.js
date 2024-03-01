import React, { useState } from "react";

import DebugCodeEditor from "./DebugCodeEditor";
import Terminal from "terminal-in-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { classnames } from "../utils/general";

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
  const [name, setName] = useState("temp");
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleClick = async () => {
    console.log(code);
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    if (name && code) {
      const { data } = await axios.post(
        "http://127.0.0.1:8000/compile",
        { code: code, name: name },
        config
      );
      console.log(data);
      if (data.success) {
        showSuccessToast(data.output);
      } else {
        showErrorToast(data.output, 5000);
      }
    }

    //  print(data.result);
  };

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    // console.log(data);
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div style={{ padding: "60px" }}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div style={{ display: "flex", gap: "5px" }}>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          style={{
            border: "1px solid black",
            width: "50%",
            padding: "1px 1px 1px 1px",
          }}
        />
        <button
          onClick={handleClick}
          style={{ border: "2px solid black" }}
          className={classnames(
            "mt-4 border-2  z-10 rounded-md  px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0"
            // !code ? "opacity-50" : ""
          )}
        >
          save
        </button>
      </div>

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
          <DebugCodeEditor
            code={code}
            onChange={onChange}
            language={"Cpp"}
            // theme={theme.value}
            value={value}
            setValue={setValue}
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
                  { command: str, name: name },
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
    </div>
  );
};

export default Debug;
