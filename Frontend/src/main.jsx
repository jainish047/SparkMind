// import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./context/store";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import Signup from "./pages/authentication/Signup.jsx";
import Login from "./pages/authentication/Login.jsx";
import VerifyWait from "./pages/authentication/VerifyWait.jsx";
import VerifyEmail from "./pages/authentication/VerifyEmail.jsx";
import Auth from "./pages/authentication/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ExploreFreelancers from "./pages/ExploreFreelancers.jsx";
import ExploreProjects from "./pages/projects/ExploreProjects.jsx";
import Verify from "./pages/authentication/Verify.jsx";
import Home from "./pages/Home.jsx";
import List from "./pages/dashboard/List.jsx";
import Projects from "./pages/dashboard/Projects.jsx";
import Notification from "./pages/dashboard/Notification.jsx";
import ProjectUpdates from "./pages/dashboard/ProjectUpdates.jsx";
import ProjectDetails from "./pages/projects/ProjectDetails.jsx";
import ProjectNotFound from "./pages/notFoundPages/ProjectNotFound.jsx";
import NotFound from "./pages/notFoundPages/PageNotFound.jsx";
import Setting, { SettingDefault } from "./pages/setting/Setting.jsx";
import ChangePW from "./pages/setting/ChangePW.jsx";
import UpdateProfile from "./pages/setting/UpdateProfile.jsx";
import ForgotPW from "./pages/authentication/ForgotPW.jsx";
import ResetPW from "./pages/authentication/ResetPassword.jsx";
import DynamicForm from "./pages/PostProjectButtonPage/DynamicForm.jsx";
import ConfirmationPage from "./pages/PostProjectButtonPage/ConfirmationPage.jsx";
import PaymentAndBudget from "./pages/PostProjectButtonPage/PaymentAndBudget.jsx";
import ChatPage from "./pages/Chat/Chat.jsx";
import PaymentSetup from "./pages/Payment.jsx";

const Router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "verify",
    element: <Verify />,
    children: [
      {
        path: "waitEmailVerify",
        element: <VerifyWait />,
      },
      {
        path: "verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "forgotpw",
        element: <ForgotPW />,
      },
      {
        path: "setpassword",
        element: <ResetPW />,
      },
    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "lists",
            element: <List />,
          },
          {
            path: "projects",
            children: [
              {
                path: "",
                element: <Projects />,
              },
              {
                path: ":id",
                element: <ProjectDetails />,
              },
              {
                path: "*",
                element: <ProjectNotFound />,
              },
            ],
          },
          {
            path: "chat",
            element: <ChatPage />,
          },
          {
            path: "projectUpdates",
            element: <ProjectUpdates />,
          },
          {
            path: "notifications",
            element: <Notification />,
          },
        ],
      },
      {
        path: "payment",
        element: <PaymentSetup />,
      },
      {
        path: "newProject",
        element: <DynamicForm />,
      },
      {
        path: "PaymentAndBudget",
        element: <PaymentAndBudget />,
      },
      {
        path: "/PaymentAndBudget/confirmationPage",
        element: <ConfirmationPage />,
      },
      {
        path: "explore",
        children: [
          {
            path: "freelancers",
            element: <ExploreFreelancers />,
          },
          {
            path: "projects",
            element: <ExploreProjects />,
          },
        ],
      },
      {
        path: "settings",
        element: <Setting />,
        children: [
          {
            path: "",
            element: <SettingDefault />,
          },
          {
            path: "editprofile",
            element: <UpdateProfile />,
          },
          {
            path: "changepassword",

            element: <ChangePW />,
          },
        ],
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
    ],
  },
  // Catch-all route for 404 Page Not Found
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={Router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
