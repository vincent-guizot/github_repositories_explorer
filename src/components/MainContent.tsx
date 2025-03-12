import { useState } from "react";
import useSearch from "../hooks/useSearch";
import { Link } from "react-router-dom";

export default function GithubSearch() {
  const [search, setSearch] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const { users, loading, error } = useSearch(username);

  const handleSearch = () => {
    setUsername(search);
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter GitHub Username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <hr />
      {/* {users.length > 0 && users.map((user: any) => JSON.stringify(user))} */}
      {users.length > 0 && (
        <div>
          <ul className="list-disc">
            {users.map((user: any) => {
              {
                JSON.stringify(user);
              }
              return (
                <div key={user.id} className="rounded shadow">
                  <div className="flex">
                    <div className="flex-[0.2] p-2">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-10 h-10 rounded-full mt-2"
                      />
                    </div>
                    <div className="flex-1 p-2">
                      <h2 className="text-xl font-bold">{user.login}</h2>
                      <p>{user.bio || "No bio available"}</p>
                      <Link to={`/users/${user.login}/repos`}>See Repos</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
