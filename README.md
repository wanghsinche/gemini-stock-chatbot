<a href="https://chat.vercel.ai/">
  <img alt="AI Investment Advisor" src="app/(chat)/opengraph-image.png">
  <h1 align="center">AI Investment Advisor</h1>
</a>

<p align="center">
  <strong>Intelligent Investment Advisory Powered by Google Gemini</strong><br>
  Combining legendary investment wisdom with real-time market intelligence
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#investment-expertise"><strong>Investment Expertise</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

### 🎯 Investment Intelligence
- **Legendary Investor Wisdom** - Trained on proven strategies from Buffett, Marks, O'Neil, and other market masters
- **Real-Time Market Analysis** - Live data integration with comprehensive technical and fundamental analysis
- **Portfolio Optimization** - Risk-adjusted allocation strategies and position sizing recommendations
- **Market Cycle Recognition** - Advanced pattern recognition for timing market entries and exits

### 🚀 Technical Excellence
- [Next.js](https://nextjs.org) App Router with React Server Components
- [AI SDK](https://sdk.vercel.ai/docs) for seamless LLM integration
- [Google Gemini](https://gemini.google.com) for superior reasoning capabilities
- [shadcn/ui](https://ui.shadcn.com) with Tailwind CSS for premium UX
- [Vercel Postgres](https://vercel.com/storage/postgres) for persistent chat history
- [NextAuth.js](https://nextauthjs/next-auth) for secure authentication

### 📊 Data Integration
- [PlusE Finance MCP](https://plusefin.com) - The core engine for real-time financial data and analytics. 
- [Tavily MCP](https://www.tavily.com) - Web intelligence for market news and sentiment
- Multi-source validation for accuracy and reliability

## Investment Expertise

Our AI advisor embodies the collective wisdom of investment legends:

### 📚 Core Investment Philosophy
- **Market Cycle Mastery** - Howard Marks' framework for recognizing market phases
- **Growth Investing Excellence** - William O'Neil's CAN SLIM methodology
- **Value Investing Principles** - Warren Buffett and Benjamin Graham's fundamental analysis
- **Behavioral Finance Insights** - Daniel Kahneman's decision-making psychology

### 🔍 Analytical Capabilities
- **Fundamental Analysis** - DCF modeling, ratio analysis, competitive positioning
- **Technical Analysis** - Chart patterns, momentum indicators, support/resistance levels
- **Risk Assessment** - Volatility analysis, correlation studies, downside protection
- **Market Sentiment** - Fear & greed indicators, institutional flow analysis

### 💡 Strategic Advisory
- **Portfolio Construction** - Asset allocation, diversification strategies
- **Entry/Exit Timing** - Optimal purchase points and profit-taking strategies
- **Risk Management** - Position sizing, stop-loss placement, hedging techniques
- **Market Timing** - Economic cycle recognition and sector rotation strategies

## Model Providers

This template ships with Google Gemini `gemini-2.5-pro` models as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own AI Investment Advisor to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fgemini-chatbot&env=AUTH_SECRET,GOOGLE_GENERATIVE_AI_API_KEY,MCP_SERVER_URL_PLUSE,MCP_SERVER_URL_TAVILY&envDescription=API%20Keys%20and%20Server%20URLs%20are%20required%20for%20the%20application%20to%20run.%20Learn%20more%20below.&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fgemini-chatbot%2Fblob%2Fmain%2FREADME.md%23configuration&demo-title=AI%20Investment%20Advisor&demo-description=An%20intelligent%20investment%20advisor%20powered%20by%20Google%20Gemini%2C%20combining%20legendary%20investment%20wisdom%20with%20real-time%20market%20data.&demo-url=https%3A%2F%2Fgemini.vercel.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])

## Configuration

The AI Investment Advisor requires a few environment variables to be set up to function correctly. See [.env.example](.env.example) for the full list.

### Basic Configuration

-   `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google Gemini API key. You can get one from the [Vertex AI Dashboard](https://cloud.google.com/vertex-ai).
-   `AUTH_SECRET`: A random secret used for authentication. You can generate one [here](https://generate-secret.vercel.app/32).

### Advanced Configuration (Real-Time Financial Data)

To unlock the full potential of the AI Investment Advisor, including real-time market analysis and data, you need to configure the MCP (Master Control Program) server endpoints.

-   `MCP_SERVER_URL_PLUSE`: This is the endpoint for the **PlusE Finance MCP**, the core engine for financial data.
    -   **⭐ To get your endpoint, sign up for a free account at [PlusE Finance](https://plusefin.com).**
-   `MCP_SERVER_URL_TAVILY`: This is the endpoint for the Tavily API, used for web intelligence. You can get a key and endpoint from [Tavily](https://www.tavily.com).

## Running locally

You will need to use the environment variables defined in [.env.example](.env.example) and explained in the [Configuration](#configuration) section. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a local `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various Google Cloud and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your AI Investment Advisor should now be running on [localhost:3000](http://localhost:3000/).

## Example Investment Queries

### Market Analysis
- *"Analyze current market conditions using Mastering the Market Cycle principles"*
- *"What phase of the market cycle are we in and where are the best opportunities?"*
- *"Compare the risk-reward profiles of different market sectors"*

### Stock Analysis
- *"Provide a comprehensive analysis of Tesla (TSLA) including valuation and investment thesis"*
- *"Compare Apple, NVIDIA, and Microsoft - which offers the best risk-adjusted returns?"*
- *"Analyze [any stock] using both fundamental and technical analysis"*

### Portfolio Strategy
- *"Help me construct a diversified portfolio for current market conditions"*
- *"What position sizing should I use for different risk levels?"*
- *"Implement a dollar-cost averaging strategy for long-term wealth building"*

### Risk Management
- *"How should I set stop-losses based on current market volatility?"*
- *"Analyze correlation between my holdings and suggest rebalancing"*
- *"Recommend hedging strategies for my current portfolio"*

Each response includes specific, actionable recommendations with clear reasoning based on proven investment methodologies.
