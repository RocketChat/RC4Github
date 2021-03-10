const jwtSecret = process.env.JWT_SECRET || "Your JWT SECRET";
const algorithm = process.env.RC_PASS_CIPHER_ALGO || "YOUR ALGO"; // For example, 'aes256'
const key = process.env.RC_PASS_CIPHER_KEY || "YOUR KEY"; //AES supports keys and iv of either 128, 192, or 256 bytes (16, 24, or 32 bytes respectively)
const iv = process.env.RC_PASS_CIPHER_IV || "YOUR IV";
const githubClientSecret =
  process.env.GITHUB_CLIENT_SECRET || "GH CLIENT SECRET";
const githubClientID = process.env.GITHUB_CLIENT_ID || "GH CLIENT ID";
const githubPrivateRepoAccessClientSecret =
  process.env.githubPrivateRepoAccessClientSecret || "GH CLIENT SECRET 2";
const githubPrivateRepoAccessClientID =
  process.env.githubPrivateRepoAccessClientID || "GH CLIENT ID 2";
const githubAuthURL = "https://github.com/login/oauth/access_token";
const githubAPIDomain = "https://api.github.com";
const rocketChatDomain = process.env.RC_DOMAIN || "http://localhost:3000";
const mongodbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1/rc4git";
const rc4gitApiURL =
  process.env.RC4GIT_API_URL || "YOUR_PUBLICLY_HOSTED_RC4GIT_API_URL";
const rc4gitDomain =
  process.env.RC4GIT_DOMAIN || "YOUR_SELF_HOSTED_RC4GIT_CLIENT";
const rc_uid = process.env.RC_UID || "ROCKET.CHAT SERVER USER ID FOR STATS";
const rc_token = process.env.RC_TOKEN || "ROCKET.CHAT SERVER USER TOKEN FOR STATS";
module.exports = {
  jwtSecret,
  algorithm,
  key,
  iv,
  githubClientSecret,
  githubClientID,
  githubAuthURL,
  githubAPIDomain,
  rocketChatDomain,
  mongodbURI,
  githubPrivateRepoAccessClientID,
  githubPrivateRepoAccessClientSecret,
  rc4gitApiURL,
  rc4gitDomain,
  rc_uid,
  rc_token
};
