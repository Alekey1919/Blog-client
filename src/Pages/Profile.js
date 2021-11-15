import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Axios from "axios";
import { UserContext } from "../Helper/UserContext";

function Profile() {
  const [user, setUser] = useState();
  const [userBlogs, setUserBlogs] = useState();
  const [liked, setLiked] = useState();
  const [following, setFollowing] = useState();
  const params = useParams();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getUsers", {
      nickname: params.id,
    }).then((res) => {
      if (res.data[0]) {
        getBlogs(res.data[0].nickname);
        getLiked(res.data[0].liked);
        getFollowing(res.data[0].following);
        setUser(res.data[0]);
      } else {
        setNotFound(true);
      }
    });
  }, [params]);

  const getBlogs = (user) => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getBlogs", {
      author: user,
    })
      .then((res) => setUserBlogs(res.data))
      .catch((err) => console.error(err.message));
  };

  // Get liked

  const getLiked = (liked) => {
    // If it's empty the map function throws an error :/
    if (liked[0] === "") {
      setLiked([]);
      return;
    }

    Axios.post("https://mern-blog-project-server.herokuapp.com/getBlogs", {
      _id: {
        $in: liked,
      },
    })
      .then((res) => setLiked(res.data))
      .catch((err) => console.error(err.message));
  };

  // Get following

  const getFollowing = (following) => {
    Axios.post("https://mern-blog-project-server.herokuapp.com/getUsers", {
      nickname: {
        $in: following,
      },
    })
      .then((res) => setFollowing(res.data))
      .catch((err) => console.error(err.message));
  };

  // LOGGED USER FUNCS

  // Get logged user's followings

  const { userData, setUserData } = useContext(UserContext);

  // Follow

  const follow = () => {
    const newFollowing = userData.following;
    newFollowing.push(params.id);

    setUserData({ ...userData, liked: newFollowing });

    Axios.post("https://mern-blog-project-server.herokuapp.com/follow", {
      followerId: userData._id,
      followedNickname: params.id,
    }).catch((err) => console.error.apply(err.message));
  };

  // Unfollow

  const unfollow = () => {
    const newFollowing = userData.following;
    newFollowing.splice(newFollowing.indexOf(params.id), 1);

    setUserData({ ...userData, liked: newFollowing });

    Axios.post("https://mern-blog-project-server.herokuapp.com/unfollow", {
      followerId: userData._id,
      followedNickname: params.id,
    }).catch((err) => console.error.apply(err.message));
  };

  if (notFound) {
    return (
      <h1 className="not-found">
        There is no user with the name "{params.id}"
      </h1>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile container">
        <div className="profile-sidebar">
          <h1>{user?.nickname}</h1>
          <img src={user?.image} alt="User" />
          <div className="profile-sidebar-follow">
            {userData &&
              userData.nickname !== params.id &&
              userData.following.includes(params.id) && (
                <button onClick={unfollow}>Unfollow</button>
              )}
            {userData &&
              userData.nickname !== params.id &&
              !userData.following.includes(params.id) && (
                <button onClick={follow}>Follow</button>
              )}
            <p>{user?.followers}: Followers</p>
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-content-section">
            <h2>My blogs:</h2>
            {userBlogs
              ? userBlogs.map((blog, key) => {
                  return (
                    <Link
                      to={`/Blog/${blog._id}`}
                      className="router-link"
                      key={key}
                    >
                      <h3>{blog.title}</h3>
                    </Link>
                  );
                })
              : null}
          </div>
          <hr />
          <div className="profile-content-section">
            <h2>Blogs I like</h2>
            {liked && liked !== undefined
              ? liked.map((blog, key) => {
                  return (
                    <Link
                      to={`/blog/${blog._id}`}
                      className="router-link"
                      key={key}
                    >
                      <h3>{blog.title}</h3>
                    </Link>
                  );
                })
              : null}
          </div>
          <hr />
          <div className="profile-content-section">
            <h2>Bloggers I follow</h2>
            <div>
              {following
                ? following.map((user, key) => {
                    return (
                      <Link
                        to={`/Profile/${user.nickname}`}
                        className="router-link"
                        key={key}
                      >
                        <h3>{user.nickname}</h3>
                      </Link>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
