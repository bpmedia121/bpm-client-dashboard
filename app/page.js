'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Lightbulb, Video, Scissors, Image, Upload, Target,
  CreditCard, BarChart3, MessageSquare, Sparkles, Bell, Search, Menu, X,
  Check, Clock, AlertCircle, Play, Download, Eye, ThumbsUp, TrendingUp,
  ChevronRight, Plus, Filter, Calendar, DollarSign, Zap, Award, FileText,
  CheckCircle2, Circle, ArrowUpRight, Star, MoreHorizontal, RefreshCw
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
  <div className="flex items-end justify-between mb-8">
    <div>
      <h1 style={{ fontFamily: 'Fraunces', fontSize: '2.25rem', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const DashboardHome = () => (
  <div>
    <SectionHeader title="Good morning, Dr. Sharma" subtitle="Here's your content system for April 2026" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Videos Planned" value={monthData.planned} icon={Calendar} />
      <StatCard label="Shot This Month" value={monthData.shot} total={monthData.planned} icon={Video} />
      <StatCard label="Ready for Review" value={monthData.review} icon={Clock} accent />
      <StatCard label="Published" value={monthData.uploaded} icon={CheckCircle2} />
    </div>
    <div className="grid lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>April Progress</h3>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>70% Complete</span>
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
              <span style={{ color: COLORS.navy, fontWeight: 500 }}>Reels</span>
              <span style={{ color: COLORS.muted }}>{monthData.reelsShot} / {monthData.reelsPlanned}</span>
            </div>
            <ProgressBar value={monthData.reelsShot} total={monthData.reelsPlanned} color={COLORS.navy} />
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
              <span style={{ color: COLORS.navy, fontWeight: 500 }}>Long-form Videos</span>
              <span style={{ color: COLORS.muted }}>{monthData.longsShot} / {monthData.longsPlanned}</span>
            </div>
            <ProgressBar value={monthData.longsShot} total={monthData.longsPlanned} color={COLORS.gold} />
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
              <span style={{ color: COLORS.navy, fontWeight: 500 }}>Published & Live</span>
              <span style={{ color: COLORS.muted }}>{monthData.uploaded} / {monthData.planned}</span>
            </div>
            <ProgressBar value={monthData.uploaded} total={monthData.planned} color={COLORS.green} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Next Payment</h3>
        <div style={{ fontFamily: 'Fraunces', fontSize: '2rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>₹2,50,000</div>
        <div className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Due April 28, 2026</div>
        <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: COLORS.gold + '15' }}>
          <Clock size={14} style={{ color: COLORS.gold }} />
          <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>6 days remaining</span>
        </div>
        <button className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>View Invoice</button>
      </div>
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>This Week's Activity</h3>
        <div className="space-y-4">
          {[
            { date: 'Apr 22', action: 'Lip Filler Reel is ready for your review', type: 'review' },
            { date: 'Apr 21', action: 'Botox Transparency video entered editing', type: 'progress' },
            { date: 'Apr 20', action: 'HydraFacial Documentary approved for publishing', type: 'success' },
            { date: 'Apr 19', action: 'Morning Clinic Routine — shoot completed', type: 'progress' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: item.type === 'success' ? COLORS.green : item.type === 'review' ? COLORS.gold : COLORS.navy }} />
                {i < 3 && <div className="w-px flex-1 mt-1" style={{ backgroundColor: COLORS.border }} />}
              </div>
              <div className="flex-1 pb-4">
                <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{item.date}</div>
                <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{item.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
        <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Review Videos', icon: Eye, count: 3 },
            { label: 'Request Changes', icon: RefreshCw, count: null },
            { label: 'Approve Content', icon: Check, count: null },
            { label: 'Submit Feedback', icon: MessageSquare, count: null },
            { label: 'Add Ad Budget', icon: DollarSign, count: null },
            { label: 'View Analytics', icon: TrendingUp, count: null },
          ].map((action, i) => (
            <button key={i} className="p-4 rounded-xl border text-left transition-all hover:border-gray-400" style={{ borderColor: COLORS.border }}>
              <div className="flex items-center justify-between mb-2">
                <action.icon size={18} style={{ color: COLORS.navy }} />
                {action.count && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 600 }}>{action.count}</span>}
              </div>
              <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const IdeasScripts = () => {
  const [tab, setTab] = useState('ideas');
  const [subTab, setSubTab] = useState('reels');
  const list = tab === 'ideas' ? (subTab === 'reels' ? ideas.reels : ideas.longs) : scripts;
  return (
    <div>
      <SectionHeader title="Ideas & Scripts" subtitle="What we're planning for you, informed by what's working in your niche"
        action={<button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}><Plus size={16} /> Request Topic</button>} />
      <div className="flex gap-1 p-1 rounded-xl mb-6 inline-flex bg-white border" style={{ borderColor: COLORS.border }}>
        {['ideas', 'scripts'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-5 py-2 rounded-lg text-sm transition-all capitalize"
            style={{ backgroundColor: tab === t ? COLORS.navy : 'transparent', color: tab === t ? 'white' : COLORS.muted, fontFamily: 'DM Sans', fontWeight: 500 }}>{t}</button>
        ))}
      </div>
      {tab === 'ideas' && (
        <div className="flex gap-2 mb-6">
          {[{ id: 'reels', label: 'Reels' }, { id: 'longs', label: 'Long-form' }].map(s => (
            <button key={s.id} onClick={() => setSubTab(s.id)} className="px-4 py-1.5 rounded-full text-sm border transition-all"
              style={{ borderColor: subTab === s.id ? COLORS.navy : COLORS.border, backgroundColor: subTab === s.id ? COLORS.navy : 'white', color: subTab === s.id ? 'white' : COLORS.muted, fontFamily: 'DM Sans' }}>{s.label}</button>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {list.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-6 border transition-all hover:shadow-md" style={{ borderColor: COLORS.border }}>
            <div className="flex items-start justify-between mb-3">
              <StatusBadge status={item.status} />
              {item.viral && (
                <div className="flex items-center gap-1">
                  <Star size={14} style={{ color: COLORS.gold, fill: COLORS.gold }} />
                  <span className="text-sm" style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 600 }}>{item.viral}</span>
                </div>
              )}
            </div>
            <h3 className="mb-2" style={{ fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1.3 }}>{item.title}</h3>
            <p className="text-sm mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans', lineHeight: 1.5 }}>{item.why || item.hook}</p>
            {item.duration && <div className="text-xs mb-3" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Duration: {item.duration}</div>}
            <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
              <button className="flex-1 py-2 text-sm rounded-lg" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>{tab === 'ideas' ? 'Approve' : 'View Script'}</button>
              <button className="px-3 py-2 text-sm rounded-lg border" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}><MoreHorizontal size={16} /></button>
            </div>
          </div>
        ))}
      </div>
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
        <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
          <div className="col-span-5">Video</div><div className="col-span-2">Category</div><div className="col-span-2">Shoot Date</div><div className="col-span-2">Status</div><div className="col-span-1"></div>
        </div>
        {filtered.map((v) => (
          <div key={v.id} className="grid grid-cols-12 px-6 py-4 items-center border-t transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border }}>
            <div className="col-span-5">
              <div style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{v.title}</div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Assigned to {v.assignee}</div>
            </div>
            <div className="col-span-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.category}</div>
            <div className="col-span-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.shootDate}</div>
            <div className="col-span-2"><StatusBadge status={v.status} /></div>
            <div className="col-span-1 text-right"><button style={{ color: COLORS.muted }}><ChevronRight size={18} /></button></div>
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
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: COLORS.border }}>
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
          <div className="grid grid-cols-4 gap-3 mb-5">
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
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{v.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colorMap[v.recommend] + '20', color: colorMap[v.recommend], fontFamily: 'DM Sans', fontWeight: 600 }}>{labelMap[v.recommend]}</span>
                </div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.reason}</div>
              </div>
              {v.spend > 0 ? (
                <div className="text-right">
                  <div className="text-sm" style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>₹{v.spend.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.reach.toLocaleString()} reach</div>
                </div>
              ) : (
                <button className="px-4 py-2 text-sm rounded-lg" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Start Campaign</button>
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
      <div className="grid grid-cols-12 px-6 py-3 text-xs uppercase tracking-wider" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
        <div className="col-span-3">Date</div><div className="col-span-3">Period</div><div className="col-span-3">Amount</div><div className="col-span-2">Status</div><div className="col-span-1 text-right">Invoice</div>
      </div>
      {[
        { date: 'Mar 28, 2026', period: 'March 2026', amount: '₹2,50,000', status: 'Paid' },
        { date: 'Feb 28, 2026', period: 'February 2026', amount: '₹2,50,000', status: 'Paid' },
        { date: 'Jan 28, 2026', period: 'January 2026', amount: '₹2,50,000', status: 'Paid' },
      ].map((p, i) => (
        <div key={i} className="grid grid-cols-12 px-6 py-4 items-center border-t hover:bg-gray-50 transition-colors" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }}>
          <div className="col-span-3 text-sm" style={{ color: COLORS.navy, fontWeight: 500 }}>{p.date}</div>
          <div className="col-span-3 text-sm" style={{ color: COLORS.muted }}>{p.period}</div>
          <div className="col-span-3 text-sm" style={{ color: COLORS.navy, fontWeight: 500 }}>{p.amount}</div>
          <div className="col-span-2"><span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontFamily: 'DM Sans', fontWeight: 500 }}>{p.status}</span></div>
          <div className="col-span-1 text-right"><button style={{ color: COLORS.muted }}><Download size={16} /></button></div>
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
    <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
      <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Top Performing Topics</h3>
      <div className="space-y-3">
        {[
          { topic: 'Patient stories & testimonials', views: 45200, trend: '+32%' },
          { topic: 'Treatment transparency (prices, process)', views: 38100, trend: '+24%' },
          { topic: 'Myth-busting content', views: 29800, trend: '+18%' },
          { topic: 'Clinic tours & behind-the-scenes', views: 18400, trend: '+9%' },
        ].map((t, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ backgroundColor: COLORS.navy + '10', color: COLORS.navy, fontFamily: 'Fraunces', fontWeight: 600 }}>{i + 1}</div>
              <span className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{t.topic}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{t.views.toLocaleString()} views</span>
              <span className="text-xs" style={{ color: COLORS.green, fontFamily: 'DM Sans', fontWeight: 600 }}>{t.trend}</span>
            </div>
          </div>
        ))}
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
      <h3 className="mt-8 mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Past Feedback</h3>
      <div className="space-y-3">
        {feedbackHistory.map(f => (
          <div key={f.id} className="bg-white rounded-xl p-4 border flex items-center gap-4" style={{ borderColor: COLORS.border }}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{f.topic}</span>
                <StatusBadge status={f.status} />
              </div>
              <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{f.summary} · {f.date}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>{f.priority}</span>
          </div>
        ))}
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
        { name: 'Growth', tagline: 'More output, faster turnaround', features: ['4 extra reels per month', '2 extra long videos', 'Faster 48h turnaround', 'Extended topic research', 'Extra shoot day'], highlighted: false },
        { name: 'Authority', tagline: 'Build a dominant personal brand', features: ['2 premium documentaries', 'Deep personal brand positioning', 'High-end thumbnail design', 'Long-form script depth', 'YouTube growth system'], highlighted: true },
        { name: 'Scale', tagline: 'Convert content into patients', features: ['Managed ad campaigns', 'Conversion-focused creative', 'Landing page + funnel build', 'Multi-platform syndication', 'Dedicated account manager'], highlighted: false },
      ].map(tier => (
        <div key={tier.name} className="rounded-2xl p-6 border relative" style={{ borderColor: tier.highlighted ? COLORS.gold : COLORS.border, backgroundColor: tier.highlighted ? COLORS.navy : 'white', transform: tier.highlighted ? 'scale(1.02)' : 'none' }}>
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
  const [section, setSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionMap = {
    home: <DashboardHome />, ideas: <IdeasScripts />, shooting: <Shooting />, editing: <EditingReview />,
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
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.gold, fontFamily: 'Fraunces', color: 'white', fontWeight: 500 }}>DS</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate" style={{ color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>Dr. Sharma</div>
                <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>Premium Retainer</div>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 px-6 lg:px-10 py-4 border-b flex items-center justify-between" style={{ backgroundColor: COLORS.cream, borderColor: COLORS.border }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1" style={{ color: COLORS.navy }}>{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
                <Search size={15} style={{ color: COLORS.muted }} />
                <input placeholder="Search videos, ideas, invoices..." className="text-sm bg-transparent outline-none w-64" style={{ fontFamily: 'DM Sans' }} />
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