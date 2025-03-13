import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RepoCard from "./RepoCard";

const GITHUB_API_URL = "https://api.github.com/users/";

const Repository = () => {
  const [repos, setRepos] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { username } = useParams();

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        method: "GET",
        url: `${GITHUB_API_URL}${username}/repos`,
      });
      setRepos(response.data);
      console.log(response);
    } catch (err: any) {
      setError(err);
      setRepos(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
    console.log(repos);
  }, [username]);

  return (
    <div>
      {/* {JSON.stringify(repos)} */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {repos.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mt-4">Repositories:</h3>
          {repos.map((repo: any) => (
            <RepoCard repo={repo}></RepoCard>
          ))}
          {/* <ul className="list-disc pl-5">
            {repos.map((repo: any) => (
              <li key={repo.id}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {repo.name}
                </a>
              </li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
};

export default Repository;
