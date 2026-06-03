import { useState } from "react";
import { BarChart3, Settings2, Info, RefreshCw, Award } from "lucide-react";
import { useAllOfflineMetricsQuery } from "./metrics.queries";

type StrategyKey = "content" | "user" | "hybrid" | "popular";

export function MetricsPage() {
  const [kParam, setKParam] = useState<number>(10);
  const [usersParam, setUsersParam] = useState<number>(20);
  
  // Local state for committing the query execution params
  const [queryParams, setQueryParams] = useState({ k: 10, users: 20 });
  const [activeTab, setActiveTab] = useState<"bar" | "radar">("bar");
  const [hoveredStrategy, setHoveredStrategy] = useState<StrategyKey | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useAllOfflineMetricsQuery(
    queryParams.k,
    queryParams.users
  );

  const handleRunEvaluation = () => {
    setQueryParams({ k: kParam, users: usersParam });
  };

  const getStrategyName = (key: string) => {
    switch (key) {
      case "content":
        return "Content-Based";
      case "user":
        return "Collaborative Filtering";
      case "hybrid":
        return "Hybrid Engine";
      case "popular":
        return "Popularity (Baseline)";
      default:
        return key;
    }
  };

  const getStrategyColor = (key: string) => {
    switch (key) {
      case "content":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-950/20";
      case "user":
        return "text-indigo-400 border-indigo-500/30 bg-indigo-950/20";
      case "hybrid":
        return "text-rose-400 border-rose-500/30 bg-rose-950/20";
      case "popular":
        return "text-amber-400 border-amber-500/30 bg-amber-950/20";
      default:
        return "text-zinc-400 border-zinc-700 bg-zinc-800/20";
    }
  };

  const getStrategyStrokeHex = (key: string) => {
    switch (key) {
      case "content":
        return "#22d3ee"; // Cyan-400
      case "user":
        return "#818cf8"; // Indigo-400
      case "hybrid":
        return "#f43f5e"; // Rose-500
      case "popular":
        return "#fbbf24"; // Amber-400
      default:
        return "#a1a1aa";
    }
  };

  const getStrategyFillHex = (key: string) => {
    switch (key) {
      case "content":
        return "rgba(34, 211, 238, 0.15)";
      case "user":
        return "rgba(129, 140, 248, 0.15)";
      case "hybrid":
        return "rgba(244, 63, 94, 0.15)";
      case "popular":
        return "rgba(251, 191, 36, 0.15)";
      default:
        return "rgba(161, 161, 170, 0.15)";
    }
  };

  // Convert API data to chartable structure
  const strategiesList: StrategyKey[] = ["content", "user", "hybrid", "popular"];
  
  const strategyData = strategiesList.map((key) => {
    const defaultData = {
      strategy: key,
      precision: 0,
      recall: 0,
      ndcg: 0,
      usersEvaluated: 0,
    };
    if (!data || !data[key]) return defaultData;
    const strat = data[key];
    return {
      strategy: key,
      precision: strat.metrics["precision@k"] || 0,
      recall: strat.metrics["recall@k"] || 0,
      ndcg: strat.metrics["ndcg@k"] || 0,
      usersEvaluated: strat.usersEvaluated,
    };
  });

  // Calculate maximum values for charts auto-scaling
  const allValues = strategyData.flatMap((d) => [d.precision, d.recall, d.ndcg]);
  const maxValue = Math.max(0.1, ...allValues);
  // Auto-scale Y-max to be slightly higher than max value (up to 1.0)
  const yMax = Math.min(1.0, Math.ceil(maxValue * 10.5) / 10.0);

  // SVG dimensions for Bar Chart
  const svgWidth = 640;
  const svgHeight = 320;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 50;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Radar Chart params
  const radarCx = 180;
  const radarCy = 160;
  const radarRadius = 110;

  // Render SVG radar coordinates
  const getRadarPoint = (metricValue: number, angleIndex: number) => {
    // 3 dimensions: 0 = Precision (UP), 1 = Recall (BOTTOM RIGHT), 2 = NDCG (BOTTOM LEFT)
    // Angles: 0 is UP (-90 degrees or -pi/2), 1 is 30 degrees (pi/6), 2 is 150 degrees (5pi/6)
    const normalizedValue = Math.min(1.0, metricValue / yMax);
    const distance = normalizedValue * radarRadius;
    let angle = 0;
    if (angleIndex === 0) {
      angle = -Math.PI / 2; // UP
    } else if (angleIndex === 1) {
      angle = Math.PI / 6; // BOTTOM RIGHT (30 deg)
    } else {
      angle = (5 * Math.PI) / 6; // BOTTOM LEFT (150 deg)
    }
    const x = radarCx + distance * Math.cos(angle);
    const y = radarCy + distance * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-teal-400 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-teal-400" />
            Evaluation Metrics
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze and compare recommendation performance using offline temporal train/test split.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="flex items-center gap-2 self-start md:self-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-teal-400 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Evaluating..." : "Refresh Data"}
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-850 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 text-teal-400 font-semibold mb-4 text-sm uppercase tracking-wider">
          <Settings2 className="h-4 w-4" />
          <span>Evaluation Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">
              Recommendation Depth (K)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={kParam}
              onChange={(e) => setKParam(parseInt(e.target.value) || 10)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
            <p className="text-[10px] text-zinc-500">Number of top recommended items evaluated.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400">
              User Sample Limit
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={usersParam}
              onChange={(e) => setUsersParam(parseInt(e.target.value) || 20)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
            <p className="text-[10px] text-zinc-500">Evaluates active users up to this limit to calculate averages.</p>
          </div>

          <button
            onClick={handleRunEvaluation}
            disabled={isLoading || isFetching}
            className="w-full bg-teal-500 hover:bg-teal-600 text-zinc-950 font-bold py-2 px-4 rounded-lg text-sm transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Run Offline Evaluation
          </button>
        </div>
      </div>

      {/* Main Content Loading State */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-zinc-950/40 rounded-xl border border-zinc-900">
          <RefreshCw className="h-8 w-8 text-teal-400 animate-spin mb-2" />
          <p className="text-zinc-400 text-sm">Running scientific evaluation splits in the database...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 text-center">
          <p className="text-red-400 font-semibold">Error retrieving evaluation metrics.</p>
          <p className="text-zinc-500 text-xs mt-1">Make sure the backend is active and seeded with interactions.</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-1.5 bg-red-950/40 border border-red-900 hover:bg-red-900/30 rounded-lg text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scorecards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {strategyData.map((d) => {
              const colorClass = getStrategyColor(d.strategy);
              return (
                <div
                  key={d.strategy}
                  className={`border rounded-xl p-4 transition-all duration-300 ${
                    hoveredStrategy === d.strategy ? "scale-[1.03] border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.1)]" : "border-zinc-800"
                  } bg-zinc-900/30`}
                  onMouseEnter={() => setHoveredStrategy(d.strategy)}
                  onMouseLeave={() => setHoveredStrategy(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {getStrategyName(d.strategy)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${colorClass}`}>
                      n={d.usersEvaluated}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-1">
                      <span className="text-zinc-400 text-xs">Precision@{queryParams.k}</span>
                      <span className="font-bold text-cyan-400">{d.precision.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-zinc-800/40 pb-1">
                      <span className="text-zinc-400 text-xs">Recall@{queryParams.k}</span>
                      <span className="font-bold text-indigo-400">{d.recall.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 text-xs">NDCG@{queryParams.k}</span>
                      <span className="font-bold text-amber-400">{d.ndcg.toFixed(4)}</span>
                    </div>
                  </div>

                  {/* Summary performance bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Award className="h-3 w-3 text-teal-400" />
                      Composite Score
                    </span>
                    <span className="text-xs font-bold text-teal-400">
                      {((d.precision + d.recall + d.ndcg) / 3).toFixed(4)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Display */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-zinc-300 font-bold text-sm uppercase tracking-wide">
                  Performance Visualizations
                </span>
                <span className="text-xs text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                  y-max: {yMax.toFixed(1)}
                </span>
              </div>
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850">
                <button
                  onClick={() => setActiveTab("bar")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "bar" ? "bg-zinc-800 text-teal-400" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Grouped Bar Chart
                </button>
                <button
                  onClick={() => setActiveTab("radar")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "radar" ? "bg-zinc-800 text-teal-400" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Radar Tradeoff Profile
                </button>
              </div>
            </div>

            {activeTab === "bar" ? (
              /* Beautiful SVG Bar Chart */
              <div className="flex flex-col lg:flex-row items-center gap-8 justify-center">
                <div className="overflow-auto max-w-full">
                  <svg
                    width={svgWidth}
                    height={svgHeight}
                    className="mx-auto rounded-lg bg-zinc-950/40 p-2 border border-zinc-900/60"
                  >
                    {/* Background Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1.0].map((tick) => {
                      const y = paddingTop + chartHeight * (1 - (tick * yMax) / yMax); // tick corresponds directly to ratio when scale matches
                      const actualVal = tick * yMax;
                      return (
                        <g key={tick} className="opacity-40">
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={svgWidth - paddingRight}
                            y2={y}
                            stroke="#3f3f46"
                            strokeWidth={1}
                            strokeDasharray={tick === 0 ? "0" : "4 4"}
                          />
                          <text
                            x={paddingLeft - 10}
                            y={y + 4}
                            fill="#a1a1aa"
                            fontSize={10}
                            textAnchor="end"
                          >
                            {actualVal.toFixed(2)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Plot bar groups for each strategy */}
                    {strategyData.map((d, index) => {
                      const groupWidth = chartWidth / strategiesList.length;
                      const groupX = paddingLeft + index * groupWidth;
                      
                      // Metrics width & gap
                      const barWidth = 14;
                      const barGap = 4;
                      const totalBarsWidth = barWidth * 3 + barGap * 2;
                      const startX = groupX + (groupWidth - totalBarsWidth) / 2;

                      // Heights based on values
                      const pHeight = (d.precision / yMax) * chartHeight;
                      const rHeight = (d.recall / yMax) * chartHeight;
                      const nHeight = (d.ndcg / yMax) * chartHeight;

                      const isHovered = hoveredStrategy === d.strategy;

                      return (
                        <g
                          key={d.strategy}
                          onMouseEnter={() => setHoveredStrategy(d.strategy)}
                          onMouseLeave={() => setHoveredStrategy(null)}
                          className="transition-all duration-300"
                        >
                          {/* Hover Background overlay */}
                          <rect
                            x={groupX + 5}
                            y={paddingTop - 10}
                            width={groupWidth - 10}
                            height={chartHeight + 20}
                            fill="rgba(20, 184, 166, 0.02)"
                            stroke={isHovered ? "rgba(20, 184, 166, 0.2)" : "transparent"}
                            strokeWidth={1}
                            rx={8}
                            className="transition-all duration-300"
                          />

                          {/* Precision Bar */}
                          <rect
                            x={startX}
                            y={paddingTop + chartHeight - pHeight}
                            width={barWidth}
                            height={pHeight}
                            fill="#06b6d4"
                            rx={2}
                            className="transition-all duration-500 hover:brightness-110"
                          />

                          {/* Recall Bar */}
                          <rect
                            x={startX + barWidth + barGap}
                            y={paddingTop + chartHeight - rHeight}
                            width={barWidth}
                            height={rHeight}
                            fill="#6366f1"
                            rx={2}
                            className="transition-all duration-500 hover:brightness-110"
                          />

                          {/* NDCG Bar */}
                          <rect
                            x={startX + (barWidth + barGap) * 2}
                            y={paddingTop + chartHeight - nHeight}
                            width={barWidth}
                            height={nHeight}
                            fill="#f59e0b"
                            rx={2}
                            className="transition-all duration-500 hover:brightness-110"
                          />

                          {/* X-axis Label */}
                          <text
                            x={groupX + groupWidth / 2}
                            y={svgHeight - paddingBottom + 20}
                            fill={isHovered ? "#22d3ee" : "#a1a1aa"}
                            fontSize={10}
                            fontWeight={isHovered ? "bold" : "normal"}
                            textAnchor="middle"
                          >
                            {getStrategyName(d.strategy)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Chart Titles / Axis lines */}
                    <line
                      x1={paddingLeft}
                      y1={paddingTop + chartHeight}
                      x2={svgWidth - paddingRight}
                      y2={paddingTop + chartHeight}
                      stroke="#52525b"
                      strokeWidth={1.5}
                    />
                  </svg>
                </div>

                {/* Legend & Tooltip Panel */}
                <div className="flex-1 w-full max-w-sm space-y-4">
                  <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Metrics Legend
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-cyan-500" />
                        <span className="text-zinc-300 font-medium">Precision@{queryParams.k}</span>
                        <span className="text-xs text-zinc-500 ml-auto">Accuracy rate of top recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-indigo-500" />
                        <span className="text-zinc-300 font-medium">Recall@{queryParams.k}</span>
                        <span className="text-xs text-zinc-500 ml-auto">Coverage of relevant test items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded bg-amber-500" />
                        <span className="text-zinc-300 font-medium">NDCG@{queryParams.k}</span>
                        <span className="text-xs text-zinc-500 ml-auto">Rank quality & discount gain</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive context card */}
                  <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl">
                    {hoveredStrategy ? (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                          Focused: {getStrategyName(hoveredStrategy)}
                        </h4>
                        {(() => {
                          const current = strategyData.find((s) => s.strategy === hoveredStrategy);
                          if (!current) return null;
                          return (
                            <div className="grid grid-cols-3 gap-2 pt-1">
                              <div className="bg-zinc-900 border border-zinc-850 p-2 rounded text-center">
                                <span className="block text-[10px] text-zinc-500 font-bold uppercase">Prec</span>
                                <span className="text-sm font-bold text-cyan-400">{current.precision.toFixed(3)}</span>
                              </div>
                              <div className="bg-zinc-900 border border-zinc-850 p-2 rounded text-center">
                                <span className="block text-[10px] text-zinc-500 font-bold uppercase">Recall</span>
                                <span className="text-sm font-bold text-indigo-400">{current.recall.toFixed(3)}</span>
                              </div>
                              <div className="bg-zinc-900 border border-zinc-850 p-2 rounded text-center">
                                <span className="block text-[10px] text-zinc-500 font-bold uppercase">NDCG</span>
                                <span className="text-sm font-bold text-amber-400">{current.ndcg.toFixed(3)}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 flex items-center gap-2 justify-center py-4">
                        <Info className="h-4 w-4 text-zinc-500" />
                        Hover over a bar group to focus metrics.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Beautiful SVG Radar (Spider) Chart */
              <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                <div className="relative">
                  <svg
                    width={360}
                    height={320}
                    className="mx-auto rounded-lg bg-zinc-950/40 p-2 border border-zinc-900/60"
                  >
                    {/* Concentric grid lines (Triangles since there are 3 variables) */}
                    {[0.25, 0.5, 0.75, 1.0].map((tick) => {
                      const p1 = getRadarPoint(tick * yMax, 0);
                      const p2 = getRadarPoint(tick * yMax, 1);
                      const p3 = getRadarPoint(tick * yMax, 2);
                      return (
                        <g key={tick} className="opacity-25">
                          <polygon
                            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                            fill="none"
                            stroke="#71717a"
                            strokeWidth={1}
                          />
                          {/* Radial grid line labels */}
                          <text
                            x={p1.x + 8}
                            y={p1.y + 4}
                            fill="#71717a"
                            fontSize={9}
                          >
                            {(tick * yMax).toFixed(2)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Radar axes radiating from center */}
                    {[0, 1, 2].map((angleIndex) => {
                      const outer = getRadarPoint(yMax, angleIndex);
                      return (
                        <line
                          key={angleIndex}
                          x1={radarCx}
                          y1={radarCy}
                          x2={outer.x}
                          y2={outer.y}
                          stroke="#3f3f46"
                          strokeWidth={1.5}
                          className="opacity-50"
                        />
                      );
                    })}

                    {/* Axis Labels */}
                    {(() => {
                      const pPrec = getRadarPoint(yMax * 1.15, 0);
                      const pRec = getRadarPoint(yMax * 1.15, 1);
                      const pNdcg = getRadarPoint(yMax * 1.15, 2);
                      return (
                        <g className="text-[10px] font-bold fill-zinc-400">
                          <text x={pPrec.x} y={pPrec.y} textAnchor="middle">
                            Precision
                          </text>
                          <text x={pRec.x} y={pRec.y + 2} textAnchor="start">
                            Recall
                          </text>
                          <text x={pNdcg.x} y={pNdcg.y + 2} textAnchor="end">
                            NDCG
                          </text>
                        </g>
                      );
                    })()}

                    {/* Plot radar polygons for each strategy */}
                    {strategyData.map((d) => {
                      const p1 = getRadarPoint(d.precision, 0);
                      const p2 = getRadarPoint(d.recall, 1);
                      const p3 = getRadarPoint(d.ndcg, 2);
                      const strokeHex = getStrategyStrokeHex(d.strategy);
                      const fillHex = getStrategyFillHex(d.strategy);
                      
                      const isFocused = hoveredStrategy === d.strategy;
                      const hasActiveHover = hoveredStrategy !== null;
                      
                      // Highlight the hovered strategy, or draw all with normal opacity
                      const opacity = !hasActiveHover ? 1.0 : isFocused ? 1.0 : 0.15;
                      
                      return (
                        <g
                          key={d.strategy}
                          style={{ transition: "opacity 300ms ease-in-out" }}
                          opacity={opacity}
                        >
                          <polygon
                            points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                            fill={fillHex}
                            stroke={strokeHex}
                            strokeWidth={isFocused ? 3 : 1.5}
                          />
                          {/* Anchor dots */}
                          <circle cx={p1.x} cy={p1.y} r={isFocused ? 4 : 3} fill={strokeHex} />
                          <circle cx={p2.x} cy={p2.y} r={isFocused ? 4 : 3} fill={strokeHex} />
                          <circle cx={p3.x} cy={p3.y} r={isFocused ? 4 : 3} fill={strokeHex} />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Radar selectors & description */}
                <div className="flex-1 w-full max-w-sm space-y-4">
                  <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-xl space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Algorithm Tradeoff Profiles
                    </h3>
                    <p className="text-xs text-zinc-500">
                      A spider profile plots Precision, Recall, and NDCG coordinates. An ideal system expands outwards towards a larger triangular area.
                    </p>
                    
                    <div className="space-y-2 mt-2">
                      {strategiesList.map((key) => {
                        const isFocused = hoveredStrategy === key;
                        const strokeHex = getStrategyStrokeHex(key);
                        return (
                          <button
                            key={key}
                            onMouseEnter={() => setHoveredStrategy(key)}
                            onMouseLeave={() => setHoveredStrategy(null)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg border text-left text-xs font-semibold transition-all ${
                              isFocused ? "border-teal-500 bg-zinc-900" : "border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900/50"
                            }`}
                          >
                            <div className="h-3.5 w-3.5 rounded-full border flex items-center justify-center" style={{ borderColor: strokeHex }}>
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: strokeHex }} />
                            </div>
                            <span className="text-zinc-300 font-bold">{getStrategyName(key)}</span>
                            <span className="text-zinc-500 ml-auto text-[10px]">Hover to Isolate</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Methodology Card */}
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-5">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 flex items-center justify-center self-start">
              <Info className="h-8 w-8 text-teal-400" />
            </div>

            <div className="space-y-3 flex-1">
              <h3 className="text-md font-bold text-zinc-200">Offline Evaluation Methodology</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                RecoForge splits each simulated user's historic interactions chronologically. The first <span className="font-semibold text-zinc-300">80% of interactions</span> are used as training events to build profiles or collaborative mappings, while the remaining <span className="font-semibold text-zinc-300">20% most recent interactions</span> are withheld as test targets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-zinc-950/50 border border-zinc-850 p-3 rounded-lg">
                  <span className="block text-xs font-bold text-cyan-400 mb-1">Precision@K</span>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Matches count of recommended items in the test set divided by K. Measures recommendation precision.
                  </p>
                </div>
                <div className="bg-zinc-950/50 border border-zinc-850 p-3 rounded-lg">
                  <span className="block text-xs font-bold text-indigo-400 mb-1">Recall@K</span>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Matches count of recommended items in the test set divided by the total size of the test split. Measures coverage.
                  </p>
                </div>
                <div className="bg-zinc-950/50 border border-zinc-850 p-3 rounded-lg">
                  <span className="block text-xs font-bold text-amber-400 mb-1">NDCG@K</span>
                  <p className="text-[11px] text-zinc-500 leading-normal">
                    Normalized Discounted Cumulative Gain. Rewards correct recommendations placed higher in list ranking orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
