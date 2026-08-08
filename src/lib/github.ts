import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

/** Attaches (or clears) the OAuth access token used for every subsequent
 * request. Once set, requests run against the real signed-in account and
 * get the authenticated (5,000/hr) rate limit instead of the anonymous one. */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
}

export interface GithubSearchUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: "User" | "Organization";
  score: number;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  private: boolean;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  forks: number;
  language: string | null;
  default_branch: string;
  updated_at: string;
  pushed_at: string;
  created_at: string;
  size: number;
  open_issues_count: number;
  homepage: string | null;
  topics: string[];
  license: { spdx_id: string; name: string } | null;
  owner?: { login: string; avatar_url: string };
}

export interface GithubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GithubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string };
  };
  author: { login: string; avatar_url: string } | null;
}

export interface GithubBranch {
  name: string;
  commit: { sha: string };
  protected: boolean;
}

export interface GithubContentItem {
  name: string;
  path: string;
  type: "file" | "dir";
  size: number;
  html_url: string;
}

function friendlyError(err: unknown, fallback: string): Error {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) return new Error("Tidak ditemukan.");
    if (err.response?.status === 403)
      return new Error(
        "Batas permintaan GitHub API tercapai. Coba lagi beberapa saat lagi."
      );
    return new Error(err.response?.data?.message || fallback);
  }
  return new Error(fallback);
}

export async function getUser(username: string): Promise<GithubUser> {
  try {
    const { data } = await api.get(`/users/${username}`);
    return data;
  } catch (err) {
    throw friendlyError(err, "Gagal memuat data pengguna.");
  }
}

/** The currently signed-in account (requires a valid OAuth token). */
export async function getAuthenticatedUser(): Promise<GithubUser> {
  try {
    const { data } = await api.get(`/user`);
    return data;
  } catch (err) {
    throw friendlyError(err, "Gagal memuat akun kamu.");
  }
}

/** Real repositories owned by the signed-in account, public and private. */
export async function getAuthenticatedUserRepos(): Promise<GithubRepo[]> {
  try {
    const { data } = await api.get(`/user/repos`, {
      params: { per_page: 100, sort: "updated", affiliation: "owner" },
    });
    return data;
  } catch (err) {
    throw friendlyError(err, "Gagal memuat repository kamu.");
  }
}

export async function searchUsers(query: string): Promise<GithubSearchUser[]> {
  if (!query.trim()) return [];
  try {
    const { data } = await api.get(`/search/users`, {
      params: { q: query, per_page: 10 },
    });
    return data.items;
  } catch (err) {
    throw friendlyError(err, "Gagal mencari user.");
  }
}

export async function searchRepositories(query: string): Promise<GithubRepo[]> {
  if (!query.trim()) return [];
  try {
    const { data } = await api.get(`/search/repositories`, {
      params: { q: query, per_page: 10 },
    });
    return data.items;
  } catch (err) {
    throw friendlyError(err, "Gagal mencari repository.");
  }
}

export async function getUserRepos(username: string): Promise<GithubRepo[]> {
  try {
    const { data } = await api.get(`/users/${username}/repos`, {
      params: { per_page: 100, sort: "updated" },
    });
    return data;
  } catch (err) {
    throw friendlyError(err, "Gagal memuat repository.");
  }
}

export async function getRepo(
  owner: string,
  repo: string
): Promise<GithubRepo> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}`);
    return data;
  } catch (err) {
    throw friendlyError(err, "Gagal memuat detail repository.");
  }
}

export async function getRepoLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/languages`);
    return data;
  } catch {
    return {};
  }
}

export async function getRepoContributors(
  owner: string,
  repo: string
): Promise<GithubContributor[]> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: 5 },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getRepoContents(
  owner: string,
  repo: string,
  path = ""
): Promise<GithubContentItem[]> {
  try {
    const { data } = await api.get(
      `/repos/${owner}/${repo}/contents/${path}`
    );
    const items: GithubContentItem[] = Array.isArray(data) ? data : [data];
    return items.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "dir" ? -1 : 1;
    });
  } catch {
    return [];
  }
}

export async function getRepoCommits(
  owner: string,
  repo: string
): Promise<GithubCommit[]> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: 10 },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getRepoBranches(
  owner: string,
  repo: string
): Promise<GithubBranch[]> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/branches`, {
      params: { per_page: 20 },
    });
    return data;
  } catch {
    return [];
  }
}
