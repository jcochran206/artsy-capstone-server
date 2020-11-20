const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'test-user-1',
            pwd: 'testpass1',
            email: 'john@somemail.com',
            bio: 'test bio test bio test bio',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            username: 'test-user-2',
            pwd: 'testpass2',
            email: 'jim@somemail.com',
            bio: 'test bio test bio test bio',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            username: 'test-user-3',
            pwd: 'testpass3',
            email: 'ron@somemail.com',
            bio: 'test bio test bio test bio',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            username: 'test-user-4',
            pwd: 'testpass4',
            email: 'gus@somemail.com',
            bio: 'test bio test bio test bio',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ]
}

function makePostsArray(users) {
    return [
        {
            id: 1,
            user_id: users[0].id,
            title: 'first test post!',
            pic: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            desc_post: 'test post description 1',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            user_id: users[0].id,
            title: 'second test post!',
            pic: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            desc_post: 'test post description 2',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            user_id: users[0].id,
            title: 'third test post!',
            pic: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            desc_post: 'test post description 3',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 4,
            user_id: users[0].id,
            title: 'fourth test post!',
            pic: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            desc_post: 'test post description 4',
            date_created: '2029-01-22T16:28:32.615Z'
        },
    ]
}

function makeFollowersArray() {
    return [
        {
            followed_user_id: 1,
            follower_user_id: 4,
        },
        {
            followed_user_id: 2,
            follower_user_id: 3,
        },
        {
            followed_user_id: 3,
            follower_user_id: 2,
        },
        {
            followed_user_id: 4,
            follower_user_id: 1,
        },
    ]
}

// function makeDecksCardsArray(decks, cards) {
//     return [
//         {
//             id: 1,
//             deck_id: decks[0].id || 1,
//             card_id: cards[0].id,
//         },
//         {
//             id: 2,
//             deck_id: decks[0].id || 1,
//             card_id: cards[1].id,
//         },
//         {
//             id: 3,
//             deck_id: decks[0].id || 1,
//             card_id: cards[2].id,
//         },
//         {
//             id: 4,
//             deck_id: decks[0].id || 1,
//             card_id: cards[3].id,
//         }
//     ];
// }

function makeExpectedPost(users, post) {
    const user = users
        .find(user => user.id === post.user_id)

    return {
        id: posts.id,
        user_id: posts.user_id,
        title: posts.title,
        pic: posts.pic,
        desc_post: posts.desc_post,
        user: {
            id: user.id,
            username: user.username,
        },
    }
}

function makeMaliciousPost(user) {
    const maliciousDeck = {
        id: 911,
        user_id: user.id,
        title: 'Bad name <script>alert("xss");</script>',
        pic: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        desc_post: 'Bad post <script>alert("xss");</script>',
    }
    const expectedPost = {
        ...makeExpectedDeck([user], maliciousDeck),
        name: 'Bad name &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        text: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
        maliciousDeck,
        expectedDeck,
    }
}

function makeFixtures() {
    const testUsers = makeUsersArray()
    const testPosts = makeCardsArray()
    const testFollowers = makeDecksArray(testUsers)
    return { testUsers, testPosts, testFollowers }
}


function cleanTables(db) {
    return db.transaction(trx =>
        trx.raw(
            `TRUNCATE
        users,
        posts,
        followers
        RESTART IDENTITY CASCADE
      `
        )
            .then(() =>
                Promise.all([
                    trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('users_id_seq', 0)`),
                    trx.raw(`SELECT setval('posts_id_seq', 0)`),
                ])
            )
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
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

// function seedDecksCardsTables(db, users, decks, cards = [], decksCards = []) {
//     return db.transaction(async trx => {
//         await seedUsers(trx, users)
//         await seedCards(trx, cards)
//         await trx.into('mtg_decks').insert(decks)
//         await trx.into('mtg_decks_cards').insert(decksCards)
//     })
// }

function seedDecksTables(db, users, decks) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('mtg_decks').insert(decks)
        await trx.raw(
            `SELECT setval('mtg_decks_id_seq', ?)`,
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

function makeExpectedDeck(users, deck) {
    const user = users
        .find(user => user.id === deck.user_id)

    return {
        id: article.id,
        name: article.title,
        text: article.content,
        user: {
            id: user.id,
            user_name: user.user_name,
            full_name: user.full_name,
            nickname: user.nickname,
        },
    }
}

function seedMaliciousDeck(db, user, deck) {
    return seedUsers(db, [user])
        .then(() =>
            db
                .into('mtg_decks')
                .insert([deck])
        )
}


module.exports = {
    makeUsersArray,
    makeDecksArray,
    makeCardsArray,
    makeDecksCardsArray,
    makeDecksFixtures,
    seedDecksCardsTables,
    cleanTables,
    seedUsers,
    seedDecksTables,
    seedMaliciousDeck,
    makeAuthHeader,
    makeExpectedDeck,
    makeMaliciousDeck,
}