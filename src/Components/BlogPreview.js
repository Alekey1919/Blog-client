import React from "react";
import { Link } from "react-router-dom";

function BlogPreview(props) {
  return (
    <div className="blog-preview col">
      <img src={props.img} alt={props.name} />
      <div className="blog-preview-text">
        <Link to={`/blog/${props.id}`} className="blog-preview-text-link">
          <h1 className="blog-preview-text-title">{props.title}</h1>
        </Link>
        <p className="blog-preview-text-date">{props.date}</p>
        <p className="blog-preview-text-body">{props.body}</p>
      </div>
    </div>
  );
}

export default BlogPreview;
