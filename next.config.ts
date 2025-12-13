const branchName = process.env.BRANCH_NAME ? "/" + process.env.BRANCH_NAME : "";

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: branchName,
  basePath: branchName,
  trailingSlash: true,
};

export default nextConfig;
