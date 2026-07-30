const forumLatest =
    'https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json';
const forumTopicUrl = 'https://forum.freecodecamp.org/t/';
const forumCategoryUrl = 'https://forum.freecodecamp.org/c/';
const avatarUrl = 'https://cdn.freecodecamp.org/curriculum/forum-latest';

const allCategories = {
    299: { category: 'Career Advice', className: 'career' },
    409: { category: 'Project Feedback', className: 'feedback' },
    417: { category: 'freeCodeCamp Support', className: 'support' },
    421: { category: 'JavaScript', className: 'javascript' },
    423: { category: 'HTML - CSS', className: 'html-css' },
    424: { category: 'Python', className: 'python' },
    432: { category: 'You Can Do This!', className: 'motivation' },
    560: { category: 'Back-End Development', className: 'backend' },
};

const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const minutes = Math.floor((now - past) / 60000);

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const viewCount = (views) => {
    if (views >= 1000) {
        const roundedViews = `${Math.floor(views / 1000)}k`;
        return roundedViews;
    }
    return views;
};

const forumCategory = (id) => {
    const selectedCategory = allCategories[id] || {
        category: 'General',
        className: 'general',
    };

    return `<a class="category ${selectedCategory.className}" href="${forumCategoryUrl}${selectedCategory.className}/${id}">${selectedCategory.category}</a>`;
};

const avatars = (posters, users) => {
    return posters
        .map((poster) => {
            const user = users.find((u) => u.id === poster.user_id);
            const template = user.avatar_template.replace('{size}', '30');
            const src = template.startsWith('/')
                ? avatarUrl + template
                : template;

            return `<img src="${src}" alt="${user.name}">`;
        })
        .join('');
};

const showLatestPosts = (data) => {
    const { users, topic_list } = data;
    const { topics } = topic_list;

    const rows = topics
        .map((topic) => {
            const {
                id,
                title,
                views,
                posts_count,
                slug,
                posters,
                category_id,
                bumped_at,
            } = topic;

            return `
                <tr>
                    <td>
                        <a
                            class="post-title"
                            href="${forumTopicUrl}${slug}/${id}"
                            >${title}</a
                        >
                        ${forumCategory(category_id)}
                    </td>
                    <td>
                        <div class="avatar-container">
                            ${avatars(posters, users)}
                        </div>
                    </td>
                    <td>${posts_count - 1}</td>
                    <td>${views}</td>
                    <td>${timeAgo(bumped_at)}</td>
                </tr>
            `;
        })
        .join('');

    document.querySelector('#posts-container').innerHTML = rows;
};

let data = [];
const fetchData = async () => {
    try {
        const res = await fetch(forumLatest);
        data = await res.json();
        showLatestPosts(data);
    } catch (error) {
        console.log('There was an error: ', error);
    }
};

fetchData();
