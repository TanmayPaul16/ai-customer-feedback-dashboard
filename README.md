# Pulseboard AI — Customer Feedback Intelligence Dashboard

An interview-ready business intelligence application that turns unstructured customer feedback into clear themes, priorities, and recommended actions.

**[View the live application](https://pulseboard-ai-feedback.paultanmay226.chatgpt.site)**

## Overview

Customer feedback often arrives through surveys, support tickets, email, app-store reviews, and social media. Reviewing this information manually is slow and makes recurring problems difficult to spot.

Pulseboard AI provides a single dashboard that:

- classifies feedback as positive, neutral, or negative;
- identifies the main business topic in every comment;
- assigns an urgency level to help teams prioritize responses;
- summarizes common themes and sentiment distribution;
- generates recommended business actions;
- supports CSV upload, search, filters, and analyzed-data export.

The demonstration runs locally in the browser and does not require an API key, making it reliable for interviews and portfolio reviews.

## Key Features

- **Executive overview:** Total feedback, positive-sentiment rate, urgent cases, and the leading conversation theme.
- **Sentiment analysis:** Visual breakdown of positive, neutral, and negative feedback.
- **Theme discovery:** Keyword-based classification across billing, delivery, reliability, account access, support, performance, onboarding, and features.
- **Urgency detection:** Critical, high, medium, and low priority tagging.
- **Recommended actions:** Automatically prioritized opportunities based on the analyzed dataset.
- **Feedback explorer:** Full-text search and filters for sentiment and topic.
- **CSV workflow:** Upload feedback for analysis and export enriched results as CSV.
- **Responsive interface:** Designed for desktop, tablet, and mobile viewing.

## Technology Stack

- React 19
- TypeScript
- Next.js-compatible application structure
- Vinext and Vite
- CSS data visualizations
- Cloudflare-compatible deployment output

## How It Works

```text
CSV feedback
     ↓
Text normalization
     ↓
Sentiment + topic + urgency classification
     ↓
Metrics, visual summaries, and recommended actions
     ↓
Searchable dashboard + enriched CSV export
```

## Run Locally

### Prerequisites

- Node.js 22.13 or newer
- npm

### Installation

```bash
git clone https://github.com/TanmayPaul16/ai-customer-feedback-dashboard.git
cd ai-customer-feedback-dashboard
npm ci
npm run dev
```

Open the local address printed in the terminal.

### Production Build

```bash
npm run build
```

## CSV Format

Upload a CSV containing a column named `feedback`, `review`, `comment`, `text`, or `message`.

```csv
feedback
"The support team resolved my problem quickly."
"My refund is still pending after five days."
"The reporting page is useful but needs more export formats."
```

If the file has no recognized header, the application analyzes the first column.

## Business Value

This prototype shows how an organization can reduce manual feedback review, surface high-risk customer issues earlier, and give business teams a shared view of customer priorities. The approach can be adapted for retail, banking, manufacturing, healthcare, CPG, and other customer-focused industries.

## Future Enhancements

- Replace heuristic classification with a hosted LLM or fine-tuned model.
- Add persistent storage and historical trend comparison.
- Connect directly to support, survey, and social-media platforms.
- Introduce multilingual analysis and automated alerts.
- Add human review and classification-confidence controls.

## Author

**Tanmay Paul**

Built as a portfolio project demonstrating rapid AI prototyping, business problem solving, dashboard development, and production deployment.
