"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
const commentsUrl = 'https://jsonplaceholder.typicode.com/comments';
const selectUser = document.getElementById('select-user');
const postsContainer = document.getElementById('posts-container');
const commentsContainer = document.getElementById('comments-container');
const postCountSpan = document.getElementById('post-count');
const commentCountSpan = document.getElementById('comment-count');
// Profile display elements - Renamed IDs for clarity and consistency with HTML
const profileUserNameElement = document.getElementById('profile-user-name');
const profileUsernameElement = document.getElementById('profile-username');
const profileDescriptionElement = document.getElementById('profile-description');
const profileEmailElement = document.getElementById('profile-email');
const profileLocationElement = document.getElementById('profile-location');
let allUsers = [];
let currentUser = null;
let currentPosts = [];
let currentComments = [];
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} from ${url}`);
        }
        return yield response.json();
    });
}
document.addEventListener('DOMContentLoaded', loadWindow);
function loadWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            allUsers = yield fetchData(usersUrl);
            dropdownUser(allUsers);
            if (allUsers.length > 0) {
                selectUser.value = allUsers[0].id.toString();
                yield loadUserData(parseInt(selectUser.value));
            }
        }
        catch (error) {
            console.error('Error initializing app:', error);
            postsContainer.innerHTML = '<p>Error loading initial data. Please try again later.</p>';
        }
    });
}
function dropdownUser(users) {
    selectUser.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "-- Select a User --";
    selectUser.appendChild(defaultOption);
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id.toString();
        option.textContent = user.name;
        selectUser.appendChild(option);
    });
    selectUser.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(selectUser.value);
        if (!isNaN(userId)) {
            yield loadUserData(userId);
        }
    }));
}
function loadUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = allUsers.find(u => u.id === userId);
            if (!user) {
                console.error(`User with ID ${userId} not found.`);
                return;
            }
            currentUser = user;
            updateProfile(user);
            postsContainer.innerHTML = '<p>Loading posts...</p>';
            const posts = yield fetchData(`${postsUrl}?userId=${userId}`);
            currentPosts = posts;
            displayPosts(posts);
            postCountSpan.textContent = `(${posts.length})`;
            if (posts.length > 0) {
                yield loadPostComments(posts[0].id);
            }
            else {
                commentsContainer.innerHTML = '<p>No posts to display comments for.</p>';
                commentCountSpan.textContent = '(0)';
            }
        }
        catch (error) {
            console.error('Error loading user data:', error);
            postsContainer.innerHTML = '<p>Error loading user data. Please try again later.</p>';
            commentsContainer.innerHTML = '';
            postCountSpan.textContent = '(0)';
            commentCountSpan.textContent = '(0)';
        }
    });
}
function updateProfile(user) {
    var _a;
    profileUserNameElement.textContent = user.name;
    profileUsernameElement.textContent = `@${user.username}`;
    profileDescriptionElement.textContent = ((_a = user.company) === null || _a === void 0 ? void 0 : _a.catchPhrase) || 'No bio available.';
    profileEmailElement.textContent = user.email;
    profileLocationElement.textContent = `${user.address.city}, ${user.address.street}`;
}
function displayPosts(posts) {
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts found for this user.</p>';
        return;
    }
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <div class="top-card">
                <h3><img src="./user1.png" class="pic"> ${post.title}</h3>
                <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                <ion-icon name="logo-twitter"></ion-icon>
            </div>
            <p>${post.body}</p>
            <div class="card-bottom">
                <p><ion-icon name="chatbubbles-outline"></ion-icon> <span>160</span></p>
                <p><ion-icon name="repeat-outline"></ion-icon> <span>4</span></p>
                <p><ion-icon name="heart" class="last"></ion-icon> <span></span></p>
            </div>
        `;
        // Attach click listener to each post card
        postElement.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield loadPostComments(post.id);
        }));
        postsContainer.appendChild(postElement);
    });
}
function loadPostComments(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            commentsContainer.innerHTML = '<p>Loading comments...</p>';
            const comments = yield fetchData(`${commentsUrl}?postId=${postId}`);
            currentComments = comments;
            displayComments(comments);
            commentCountSpan.textContent = `(${comments.length})`;
        }
        catch (error) {
            console.error('Error loading comments:', error);
            commentsContainer.innerHTML = '<p>Error loading comments.</p>';
            commentCountSpan.textContent = '(0)';
        }
    });
}
function displayComments(comments) {
    commentsContainer.innerHTML = '';
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments for this post.</p>';
        return;
    }
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'post-card comment-card-item';
        commentElement.innerHTML = `
            <div class="top-card">
                <h3><img src="./user1.png" class="pic"> ${comment.name}</h3>
                
                <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                <ion-icon name="logo-twitter"></ion-icon>
                
            </div>
            <p>${comment.body}</p>
            <p><small>By: ${comment.email}</small></p>
            <div class="card-bottom">
                <p><ion-icon name="chatbubbles-outline"></ion-icon> <span>45</span></p>
                <p><ion-icon name="repeat-outline"></ion-icon> <span>5</span></p>
                <p><ion-icon name="heart" class="last"></ion-icon> <span>68</span></p>
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}
