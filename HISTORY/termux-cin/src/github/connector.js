const API = "https://api.github.com";

export function createGitHubConnector(config, session) {
  const allowedPrefix = "/repos/" + config.owner + "/" + config.repository;
  return {
    async request(path, method = "GET", body = undefined) {
      if (path !== "/user" && path !== allowedPrefix && !path.startsWith(allowedPrefix + "/")) {
        const error = new Error("github_repository_outside_cin_scope"); error.status = 403; throw error;
      }
      const token = session.get();
      if (!token) { const error = new Error("github_not_authorized"); error.status = 401; throw error; }
      const url = new URL(API + path);
      const response = await fetch(url, {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: "Bearer " + token,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body === undefined ? {} : { "Content-Type": "application/json" })
        },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const error = new Error(data?.message || "github_api_http_" + response.status);
        error.status = response.status; throw error;
      }
      return data;
    }
  };
}
