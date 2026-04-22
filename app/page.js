'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard, Lightbulb, Video, Scissors, Image, Upload, Target,
  CreditCard, BarChart3, MessageSquare, Sparkles, Bell, Search, Menu, X,
  Check, Clock, AlertCircle, Play, Download, Eye, ThumbsUp, TrendingUp,
  ChevronRight, Plus, Filter, Calendar, DollarSign, Zap, Award, FileText,
  CheckCircle2, Circle, ArrowUpRight, Star, MoreHorizontal, RefreshCw, LogOut
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

const COLORS = {
  navy: '#0A1628', navyLight: '#1A2B47', cream: '#FAFAF5', paper: '#FFFFFF',
  gold: '#C9A961', goldLight: '#E8D5A3', ink: '#0A1628', muted: '#6B7280',
  border: '#E5E7EB', green: '#10B981', amber: '#F59E0B', red: '#EF4444', blue: '#3B82F6',
};

const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=DM+Sans:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e){} };
  }, []);
  return null;
};

const monthData = { planned: 20, shot: 14, editing: 5, review: 3, approved: 8, uploaded: 6, scheduled: 2, reelsPlanned: 12, reelsShot: 9, longsPlanned: 8, longsShot: 5 };

const ideas = {
  reels: [
    { id: 1, title: 'The #1 mistake women make with lip fillers', why: 'High emotional hook, addresses common fear', viral: 92, status: 'Approved', platform: 'Instagram' },
    { id: 2, title: 'What ₹50,000 Botox actually looks like', why: 'Price transparency trend performing well', viral: 88, status: 'In Production', platform: 'Instagram' },
    { id: 3, title: 'Before you get a facial, watch this', why: 'Authority-building + warning angle', viral: 84, status: 'Suggested', platform: 'Instagram' },
    { id: 4, title: '3 signs your aesthetic doctor is wrong for you', why: 'Trust-building, listicle format', viral: 90, status: 'Approved', platform: 'Instagram' },
  ],
  longs: [
    { id: 5, title: 'Full HydraFacial Experience — Documentary', why: 'Trust through transparency', viral: 78, status: 'Approved', platform: 'YouTube' },
    { id: 6, title: 'What happens in the first consultation', why: 'Reduces booking friction', viral: 82, status: 'In Production', platform: 'YouTube' },
    { id: 7, title: 'Aesthetic myths busted — 15 minute edition', why: 'Evergreen educational content', viral: 86, status: 'Suggested', platform: 'YouTube' },
  ],
};

const scripts = [
  { id: 1, title: 'Lip Filler Mistakes', hook: "Most women don't know this about fillers...", duration: '45s', status: 'Approved' },
  { id: 2, title: 'Botox Price Reveal', hook: "I'll show you exactly what ₹50K Botox looks like", duration: '60s', status: 'Draft' },
  { id: 3, title: 'HydraFacial Documentary', hook: 'From consultation to recovery — every step', duration: '8min', status: 'Shot' },
];

const videos = [
  { id: 1, title: 'Lip Filler Mistakes Reel', category: 'Reel', status: 'Ready for Review', shootDate: 'Apr 15', assignee: 'Vikram', version: 'v1', uploadedDate: 'Apr 18', revisionsUsed: 0 },
  { id: 2, title: 'Botox Price Transparency', category: 'Talking Head', status: 'In Editing', shootDate: 'Apr 16', assignee: 'Priya', version: 'v1', uploadedDate: null, revisionsUsed: 0 },
  { id: 3, title: 'HydraFacial Documentary', category: 'Documentary', status: 'Approved', shootDate: 'Apr 10', assignee: 'Vikram', version: 'v2', uploadedDate: 'Apr 17', revisionsUsed: 1 },
  { id: 4, title: 'Morning Clinic Routine', category: 'Reel', status: 'Shot', shootDate: 'Apr 18', assignee: 'Priya', version: null, uploadedDate: null, revisionsUsed: 0 },
  { id: 5, title: 'Patient Q&A Session', category: 'Talking Head', status: 'Published', shootDate: 'Apr 5', assignee: 'Vikram', version: 'v1', uploadedDate: 'Apr 8', revisionsUsed: 0 },
  { id: 6, title: '3 Signs Your Doctor is Wrong', category: 'Reel', status: 'Scheduled', shootDate: 'Apr 12', assignee: 'Priya', version: 'v1', uploadedDate: 'Apr 14', revisionsUsed: 0 },
];

const publishedVideos = [
  { id: 5, title: 'Patient Q&A Session', platform: 'YouTube', publishDate: 'Apr 8', views: 12400, likes: 842, comments: 67, ctr: 5.2, retention: 62, keyword: 'aesthetic clinic consultation', verdict: 'Strong start' },
  { id: 7, title: 'Dermal Filler Explained', platform: 'YouTube', publishDate: 'Apr 2', views: 8920, likes: 516, comments: 34, ctr: 4.1, retention: 54, keyword: 'dermal fillers guide', verdict: 'Good retention' },
  { id: 8, title: 'Why I Became a Surgeon (Reel)', platform: 'Instagram', publishDate: 'Mar 28', views: 34500, likes: 2840, comments: 156, ctr: 7.8, retention: 71, keyword: 'surgeon story', verdict: 'Organic winner' },
  { id: 9, title: 'Clinic Tour', platform: 'Instagram', publishDate: 'Mar 22', views: 5600, likes: 312, comments: 18, ctr: 3.2, retention: 48, keyword: 'aesthetic clinic mumbai', verdict: 'Needs better hook' },
];

const analyticsData = [
  { day: 'Mon', views: 2400, watchTime: 180 }, { day: 'Tue', views: 3200, watchTime: 220 },
  { day: 'Wed', views: 2800, watchTime: 210 }, { day: 'Thu', views: 4100, watchTime: 340 },
  { day: 'Fri', views: 5200, watchTime: 420 }, { day: 'Sat', views: 6800, watchTime: 510 },
  { day: 'Sun', views: 5900, watchTime: 480 },
];

const formatSplit = [{ name: 'Reels', value: 68, color: COLORS.navy }, { name: 'Long-form', value: 32, color: COLORS.gold }];

const adsVideos = [
  { id: 1, title: 'Lip Filler Mistakes Reel', recommend: 'green', reason: 'High engagement rate + strong hook', spend: 0, reach: 0 },
  { id: 2, title: 'Patient Q&A Session', recommend: 'green', reason: 'Top organic performer — scale with ads', spend: 5000, reach: 42000 },
  { id: 3, title: 'Clinic Tour', recommend: 'red', reason: 'Weak hook and low retention', spend: 0, reach: 0 },
  { id: 4, title: 'Dermal Filler Explained', recommend: 'yellow', reason: 'Average performance — test small budget', spend: 2000, reach: 14000 },
];

