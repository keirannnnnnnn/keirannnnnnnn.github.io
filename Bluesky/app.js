import bsky from "@atproto/api";
const { BskyAgent } = bsky;

const agent = new BskyAgent({ service: "https://bsky.social" });
const feedContainer = document.getElementById("feed");

// Function to fetch and display posts
async function fetchPosts() {
    try {
        const { data } = await agent.api.com.atproto.repo.listRecords({
            reverse: true,
            repo: "shino3.bsky.social",
            collection: "app.bsky.feed.post",
        });

        displayPosts(data.records);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
    }
}

// Display posts in the HTML
function displayPosts(posts) {
    posts.slice(-5).forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        postElement.innerHTML = `
            <h3 onclick="window.open('https://bsky.social/profile/${post.repo}', '_blank')">${post.repo}</h3>
            <p>${post.value.text}</p>
            <div class="post-actions">
                <button onclick="likePost('${post.uri}')">👍 ${post.value.likes || 0}</button>
                <button onclick="repostPost('${post.uri}')">🔄 ${post.value.reposts || 0}</button>
                <button onclick="commentPost('${post.uri}')">💬 Comment</button>
            </div>
        `;
        feedContainer.appendChild(postElement);
    });
}

// Function to like a post
async function likePost(uri) {
    try {
        await agent.api.app.bsky.feed.postLike({
            uri,
            actor: agent.session.did,
        });
        alert("Liked the post!");
    } catch (error) {
        console.error("Failed to like post:", error);
    }
}

// Function to repost
async function repostPost(uri) {
    try {
        await agent.api.app.bsky.feed.repost({
            uri,
            actor: agent.session.did,
        });
        alert("Reposted!");
    } catch (error) {
        console.error("Failed to repost:", error);
    }
}

// Function to comment
async function commentPost(uri) {
    const commentText = prompt("Enter your comment:");
    if (commentText) {
        try {
            await agent.api.app.bsky.feed.reply({
                uri,
                actor: agent.session.did,
                text: commentText,
            });
            alert("Commented on the post!");
        } catch (error) {
            console.error("Failed to comment on post:", error);
        }
    }
}

// Initial fetch of posts
fetchPosts();
