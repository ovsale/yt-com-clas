import fs from 'fs'
import path from 'path'

import { Comment } from './Comment.js'
import { classifyCommentRu, classifyCommentsRu } from './GptLogic.js'
import { getCost } from './GptUtils.js'
import { __dirname } from './Utils.js'

const dataFolder = path.join(__dirname, '../../data')

let jsonStr = fs.readFileSync(path.join(dataFolder, 'comments_test.json'), 'utf8')
let comments: Comment[] = JSON.parse(jsonStr)
console.log('cnt: ' + comments.length)
// comments = comments.slice(0, 10)
console.log('cnt: ' + comments.length)

let description = `
Пробный заезд шести электрических SUV для проверки соответствия заявленной дальности хода реальной.
Участвуют Audi Q4 e-tron Sportback, Genesis GV60, Mercedes EQA, Nissan Ariya, Tesla Model Y и Volkswagen ID Buzz.
Узнайте, кто покажет лучший результат в новом тесте с Мэтом на carwow!
`

await doClassifyComment()
// await doClassifyComments()

/***************************************************************************/

async function doClassifyComment() {
    let groups = [
        'нравятся электромобили',
        'предпочитает автомобили с ДВС или не нравятся электромобили',
        'другое'
    ]

    let res : number[] = []
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]
        let res2 = await classifyCommentRu(description, groups, comment.text)
        // let res2 = comment.res
        console.log(res2)
        res.push(res2)
    }

    let error1 = 0
    let error2 = 0
    let must = [0, 0]
    let actual = [0, 0]
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]
        console.log('- ' + comments[i].text)
        console.log(`must: ${comment.res}, actual: ${res[i]}`)
        must[comment.res]++
        actual[res[i]]++
        if (comment.res !== res[i]) {
            if (comment.res === 2 || res[i] === 2) {
                error1++
            } else {
                error2++
            }
        }
    }
    console.log('error1: ' + error1)
    console.log('error2: ' + error2)
    console.log(`must ${toPerc(must[0] / comments.length)} / ${toPerc(must[1] / comments.length)}`)
    console.log(`actual ${toPerc(actual[0] / comments.length)} / ${toPerc(actual[1] / comments.length)}`)
    console.log('cost: ' + getCost())
}

function toPerc(val: number) : string {
    return (100 * val).toFixed(0)
}

/***************************************************************************/

async function doClassifyComments() {
    // let groups = [
    //     'поддерживает Максима Каца или недоволен ФБК или за объединение опозиции',
    //     'поддерживает ФБК или недоволен Максимом Кацем или против объединения опозиции',
    //     'другое'
    // ]
    // let groups2 = [
    //     0,
    //     1,
    //     2
    // ]
    // let groups3 = [
    //     0,
    //     1,
    //     2,
    // ]
    let groups = [
        'поддерживает Максима Каца',
        'недоволен ФБК',
        'за объединение оппозиции',
        'поддерживает ФБК',
        'недоволен Максимом Кацем',
        'против объединения оппозиции',
        'другое'
    ]
    let groups2 = [
        0,
        0,
        0,
        1,
        1,
        1,
        2
    ]
    let groups3 = [
        0,
        3,
        6,
    ]

    async function fake(comments: Comment[]) : Promise<number[]> {
        return comments.map(comment => groups3[comment.res])
    }

    let res = await batchClassifyCommentsRu(description, groups, comments.map(comment => comment.text), 1)
    // let res = await fake(comments)
    console.log(res)

    let res2 = res.map(r => groups2[r])
    console.log(res2)

    for (let i = 0; i < groups.length; i++) {
        console.log('-------- ' + groups[i])
        for (let j = 0; j < comments.length; j++) {
            if (res[j] === i) {
                console.log('- ' + comments[j].text)
            }
        }
    }

    let error1 = 0
    let error2 = 0
    let must = [0, 0]
    let actual = [0, 0]
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]
        console.log('- ' + comments[i].text)
        console.log(`must: ${comment.res}, actual: ${res2[i]}`)
        must[comment.res]++
        actual[res2[i]]++
        if (comment.res !== res2[i]) {
            if (comment.res === 2 || res2[i] === 2) {
                error1++
            } else {
                error2++
            }
        }
    }
    console.log('error1: ' + error1)
    console.log('error2: ' + error2)
    console.log(`must ${toPerc(must[0] / comments.length)} / ${toPerc(must[1] / comments.length)}`)
    console.log(`actual ${toPerc(actual[0] / comments.length)} / ${toPerc(actual[1] / comments.length)}`)
}

async function batchClassifyCommentsRu(description: string, groups: string[], comments: string[], N: number)
        : Promise<number[]> {
    let result: number[] = [];
    for (let i = 0; i < comments.length; i += N) {
        const batch = comments.slice(i, i + N);
        const batchResult = await classifyCommentsRu(description, groups, batch);
        result = result.concat(batchResult);
    }
    return result;
}