const feedbackHistory = [
  { id: 1, date: 'Apr 10', topic: 'Content direction', priority: 'Medium', status: 'Resolved', summary: 'Want more patient testimonials' },
  { id: 2, date: 'Apr 5', topic: 'Edit timing', priority: 'Low', status: 'Resolved', summary: 'Transitions on reel felt slow' },
];

const navItems = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ideas', label: 'Ideas & Scripts', icon: Lightbulb },
  { id: 'shooting', label: 'Shooting', icon: Video },
  { id: 'editing', label: 'Editing & Review', icon: Scissors },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'publishing', label: 'Publishing', icon: Upload },
  { id: 'ads', label: 'Ads', icon: Target },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'upgrade', label: 'Upgrade', icon: Sparkles },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Approved': { bg: '#D1FAE5', text: '#065F46' },
    'In Production': { bg: '#FEF3C7', text: '#92400E' },
    'Suggested': { bg: '#E0E7FF', text: '#3730A3' },
    'Draft': { bg: '#F3F4F6', text: '#374151' },
    'Shot': { bg: '#DBEAFE', text: '#1E40AF' },
    'In Editing': { bg: '#FEF3C7', text: '#92400E' },
    'Ready for Review': { bg: '#FED7AA', text: '#9A3412' },
    'Scheduled': { bg: '#E0E7FF', text: '#3730A3' },
    'Published': { bg: '#D1FAE5', text: '#065F46' },
    'Planned': { bg: '#F3F4F6', text: '#374151' },
    'Resolved': { bg: '#D1FAE5', text: '#065F46' },
    'Under Review': { bg: '#FEF3C7', text: '#92400E' },
  };
  const s = styles[status] || styles['Planned'];
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.text, fontFamily: 'DM Sans' }}>
      {status}
    </span>
  );
};

