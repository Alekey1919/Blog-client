import React, { useState, useContext } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { storage } from "../firebase";
import { UserContext } from "../Helper/UserContext";
import Axios from "axios";
import { useNavigate } from "react-router";

function WriteBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [storageImgRef, setStorageImgRef] = useState(
    "https://firebasestorage.googleapis.com/v0/b/blog-50e51.appspot.com/o/blogs%2Fblog-default.jpg?alt=media&token=d11d60ee-7d08-42a2-ae42-0922e21f0bb1"
  );
  const [progress, setProgress] = useState();

  // Image upload

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file.size > 1048576) {
      alert("Max size is 1MB");
      return;
    }

    const storageRef = ref(
      storage,
      `/blogs/${Math.floor(Math.random() * 100000)}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (err) => console.error(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => setStorageImgRef(url))
          .catch((err) => console.error(err));
      }
    );
  };

  // Post

  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const handlePost = () => {
    // Getting all the tags
    const checkedBoxes = document.querySelectorAll("input[name=tags]:checked");
    const tags = [];
    checkedBoxes.forEach((box) => {
      tags.push(box.value);
    });

    // Crafting blog
    const finishedBlog = {
      title,
      body,
      author: userData.nickname,
      date: new Date().toLocaleDateString(undefined, {}),
      comments: [],
      likes: 0,
      img: storageImgRef,
      tags,
    };

    // Posting the blog
    Axios.post(
      "https://mern-blog-project-server.herokuapp.com/postBlog",
      finishedBlog
    )
      .then((res) => {
        pushBlogToUserDB(res.data._id);
      })
      .catch((err) => console.error(err.message));
  };

  const pushBlogToUserDB = (blogId) => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/setBlogToUser", {
      userId: userData._id,
      blogId,
    })
      .then((res) => navigate(`/blog/${blogId}`))
      .catch((err) => console.error(err.message));
  };

  // Tags

  const toggleTagsContainer = () => {
    document
      .querySelector(".write-blog-tags-container")
      .classList.toggle("none");
  };

  return (
    <div className="write-blog">
      <h1>Write a blog</h1>
      <div className="write-blog-image">
        <label htmlFor="file">Image</label>
        {progress ? <p>{progress}%</p> : null}
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => handleImageUpload(e)}
        />
      </div>
      <div className="write-blog-title">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="write-blog-body">
        <label htmlFor="body">Body:</label>
        <textarea
          type="text"
          name="body"
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="write-blog-tags">
        <label htmlFor="tags" onClick={toggleTagsContainer}>
          Select the tags for this blog:
        </label>
        <div className="write-blog-tags-container none">
          <div>
            <label htmlFor="cars">Cars</label>
            <input type="checkbox" name="tags" value="cars" id="cars" />
          </div>
          <div>
            <label htmlFor="videogames">Videogames</label>
            <input
              type="checkbox"
              name="tags"
              value="videogames"
              id="videogames"
            />
          </div>
          <div>
            <label htmlFor="sports">Sports</label>
            <input type="checkbox" name="tags" value="sports" id="sports" />
          </div>
          <div>
            <label htmlFor="personal">Personal</label>
            <input type="checkbox" name="tags" value="personal" id="personal" />
          </div>
          <div>
            <label htmlFor="food">Food</label>
            <input type="checkbox" name="tags" value="food" id="food" />
          </div>
          <div>
            <label htmlFor="lifestyle">Lifestyle</label>
            <input
              type="checkbox"
              name="tags"
              value="lifestyle"
              id="lifestyle"
            />
          </div>
          <div>
            <label htmlFor="business">Business / corporate</label>
            <input type="checkbox" name="tags" value="business" id="business" />
          </div>
          <div>
            <label htmlFor="news">News</label>
            <input type="checkbox" name="tags" value="news" id="news" />
          </div>
          <div>
            <label htmlFor="others">Others</label>
            <input type="checkbox" name="tags" value="others" id="others" />
          </div>
        </div>
      </div>
      <button onClick={handlePost}>Post</button>
    </div>
  );
}

export default WriteBlog;
