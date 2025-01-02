# TypeScript Form with Notion Integration

## How to Set Up Notion Integration

1. Create a page in Notion.
2. Add a database table.
3. Create the following columns:
    - Name (The title of the database will be the person's name)
    - Phone (text format)
    - Email (email format)
    - Submission Date (date format)
4. Copy the column ID and paste it into the `.env` file in the "NOTION_DB" field.
5. Open [Notion Integrations](https://www.notion.so/my-integrations).
6. Create a new integration and paste the Internal Integration Secret Key into the `.env` file in the "NOTION_SECRET" field.

### How to Copy the Database ID:

<img src="image.png" alt="alt text" width="400" />

<img src="image-1.png" alt="alt text" width="400" />
