"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

type Sentiment = "Positive" | "Neutral" | "Negative";
type Urgency = "Critical" | "High" | "Medium" | "Low";
type Feedback = {
  id: number;
  customer: string;
  channel: string;
  date: string;
  text: string;
  sentiment: Sentiment;
  topic: string;
  urgency: Urgency;
};

const seed: Feedback[] = [
  { id: 1, customer: "Aarav S.", channel: "Support", date: "18 Jul", text: "My payment was deducted twice and the refund is still pending after five days.", sentiment: "Negative", topic: "Billing", urgency: "Critical" },
  { id: 2, customer: "Meera K.", channel: "App store", date: "18 Jul", text: "The new dashboard is clean and much faster. Love the simplified navigation.", sentiment: "Positive", topic: "Product UX", urgency: "Low" },
  { id: 3, customer: "Rohan P.", channel: "Email", date: "17 Jul", text: "Delivery arrived two days late and the tracking link never updated.", sentiment: "Negative", topic: "Delivery", urgency: "High" },
  { id: 4, customer: "Nisha R.", channel: "Survey", date: "17 Jul", text: "Setup was straightforward, but I would like more export formats.", sentiment: "Neutral", topic: "Features", urgency: "Medium" },
  { id: 5, customer: "Vikram D.", channel: "Support", date: "16 Jul", text: "The app crashes every time I upload a large file. This blocks our team.", sentiment: "Negative", topic: "Reliability", urgency: "Critical" },
  { id: 6, customer: "Leena M.", channel: "Survey", date: "16 Jul", text: "Customer support solved my issue in ten minutes. Excellent experience.", sentiment: "Positive", topic: "Support", urgency: "Low" },
  { id: 7, customer: "Kabir A.", channel: "Social", date: "15 Jul", text: "Good product overall, although the pricing page is a little confusing.", sentiment: "Neutral", topic: "Billing", urgency: "Medium" },
  { id: 8, customer: "Tara J.", channel: "Email", date: "15 Jul", text: "I cannot reset my password and need access before today's client meeting.", sentiment: "Negative", topic: "Account access", urgency: "High" },
  { id: 9, customer: "Dev B.", channel: "App store", date: "14 Jul", text: "Reports now load instantly. This update saved me a lot of time.", sentiment: "Positive", topic: "Performance", urgency: "Low" },
  { id: 10, customer: "Ishita G.", channel: "Support", date: "14 Jul", text: "The invoice has the wrong company address. Please correct it this week.", sentiment: "Negative", topic: "Billing", urgency: "Medium" },
  { id: 11, customer: "Arjun V.", channel: "Survey", date: "13 Jul", text: "It works as expected. A guided onboarding checklist would be useful.", sentiment: "Neutral", topic: "Onboarding", urgency: "Low" },
  { id: 12, customer: "Sara N.", channel: "Social", date: "13 Jul", text: "Fantastic service and a genuinely helpful team. Highly recommended.", sentiment: "Positive", topic: "Support", urgency: "Low" },
];

const topicKeywords: Record<string, string[]> = {
  Billing: ["payment", "refund", "price", "pricing", "invoice", "charged", "billing"],
  Delivery: ["delivery", "shipping", "tracking", "arrived"],
  Reliability: ["crash", "error", "broken", "bug", "down", "fails"],
  "Account access": ["password", "login", "access", "account"],
  Support: ["support", "service", "team", "agent", "helpful"],
  Performance: ["slow", "fast", "load", "speed", "instantly"],
  Onboarding: ["setup", "onboarding", "guide", "tutorial"],
  Features: ["feature", "export", "format", "integration"],
};

function classify(text: string, index: number): Feedback {
  const value = text.toLowerCase();
  const positive = ["love", "excellent", "great", "good", "fast", "helpful", "fantastic", "easy", "recommend", "saved"];
  const negative = ["late", "wrong", "crash", "cannot", "issue", "pending", "confusing", "slow", "deducted", "blocks", "broken", "bad"];
  const posScore = positive.filter((word) => value.includes(word)).length;
  const negScore = negative.filter((word) => value.includes(word)).length;
  const sentiment: Sentiment = posScore > negScore ? "Positive" : negScore > posScore ? "Negative" : "Neutral";
  const topic = Object.entries(topicKeywords).find(([, words]) => words.some((word) => value.includes(word)))?.[0] ?? "General";
  const urgency: Urgency = /fraud|unsafe|emergency|deducted twice|crash|blocked/.test(value) ? "Critical" : /urgent|cannot|today|late|immediately/.test(value) ? "High" : sentiment === "Negative" ? "Medium" : "Low";
  return { id: index + 1, customer: `Customer ${index + 1}`, channel: "CSV upload", date: "Today", text, sentiment, topic, urgency };
}

