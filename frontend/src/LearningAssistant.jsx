import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileText,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  AlertCircle,
} from "lucide-react";

export default function LearningAssistant() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [error, setError] = useState("");
  const [processingTime, setProcessingTime] = useState(0);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setHasAnswer(false);
    const startTime = Date.now();

    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setAnswer(data.answer || "No answer returned");
      setSources(data.sources || []);
      setConfidence(Math.round(data.confidence || 0));
      setProcessingTime(((Date.now() - startTime) / 1000).toFixed(2));
      setHasAnswer(true);
    } catch (err) {
      setError("Unable to connect to backend. Please ensure the FastAPI server is running at http://127.0.0.1:8000");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuestion = () => {
    setQuery("");
    setAnswer("");
    setSources([]);
    setConfidence(0);
    setHasAnswer(false);
    setIsExpanded(false);
    setError("");
    setProcessingTime(0);
  };

  const getConfidenceColor = (score) => {
    if (score >= 75) return "from-emerald-500 to-green-500";
    if (score >= 50) return "from-amber-500 to-yellow-500";
    return "from-red-500 to-rose-500";
  };

  const getConfidenceLabel = (score) => {
    if (score >= 75) return "High Confidence";
    if (score >= 50) return "Medium Confidence";
    return "Low Confidence";
  };

  const calculateAvgRelevance = () => {
    if (sources.length === 0) return 0;
    const total = sources.reduce((sum, s) => sum + (s.score || 0), 0);
    return Math.round((total / sources.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Context-Aware Learning Assistant
                </h1>
                <p className="text-sm text-slate-600 font-medium">
                  Document-Based Academic Question Answering System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 rounded-full shadow-lg">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">RAG System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {!hasAnswer ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <div className="w-full max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-semibold">Powered by Retrieval-Augmented Generation (RAG)</span>
                  </div>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
                    What do you want to learn today?
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Ask any computer science question and receive AI-generated answers backed by your course materials
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="backdrop-blur-xl bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-red-900 mb-1">Connection Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Query Input Card */}
                <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border border-white/50 p-8 mb-8">
                  <div className="relative">
                    <div className="absolute -top-4 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Your Question
                    </div>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., Explain deadlock in Operating System for 13 marks"
                      rows={6}
                      className="w-full px-6 py-6 text-lg text-slate-900 placeholder-slate-400 border-2 border-slate-200 rounded-xl  focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 resize-none transition-all duration-300 bg-white/50"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleSubmit();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Syllabus-based</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Instant Response</span>
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={!query.trim() || isLoading}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 overflow-hidden"
                    >
                      {isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 animate-pulse"></div>
                      )}
                      <span className="relative flex items-center space-x-2">
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Generate Answer</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="backdrop-blur-xl bg-white/60 rounded-xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Context Retrieval</h3>
                    <p className="text-sm text-slate-600">Advanced RAG system finds relevant course materials</p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/60 rounded-xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Confidence Scoring</h3>
                    <p className="text-sm text-slate-600">Transparent reliability metrics for every answer</p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/60 rounded-xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Source Transparency</h3>
                    <p className="text-sm text-slate-600">View exact sources used to generate answers</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-white/50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Your Question</span>
                    </div>
                    <p className="text-xl text-slate-900 font-medium">{query}</p>
                  </div>
                  <button
                    onClick={handleNewQuestion}
                    className="ml-4 px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    New Question
                  </button>
                </div>
              </div>

              {/* Confidence Dashboard */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/90 to-white/70 rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Answer Confidence</h3>
                      <p className="text-sm text-slate-600">Based on retrieval quality & source relevance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold bg-gradient-to-r ${getConfidenceColor(confidence)} bg-clip-text text-transparent`}>
                      {confidence}%
                    </div>
                    <span className={`text-sm font-semibold ${confidence >= 75 ? 'text-emerald-600' : confidence >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {getConfidenceLabel(confidence)}
                    </span>
                  </div>
                </div>
                
                <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300"></div>
                  <div
                    className={`relative h-full bg-gradient-to-r ${getConfidenceColor(confidence)} shadow-lg transition-all duration-1000 ease-out`}
                    style={{ width: `${confidence}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/60 rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{sources.length}</div>
                    <div className="text-xs text-slate-600 font-medium">Sources Retrieved</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{calculateAvgRelevance()}%</div>
                    <div className="text-xs text-slate-600 font-medium">Avg. Relevance</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-900">{processingTime}s</div>
                    <div className="text-xs text-slate-600 font-medium">Processing Time</div>
                  </div>
                </div>
              </div>

              {/* Generated Answer */}
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-white/50 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Generated Answer</h3>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-xl p-6">
                  <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </div>
                </div>
              </div>

              {/* Retrieved Sources */}
              <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/50 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-900">Retrieved Source Context</h3>
                      <p className="text-sm text-slate-600">View the exact documents used to generate this answer</p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-6 h-6 text-slate-600" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-8 pb-8 pt-4 space-y-4 bg-gradient-to-b from-transparent to-slate-50/50">
                    {sources.length === 0 ? (
                      <div className="text-center py-8 text-slate-600">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No source contexts available</p>
                      </div>
                    ) : (
                      sources.map((source, index) => {
                        const relevanceScore = Math.round((source.score || 0) * 100);
                        const borderColor = relevanceScore >= 80 ? 'border-emerald-200 hover:border-emerald-400' 
                                          : relevanceScore >= 60 ? 'border-blue-200 hover:border-blue-400'
                                          : 'border-purple-200 hover:border-purple-400';
                        const bgColor = relevanceScore >= 80 ? 'from-emerald-500 to-green-500'
                                      : relevanceScore >= 60 ? 'from-blue-500 to-indigo-500'
                                      : 'from-purple-500 to-pink-500';
                        const badgeColor = relevanceScore >= 80 ? 'bg-emerald-100 text-emerald-700'
                                         : relevanceScore >= 60 ? 'bg-blue-100 text-blue-700'
                                         : 'bg-purple-100 text-purple-700';
                        const accentColor = relevanceScore >= 80 ? 'border-emerald-500'
                                          : relevanceScore >= 60 ? 'border-blue-500'
                                          : 'border-purple-500';

                        return (
                          <div key={index} className={`group bg-white rounded-xl p-6 border-2 ${borderColor} hover:shadow-lg transition-all duration-300`}>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 bg-gradient-to-br ${bgColor} rounded-lg flex items-center justify-center`}>
                                  <span className="text-white font-bold text-sm">{index + 1}</span>
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900">{source.source || `Source ${index + 1}`}</div>
                                  <div className="text-xs text-slate-500">{source.subject || 'Retrieved Context'}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`px-3 py-1 ${badgeColor} rounded-full text-xs font-bold`}>
                                  {relevanceScore}% Match
                                </div>
                              </div>
                            </div>
                            <p className={`text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-4 border-l-4 ${accentColor}`}>
                              {source.text || 'No context text available'}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative backdrop-blur-xl bg-white/70 border-t border-white/20 shadow-lg mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Context-Aware Learning Assistant</span>
              <span className="text-slate-400">•</span>
              <span>Academic RAG System v2.0</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <span className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </span>
              <span className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Real-time</span>
              </span>
              <span className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>AI-Powered</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}