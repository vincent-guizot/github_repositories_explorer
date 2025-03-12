import { useState, useEffect } from "react";
import axios from "axios";

const GITHUB_API_URL = "https://api.github.com/search/users?q=";

function useSearch(username: string | null) {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!username) return;

    const fetchGithubData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user details
        const userResponse = await axios({
          method: "GET",
          url: `${GITHUB_API_URL}${username}&per_page=5`,
        });
        setUsers(userResponse.data.items);
        // Fetch user repositories
        // const repoResponse = await fetch(`${GITHUB_API_URL}${username}/repos`);
        // if (!repoResponse.ok) throw new Error("Repositories not found");
        // const repoData = await repoResponse.json();
        // setRepos(repoData);
        console.log(userResponse.data.items);
      } catch (err) {
        setError(err);
        setUsers(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, [username]);

  return { users, loading, error };
}

export default useSearch;
