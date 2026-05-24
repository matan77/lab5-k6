import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

// counter for 429 responses (too many requests)
export const rateLimited429 = new Counter("rate_limited_429");

export const options = {
  vus: 10,
  duration: "15m",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<800"],
    checks: ["rate>0.95"],
  },
};
// Fails test if more than 1% of requests fail
// 95% of requests must finish under 800ms
// At least 95% of all checks/assertions must pass

const BASE_URL = "https://dummyjson.com";

const REGEX = {
  id: /^[1-9]\d*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  username: /^[a-zA-Z0-9_.-]{3,20}$/,
};

function track429(res) {
  if (res.status === 429) {
    rateLimited429.add(1);
  }
}

export default function () {
  // user
  const userRes = http.get(`${BASE_URL}/users/1`);
  const user = userRes.status === 200 ? JSON.parse(userRes.body) : {};
  const userId = String(user.id || "");

  // posts (dummy relation via limit)
  const postsRes = http.get(`${BASE_URL}/posts/user/1`);
  const posts = postsRes.status === 200 ? JSON.parse(postsRes.body).posts : [];
  const post = posts[0] || {};

  // post
  const postRes = http.get(`${BASE_URL}/posts/${post.id}`);
  const postData = postRes.status === 200 ? JSON.parse(postRes.body) : {};

  // comments
  const commentsRes = http.get(`${BASE_URL}/comments/post/${post.id}`);
  const comments =
    commentsRes.status === 200 ? JSON.parse(commentsRes.body).comments : [];
  const comment = comments[0] || {};

  const commentRes = http.get(`${BASE_URL}/comments/${comment.id}`);
  const commentData =
    commentRes.status === 200 ? JSON.parse(commentRes.body) : {};

  // random categories
  const categoriesRes = http.get(`${BASE_URL}/products/categories`);
  const rawCategories =
    categoriesRes.status === 200 ? JSON.parse(categoriesRes.body) : [];

  const categories = rawCategories.map((c) =>
    typeof c === "string" ? c : c.slug,
  );

  const category =
    categories.length > 0
      ? categories[Math.floor(Math.random() * categories.length)]
      : "smartphones";

  // products by category
  const productsRes = http.get(`${BASE_URL}/products/category/${category}`);
  const productsOk = productsRes.status === 200;

  const products = productsOk
    ? JSON.parse(productsRes.body).products || []
    : [];

  const categoryValid =
    products.length > 0 && products.every((p) => p.category === category);

  track429(userRes);
  track429(postsRes);
  track429(postRes);
  track429(commentsRes);
  track429(commentRes);
  track429(productsRes);
  // checks
  const checks = {
    user_ok: userRes.status === 200,
    posts_ok: postsRes.status === 200,
    post_ok: postRes.status === 200,
    comments_ok: commentsRes.status === 200,
    comment_ok: commentRes.status === 200,

    id_valid: REGEX.id.test(userId),
    post_id_valid: REGEX.id.test(String(post.id)),

    email_valid: REGEX.email.test(user.email),
    username_valid: REGEX.username.test(user.username || ""),

    user_post_match: postData.userId == userId,
    post_comment_match: comment.postId == post.id,
    comment_post_match: String(commentData.postId) === String(post.id),

    posts_exist: posts.length > 0,
    comments_exist: comments.length > 0,

    products_ok: productsOk,
    products_category_valid: categoryValid,
  };

  check({}, checks);

  sleep(1);
}
