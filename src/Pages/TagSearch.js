import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import BlogPreview from "../Components/BlogPreview";

function TagSearch() {
  const [blogs, setBlogs] = useState();
  const [noBlogs, setNoBlogs] = useState();

  const params = useParams();

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/searchTags", {
      tag: params.id,
    })
      .then((res) => {
        if (res.data.length >= 1) {
          setBlogs(res.data);
        } else {
          setNoBlogs(true);
        }
      })
      .catch((err) => console.error(err.message));
  }, [params]);

  if (noBlogs) {
    return (
      <div className="tag-no-result">
        <h1>
          There are no blogs with the "{params.id}" tag.
          <Link to="/write-blog" className="router-link">
            Be the first one to write one!
          </Link>
        </h1>
      </div>
    );
  }

  return (
    <div className="tag-search">
      <h1>{params.id.charAt(0).toUpperCase() + params.id.slice(1)}</h1>
      <div className="row">
        {blogs
          ? blogs.map((blog, key) => {
              return (
                <BlogPreview
                  key={key}
                  title={blog.title}
                  date={blog.date}
                  body={blog.body}
                  id={blog._id}
                  img={blog.img}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default TagSearch;
