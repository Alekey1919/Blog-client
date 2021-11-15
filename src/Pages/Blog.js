import React, { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import { UserContext } from "../Helper/UserContext";
import { useNavigate } from "react-router";

function Blog() {
  const params = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getBlogs", {
      _id: params.id,
    }).then((res) => {
      if (res.data[0]) {
        setBlog(res.data[0]);
        setComments(res.data[0].comments);
      } else {
        setNotFound(true);
      }
    });
  }, [params]);

  //Post a comment

  const { userData, setUserData } = useContext(UserContext);

  const postComment = () => {
    if (comment === "") {
      return;
    }

    const date = new Date().toLocaleDateString(undefined, {});
    const innerComment = [userData.nickname, comment, date];

    Axios.post("https://mern-blog-project-server.herokuapp.com/postComment", {
      blogId: params.id,
      comment: innerComment,
    });

    setComments([...comments, innerComment]);
  };

  // Delete comment

  const deleteComment = (e) => {
    let commentor =
      e.target.previousSibling.previousSibling.previousSibling.innerText;
    commentor = commentor.substr(0, commentor.indexOf(":"));
    const commentText = e.target.previousSibling.previousSibling.innerText;
    const date = e.target.previousSibling.innerText;

    Axios.post("https://mern-blog-project-server.herokuapp.com/deleteComment", {
      blogId: params.id,
      comment: [commentor, commentText, date],
    }).catch((err) => console.error(err.message));

    e.target.parentNode.remove(); // Removing the comment node
  };

  // Like & Dislike

  const dislike = () => {
    const newLiked = userData.liked;
    newLiked.splice(newLiked.indexOf(params.id), 1);

    setUserData({ ...userData, liked: newLiked });

    const likesNumber = document.getElementById("likes-number");
    likesNumber.innerText = parseInt(likesNumber.innerText) - 1;

    Axios.post("https://mern-blog-project-server.herokuapp.com/dislike", {
      userId: userData._id,
      blogId: params.id,
    }).catch((err) => console.error(err.message));
  };

  const like = () => {
    if (!userData) {
      navigate("/login");
      return;
    }

    const newLiked = userData.liked;
    newLiked.push(params.id);

    setUserData({ ...userData, liked: newLiked });

    const likesNumber = document.getElementById("likes-number");
    likesNumber.innerText = parseInt(likesNumber.innerText) + 1;

    Axios.post("https://mern-blog-project-server.herokuapp.com/like", {
      userId: userData._id,
      blogId: params.id,
    }).catch((err) => console.error(err.message));
  };

  // Delete blog

  const deleteBlog = () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    Axios.post("https://mern-blog-project-server.herokuapp.com/deleteBlog", {
      blogId: params.id,
      userId: userData._id,
    })
      .then((res) => setDeleted(true))
      .catch((err) => console.error(err.message));
  };

  // Edit blog

  const editBlog = () => {
    navigate(`/edit-blog/${params.id}`);
  };

  // Toggle options

  const toggleOptions = () => {
    let optionsContainer = document.querySelector(".blog-options-container");
    document.querySelector(".blog-options").classList.toggle("margin");
    if (optionsContainer.classList.contains("none")) {
      optionsContainer.classList.toggle("none");
      setTimeout(() => {
        optionsContainer.classList.toggle("toggled");
      }, 10);
    } else {
      optionsContainer.classList.toggle("toggled");
      setTimeout(() => {
        optionsContainer.classList.toggle("none");
      }, 500);
    }
    document.querySelector(".blog-options-toggler").classList.toggle("active");
  };

  // Render

  if (notFound) {
    return (
      <h1 className="not-found">The blog ID "{params.id}" doesn't exist.</h1>
    );
  }

  if (!blog) {
    return <h1 className="not-found">Loading</h1>;
  }

  if (deleted) {
    return <h1 className="not-found">The blog was deleted</h1>;
  }

  return (
    <div className="blog">
      {blog.author === userData.nickname ? (
        <div className="blog-options">
          <i
            className="fas fa-ellipsis-v blog-options-toggler"
            onClick={toggleOptions}
          ></i>
          <div className="blog-options-container none">
            <button onClick={editBlog}>Edit</button>
            <button onClick={deleteBlog}>Delete</button>
          </div>
        </div>
      ) : null}
      <img src={blog.img} alt="Blog" />
      <h1>{blog.title}</h1>
      <h2>
        By:
        <Link to={`/profile/${blog.author}`} className="author-link">
          <span>{blog.author}</span>
        </Link>
      </h2>
      <p className="date">{blog.date}</p>
      <p className="blog-body">{blog.body}</p>
      <div className="blog-likes">
        <p id="likes-number">{blog.likes}</p>
        {userData.liked?.includes(params.id) ? (
          <i className="fas fa-heart" onClick={dislike}></i>
        ) : (
          <i className="far fa-heart" onClick={like}></i>
        )}
      </div>
      <hr />
      <div className="blog-comments">
        <h3>Comments:</h3>
        {comments.map((comment, key) => {
          return (
            <div className="blog-comment" key={key}>
              <p className="blog-comment-commentor">
                <Link to={`/profile/${comment[0]}`} className="router-link">
                  {comment[0]}:
                </Link>
              </p>
              <p>{comment[1]}</p>
              <p>{comment[2]}</p>
              {userData?.nickname === comment[0] ? (
                <i
                  className="fas fa-trash-alt"
                  onClick={(e) => deleteComment(e)}
                ></i>
              ) : null}
            </div>
          );
        })}
        {userData ? (
          <div className="blog-comments-add-comment">
            <label htmlFor="add-comment">Write a comment!</label>
            <input
              type="text"
              name="add-comment"
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={postComment}>Comment</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Blog;
