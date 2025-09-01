import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEWrapper = ({
  value,
  onChange,
  height = 300,
  placeholder = "Tulis di sini...",
  toolbar,
}) => {
  const editorRef = useRef(null);

  const handleInit = (_evt, editor) => {
    editorRef.current = editor;
    if (value) editor.setContent(value);
  };

  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className="tiny-mce-wrapper">
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
        onInit={handleInit}
        value={value}
        onEditorChange={handleChange}
        init={{
          height: height,
          menubar: false,
          branding: false,
          statusbar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            toolbar ||
            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 14px; 
              line-height: 1,2;
            }
          `,
          paste_data_images: false,
          promotion: false,
          placeholder: placeholder,
        }}
      />
    </div>
  );
};

export default TinyMCEWrapper;
