const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            pwd: 'Aa11bB!!',
            email: 'test1@email.com',
            bio: 'testbio1',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            username: 'test-user-2',
            pwd: 'Aa11bB!!',
            email: 'test2@email.com',
            bio: 'testbio2',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            username: 'test-user-3',
            pwd: 'Aa11bB!!',
            email: 'test3@email.com',
            bio: 'testbio3',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            username: 'test-user-4',
            pwd: 'Aa11bB!!',
            email: 'test4@email.com',
            bio: 'testbio4',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ]
}

function makePostsArray(users) {
    return [
        {
            id: 1,
            user_id: users[0].id,
            title: 'First test post!',
            pic: '',
            desc_post: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            user_id: users[1].id,
            title: 'Second test post!',
            pic: '',
            desc_post: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            user_id: users[2].id,
            title: 'Third test post!',
            pic: '',
            desc_post: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            user_id: users[3].id,
            title: 'Fourth test post!',
            pic: '',
            desc_post: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ]
}

function makeFollowersArray(users) {
    return [
        {
            followed_user_id: users[0].id,
            follower_user_id: users[1].id
        },
        {
            followed_user_id: users[1].id,
            follower_user_id: users[2].id
        },
        {
            followed_user_id: users[2].id,
            follower_user_id: users[3].id
        },
        {
            followed_user_id: users[3].id,
            follower_user_id: users[1].id
        }
    ]
}

function makeCommentsArray(posts, users) {
    return [
        {
            id: 1,
            post_id: posts[0].id,
            user_id: users[0].id,
            desc_comment: 'test comment 1'
        },
        {
            id: 2,
            post_id: posts[0].id || 1,
            user_id: users[1].id,
            desc_comment: 'test comment 2'
        },
        {
            id: 3,
            post_id: posts[0].id || 1,
            user_id: users[2].id,
            desc_comment: 'test comment 3'
        },
        {
            id: 4,
            post_id: posts[0].id || 1,
            user_id: users[4].id,
            desc_comment: 'test comment 4'
        },
    ];
}

function makeExpectedPost(users, posts, comments = []) {
    const user = users
        .find(user => user.id === posts.user_id)

    const number_of_comments = comments
        .filter(comment => comment.post_id === post.id)
        .length

    return {
        id: article.id,
        user_id: article.user_id,
        title: article.title,
        pic: article.pic,
        desc_post: article.desc_post,
        date_created: article.date_created,
        number_of_comments,
        user: {
            id: user.id,
            user_name: user.username,
        },
    }
}

function makeMaliciousPost(user) {
    const maliciousPost = {
        id: 911,
        user_id: user.id,
        title: 'Bad name <script>alert("xss");</script>',
        pic: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        desc_post: 'Bad name <script>alert("xss");</script>',
        date_created: '2029-01-22T16:28:32.615Z'
    }
    const expectedPost = {
        ...makeExpectedPost([user], maliciousPost),
        title: 'Bad name &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        desc_post: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
        maliciousDeck,
        expectedDeck,
    }
}

function makeFixtures() {
    const testUsers = makeUsersArray()
    const testPosts = makePostsArray()
    const testComments = makeCommentsArray(testUsers, testPosts)
    const testFollowers = makeFollowersArray(testUsers)
    return { testUsers, testPosts, testComments, testFollowers }
}


function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
        users,
        posts,
        comments,
        followers
        RESTART IDENTITY CASCADE
      `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE comments_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                    trx.raw(`SELECT setval('posts_id_seq', 0)`),
                    trx.raw(`SELECT setval('comments_id_seq', 0)`),
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        pwd: bcrypt.hashSync(user.pwd, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}

function seedPosts(db, posts) {
    const preppedPosts = posts.map(post => ({
        ...post
    }))
    return db.into('posts').insert(preppedPosts)
        .then(() =>
            db.raw(
                `SELECT setval('posts_id_seq', ?)`,
                [posts[posts.length - 1].id],
            )
        )
}

function seedComments(db, comments) {
    const preppedComments = comments.map(comment => ({
        ...comment
    }))
    return db.into('comments').insert(preppedComments)
        .then(() =>
            db.raw(
                `SELECT setval('comments_id_seq', ?)`,
                [comments[comments.length - 1].id],
            )
        )
}

function seedPostsTables(db, users, posts) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('posts').insert(posts)
        await trx.raw(
            `SELECT setval('posts_id_seq', ?)`,
            [decks[decks.length - 1].id],
        )
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}


module.exports = {
    makeUsersArray,
    makePostsArray,
    makeCommentsArray,
    makeFollowersArray,
    makeFixtures,
    seedFollowersTables,
    cleanTables,
    seedUsers,
    seedPosts,
    seedComments,
    seedPostsTables,
    seedMaliciousPost,
    makeAuthHeader,
    makeExpectedPost,
    makeMaliciousPost,
}