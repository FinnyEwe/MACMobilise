"use server"


import { NotionListResponse } from '@/lib/types';

export async function fetchCoords(address: string){
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+AU&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  return await (response.json())
}

export async function fetchit() {
  const response = await fetch(
    `https://api.notion.com/v1/databases/40ef5506e46b4f6196fd8f4aa8dcb4a6/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PRIVATE_NOTION_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
    },
  );
  const responseObj: NotionListResponse = await response.json()
  console.log(responseObj.results[1].properties["Name"]["title"][0]["plain_text"])}
