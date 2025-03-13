const RepoCard = (props: any) => {
  const { repo } = props;
  return (
    <div className="w-full p-3 my-2 shadow">
      <div p-3>
        <p className="font-bold text-2xl">{repo.name}</p>
        <p className="">
          {repo.description ? repo.description : "No description"}
        </p>
        <a className="font-italic text-blue-500" href={repo.html_url}>
          See repository
        </a>
      </div>
      <div className="flex p-3">
        <div className="w-1/3">
          <p className="text-sm">Stars</p>
          <p className="font-bold text-3xl">{repo.stargazers_count}</p>
        </div>
        <div className="w-1/3">
          <p className="text-sm">Forks</p>
          <p className="font-bold text-3xl">{repo.forks}</p>
        </div>
        <div className="w-1/3">
          <p className="text-sm">Default Branch</p>
          <p className="font-bold text-3xl">{repo.default_branch}</p>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;
