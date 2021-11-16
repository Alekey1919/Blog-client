import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import BlogPreview from "../Components/BlogPreview";
import Loading from "../images/loading.svg";

function Search() {
  const [blogs, setBlogs] = useState();
  const [noBlogs, setNoBlogs] = useState();
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/search", {
      input: params.id,
    })
      .then((res) => {
        if (res.data.length >= 1) {
          setNoBlogs(false);
          setLoading(false);
          setBlogs(res.data);
        } else {
          setNoBlogs(true);
        }
      })
      .catch((err) => console.error(err.message));
  }, [params]);

  if (loading) {
    return (
      <div className="loading">
        <img src={Loading} alt="Loading" />
      </div>
    );
  }

  if (noBlogs) {
    return (
      <div className="tag-no-result">
        <h1>There are no blogs related to "{params.id}".</h1>
      </div>
    );
  }

  return (
    <div className="tag-search">
      <h1>Results</h1>
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

export default Search;
