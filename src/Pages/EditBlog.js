import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import { UserContext } from "../Helper/UserContext";
import { useNavigate } from "react-router";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";

function EditBlog() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const params = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState();
  const [wrongUser, setWrongUser] = useState(false);
  const [error, setError] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getBlogs", {
      _id: params.id,
    })
      .then((res) => {
        if (userData.nickname === res.data[0].author) {
          setBlog(res.data[0]);
          setTitle(res.data[0].title);
          setBody(res.data[0].body);
          setStorageImgRef(res.data[0].img);
        } else {
          setWrongUser(true);
        }
      })
      .catch((err) => setError(true));
  }, [params.id, userData.nickname]);

  // Image Update

  const [progress, setProgress] = useState();
  const [storageImgRef, setStorageImgRef] = useState();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 1048576) {
      alert("Max size is 1MB");
      return;
    }

    const storageRef = ref(
      storage,
      `/blogs/${Math.floor(Math.random() * 100000) + userData.nickname}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_change",
      (snapshot) => {
        setProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => setStorageImgRef(url))
          .catch((err) => console.error(err));
      }
    );
  };

  // Cancel

  const cancel = () => {
    navigate(`/blog/${blog._id}`);
  };

  // Confirm

  const confirm = () => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/editBlog", {
      blogId: blog._id,
      title,
      body,
      img: storageImgRef,
      date: new Date().toLocaleDateString(undefined, {}),
    })
      .then((res) => navigate(`/blog/${params.id}`))
      .catch((err) => console.error(err.message));
  };

  // Checking user is the author

  if (wrongUser) {
    return <h1>You are not the author of this blog.</h1>;
  }

  if (error) {
    return <h1>There was an error while fetching the blog. </h1>;
  }

  if (!blog) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="edit-blog container">
      <button onClick={cancel} id="cancel">
        Cancel
      </button>
      <h1>Edit blog</h1>
      <div className="edit-blog-image">
        <img src={blog.img} alt="Blog" />
        <label htmlFor="file">Change image</label>
        {progress ? <p>{progress}%</p> : null}
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => handleImageUpload(e)}
        />
      </div>
      <div className="edit-blog-title">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="edit-blog-body">
        <label htmlFor="body">Body:</label>
        <textarea
          name="body"
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button onClick={confirm} id="confirm">
        Confirm
      </button>
    </div>
  );
}

export default EditBlog;
