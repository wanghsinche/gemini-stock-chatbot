import { motion } from "framer-motion";

import { LogoGoogle, MessageIcon, VercelIcon } from "./icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-[600px] mt-20 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border-none bg-muted/50 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <span className="text-2xl">📈</span>
          <span>+</span>
          <LogoGoogle />
        </p>
        <p>
          Welcome to your AI Investment Advisor powered by Google Gemini. This intelligent assistant
          combines legendary investment wisdom from books like Mastering the Market Cycle, How to Make Money in Stocks,
          and One Up on Wall Street with real-time market data and advanced analytics.
        </p>
        <p>
          Ask me about market analysis, portfolio construction, stock valuation, risk management,
          or any investment strategy. I&apos;ll provide actionable insights using proven methodologies
          and current market data to help you make informed investment decisions.
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          💡 Pro tip: Use the suggested questions below to explore different investment strategies
          and market analysis techniques from renowned investors.
        </p>
      </div>
    </motion.div>
  );
};
