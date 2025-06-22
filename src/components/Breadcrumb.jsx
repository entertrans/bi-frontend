// src/components/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ path }) => {
  const segments = path.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const url = "/" + segments.slice(0, index + 1).join("/");
    const label =
      segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");

    return (
      <li key={index} className="inline-flex items-center">
        {index !== 0 && (
          <svg
            className="w-4 h-4 mx-2 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M7.05 4.05a.75.75 0 011.06 0L14 9.94a.75.75 0 010 1.06l-5.89 5.89a.75.75 0 11-1.06-1.06L12.44 10 7.05 4.66a.75.75 0 010-1.06z" />
          </svg>
        )}
        <Link
          to={url}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          {label}
        </Link>
      </li>
    );
  });

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-300">
        <li>
          <Link to="/" className="hover:underline"></Link>
        </li>
        {breadcrumbs}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
