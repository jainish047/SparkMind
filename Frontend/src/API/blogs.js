import { api } from "./axiosConfig";

export async function getBlogs() {
  return api
    .get("/blogs")
    .then((response) => {
        console.log("Fetched blogs in api:", response.data.blogs);
      return response;
    })
    .catch((err) => {
      throw err;
    });
}

export async function postBlog(title, content, authorId) {
  return api
    .post("/blogs", { title, content, authorId })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      throw err;
    });
}
