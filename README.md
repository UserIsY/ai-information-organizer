# ClearDayline

A clean and focused tool to turn messy information into actionable daily tasks.

## Demo

Try the live demo:
https://cleardayline.vercel.app/

Note: To manage API costs, each user is limited to 10 analyses per day.

## How It Works

1. Save your scattered notes in one place.
2. Analyze your notes and generate a clearer task preview.
3. Adopt the tasks you prefer into today's task list.

## Features

* Save up to 10 notes locally in your browser.
* Turn unorganized information into actionable tasks.
* Review generated tasks before adding them to your daily list.
* Track completed tasks with a simple checklist.

## Tech Stack

* Next.js
* TypeScript
* AI API

## Project Structure

```text
app/
├── api/
│   └── analyze/
│       └── route.ts
├── page.tsx
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/UserIsY/ClearDayline.git
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
AI_API_KEY=your_ai_api_key
AI_BASE_URL=your_ai_base_url
AI_MODEL=your_ai_model
SYSTEM_PROMPT=your_system_prompt
```

Example:

```env
AI_API_KEY=sk-ai_api_key
AI_BASE_URL=https://api.deepseek.com
AI_MODEL=deepseek-v4-flash

SYSTEM_PROMPT="Your job is to transform messy notes, ideas, tasks, and scattered information into a clear and actionable task list for today.
Follow this exact output format:

## Today's Tasks

### High Priority

1. Task name
   Next action: One short first step.

### Important

1. Task name
   Next action: One short first step.

### Later

1. Task name
   Next action: One short first step."

### End   
```

### Run locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Feedback

Have suggestions or found a bug?

Please open an issue in this repository.

## Future Improvements

Possible improvements:

* Add step-by-step action flows for individual tasks to make them easier to start and complete.
* Support file uploads for extracting tasks from documents.
* Add export options for generated task lists.

## License

MIT
