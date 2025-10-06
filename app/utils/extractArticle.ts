import { extract } from "@extractus/article-extractor"; 

export async function fetchArticleText(url:string) {
    try {
        const article = await extract (url, undefined, {headers : {"user-agent" : }})
    } catch (error) {
        
    }
    
}