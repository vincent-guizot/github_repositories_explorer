const RepoCard = (props: any) => {
  const { repo } = props;
  return (
    <div className="w-full p-3">
      <div>
        <p>{repo.name}</p>
        <p>{repo.description ? repo.description : "No description"}</p>
        <a href={repo.html_url}>See repository</a>
      </div>
      <div className="flex">
        <div className="w-1/3">
          <p>Stars</p>
          <p>{repo.stargazers_count}</p>
        </div>
        <div className="w-1/3">
          <p>Forks</p>
          <p>{repo.forks}</p>
        </div>
        <div className="w-1/3">
          <p>Created At</p>
          <p>{repo.created_at}</p>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
