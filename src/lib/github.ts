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

export interface GithubReadme {
  name: string;
  path: string;
  sha: string;
  size: number;
  content?: string;
  encoding?: string;
  html_url: string;
  download_url: string | null;
}

export interface GithubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  content: string;
  isBinary: boolean;
  downloadUrl: string | null;
  htmlUrl: string;
}

export interface GithubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  user: { login: string; avatar_url: string } | null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: {
    html_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;
}

export interface GithubReleaseAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

export interface GithubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  author: { login: string; avatar_url: string } | null;
  assets: GithubReleaseAsset[];
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

export async function getRepoReadmeHtml(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/readme`, {
      headers: {
        Accept: "application/vnd.github.html+json",
      },
    });
    return typeof data === "string" ? data : "";
  } catch {
    return "";
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<GithubFileContent> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/contents/${path}`);
    if (Array.isArray(data)) {
      throw new Error("Path is a directory.");
    }
    let decoded = "";
    let isBinary = false;
    if (data.content && data.encoding === "base64") {
      try {
        const cleanBase64 = data.content.replace(/\s/g, "");
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        decoded = new TextDecoder("utf-8").decode(bytes);
      } catch {
        isBinary = true;
      }
    } else if (typeof data.content === "string") {
      decoded = data.content;
    }
    return {
      name: data.name,
      path: data.path,
      sha: data.sha,
      size: data.size,
      content: decoded,
      isBinary,
      downloadUrl: data.download_url,
      htmlUrl: data.html_url,
    };
  } catch (err) {
    throw friendlyError(err, "Gagal memuat isi file.");
  }
}

export async function getRepoIssues(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "all"
): Promise<GithubIssue[]> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/issues`, {
      params: { per_page: 30, state },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getRepoReleases(
  owner: string,
  repo: string
): Promise<GithubRelease[]> {
  try {
    const { data } = await api.get(`/repos/${owner}/${repo}/releases`, {
      params: { per_page: 20 },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getUserStarred(username: string): Promise<GithubRepo[]> {
  try {
    const { data } = await api.get(`/users/${username}/starred`, {
      params: { per_page: 30, sort: "updated" },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getUserFollowers(username: string): Promise<GithubUser[]> {
  try {
    const { data } = await api.get(`/users/${username}/followers`, {
      params: { per_page: 30 },
    });
    return data;
  } catch {
    return [];
  }
}

export async function getUserFollowing(username: string): Promise<GithubUser[]> {
  try {
    const { data } = await api.get(`/users/${username}/following`, {
      params: { per_page: 30 },
    });
    return data;
  } catch {
    return [];
  }
}
