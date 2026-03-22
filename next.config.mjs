/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      sqlite3: 'commonjs sqlite3',
      tedious: 'commonjs tedious',
      pg: 'commonjs pg',
      'pg-native': 'commonjs pg-native',
      'pg-query-stream': 'commonjs pg-query-stream',
      oracledb: 'commonjs oracledb',
      'mysql-api': 'commonjs mysql-api',
      mysql: 'commonjs mysql'
    });
    return config;
  },
}

export default nextConfig;
