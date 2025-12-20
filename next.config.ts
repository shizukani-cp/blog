const branchName = process.env.BRANCH_NAME ? "/" + process.env.BRANCH_NAME : "";

const nextConfig = {
  reactStrictMode: true,
  assetPrefix: branchName,
  basePath: process.env.NODE_ENV === 'production' ? '/blog' : '',
  trailingSlash: true,
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
