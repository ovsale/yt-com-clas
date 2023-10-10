
export function getCost(model: string, in_tokens: number, out_tokens: number) : number {
    if (model.startsWith('gpt-3.5-turbo-16k')) {
        return 0.003 * (in_tokens / 1000) + 0.004 * (out_tokens / 1000)
    }
    if (model.startsWith('gpt-3.5-turbo')) {
        return 0.0015 * (in_tokens / 1000) + 0.002 * (out_tokens / 1000)
    }
    if (model.startsWith('gpt-4')) {
        return 0.03 * (in_tokens / 1000) + 0.06 * (out_tokens / 1000)
    }
    throw new Error()
}