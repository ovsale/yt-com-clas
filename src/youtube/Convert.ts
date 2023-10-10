import fs from 'fs'
import path from 'path'

import { __dirname } from './Utils.js'
import { Comment } from './Comment.js'

const dataFolder = path.join(__dirname, '../../data')

let comments = JSON.parse(fs.readFileSync(path.join(dataFolder, 'comments.json'), 'utf8'))

let comments2: Comment[] = []
for (const comment of comments) {
    let commentId = comment.snippet.topLevelComment.id
    let commentText = comment.snippet.topLevelComment.snippet.textDisplay
    comments2.push({
        id: commentId,
        text: commentText,
        res: -1,
    })
}

let comments3 = comments2.filter(com => com.text.length < 400)
console.log(comments3.length / comments2.length)

let comments4 = comments3.slice(0, 100)
fs.writeFileSync(path.join(dataFolder, 'comments2.json'), JSON.stringify(comments4, null, 2))




