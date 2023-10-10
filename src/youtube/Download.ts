import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

import { __dirname } from './Utils.js'

dotenv.config()

const API_KEY = process.env.YOUTUBE_API_KEY

const videoId = "39nhkMngnFM"
const maxResults = 500

const dataFolder = path.join(__dirname, '../../data')

console.log(dataFolder)

async function getComments(pageToken?: string): Promise<string[]> {
    console.log('pageToken = ' + pageToken)

    const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&textFormat=plainText&part=snippet&videoId=${videoId}&maxResults=${maxResults}${pageToken ? "&pageToken=" + pageToken : ""}`;

    try {
      const response = await axios.get(url);
      const data = response.data;
  
    //   const comments = data.items.map((item: any) => item.snippet.topLevelComment.snippet)
      const comments = data.items.map((item: any) => item)
  
      if (data.nextPageToken) {
        const nextPageComments = await getComments(data.nextPageToken);
        return comments.concat(nextPageComments);
      }
  
      return comments;
  
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
}

let comments = await getComments()
console.log("Total Comments:", comments.length)
// console.log("Comments:", comments)
const filePath = path.join(dataFolder, 'comments.json')
fs.writeFileSync(filePath, JSON.stringify(comments, null, 2))




