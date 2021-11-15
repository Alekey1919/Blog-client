import { useState, useEffect } from "react";
import Test from "./Test";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Blog from "./Pages/Blog";
import { UserContext } from "./Helper/UserContext";
import Axios from "axios";
import WriteBlog from "./Pages/WriteBlog";
import EditBlog from "./Pages/EditBlog";
import TagSearch from "./Pages/TagSearch";
import Search from "./Pages/Search";

function App() {
  const [userData, setUserData] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      Axios.post("https://mern-blog-project-server.herokuapp.com/getUsers", {
        email: localStorage.getItem("user"),
      })
        .then((res) => {
          setUserData(res.data[0]);
        })
        .catch((err) => console.error(err.message));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }} className="App">
      <Router basename="/">
        <Navbar />
        <div className="main-content container">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/test" exact element={<Test />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile/:id" exact element={<Profile />} />
            <Route path="/blog/:id" exact element={<Blog />} />
            <Route path="/write-blog" exact element={<WriteBlog />} />
            <Route path="/edit-blog/:id" exact element={<EditBlog />} />
            <Route path="/tag/:id" exact element={<TagSearch />} />
            <Route path="/search/:id" exact element={<Search />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
