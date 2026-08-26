# AI Information Organizer

An AI-powered tool that turns messy notes into clear, actionable daily tasks.

## Demo

Try the live demo:

https://ai-information-organizer.vercel.app/

## Overview

AI Information Organizer helps you transform unstructured notes, thoughts, and reminders into a focused list of actionable tasks.

Instead of manually organizing scattered information from different places, simply paste your notes and let AI extract the tasks that matter today.

## Features

- Paste messy text notes
- AI extracts today's actionable tasks
- Converts unstructured information into a clear task list
- Simple and focused MVP experience

## How It Works

1. Paste your notes into the input box
2. Click "Analyze"
3. AI organizes the information into today's actionable tasks

## Tech Stack

- Next.js
- TypeScript
- DeepSeek API

## Project Structure

```
app/  
├── api/  
│ └── analyze/  
│ └── route.ts  
├── page.tsx
```

## Getting Started

### Clone the repository

```
git clone https://github.com/UserIsY/ai-information-organizer.git
```

### Install dependencies

```
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
DEEPSEEK_API_KEY=your_api_key
SYSTEM_PROMPT=your_system_prompt
```

### Run locally

Start the development server:

```
npm run dev
```

Open:

```
http://localhost:3000
```

## Feedback

Have suggestions or found a bug?

Please open an issue in this repository.

## Future Improvements

Possible improvements:

- Save temporary notes before analysis
- Add task completion tracking
- Improve AI output customization
- Add more feedback-driven improvements

## License

MIT