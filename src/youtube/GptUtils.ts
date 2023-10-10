import { OpenAI } from "openai"
import { encoding_for_model } from "tiktoken"
import dotenv from 'dotenv'
import { getCost as getCost_ } from "./CostUtils.js"

dotenv.config()

const openai = new OpenAI()

const enc = encoding_for_model('gpt-3.5-turbo')

let cost = 0

export function getTokensCnt(text: string): number {
    return enc.encode(text).length;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
    let embeds: number[][] = [];
    for (const text of texts) {
        let embed: number[] = await embedText(text);
        embeds.push(embed);
    }
    return embeds;
}

export async function embedText(text: string): Promise<number[]> {
    const embedResult = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: [text],
    });
    return embedResult.data[0].embedding;
}

export async function callOpenAi(system: string, user: string): Promise<string | null> {
    const model = 'gpt-3.5-turbo'
    // const model = 'gpt-3.5-turbo-16k'
    // const model = 'gpt-4'
    const result = await openai.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ],
        temperature: 0,
    }, {
        // maxRetries?: 3,
        timeout: 5000,
    })
    cost += getCost_(model, result.usage!.prompt_tokens, result.usage!.completion_tokens)
    return result.choices[0]?.message?.content
}

export function getCost() {
    return cost
}
