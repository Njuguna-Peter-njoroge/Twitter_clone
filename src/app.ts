interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode?: string;
        geo?: {
            lat: string;
            lng: string;
        };
    };
    phone?: string;
    website: string;
    company?: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;

}

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}


const usersUrl = 'https://jsonplaceholder.typicode.com/users';
const postsUrl = 'https://jsonplaceholder.typicode.com/posts';
const commentsUrl = 'https://jsonplaceholder.typicode.com/comments';


const selectUser = document.getElementById('select-user') as HTMLSelectElement;
const postsContainer = document.getElementById('posts-container') as HTMLDivElement;
const commentsContainer = document.getElementById('comments-container') as HTMLDivElement;
const postCountSpan = document.getElementById('post-count') as HTMLSpanElement;
const commentCountSpan = document.getElementById('comment-count') as HTMLSpanElement;

// Profile display elements - Renamed IDs for clarity and consistency with HTML
const profileUserNameElement = document.getElementById('profile-user-name') as HTMLHeadingElement;
const profileUsernameElement = document.getElementById('profile-username') as HTMLParagraphElement;
const profileDescriptionElement = document.getElementById('profile-description') as HTMLParagraphElement;
const profileEmailElement = document.getElementById('profile-email') as HTMLParagraphElement;
const profileLocationElement = document.getElementById('profile-location') as HTMLSpanElement;

let allUsers: User[] = [];
let currentUser: User | null = null;
let currentPosts: Post[] = [];
let currentComments: Comment[] = [];


async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} from ${url}`);
    }
    return await response.json();
}


document.addEventListener('DOMContentLoaded', loadWindow);

async function loadWindow() {
    try {
        allUsers = await fetchData<User[]>(usersUrl); 
        dropdownUser(allUsers); 

        if (allUsers.length > 0) {
            selectUser.value = allUsers[0].id.toString();
            await loadUserData(parseInt(selectUser.value));
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        postsContainer.innerHTML = '<p>Error loading initial data. Please try again later.</p>';
    }
}
function dropdownUser(users: User[]) {
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

    selectUser.addEventListener('change', async () => {
        const userId = parseInt(selectUser.value);
        if (!isNaN(userId)) {
            await loadUserData(userId);
        } 
      
    });
}

async function loadUserData(userId: number) {
    try {
        const user = allUsers.find(u => u.id === userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
           
            return;
        }

        currentUser = user; 
        
        updateProfile(user);

        postsContainer.innerHTML = '<p>Loading posts...</p>';
        const posts = await fetchData<Post[]>(`${postsUrl}?userId=${userId}`);
        currentPosts = posts;
        displayPosts(posts);
        postCountSpan.textContent = `(${posts.length})`;
        if (posts.length > 0) {
            await loadPostComments(posts[0].id);
        } else {
            commentsContainer.innerHTML = '<p>No posts to display comments for.</p>';
            commentCountSpan.textContent = '(0)';
        }

    } catch (error) {
        console.error('Error loading user data:', error);
        postsContainer.innerHTML = '<p>Error loading user data. Please try again later.</p>';
        commentsContainer.innerHTML = ''; 
        postCountSpan.textContent = '(0)';
        commentCountSpan.textContent = '(0)';
    }
}

function updateProfile(user: User) {
    profileUserNameElement.textContent = user.name;
    profileUsernameElement.textContent = `@${user.username}`;
    profileDescriptionElement.textContent = user.company?.catchPhrase || 'No bio available.';
    profileEmailElement.textContent = user.email; 
    profileLocationElement.textContent = `${user.address.city}, ${user.address.street}`;
}

function displayPosts(posts: Post[]) {
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
        postElement.addEventListener('click', async () => {
            await loadPostComments(post.id);
        });

        postsContainer.appendChild(postElement);
    });
}

async function loadPostComments(postId: number) {
    try {
        commentsContainer.innerHTML = '<p>Loading comments...</p>'; 
        const comments = await fetchData<Comment[]>(`${commentsUrl}?postId=${postId}`);
        currentComments = comments;
        displayComments(comments);
        commentCountSpan.textContent = `(${comments.length})`;
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = '<p>Error loading comments.</p>';
        commentCountSpan.textContent = '(0)';
    }
}

function displayComments(comments: Comment[]) {
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