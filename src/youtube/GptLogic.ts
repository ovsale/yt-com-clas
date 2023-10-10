import { getTokensCnt, embedText, callOpenAi }  from './GptUtils.js'

/************************************************************************************************/

export async function classifyCommentRu(description: string, groups: string[], comment: string): Promise<number> {
    let groupsStr = groups.map((value, index) => `${index + 1} ${value}`).join('\n')

    const sysPropmpt = `
Найди наиболее подходящую группу для комментария к YouTube видео.

Описание видео:
${description}

Группы:
${groupsStr}
`

    const userPropmpt = `
Комментарий: ${comment}
Номер наиболее подходящей группы:
`
    console.log('-------------')
    console.log("system: " + sysPropmpt)
    console.log('-------------')
    console.log("user: " + userPropmpt)

    // console.log("request tokens: " + getTokensCnt(sysPropmpt + userPropmpt))
    let resStr = await callOpenAi(sysPropmpt, userPropmpt)
    return parseInt(resStr!) - 1
}

/************************************************************************************************/

export async function classifyCommentsRu(description: string, groups: string[], comments: string[]): Promise<number[]> {
    let groupsStr = groups.map((value, index) => `${index + 1} ${value}`).join('\n')
    let commentsStr = JSON.stringify(comments, null, 2)

    const sysPropmpt = `
Найди наиболее подходящую группу для каждого комментария к YouTube видео.

Описание видео:
${description}

Группы:
${groupsStr}

Комментарии представлены в формате JSON массива.

Требуемый результат: JSON массив с соответствующими номерами групп.
`

    const userPropmpt = `
Комментарии:
${commentsStr}

Результат:
`
    // console.log('-------------')
    // console.log("system: " + sysPropmpt)
    // console.log('-------------')
    // console.log("user: " + userPropmpt)

    // console.log("request tokens: " + getTokensCnt(sysPropmpt + userPropmpt))
    let resStr = await callOpenAi(sysPropmpt, userPropmpt)
    console.log(resStr)
    let res : number[] = JSON.parse(resStr!) 
    if (res.length !== comments.length) {
        console.log('!!!!!!!!!!')
    }
    return res.map(r => r - 1)
}

/***********************************************/
