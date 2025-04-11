import { Helmet } from "react-helmet-async";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "react-redux";
import { getBlogs } from "../../API/blogs"; // assuming postBlog is updated there
import { api } from "../../API/axiosConfig"; // assuming axiosConfig is updated there
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // <-- new state
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    console.log("Fetching blogs...");
    const response = await getBlogs();
    console.log("Fetched blogs:", response?.data?.blogs);
    setBlogs(response?.data.blogs || []);
  };

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("authorId", user.id);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // postBlog now sends a multipart/form-data request
      await api.post("blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTitle("");
      setContent("");
      setImageFile(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error posting blog:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="p-5">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <div className="w-full col-span-3  flex flex-col justify-center items-center">
            <div className="flex justify-between items-center w-full px-4 mb-6">
              <h1 className="text-2xl font-semibold">Blogs</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Post Blog</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto gap-4">
                  <DialogHeader>
                    <DialogTitle>Post Blog</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-md border border-gray-300"
                    />
                  )}
                  <Button onClick={handlePost}>Post</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="shadow-md max-w-xl">
                  <CardHeader className="flex flex-row items-center">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        blog.author?.profilePic ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${blog.author?.name}`
                      }
                      alt="profile"
                    />
                    <div className="flex flex-col ml-3">
                      <h2 className="text-lg font-semibold">
                        {blog.author.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mt-2 text-gray-700">{blog.content}</p>
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt="Blog"
                        className="mt-4 w-full h-auto rounded-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {user && (
            <div className="border-l pl-4 col-span-3">
              <div className="w-full">
                <div className="flex flex-col gap-4">
                  <Card className="p-4 shadow-md flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      Complete your profile
                    </h3>
                    {/* Add recent activities here */}
                    <Button
                      className="border border-1"
                      onClick={() => navigate("/settings/editProfile")}
                    >
                      Edit profile
                    </Button>
                  </Card>
                  <Card className="p-4 shadow-md">
                    <h3 className="text-lg font-semibold">Recent Activities</h3>
                    {/* Add recent activities here */}
                  </Card>
                  <Card className="p-4 shadow-md">
                    <h3 className="text-lg font-semibold">Quick Links</h3>
                    {/* Add quick links here */}
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
