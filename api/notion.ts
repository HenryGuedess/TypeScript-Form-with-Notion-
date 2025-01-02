import { Client } from "@notionhq/client";

const NOTION_SECRET = process.env.NOTION_SECRET;
const NOTION_DB = process.env.NOTION_DB;

// Set the runtime to "edge"
export const runtime = 'edge';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { name, phone, email } = await req.json();
    console.log('Received form data:', { name, phone, email });

    if (!NOTION_SECRET) {
      return new Response(JSON.stringify({ error: 'Notion secret is not configured' }), { status: 500 });
    }

    if (!NOTION_DB) {
      return new Response(JSON.stringify({ error: 'Notion database ID is not configured' }), { status: 500 });
    }

    const notion = new Client({ auth: NOTION_SECRET });

    const pageData = {
      parent: { database_id: NOTION_DB },
      properties: {
        'Name': { title: [{ text: { content: name } }] },
        'Phone': { rich_text: [{ text: { content: phone } }] },
        'Email': { email: email },
        'Submission Date': { date: { start: new Date().toISOString() } }
      }
    };

    const response = await notion.pages.create(pageData);
    console.log('Notion page created successfully');
    return new Response(JSON.stringify({ success: true, message: 'Form submitted successfully!' }), { status: 200 });

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process submission', details: error.message }),
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process submission', details: 'An unknown error occurred' }),
        { status: 500 }
      );
    }
  }
}