function parseCSV(content: string) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const cells = lines.map((line) => line.match(/("[^"]*(?:""[^"]*)*"|[^,]+)/g)?.map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"').trim()) ?? []);
  const header = cells[0].map((cell) => cell.toLowerCase());
  const textIndex = header.findIndex((cell) => ["feedback", "review", "comment", "text", "message"].includes(cell));
  const start = textIndex >= 0 ? 1 : 0;
  return cells.slice(start).map((row, index) => row[textIndex >= 0 ? textIndex : 0]).filter(Boolean).map(classify);
}

export default function Home() {
  const [feedback, setFeedback] = useState(seed);
  const [sentiment, setSentiment] = useState("All sentiment");
  const [topic, setTopic] = useState("All topics");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => ({
    positive: feedback.filter((item) => item.sentiment === "Positive").length,
    neutral: feedback.filter((item) => item.sentiment === "Neutral").length,
    negative: feedback.filter((item) => item.sentiment === "Negative").length,
    urgent: feedback.filter((item) => ["Critical", "High"].includes(item.urgency)).length,
  }), [feedback]);

  const topics = useMemo(() => Object.entries(feedback.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.topic]: (acc[item.topic] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]), [feedback]);
  const visible = feedback.filter((item) => (sentiment === "All sentiment" || item.sentiment === sentiment) && (topic === "All topics" || item.topic === topic) && `${item.text} ${item.customer}`.toLowerCase().includes(query.toLowerCase()));
  const total = Math.max(feedback.length, 1);

  const upload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCSV(String(reader.result));
      if (parsed.length) {
        setFeedback(parsed);
        setNotice(`${parsed.length} comments analyzed successfully`);
        setTimeout(() => setNotice(""), 3200);
      } else setNotice("No feedback rows found in that file");
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    const header = "Customer,Channel,Date,Feedback,Sentiment,Topic,Urgency\n";
    const rows = visible.map((item) => [item.customer, item.channel, item.date, item.text, item.sentiment, item.topic, item.urgency].map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([header + rows], { type: "text/csv" }));
    link.download = "pulseboard-analysis.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brand-mark">P</span><span>Pulseboard</span><small>AI</small></div>
        <div className="header-actions">
          <span className="status"><i /> AI analysis ready</span>
          <button className="button ghost" onClick={exportCSV}>↓ Export report</button>
          <button className="button primary" onClick={() => fileRef.current?.click()}>＋ Upload CSV</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={upload} hidden />
        </div>
      </header>

      {notice && <div className="toast">✓ {notice}</div>}

      <section className="page-head">
        <div><p className="eyebrow">CUSTOMER INTELLIGENCE</p><h1>What are your customers really saying?</h1><p>AI-organized feedback from every channel, ready for your next decision.</p></div>
        <div className="range"><span>Last 30 days</span><b>⌄</b></div>
      </section>

      <section className="metrics">
        <article className="metric"><div><span>Total feedback</span><strong>{feedback.length.toLocaleString()}</strong></div><em className="metric-icon violet">↗</em><p><b>↑ 18.4%</b> vs previous period</p></article>
        <article className="metric"><div><span>Positive sentiment</span><strong>{Math.round(counts.positive / total * 100)}%</strong></div><em className="metric-icon green">☺</em><p><b>↑ 6.2%</b> improving this month</p></article>
        <article className="metric"><div><span>Needs attention</span><strong>{counts.urgent}</strong></div><em className="metric-icon amber">!</em><p><b className="warn">{counts.negative} negative</b> comments detected</p></article>
        <article className="metric"><div><span>Top theme</span><strong className="theme-name">{topics[0]?.[0] ?? "General"}</strong></div><em className="metric-icon blue">#</em><p><b>{topics[0]?.[1] ?? 0} mentions</b> in this period</p></article>
      </section>

      <section className="insights-grid">
        <article className="panel sentiment-panel">
          <div className="panel-head"><div><h2>Sentiment overview</h2><p>How customers feel across all feedback</p></div><button aria-label="More options">•••</button></div>
          <div className="donut-row">
            <div className="donut" style={{ background: `conic-gradient(#19a777 0 ${counts.positive / total * 100}%, #f1ad43 0 ${(counts.positive + counts.neutral) / total * 100}%, #e76161 0)` }}><div><strong>{Math.round(counts.positive / total * 100)}%</strong><span>positive</span></div></div>
            <div className="legend">
              <div><i className="dot positive" /><span>Positive</span><strong>{counts.positive}</strong><small>{Math.round(counts.positive / total * 100)}%</small></div>
              <div><i className="dot neutral" /><span>Neutral</span><strong>{counts.neutral}</strong><small>{Math.round(counts.neutral / total * 100)}%</small></div>
              <div><i className="dot negative" /><span>Negative</span><strong>{counts.negative}</strong><small>{Math.round(counts.negative / total * 100)}%</small></div>
            </div>
          </div>
        </article>

        <article className="panel topic-panel">
          <div className="panel-head"><div><h2>Top conversation themes</h2><p>Most discussed topics this period</p></div><span className="ai-pill">✦ AI grouped</span></div>
          <div className="topic-list">
            {topics.slice(0, 5).map(([name, value], index) => <div className="topic-bar" key={name}><span>{name}</span><div><i style={{ width: `${Math.max(value / (topics[0]?.[1] ?? 1) * 100, 10)}%` }} /></div><strong>{value}</strong><small className={index === 0 ? "up" : ""}>{index === 0 ? "↑ 24%" : index === 1 ? "↑ 9%" : ""}</small></div>)}
          </div>
        </article>

        <article className="panel action-panel">
          <div className="panel-head"><div><h2>Recommended actions</h2><p>Prioritized opportunities from your data</p></div><span className="ai-pill">✦ AI generated</span></div>
          <div className="actions-list">
            <div className="action critical"><span>1</span><div><b>Resolve high-risk customer cases</b><p>{counts.urgent} comments indicate urgent access, reliability, or billing problems.</p></div><em>HIGH IMPACT</em></div>
            <div className="action"><span>2</span><div><b>Clarify billing communication</b><p>Explain refunds, invoices, and pricing with simpler status updates.</p></div><em>QUICK WIN</em></div>
            <div className="action"><span>3</span><div><b>Build on positive support signals</b><p>Turn strong service moments into a repeatable response playbook.</p></div><em>OPPORTUNITY</em></div>
          </div>
        </article>
      </section>

      <section className="panel feedback-panel">
        <div className="table-title"><div><h2>Feedback explorer</h2><p>Review AI-tagged comments and discover the story behind the numbers.</p></div><span>{visible.length} of {feedback.length} comments</span></div>
        <div className="toolbar">
          <label className="search">⌕<input aria-label="Search feedback" placeholder="Search feedback..." value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}><option>All sentiment</option><option>Positive</option><option>Neutral</option><option>Negative</option></select>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}><option>All topics</option>{topics.map(([name]) => <option key={name}>{name}</option>)}</select>
          <button className="clear" onClick={() => { setQuery(""); setSentiment("All sentiment"); setTopic("All topics"); }}>Clear filters</button>
        </div>
        <div className="table-wrap"><table><thead><tr><th>Customer & feedback</th><th>Channel</th><th>Sentiment</th><th>Topic</th><th>Urgency</th><th>Date</th></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><div className="customer"><span>{item.customer.charAt(0)}</span><div><b>{item.customer}</b><p>{item.text}</p></div></div></td><td>{item.channel}</td><td><span className={`tag ${item.sentiment.toLowerCase()}`}><i />{item.sentiment}</span></td><td><span className="topic-tag">{item.topic}</span></td><td><span className={`urgency ${item.urgency.toLowerCase()}`}>{item.urgency}</span></td><td>{item.date}</td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty"><b>No matching feedback</b><span>Try clearing your filters.</span></div>}</div>
      </section>

      <footer><span>Pulseboard AI · Customer Feedback Intelligence</span><span>Demo workspace · Analysis runs locally</span></footer>
    </main>
  );
}
