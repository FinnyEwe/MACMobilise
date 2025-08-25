'use server';
import { NameOption, NotionListResponse } from '@/lib/types';
import { Client } from '@notionhq/client';
import convert from 'heic-convert';

const notion = new Client({
  auth: process.env.NEXT_PRIVATE_NOTION_KEY,
});

export async function fetchCoords(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address},+AU&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  );
  return await response.json();
}

export async function fetchCommittee() {
  const response = await fetch(
    `https://api.notion.com/v1/databases/40ef5506e46b4f6196fd8f4aa8dcb4a6/query?`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PRIVATE_NOTION_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: 'Current MAC Role',
          select: {
            does_not_equal: 'Alumni',
          },
        },
      }),
    },
  );
  const responseObj: NotionListResponse = await response.json();
  let nameResults: NameOption[] = [];
  for (let person of responseObj.results) {
    const name = person.properties['Name']['title'][0]?.plain_text;
    if (name !== 'Profile Template') {
      const pageId = person.id;
      nameResults.push({ label: name, value: name, pageId });
    }
  }
  return nameResults;
}

/// I SHOULD CALL FETCHPROFILE PER ADD
// Perhaps when i fetch I should store in a database s3, GCP etc cause of notion expiry
// different colours for driver and passenger or icons

export async function fetchProfile(blockId: string) {
  console.log('Fetching profile');
  const blocks = await notion.blocks.children.list({ block_id: blockId });
  //Loop for image fetching
  for (let block of blocks.results) {
    if ('type' in block && block.type === 'image' && 'file' in block.image) {
      return convertHeic(block.image.file.url);
    } else if ('type' in block && block.type === 'column_list') {
      let blockId = block.id;
      let queue: string[] = [blockId];
      if (block.has_children) {
        while (queue.length > 0) {
          const currentId = queue.shift()!;
          const { results } = await notion.blocks.children.list({
            block_id: currentId,
          });
          for (const block of results) {
            if ('type' in block) {
              if (block.type === 'image' && 'file' in block.image) {
                return convertHeic(block.image.file.url);
              }
              if (block.has_children && ['column_list', 'column', 'toggle'].includes(block.type)) {
                queue.push(block.id);
              }
            }
          }
        }
      }
    }
  }
}

async function convertHeic(url: string) {
  console.log('hi');
  const isHeic = url.match(/\.(heic|heif)(\?.*)?$/i) !== null;
  if (!isHeic) return url;

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // Convert ArrayBuffer to Node Buffer
  const buffer = Buffer.from(arrayBuffer);

  // Pass Node Buffer to heic-convert
  const outputBuffer = await convert({
    buffer: buffer as any, // bypass type checking
    format: 'JPEG',
    quality: 0.85,
  });
  const bufferNode = Buffer.from(outputBuffer); // Node Buffer
  return `data:image/jpeg;base64,${bufferNode.toString('base64')}`;
}
