"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
//import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

let textAreaValue = "";

const AddCourseTextContent = ({ onSubmit, documentId, type }) => {
  console.log(documentId);
  const [formData, setFormData] = useState({});
  const [textContent, setTextContent] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const editorRef = useRef(null);
  const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

  useEffect(() => {
    // Initialize the courseDocId field with the value of documentId
    setFormData((prevFormData) => ({
      ...prevFormData,
      courseDocId: documentId,
      type: "text",
    }));
    console.log(formData);
  }, [documentId, formData]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleTextContentChange = (value) => {
    console.log(value);
    textAreaValue = value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: value,
    }));
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    setTextContent(htmlContent);
    console.log(formData);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    console.log(htmlContent);
    setFormData((prevFormData) => ({
      ...prevFormData,
      textContent: htmlContent,
    }));
    const jsonData = JSON.stringify(formData);

    console.log(jsonData);
    onSubmit(formData); // Call the onSubmit callback with the form data
    setFormData(""); // Clear the form data after submission
  };

  const handleInputChange = (event) => {
    const editorElement = document.querySelector(".ql-editor");
    const htmlContent = editorElement.innerHTML;
    setTextContent(htmlContent);
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    console.log(formData);
  };

  const quill = React.useMemo(
    () => (
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={textContent}
        onChange={handleTextContentChange}
      />
    ),
    [handleTextContentChange, textContent]
  );

  return (
    <form className="form-lg" onSubmit={handleFormSubmit}>
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="title"
      >
        Title
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="text"
        id="title"
        name="title"
        required
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2 mr-2 flex"
        htmlFor="contentOrder"
      >
        Chapter <InfoIcon
        className="ml-2 text-grey-700"
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      />
      </label>

      <input
        onChange={handleInputChange}
        className=""
        type="text"
        id="contentOrder"
        name="contentOrder"
        required
      />
     

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <p>
            The numerical order that content is displayed in the app, similar to
            book chapters.
          </p>{" "}
          <p>
            For example, these numberings would be displayed in order from
            smallest to largest:
          </p>{" "}
          <p>1.0, 1.1, 1.2, 2.0, 3.0, 3.1, etc.</p>
        </Typography>
      </Popover>
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="due"
      >
        Due Date/Time
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="due"
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="open"
      >
        App Users can see this content at the following date and time:
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="open"
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="close"
      >
        At the following date and time, app users will no longer have access to
        this content:
      </label>
      <input
        onChange={handleInputChange}
        className=""
        type="datetime-local"
        name="close"
      />
      <label
        className="block text-white-700 text-lg font-bold mb-2"
        htmlFor="textContent"
      >
        Text Content
      </label>

      {quill}
      <div className="mt-5">
        <Button variant="contained" type="submit" className="btn">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default AddCourseTextContent;
