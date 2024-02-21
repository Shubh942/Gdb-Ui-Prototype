import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import LanguagesDropdown from "./LanguagesDropdown";
import LeftBar from "./LeftBar";

const javascriptDefault = `
//select Any file to start coding 😊
`;

const pythonDefault = `
# Python 3.x code to demonstrate star pattern

# Function to demonstrate printing pattern triangle
def triangle(n):
	
	# number of spaces
	k = n - 1

	# outer loop to handle number of rows
	for i in range(0, n):
	
		# inner loop to handle number spaces
		# values changing acc. to requirement
		for j in range(0, k):
			print(end=" ")
	
		# decrementing k after each loop
		k = k - 1
	
		# inner loop to handle number of columns
		# values changing acc. to outer loop
		for j in range(0, i+1):
		
			# printing stars
			print("* ", end="")
	
		# ending line after each row
		print("")

# Driver Code
n = 5
triangle(n)

`;

const cppDefault = `
#include<iostream>
using namespace std;

int main()
{

int n,row,col;
n = 6;
for(row=0;row<n;row++)
{
  for(col=0;col<n+1;col++)
     if ((row==0 && col%3!=0) || (row==1 && col%3==0) || (row-col==2) || (row+col==8))
          cout<<("*");
        else
          cout<<(" ");

    cout<<("\n");

}
  return 0;
}
`;

const pythonStar = `
num_rows = 6
k = 0
for i in range(1, num_rows + 1): 
    for j in range (1, (num_rows - i) + 1): 
        print(end = " ")
    while k != (2 * i - 1):
        print("*", end = "")
        k = k + 1
    k = 0   
    print()
k = 2
m = 1
for i in range(1, num_rows): 
    for j in range (1, k):
        print(end = " ") 
    k = k + 1
    while m <= (2 * (num_rows - i) - 1): 
        print("*", end = "") 
        m = m + 1
    m = 1	
    print()
`;

const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [customInput, setCustomInput] = useState("");
  const [currentClass, setCurrentClass] = useState("");
  let filecode = "";
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [language, setLanguage] = useState(languageOptions[0]);
  const [value, setValue] = useState(code || "");
  const data = [
    {
      type: "folder",
      name: "Folder1",
      data: [
        { type: "file", name: "file2", code: pythonDefault },
        { type: "file", name: "file3", code: `console.log("Hello World")` },
        {
          type: "folder",
          name: "folder2",
          data: [{ type: "file", name: "file4", code: cppDefault }],
        },
      ],
    },
    { type: "file", name: "file1", code: pythonStar },
  ];

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
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
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
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
    console.log(data);
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
    <>
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
      <div>
        <div className="h-4 w-full "></div>
        <div className="flex flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
        </div>
        <div
          className="flex flex-row space-x-4 items-start px-4 py-4"
          style={{ flexDirection: "row-reverse" }}
        >
          <div
            className="leftClass w-full"
            style={{
              height: "85vh",
              width: `25%`,
              border: "2px solid black",
              borderRadius: "5px",
            }}
          >
            <LeftBar
              data={data}
              setCode={setCode}
              onChange={onChange}
              setValue={setValue}
              currentClass={currentClass}
              setCurrentClass={setCurrentClass}
              filecode={filecode}
              value={value}
            />
          </div>
          <div className="flex flex-col w-full h-full justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              // theme={theme.value}
              value={value}
              setValue={setValue}
            />
          </div>

          <div className="right-container flex flex-shrink-0 w-[20%] flex-col">
            <OutputWindow outputDetails={outputDetails} />
            <div className="flex flex-col items-end">
              <CustomInput
                customInput={customInput}
                setCustomInput={setCustomInput}
              />
              <button
                onClick={handleCompile}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md  px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Compile and Execute"}
              </button>
            </div>
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;
