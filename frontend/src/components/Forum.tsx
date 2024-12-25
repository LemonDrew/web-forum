import PostContainer from "./PostContainer";
import AddPost from "./AddPost";

// Page where the forum is located
function Forum() {
    return <h2>
      <AddPost/>
      <PostContainer/>
      </h2>;
  }
  
  export default Forum;
  