const StatCard = ({ label, value, total, icon: Icon, accent }) => (
  <div className="bg-white rounded-2xl p-5 border transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: accent ? COLORS.gold + '20' : COLORS.navy + '10' }}>
        <Icon size={18} style={{ color: accent ? COLORS.gold : COLORS.navy }} />
      </div>
    </div>
    <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans', letterSpacing: '0.02em' }}>{label}</div>
    <div className="flex items-baseline gap-2">
      <span style={{ fontFamily: 'Fraunces', fontSize: '2rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>{value}</span>
      {total && <span className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>/ {total}</span>}
    </div>
  </div>
);

const ProgressBar = ({ value, total, color }) => {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="w-full">
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color || COLORS.navy }} />
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
    <div>
      <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Fraunces', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

  const DashboardHome = ({ userName, clientId }) => {
    const [stats, setStats] = useState({ planned: 0, shot: 0, review: 0, published: 0 });
    const [reelsCount, setReelsCount] = useState({ shot: 0, planned: 0 });
    const [longsCount, setLongsCount] = useState({ shot: 0, planned: 0 });
    const [nextPayment, setNextPayment] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadData = async () => {
        const { data: allVideos } = await supabase.from('videos').select('*');
        if (allVideos) {
          const planned = allVideos.length;
          const shot = allVideos.filter(v => !['Planned', 'Script Ready'].includes(v.status)).length;
          const review = allVideos.filter(v => v.status === 'Ready for Review').length;
          const published = allVideos.filter(v => v.status === 'Published').length;
          setStats({ planned, shot, review, published });
  
          const reels = allVideos.filter(v => v.category === 'Reel');
          const longs = allVideos.filter(v => ['Talking Head', 'Documentary', 'Educational'].includes(v.category));
          setReelsCount({ shot: reels.filter(v => !['Planned', 'Script Ready'].includes(v.status)).length, planned: reels.length });
          setLongsCount({ shot: longs.filter(v => !['Planned', 'Script Ready'].includes(v.status)).length, planned: longs.length });
        }
  
        const { data: payments } = await supabase.from('payments').select('*').eq('status', 'Upcoming').order('due_date', { ascending: true }).limit(1);
        if (payments && payments.length > 0) setNextPayment(payments[0]);
  
        const { data: activity } = await supabase.from('videos').select('*').order('updated_at', { ascending: false }).limit(4);
        if (activity) setRecentActivity(activity);
  
        setLoading(false);
      };
      loadData();
    }, [clientId]);
  
    if (loading) {
      return <div className="text-center py-20" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading dashboard...</div>;
    }
  
    const daysRemaining = nextPayment ? Math.max(0, Math.ceil((new Date(nextPayment.due_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
    const completionPct = stats.planned > 0 ? Math.round((stats.published / stats.planned) * 100) : 0;
  
    return (
      <div>
        <SectionHeader title={`Good morning, ${userName || 'there'}`} subtitle={`Here's your content system for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Videos Planned" value={stats.planned} icon={Calendar} />
          <StatCard label="Shot This Month" value={stats.shot} total={stats.planned} icon={Video} />
          <StatCard label="Ready for Review" value={stats.review} icon={Clock} accent />
          <StatCard label="Published" value={stats.published} icon={CheckCircle2} />
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Monthly Progress</h3>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{completionPct}% Complete</span>
            </div>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
                  <span style={{ color: COLORS.navy, fontWeight: 500 }}>Reels</span>
                  <span style={{ color: COLORS.muted }}>{reelsCount.shot} / {reelsCount.planned}</span>
                </div>
                <ProgressBar value={reelsCount.shot} total={Math.max(reelsCount.planned, 1)} color={COLORS.navy} />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
                  <span style={{ color: COLORS.navy, fontWeight: 500 }}>Long-form Videos</span>
                  <span style={{ color: COLORS.muted }}>{longsCount.shot} / {longsCount.planned}</span>
                </div>
                <ProgressBar value={longsCount.shot} total={Math.max(longsCount.planned, 1)} color={COLORS.gold} />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
                  <span style={{ color: COLORS.navy, fontWeight: 500 }}>Published & Live</span>
                  <span style={{ color: COLORS.muted }}>{stats.published} / {stats.planned}</span>
                </div>
                <ProgressBar value={stats.published} total={Math.max(stats.planned, 1)} color={COLORS.green} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Next Payment</h3>
            {nextPayment ? (
              <>
                <div style={{ fontFamily: 'Fraunces', fontSize: '2rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>₹{Number(nextPayment.amount).toLocaleString('en-IN')}</div>
                <div className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Due {new Date(nextPayment.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: COLORS.gold + '15' }}>
                  <Clock size={14} style={{ color: COLORS.gold }} />
                  <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{daysRemaining} days remaining</span>
                </div>
              </>
            ) : (
              <div className="text-sm py-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No upcoming payments</div>
            )}
            <button className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>View Invoice</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No recent activity</div>
              ) : recentActivity.map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: item.status === 'Published' || item.status === 'Approved' ? COLORS.green : item.status === 'Ready for Review' ? COLORS.gold : COLORS.navy }} />
                    {i < recentActivity.length - 1 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: COLORS.border }} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{new Date(item.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{item.title} — {item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Review Videos', icon: Eye, count: stats.review },
                { label: 'Request Changes', icon: RefreshCw, count: null },
                { label: 'Approve Content', icon: Check, count: null },
                { label: 'Submit Feedback', icon: MessageSquare, count: null },
                { label: 'Add Ad Budget', icon: DollarSign, count: null },
                { label: 'View Analytics', icon: TrendingUp, count: null },
              ].map((action, i) => (
                <button key={i} className="p-4 rounded-xl border text-left transition-all hover:border-gray-400" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center justify-between mb-2">
                    <action.icon size={18} style={{ color: COLORS.navy }} />
                    {action.count > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 600 }}>{action.count}</span>}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const IdeasScripts = ({ clientId, userRole }) => {
    const [tab, setTab] = useState('ideas');
    const [subTab, setSubTab] = useState('reels');
    const [suggestedReels, setSuggestedReels] = useState([]);
    const [suggestedLongs, setSuggestedLongs] = useState([]);
    const [approvedReels, setApprovedReels] = useState([]);
    const [approvedLongs, setApprovedLongs] = useState([]);
    const [scriptReels, setScriptReels] = useState([]);
    const [scriptLongs, setScriptLongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [scriptGeneratingId, setScriptGeneratingId] = useState(null);
    const [scriptProgress, setScriptProgress] = useState(0);
    const [scriptStage, setScriptStage] = useState('');
    const [expandedScriptId, setExpandedScriptId] = useState(null);
    const [error, setError] = useState('');
    const [keyword, setKeyword] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressStage, setProgressStage] = useState('');
  
    const loadData = async () => {
      const { data: suggested } = await supabase
        .from('ideas').select('*').eq('status', 'Suggested')
        .order('created_at', { ascending: false });
      const { data: approved } = await supabase
        .from('ideas').select('*').eq('status', 'Approved')
        .order('created_at', { ascending: false });
      const { data: scripts } = await supabase
        .from('scripts').select('*')
        .in('status', ['Draft', 'Approved', 'In Production'])
        .order('created_at', { ascending: false });
  
      if (suggested) {
        setSuggestedReels(suggested.filter(i => i.format === 'Reel'));
        setSuggestedLongs(suggested.filter(i => i.format === 'Long-form'));
      }
      if (approved) {
        setApprovedReels(approved.filter(i => i.format === 'Reel'));
        setApprovedLongs(approved.filter(i => i.format === 'Long-form'));
      }
      if (scripts) {
        setScriptReels(scripts.filter(s => s.format === 'Reel'));
        setScriptLongs(scripts.filter(s => s.format === 'Long-form'));
      }
      setLoading(false);
    };
  
    useEffect(() => { loadData(); }, []);
  
    const currentFormat = subTab === 'reels' ? 'Reel' : 'Long-form';
  
    const handleGenerateAI = async () => {
      setGenerating(true);
      setError('');
      setProgress(0);
      setTab('ideas');
  
      const stages = [
        { percent: 22, label: 'Scanning competitor videos...' },
        { percent: 48, label: 'Analyzing viral patterns...' },
        { percent: 72, label: 'Ranking by predicted performance...' },
        { percent: 92, label: 'Finalizing your ideas...' },
      ];
  
      let stageIndex = 0;
      setProgressStage(stages[0].label);
      setProgress(stages[0].percent);
      stageIndex = 1;
  
      const progressInterval = setInterval(() => {
        if (stageIndex < stages.length) {
          setProgress(stages[stageIndex].percent);
          setProgressStage(stages[stageIndex].label);
          stageIndex++;
        }
      }, 1300);
  
      try {
        await supabase.from('ideas').update({ status: 'Archived' })
          .eq('status', 'Suggested').eq('format', currentFormat);
  
        const baseContext = 'Premium aesthetic clinic in India. Services: Botox, fillers, HydraFacial, dermal treatments. Audience: women 25-45, upper-middle class.';
        const contextWithKeyword = keyword.trim()
          ? `${baseContext} Focus especially on this topic or keyword: "${keyword.trim()}".`
          : baseContext;
  
        const apiPromise = fetch('/api/generate-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientContext: contextWithKeyword, format: currentFormat }),
        }).then(r => r.json());
  
        const minAnimationTime = new Promise(r => setTimeout(r, 5500));
        const [data] = await Promise.all([apiPromise, minAnimationTime]);
        if (data.error) throw new Error(data.error);
  
        const rows = data.ideas.map(idea => ({
          client_id: clientId || '11111111-1111-1111-1111-111111111111',
          title: idea.title,
          why_matters: idea.why_matters,
          format: idea.format || currentFormat,
          platform: idea.platform,
          viral_score: idea.viral_score,
          inspiration_source: idea.inspiration_source,
          status: 'Suggested',
        }));
        const { error: insertError } = await supabase.from('ideas').insert(rows);
        if (insertError) throw new Error(insertError.message);
  
        clearInterval(progressInterval);
        setProgress(100);
        setProgressStage('Ready');
        await loadData();
  
        setTimeout(() => {
          setGenerating(false);
          setProgress(0);
          setProgressStage('');
          setKeyword('');
        }, 600);
      } catch (e) {
        clearInterval(progressInterval);
        setError(e.message);
        setGenerating(false);
        setProgress(0);
        setProgressStage('');
      }
    };
  
    const handleApprove = async (id) => {
      await supabase.from('ideas').update({ status: 'Approved' }).eq('id', id);
      await loadData();
    };
  
    const handleReject = async (id) => {
      await supabase.from('ideas').update({ status: 'Rejected' }).eq('id', id);
      await loadData();
    };
  
    const handleDeleteIdea = async (id) => {
      if (!confirm('Delete this idea?')) return;
      await supabase.from('ideas').update({ status: 'Archived' }).eq('id', id);
      await loadData();
    };
  
    const handleDeleteScript = async (id) => {
      if (!confirm('Delete this script?')) return;
      await supabase.from('scripts').update({ status: 'Archived' }).eq('id', id);
      await loadData();
    };
  
    const handleUndoApprove = async (id) => {
      await supabase.from('ideas').update({ status: 'Suggested' }).eq('id', id);
      await loadData();
    };
  
    const handleSendToScripts = async (idea) => {
      const { error: insertError } = await supabase.from('scripts').insert({
        idea_id: idea.id,
        client_id: idea.client_id,
        title: idea.title,
        format: idea.format,
        status: 'Draft',
      });
      if (insertError) { setError(insertError.message); return; }
      await supabase.from('ideas').update({ status: 'In Production' }).eq('id', idea.id);
      setTab('scripts');
      await loadData();
    };
  
    const handleGenerateScript = async (script) => {
      setScriptGeneratingId(script.id);
      setScriptProgress(0);
      setError('');
  
      const stages = [
        { percent: 25, label: 'Analyzing your approved idea...' },
        { percent: 50, label: 'Writing the hook...' },
        { percent: 75, label: 'Structuring main points and flow...' },
        { percent: 92, label: 'Finalizing your script...' },
      ];
      let stageIndex = 0;
      setScriptStage(stages[0].label);
      setScriptProgress(stages[0].percent);
      stageIndex = 1;
  
      const progressInterval = setInterval(() => {
        if (stageIndex < stages.length) {
          setScriptProgress(stages[stageIndex].percent);
          setScriptStage(stages[stageIndex].label);
          stageIndex++;
        }
      }, 1300);
  
      try {
        const { data: ideaData } = await supabase.from('ideas').select('*').eq('id', script.idea_id).single();
        const ideaForPrompt = ideaData || { title: script.title, format: script.format, platform: 'Instagram', why_matters: '' };
  
        const apiPromise = fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea: ideaForPrompt }),
        }).then(r => r.json());
  
        const minAnimationTime = new Promise(r => setTimeout(r, 5500));
        const [data] = await Promise.all([apiPromise, minAnimationTime]);
        if (data.error) throw new Error(data.error);
  
        const { error: updateError } = await supabase.from('scripts').update({
          hook: data.script.hook,
          main_points: data.script.main_points,
          cta: data.script.cta,
          scenes: data.script.scenes,
          important_lines: data.script.important_lines,
          flow: data.script.flow,
        }).eq('id', script.id);
        if (updateError) throw new Error(updateError.message);
  
        clearInterval(progressInterval);
        setScriptProgress(100);
        setScriptStage('Ready');
        setExpandedScriptId(script.id);
        await loadData();
  
        setTimeout(() => {
          setScriptGeneratingId(null);
          setScriptProgress(0);
          setScriptStage('');
        }, 600);
      } catch (e) {
        clearInterval(progressInterval);
        setError(e.message);
        setScriptGeneratingId(null);
        setScriptProgress(0);
        setScriptStage('');
      }
    };
  
    let list = [];
    if (tab === 'ideas') list = subTab === 'reels' ? suggestedReels : suggestedLongs;
    else if (tab === 'approved') list = subTab === 'reels' ? approvedReels : approvedLongs;
    else if (tab === 'scripts') list = subTab === 'reels' ? scriptReels : scriptLongs;
  
    const tabs = [
      { id: 'ideas', label: 'Ideas', count: suggestedReels.length + suggestedLongs.length },
      { id: 'approved', label: 'Approved', count: approvedReels.length + approvedLongs.length },
      { id: 'scripts', label: 'Scripts', count: scriptReels.length + scriptLongs.length },
    ];
  
    const emptyMessage = () => {
      if (tab === 'ideas') return { title: `No ${subTab === 'reels' ? 'reel' : 'long-form'} ideas yet`, sub: `Click "Generate 6 Ideas with AI" to get ${subTab === 'reels' ? 'Reel' : 'Long-form'} ideas` };
      if (tab === 'approved') return { title: `No approved ${subTab === 'reels' ? 'reels' : 'long-form'} yet`, sub: 'Approve ideas from the Ideas tab to see them here' };
      return { title: `No ${subTab === 'reels' ? 'reel' : 'long-form'} scripts yet`, sub: 'Send an approved idea to Scripts from the Approved tab' };
    };
  
    const ScriptSection = ({ label, text, placeholder }) => (
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '0.08em' }}>{label}</div>
        <div className="text-sm whitespace-pre-wrap" style={{ color: text ? COLORS.navy : COLORS.muted, fontFamily: 'DM Sans', lineHeight: 1.6, fontStyle: text ? 'normal' : 'italic' }}>
          {text || placeholder}
        </div>
      </div>
    );
  
    return (
      <div>
        <SectionHeader
          title="Ideas & Scripts"
          subtitle="AI-researched content topics tailored for your niche"
          action={(
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} disabled={generating}
                placeholder="Keyword (optional)" className="px-3 py-2 rounded-lg border text-sm outline-none transition-all"
                style={{ borderColor: COLORS.border, fontFamily: 'DM Sans', minWidth: 180, backgroundColor: 'white' }} />
              <button onClick={handleGenerateAI} disabled={generating}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm transition-opacity"
                style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 500, opacity: generating ? 0.6 : 1 }}>
                <Sparkles size={16} />
                {generating ? 'Generating...' : `Generate 6 ${currentFormat === 'Reel' ? 'Reel' : 'Long-form'} Ideas`}
              </button>
            </div>
          )}
        />
  
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: COLORS.red + '15', color: COLORS.red, fontFamily: 'DM Sans' }}>{error}</div>
        )}
  
        {generating && (
          <div className="mb-6 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} style={{ color: COLORS.gold }} />
                <span style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy }}>Generating premium {currentFormat === 'Reel' ? 'Reel' : 'Long-form'} ideas for your clinic</span>
              </div>
              <span className="text-sm" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: COLORS.border }}>
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.gold} 100%)` }} />
            </div>
            <div className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontStyle: 'italic' }}>{progressStage}</div>
          </div>
        )}
  
        <div className="flex gap-1 p-1 rounded-xl mb-6 inline-flex bg-white border" style={{ borderColor: COLORS.border }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="px-5 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
              style={{ backgroundColor: tab === t.id ? COLORS.navy : 'transparent', color: tab === t.id ? 'white' : COLORS.muted, fontFamily: 'DM Sans', fontWeight: 500 }}>
              <span>{t.label}</span>
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: tab === t.id ? COLORS.gold : COLORS.border, color: tab === t.id ? 'white' : COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
  
        <div className="flex gap-2 mb-6">
          {[{ id: 'reels', label: 'Reels' }, { id: 'longs', label: 'Long-form' }].map(s => (
            <button key={s.id} onClick={() => setSubTab(s.id)} className="px-4 py-1.5 rounded-full text-sm border transition-all"
              style={{ borderColor: subTab === s.id ? COLORS.navy : COLORS.border, backgroundColor: subTab === s.id ? COLORS.navy : 'white', color: subTab === s.id ? 'white' : COLORS.muted, fontFamily: 'DM Sans' }}>
              {s.label}
            </button>
          ))}
        </div>
  
        {loading ? (
          <div className="text-center py-10" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading...</div>
        ) : list.length === 0 && !generating ? (
          <div className="bg-white rounded-2xl p-10 border text-center" style={{ borderColor: COLORS.border }}>
            <Lightbulb size={32} style={{ color: COLORS.muted, margin: '0 auto 12px' }} />
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', color: COLORS.navy, fontWeight: 500 }}>{emptyMessage().title}</div>
            <div className="text-sm mt-2" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{emptyMessage().sub}</div>
          </div>
        ) : tab === 'scripts' ? (
          <div className="space-y-4">
            {list.map(item => {
              const hasContent = item.hook || item.main_points;
              const isExpanded = expandedScriptId === item.id || !hasContent;
              const isGenerating = scriptGeneratingId === item.id;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-6 border transition-all" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={item.status} />
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.navy + '10', color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{item.format}</span>
                      </div>
                      <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1.3 }}>{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasContent && (
                        <button onClick={() => setExpandedScriptId(isExpanded ? null : item.id)} className="p-1.5 rounded-lg border text-xs transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                      )}
                      <button onClick={() => handleDeleteScript(item.id)} className="p-1.5 rounded-lg border transition-colors hover:bg-red-50" style={{ borderColor: COLORS.border, color: COLORS.red }} title="Delete">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
  
                  {isGenerating ? (
                    <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.cream }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} style={{ color: COLORS.gold }} />
                          <span className="text-sm" style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 500 }}>Writing your script</span>
                        </div>
                        <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{scriptProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: COLORS.border }}>
                        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${scriptProgress}%`, background: `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.gold} 100%)` }} />
                      </div>
                      <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontStyle: 'italic' }}>{scriptStage}</div>
                    </div>
                  ) : isExpanded ? (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: COLORS.border }}>
                      <ScriptSection label="Hook" text={item.hook} placeholder="— script not generated yet —" />
                      <ScriptSection label="Main Points" text={item.main_points} placeholder="— the key points the doctor will cover —" />
                      <ScriptSection label="Call to Action" text={item.cta} placeholder="— what the viewer should do at the end —" />
                      <ScriptSection label="Scenes & B-roll" text={item.scenes} placeholder="— visual and shooting suggestions —" />
                      <ScriptSection label="Important Lines" text={item.important_lines} placeholder="— lines to say word-for-word —" />
                      <ScriptSection label="Flow" text={item.flow} placeholder="— full video flow from intro to outro —" />
  
                      {!hasContent && (
                        <button onClick={() => handleGenerateScript(item)} className="w-full py-3 rounded-lg text-sm mt-2 flex items-center justify-center gap-2 transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>
                          <Sparkles size={16} />
                          Generate Full Script with AI
                        </button>
                      )}
                      {hasContent && (
                        <button onClick={() => handleGenerateScript(item)} className="w-full py-2 rounded-lg text-sm mt-2 border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>
                          Regenerate Script
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {list.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start justify-between mb-3">
                  <StatusBadge status={item.status} />
                  <div className="flex items-center gap-2">
                    {item.viral_score && (
                      <div className="flex items-center gap-1">
                        <Star size={14} style={{ color: COLORS.gold, fill: COLORS.gold }} />
                        <span className="text-sm" style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 600 }}>{item.viral_score}</span>
                      </div>
                    )}
                    <button onClick={() => handleDeleteIdea(item.id)} className="p-1 rounded-lg transition-colors hover:bg-red-50" style={{ color: COLORS.muted }} title="Delete">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="mb-2" style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1.3 }}>{item.title}</h3>
                {item.why_matters && <p className="text-sm mb-3" style={{ color: COLORS.muted, fontFamily: 'DM Sans', lineHeight: 1.5 }}>{item.why_matters}</p>}
                {item.inspiration_source && <p className="text-xs mb-3" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontStyle: 'italic' }}>✨ {item.inspiration_source}</p>}
  
                {tab === 'ideas' && (
                  <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                    <button onClick={() => handleApprove(item.id)} className="flex-1 py-2 text-sm rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Approve</button>
                    <button onClick={() => handleReject(item.id)} className="flex-1 py-2 text-sm rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>Reject</button>
                  </div>
                )}
  
                {tab === 'approved' && (
                  <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                    <button onClick={() => handleSendToScripts(item)} className="flex-1 py-2 text-sm rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>Send to Scripts →</button>
                    <button onClick={() => handleUndoApprove(item.id)} className="px-3 py-2 text-sm rounded-lg border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>Undo</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
const Shooting = () => {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? videos : videos.filter(v => v.category === filter);
  return (
    <div>
      <SectionHeader title="Shooting Tracker" subtitle="Every video from planning to published" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Required This Month" value={monthData.planned} icon={Calendar} />
        <StatCard label="Shot" value={monthData.shot} total={monthData.planned} icon={Video} accent />
        <StatCard label="Pending Shoot" value={monthData.planned - monthData.shot} icon={Clock} />
        <StatCard label="Completion" value="70%" icon={TrendingUp} />
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All', 'Reel', 'Talking Head', 'Documentary'].map(c => (
          <button key={c} onClick={() => setFilter(c)} className="px-4 py-1.5 rounded-full text-sm border transition-all"
            style={{ borderColor: filter === c ? COLORS.navy : COLORS.border, backgroundColor: filter === c ? COLORS.navy : 'white', color: filter === c ? 'white' : COLORS.muted, fontFamily: 'DM Sans' }}>{c}</button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
        <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
          <div className="col-span-5">Video</div><div className="col-span-2">Category</div><div className="col-span-2">Shoot Date</div><div className="col-span-2">Status</div><div className="col-span-1"></div>
        </div>
        {filtered.map((v) => (
          <div key={v.id} className="md:grid md:grid-cols-12 px-6 py-4 md:items-center border-t transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border }}>
            <div className="md:col-span-5">
              <div style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{v.title}</div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.category} · {v.shootDate} · {v.assignee}</div>
            </div>
            <div className="hidden md:block md:col-span-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.category}</div>
            <div className="hidden md:block md:col-span-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.shootDate}</div>
            <div className="md:col-span-2 mt-2 md:mt-0"><StatusBadge status={v.status} /></div>
            <div className="hidden md:block md:col-span-1 text-right"><button style={{ color: COLORS.muted }}><ChevronRight size={18} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EditingReview = () => {
  const [selected, setSelected] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('Cut this part');
  const reviewVideos = videos.filter(v => ['Ready for Review', 'In Editing', 'Approved'].includes(v.status));
  return (
    <div>
      <SectionHeader title="Editing & Review" subtitle="Review edited videos, request changes with timestamps, approve for publishing" />
      {!selected ? (
        <div className="grid md:grid-cols-2 gap-4">
          {reviewVideos.map(v => (
            <div key={v.id} className="bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
              <div className="aspect-video flex items-center justify-center relative" style={{ backgroundColor: COLORS.navy }}>
                <Play size={48} style={{ color: 'white', opacity: 0.8 }} />
                <div className="absolute top-3 right-3"><StatusBadge status={v.status} /></div>
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontFamily: 'DM Sans' }}>{v.version} · {v.uploadedDate}</div>
              </div>
              <div className="p-5">
                <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy }}>{v.title}</h3>
                <div className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Revisions used: {v.revisionsUsed} / 2 · Editor: {v.assignee}</div>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(v)} className="flex-1 py-2 text-sm rounded-lg" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Review</button>
                  <button className="px-3 py-2 text-sm rounded-lg border" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}><Download size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <button onClick={() => setSelected(null)} className="text-sm mb-4 flex items-center gap-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>← Back to all videos</button>
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
              <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: COLORS.navy }}><Play size={64} style={{ color: 'white', opacity: 0.8 }} /></div>
              <div className="p-5">
                <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: COLORS.navy }}>{selected.title}</h3>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{selected.version} · Uploaded {selected.uploadedDate} · Revisions used: {selected.revisionsUsed} / 2</div>
                <div className="flex gap-2 mt-5">
                  <button className="flex-1 py-2.5 text-sm rounded-lg" style={{ backgroundColor: COLORS.green, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}><Check size={16} className="inline mr-1" /> Approve for Publishing</button>
                  <button className="px-4 py-2.5 text-sm rounded-lg border" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}><Download size={16} className="inline mr-1" /> Download</button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border h-fit" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Request a Change</h3>
            <p className="text-xs mb-5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{2 - selected.revisionsUsed} revisions remaining</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Timestamp</label>
                <input value={timestamp} onChange={e => setTimestamp(e.target.value)} placeholder="00:13 – 00:19" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Change Type</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }}>
                  <option>Cut this part</option><option>Add text</option><option>Change music</option><option>Color issue</option><option>Audio issue</option><option>Transition issue</option><option>Thumbnail issue</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Describe the change..." className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Screenshot (optional)</label>
                <button className="w-full px-3 py-4 rounded-lg border-2 border-dashed text-sm" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>+ Upload screenshot</button>
              </div>
              <button className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Submit Revision Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Thumbnails = () => {
  const thumbVideos = videos.filter(v => ['Approved', 'Published', 'Scheduled'].includes(v.status));
  return (
    <div>
      <SectionHeader title="Thumbnails" subtitle="Review and approve thumbnails for approved videos" />
      <div className="grid md:grid-cols-2 gap-6">
        {thumbVideos.map(v => (
          <div key={v.id} className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy }}>{v.title}</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1,2,3].map(n => (
                <div key={n} className="aspect-video rounded-lg relative flex items-center justify-center cursor-pointer transition-all hover:scale-105" style={{ backgroundColor: n === 1 ? COLORS.navy : COLORS.navyLight }}>
                  {n === 1 && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 600 }}>Recommended</div>}
                  <span style={{ color: 'white', fontFamily: 'DM Sans', fontSize: '0.75rem' }}>v{n}</span>
                </div>
              ))}
            </div>
            <div className="text-xs mb-4 p-3 rounded-lg" style={{ backgroundColor: COLORS.gold + '15', color: COLORS.navy, fontFamily: 'DM Sans' }}><strong>CTR Note:</strong> High-contrast face shots with bold text have 2.4x higher CTR on Instagram.</div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-sm rounded-lg" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Approve Thumbnail</button>
              <button className="flex-1 py-2 text-sm rounded-lg border" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>Request Change</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Publishing = () => (
  <div>
    <SectionHeader title="Publishing & SEO" subtitle="Published performance, scheduled content, and search visibility" />
    <div className="hidden md:block bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
        <div className="col-span-4">Video</div><div className="col-span-1">Platform</div><div className="col-span-1 text-right">Views</div><div className="col-span-1 text-right">Likes</div><div className="col-span-1 text-right">CTR</div><div className="col-span-1 text-right">Ret.</div><div className="col-span-3">Verdict</div>
      </div>
      {publishedVideos.map(v => (
        <div key={v.id} className="grid grid-cols-12 px-6 py-4 items-center border-t hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border }}>
          <div className="col-span-4">
            <div style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{v.title}</div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>SEO: {v.keyword}</div>
          </div>
          <div className="col-span-1 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.platform}</div>
          <div className="col-span-1 text-right text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{v.views.toLocaleString()}</div>
          <div className="col-span-1 text-right text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.likes}</div>
          <div className="col-span-1 text-right text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.ctr}%</div>
          <div className="col-span-1 text-right text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.retention}%</div>
          <div className="col-span-3">
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: v.verdict.includes('Strong') || v.verdict.includes('winner') ? '#D1FAE5' : v.verdict.includes('Good') ? '#FEF3C7' : '#FEE2E2', color: v.verdict.includes('Strong') || v.verdict.includes('winner') ? '#065F46' : v.verdict.includes('Good') ? '#92400E' : '#991B1B', fontFamily: 'DM Sans', fontWeight: 500 }}>{v.verdict}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="md:hidden space-y-3">
      {publishedVideos.map(v => (
        <div key={v.id} className="bg-white rounded-2xl p-5 border" style={{ borderColor: COLORS.border }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>{v.title}</div>
              <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.platform} · SEO: {v.keyword}</div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: v.verdict.includes('Strong') || v.verdict.includes('winner') ? '#D1FAE5' : v.verdict.includes('Good') ? '#FEF3C7' : '#FEE2E2', color: v.verdict.includes('Strong') || v.verdict.includes('winner') ? '#065F46' : v.verdict.includes('Good') ? '#92400E' : '#991B1B', fontFamily: 'DM Sans', fontWeight: 500 }}>{v.verdict}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Views</div><div style={{ fontFamily: 'DM Sans', fontWeight: 600, color: COLORS.navy }}>{v.views.toLocaleString()}</div></div>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Likes</div><div style={{ fontFamily: 'DM Sans', fontWeight: 600, color: COLORS.navy }}>{v.likes}</div></div>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>CTR</div><div style={{ fontFamily: 'DM Sans', fontWeight: 600, color: COLORS.navy }}>{v.ctr}%</div></div>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Ret.</div><div style={{ fontFamily: 'DM Sans', fontWeight: 600, color: COLORS.navy }}>{v.retention}%</div></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Ads = () => {
  const [budget, setBudget] = useState(5000);
  return (
    <div>
      <SectionHeader title="Ads" subtitle="Amplify your best content with paid promotion" />
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
          <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Daily Ad Budget</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[5000, 7500, 10000, 'Custom'].map(amt => (
              <button key={amt} onClick={() => typeof amt === 'number' && setBudget(amt)} className="py-4 rounded-xl border-2 text-center transition-all"
                style={{ borderColor: budget === amt ? COLORS.navy : COLORS.border, backgroundColor: budget === amt ? COLORS.navy + '08' : 'white', fontFamily: 'DM Sans' }}>
                <div style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: COLORS.navy }}>{typeof amt === 'number' ? `₹${(amt/1000)}K` : amt}</div>
                {typeof amt === 'number' && <div className="text-xs mt-1" style={{ color: COLORS.muted }}>per day</div>}
              </button>
            ))}
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.gold + '15' }}>
            <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>At ₹{budget.toLocaleString()}/day</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Estimated reach: {(budget * 8).toLocaleString()}–{(budget * 15).toLocaleString()} per day</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
          <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Live Campaigns</h3>
          <div className="space-y-3">
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Active</div><div style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: COLORS.navy }}>2</div></div>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Total spend this month</div><div style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: COLORS.navy }}>₹42,000</div></div>
            <div><div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Total reach</div><div style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: COLORS.navy }}>1.2L</div></div>
          </div>
        </div>
      </div>
      <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Our Recommendations</h3>
      <div className="space-y-3">
        {adsVideos.map(v => {
          const colorMap = { green: COLORS.green, yellow: COLORS.amber, red: COLORS.red };
          const labelMap = { green: 'Strong candidate', yellow: 'Test small budget', red: 'Do not boost' };
          return (
            <div key={v.id} className="bg-white rounded-xl p-5 border flex items-center gap-4" style={{ borderColor: COLORS.border }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colorMap[v.recommend] }} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{v.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colorMap[v.recommend] + '20', color: colorMap[v.recommend], fontFamily: 'DM Sans', fontWeight: 600 }}>{labelMap[v.recommend]}</span>
                </div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.reason}</div>
              </div>
              {v.spend > 0 ? (
                <div className="text-right flex-shrink-0">
                  <div className="text-sm" style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>₹{v.spend.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.reach.toLocaleString()} reach</div>
                </div>
              ) : (
                <button className="px-4 py-2 text-sm rounded-lg flex-shrink-0" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Start</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Payments = () => (
  <div>
    <SectionHeader title="Payments" subtitle="Monthly retainer, billing cycle, and history" />
    <div className="grid lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Next payment due</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '3rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>₹2,50,000</div>
            <div className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>April 28, 2026 · 6 days remaining</div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>Upcoming</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 rounded-xl text-sm" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>Download Invoice</button>
          <button className="py-3 rounded-xl text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Payment Methods</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy }}>Package</h3>
        <div className="space-y-3 text-sm" style={{ fontFamily: 'DM Sans' }}>
          <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Plan</span><span style={{ color: COLORS.navy, fontWeight: 500 }}>Premium Retainer</span></div>
          <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Billing cycle</span><span style={{ color: COLORS.navy, fontWeight: 500 }}>28th each month</span></div>
          <div className="flex justify-between"><span style={{ color: COLORS.muted }}>Methods</span><span style={{ color: COLORS.navy, fontWeight: 500 }}>Bank / UPI / Cash</span></div>
        </div>
      </div>
    </div>
    <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Payment History</h3>
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
      <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
        <div className="col-span-3">Date</div><div className="col-span-3">Period</div><div className="col-span-3">Amount</div><div className="col-span-2">Status</div><div className="col-span-1 text-right">Invoice</div>
      </div>
      {[
        { date: 'Mar 28, 2026', period: 'March 2026', amount: '₹2,50,000', status: 'Paid' },
        { date: 'Feb 28, 2026', period: 'February 2026', amount: '₹2,50,000', status: 'Paid' },
        { date: 'Jan 28, 2026', period: 'January 2026', amount: '₹2,50,000', status: 'Paid' },
      ].map((p, i) => (
        <div key={i} className="md:grid md:grid-cols-12 px-6 py-4 md:items-center border-t hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }}>
          <div className="md:col-span-3 text-sm" style={{ color: COLORS.navy, fontWeight: 500 }}>{p.date}</div>
          <div className="md:col-span-3 text-sm" style={{ color: COLORS.muted }}>{p.period}</div>
          <div className="md:col-span-3 text-sm" style={{ color: COLORS.navy, fontWeight: 500 }}>{p.amount}</div>
          <div className="md:col-span-2 mt-2 md:mt-0"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'DM Sans', fontWeight: 500 }}>{p.status}</span></div>
          <div className="hidden md:block md:col-span-1 text-right"><button style={{ color: COLORS.muted }}><Download size={16} /></button></div>
        </div>
      ))}
    </div>
  </div>
);

const Analytics = () => (
  <div>
    <SectionHeader title="Analytics" subtitle="Views, watch time, and content performance" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard label="Total Views (30d)" value="61.4K" icon={Eye} />
      <StatCard label="Watch Time (hrs)" value="238" icon={Clock} />
      <StatCard label="New Subscribers" value="+412" icon={ThumbsUp} accent />
      <StatCard label="Avg CTR" value="5.8%" icon={TrendingUp} />
    </div>
    <div className="grid lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Views This Week</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={analyticsData}>
            <defs><linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.navy} stopOpacity={0.3}/><stop offset="95%" stopColor={COLORS.navy} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="day" stroke={COLORS.muted} style={{ fontFamily: 'DM Sans', fontSize: '0.75rem' }} />
            <YAxis stroke={COLORS.muted} style={{ fontFamily: 'DM Sans', fontSize: '0.75rem' }} />
            <Tooltip />
            <Area type="monotone" dataKey="views" stroke={COLORS.navy} strokeWidth={2} fill="url(#viewGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Format Split</h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={formatSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
              {formatSplit.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-3">
          {formatSplit.map(f => (
            <div key={f.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
              <span className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{f.name} · {f.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Feedback = () => {
  const [priority, setPriority] = useState('Medium');
  return (
    <div>
      <SectionHeader title="Feedback" subtitle="Help us make this better — we read every message" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
          <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Share Feedback</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>What would make this month's content better?</label>
              <textarea rows={3} className="w-full px-3 py-2 rounded-lg border text-sm resize-none" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} placeholder="Tell us what you want more of, less of, or what should change..." />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>Priority</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map(p => (
                  <button key={p} onClick={() => setPriority(p)} className="px-4 py-1.5 rounded-full text-sm border transition-all"
                    style={{ borderColor: priority === p ? COLORS.navy : COLORS.border, backgroundColor: priority === p ? COLORS.navy : 'white', color: priority === p ? 'white' : COLORS.muted, fontFamily: 'DM Sans' }}>{p}</button>
                ))}
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Submit</button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
          <h3 className="mb-2" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Happiness Score</h3>
          <div className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Based on your feedback this month</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: '3rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>9.2<span style={{ fontSize: '1.25rem', color: COLORS.muted }}>/10</span></div>
          <div className="mt-3 flex gap-0.5">
            {[1,2,3,4,5].map(s => (<Star key={s} size={14} style={{ color: COLORS.gold, fill: COLORS.gold }} />))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Upgrade = () => (
  <div>
    <SectionHeader title="You're ready for the next growth phase" subtitle="Your content is performing. Let's scale." />
    <div className="p-6 rounded-2xl mb-8 flex items-center gap-4" style={{ backgroundColor: COLORS.gold + '15' }}>
      <Sparkles size={24} style={{ color: COLORS.gold }} />
      <div>
        <div style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy }}>Based on this month's performance, we recommend the Authority Upgrade</div>
        <div className="text-sm mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Your long-form content is outperforming — scaling YouTube can compound your authority faster.</div>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { name: 'Growth', tagline: 'More output, faster turnaround', features: ['4 extra reels per month', '2 extra long videos', 'Faster 48h turnaround'], highlighted: false },
        { name: 'Authority', tagline: 'Build a dominant personal brand', features: ['2 premium documentaries', 'Deep brand positioning', 'High-end thumbnails'], highlighted: true },
        { name: 'Scale', tagline: 'Convert content into patients', features: ['Managed ad campaigns', 'Conversion-focused creative', 'Landing page support'], highlighted: false },
      ].map(tier => (
        <div key={tier.name} className="rounded-2xl p-6 border relative" style={{ borderColor: tier.highlighted ? COLORS.gold : COLORS.border, backgroundColor: tier.highlighted ? COLORS.navy : 'white' }}>
          {tier.highlighted && (<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 600 }}>RECOMMENDED</div>)}
          <div style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: tier.highlighted ? 'white' : COLORS.navy }}>{tier.name}</div>
          <div className="text-sm mb-6" style={{ color: tier.highlighted ? COLORS.goldLight : COLORS.muted, fontFamily: 'DM Sans' }}>{tier.tagline}</div>
          <ul className="space-y-3 mb-6">
            {tier.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: tier.highlighted ? 'white' : COLORS.navy, fontFamily: 'DM Sans' }}>
                <Check size={16} style={{ color: tier.highlighted ? COLORS.gold : COLORS.green, marginTop: 2, flexShrink: 0 }} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: tier.highlighted ? COLORS.gold : COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Talk to the team</button>
        </div>
      ))}
    </div>
  </div>
);

export default function App() {
  const router = useRouter();
  const [section, setSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role, full_name, client_id')
        .eq('user_id', session.user.id)
        .single();
      if (roleData) setUserRole(roleData);
      setAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF5' }}>
        <div style={{ fontFamily: 'Fraunces', color: '#0A1628', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    );
  }

  const sectionMap = {
    home: <DashboardHome userName={userRole?.full_name} clientId={userRole?.client_id} />, ideas: <IdeasScripts clientId={userRole?.client_id} userRole={userRole} />, shooting: <Shooting />, editing: <EditingReview />,
    thumbnails: <Thumbnails />, publishing: <Publishing />, ads: <Ads />, payments: <Payments />,
    analytics: <Analytics />, feedback: <Feedback />, upgrade: <Upgrade />,
  };

  return (
    <>
      <FontLoader />
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.cream, fontFamily: 'DM Sans' }}>
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 z-40 transition-transform flex flex-col`} style={{ backgroundColor: COLORS.navy }}>
          <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: 'white', letterSpacing: '-0.01em' }}>Black Pepper</div>
            <div className="text-xs" style={{ color: COLORS.goldLight, fontFamily: 'DM Sans', letterSpacing: '0.08em' }}>CLIENT OS</div>
          </div>
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setSection(item.id); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all"
                style={{ backgroundColor: section === item.id ? 'rgba(201, 169, 97, 0.15)' : 'transparent', color: section === item.id ? COLORS.goldLight : 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', fontWeight: section === item.id ? 500 : 400 }}>
                <item.icon size={17} /><span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.gold, fontFamily: 'Fraunces', color: 'white', fontWeight: 500 }}>
                {userRole?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>{userRole?.full_name || 'User'}</div>
                <div className="text-xs truncate capitalize" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>{userRole?.role || 'Loading...'}</div>
              </div>
              <button onClick={handleLogout} className="p-1 rounded hover:bg-white/10" title="Logout">
                <LogOut size={14} style={{ color: 'rgba(255,255,255,0.6)' }} />
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 px-6 lg:px-10 py-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.cream, borderColor: COLORS.border }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1" style={{ color: COLORS.navy }}>{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
                <Search size={15} style={{ color: COLORS.muted }} />
                <input placeholder="Search..." className="text-sm bg-transparent outline-none w-64" style={{ fontFamily: 'DM Sans' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-lg" style={{ color: COLORS.navy }}>
                <Bell size={18} /><span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.gold }} />
              </button>
            </div>
          </header>
          <div className="px-6 lg:px-10 py-8">{sectionMap[section]}</div>
        </main>
        {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />}
      </div>
    </>
  );
}