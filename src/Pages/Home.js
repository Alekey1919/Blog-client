import React, { useState, useEffect } from "react";
import BlogPreview from "../Components/BlogPreview";
import Axios from "axios";
import { useNavigate } from "react-router";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getBlogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const tagSearch = (tag) => {
    navigate(`/tag/${tag}`);
  };

  return (
    <div className="home">
      <div className="home-tags">
        <div>
          <button onClick={() => tagSearch("cars")}>Cars</button>
          <button onClick={() => tagSearch("videogames")}>Videogames</button>
          <button onClick={() => tagSearch("sports")}>Sports</button>
          <button onClick={() => tagSearch("personal")}>Personal</button>
          <button onClick={() => tagSearch("food")}>Food</button>
          <button onClick={() => tagSearch("lifestyle")}>Lifestyle</button>
          <button onClick={() => tagSearch("business")}>Business</button>
          <button onClick={() => tagSearch("news")}>News</button>
          <button onClick={() => tagSearch("others")}>Others</button>
        </div>
      </div>
      <div className="row">
        {blogs
          ? blogs.map((blog, key) => {
              return (
                <BlogPreview
                  key={key}
                  id={blog._id}
                  img={blog.img}
                  title={blog.title}
                  date={blog.date}
                  body={blog.body}
                  author={blog.author}
                  comments={blog.comments}
                  likes={blog.likes}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}

export default Home;
