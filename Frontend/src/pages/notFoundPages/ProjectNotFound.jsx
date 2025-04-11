const ProjectNotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>404 - Project Not Found</h1>
      <p>The project you are looking for does not exist.</p>
      <a href="/projects">See all Projects</a>
    </div>
  );
};

export default ProjectNotFound;
