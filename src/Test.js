import React, { useEffect, useState } from "react";
import Axios from "axios";

function Test() {
  const [data, setData] = useState();

  useEffect(() => {
    Axios.get("http://localhost:5000/getUsers")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err.message));
  }, []);

  return (
    <div>
      <h1>Get names test</h1>
      {data
        ? data.map((user, key) => {
            return <h1 key={key}>{user.nickname}</h1>;
          })
        : null}
    </div>
  );
}

export default Test;
