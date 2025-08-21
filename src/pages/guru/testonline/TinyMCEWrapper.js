import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEWrapper = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Handle initialization
  const handleInit = (_evt, editor) => {
    editorRef.current = editor;
    
    // Set content awal jika ada value
    if (value) {
      editor.setContent(value);
    }
  };

  // Handle content change
  const handleChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <div className="tiny-mce-wrapper">
      <Editor
        apiKey={process.env.REACT_APP_TINYMCE_API_KEY} // Ambil dari environment variable
        onInit={handleInit}
        value={value}
        onEditorChange={handleChange}
        init={{
          height: 300,
          menubar: false,
          branding: false, // Menghilangkan watermark "Powered by Tiny"
          statusbar: false, // Menghilangkan status bar bawah
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat ',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px; 
              line-height: 1.6;
            }
          `,
          paste_data_images: false,
          promotion: false,
          placeholder: "Ketik pertanyaan di sini...",
        }}
      />
    </div>
  );
};

export default TinyMCEWrapper;