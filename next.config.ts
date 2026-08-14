import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static. There is no server runtime in production — GitHub Pages
  // serves the contents of `out/` as plain files.
  output: "export",

  // Pages serves `/work/foo/` from `/work/foo/index.html`. Matching that here
  // means local runs and production resolve URLs identically.
  trailingSlash: true,

  // next/image's optimiser needs a server. There isn't one.
  images: { unoptimized: true },

  // Deliberately NO basePath and NO assetPrefix.
  // This is a GitHub *user* site (venunistala.github.io), served from the
  // domain root. Adding either would prefix every asset URL with a repo name
  // and break the deployed site. Project sites need them; user sites do not.
};

export default nextConfig;
