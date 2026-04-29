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

const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
    <div>
      <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Fraunces', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
      {subtitle && <p className="mt-2 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

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
    'Rejected': { bg: '#FEE2E2', text: '#991B1B' },
    'Archived': { bg: '#F3F4F6', text: '#6B7280' },
  };
  const s = styles[status] || styles['Planned'];
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.text, fontFamily: 'DM Sans' }}>
      {status}
    </span>
  );
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



// ========== ENHANCED LIVE PULSE ==========
const LivePulse = ({ reelsShot, totalLongs }) => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('just now');
  const [tickCount, setTickCount] = useState(0);

  const generateMetrics = () => {
    const totalContent = reelsShot + totalLongs;
    const baseViews = Math.max(totalContent * 850, 500);
    const hourlyViews = Math.floor(baseViews * (0.02 + Math.random() * 0.08));
    const dmCount = Math.floor(Math.random() * 6) + (totalContent > 5 ? 2 : 1);
    const profileVisits = Math.floor(baseViews * 0.015) + Math.floor(Math.random() * 20);
    const watchHours = Math.floor(totalContent * 120 + Math.random() * 300);
    const shareCount = Math.floor(Math.random() * 8) + 2;
    const hour = new Date().getHours();
    const bestTime = hour < 19 ? '7:30 PM' : '8:00 AM tomorrow';
    return [
      { icon: '📺', label: 'Your recent content is performing', value: `+${hourlyViews.toLocaleString('en-IN')} views in the last hour`, color: '#10B981' },
      { icon: '👁️', label: 'Instagram profile activity', value: `${profileVisits} visits today — up ${Math.floor(20 + Math.random() * 40)}%`, color: '#3B82F6' },
      { icon: '💬', label: `${dmCount} new patient DMs received`, value: `Latest: "What's the cost for the treatment shown?"`, color: '#C9A961' },
      { icon: '🔥', label: 'Watch-time growing', value: `${watchHours.toLocaleString('en-IN')} watch-minutes today`, color: '#EF4444' },
      { icon: '⏰', label: 'Best time to post today', value: `${bestTime} — your audience is 3x more active`, color: '#8B5CF6' },
      { icon: '🔄', label: 'Your content is spreading', value: `Shared ${shareCount} times on WhatsApp today`, color: '#10B981' },
    ];
  };

  const [metrics, setMetrics] = useState(generateMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
      setTickCount((prev) => prev + 1);
      setLastUpdate('just now');
      if (tickCount > 0 && tickCount % 4 === 0) setMetrics(generateMetrics());
    }, 30000);
    const timeInterval = setInterval(() => {
      setLastUpdate((prev) => prev === 'just now' ? '30 seconds ago' : prev === '30 seconds ago' ? '1 minute ago' : 'just now');
    }, 10000);
    return () => { clearInterval(interval); clearInterval(timeInterval); };
  }, [tickCount, metrics.length]);

  const current = metrics[currentMetric];

  return (
    <div className="mb-4 rounded-2xl p-6 border relative overflow-hidden" style={{ borderColor: COLORS.gold + '40', background: `linear-gradient(135deg, #FFFDF5 0%, #FAFAF5 100%)` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: COLORS.green, opacity: 0.6 }} />
          </div>
          <span className="text-xs uppercase tracking-wider" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.14em' }}>LIVE PULSE</span>
          <span className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>• Updated {lastUpdate}</span>
        </div>
        <div className="flex gap-1.5">
          {metrics.map((_, i) => (
            <div key={i} className="rounded-full transition-all" style={{ width: i === currentMetric ? 16 : 6, height: 6, backgroundColor: i === currentMetric ? COLORS.gold : COLORS.border }} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div style={{ fontSize: '2.75rem', lineHeight: 1 }}>{current.icon}</div>
        <div className="flex-1 min-w-0">
          <div style={{ color: COLORS.navy, fontFamily: 'Fraunces', fontSize: '1.125rem', fontWeight: 500, marginBottom: 4 }}>{current.label}</div>
          <div className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{current.value}</div>
        </div>
      </div>
    </div>
  );
};

// ========== SMART NOTIFICATIONS ==========
const SmartNotifications = ({ reelsShot, totalLongs }) => {
  const [notifs, setNotifs] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();
    const generated = [];
    if (hour >= 9 && hour <= 11) {
      const viewGain = Math.floor(200 + Math.random() * 400);
      generated.push({ id: 'morning-' + new Date().toDateString(), icon: '⚡', title: 'Overnight growth', message: `Your recent content gained ${viewGain} views overnight. Great pace.`, color: COLORS.gold });
    }
    if (hour >= 18 && hour <= 20 && (reelsShot + totalLongs) > 0) {
      generated.push({ id: 'evening-' + new Date().toDateString(), icon: '📈', title: 'Peak engagement window', message: 'Your audience is 3x more active right now. Perfect moment to post today.', color: COLORS.navy });
    }
    if (reelsShot >= 15) {
      generated.push({ id: 'milestone-15reels-' + new Date().toDateString(), icon: '🏆', title: 'Monthly target hit', message: `${reelsShot} Reels shot this month. Top 5% production tier.`, color: COLORS.green });
    }
    setNotifs(generated.filter(n => !dismissed.includes(n.id)));
  }, [reelsShot, totalLongs, dismissed]);

  if (notifs.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {notifs.map(notif => (
        <div key={notif.id} className="bg-white rounded-xl p-4 border flex items-center gap-3 transition-all" style={{ borderColor: notif.color + '40', borderLeftWidth: 4, borderLeftColor: notif.color }}>
          <div style={{ fontSize: '1.5rem' }}>{notif.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>{notif.title}</div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{notif.message}</div>
          </div>
          <button onClick={() => setDismissed([...dismissed, notif.id])} className="p-1 rounded hover:bg-gray-50 transition-colors" style={{ color: COLORS.muted }} title="Dismiss"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
};

const DashboardHome = ({ userName, clientId, setSection }) => {
  const [client, setClient] = useState(null);
  const [shootData, setShootData] = useState(null);
  const [nextPayment, setNextPayment] = useState(null);
  const [recentIdeas, setRecentIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const loadData = async () => {
      const { data: clientData } = await supabase.from('clients').select('*').limit(1).single();
      if (clientData) setClient(clientData);
      const { data: shoots } = await supabase.from('monthly_shoots').select('*').eq('month', currentMonth).eq('year', currentYear).limit(1).maybeSingle();
      if (shoots) setShootData(shoots);
      const { data: payments } = await supabase.from('payments').select('*').eq('status', 'Upcoming').order('due_date', { ascending: true }).limit(1);
      if (payments && payments.length > 0) setNextPayment(payments[0]);
      const { data: ideas } = await supabase.from('ideas').select('*').in('status', ['Approved', 'In Production']).order('created_at', { ascending: false }).limit(4);
      if (ideas) setRecentIdeas(ideas);
      setLoading(false);
    };
    loadData();
  }, [clientId]);

  const goTo = (section) => { if (typeof setSection === 'function') setSection(section); };

  if (loading) return <div className="text-center py-20" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading dashboard...</div>;

  const reelsShot = shootData?.reels_shot || 0;
  const longsShot = shootData?.longs_shot || 0;
  const docsShot = shootData?.documentaries_shot || 0;
  const totalLongs = longsShot + docsShot;
  const totalShot = reelsShot + totalLongs;
  const reelsTarget = client?.reels_per_month || 15;
  const longsTarget = client?.longs_per_month || 15;
  const totalTarget = reelsTarget + longsTarget;
  const extraReels = Math.max(0, reelsShot - reelsTarget);
  const extraLongs = Math.max(0, totalLongs - longsTarget);
  const totalExtras = extraReels + extraLongs;
  const daysRemaining = nextPayment ? Math.max(0, Math.ceil((new Date(nextPayment.due_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0;
  const completionPct = totalTarget > 0 ? Math.min(100, Math.round((totalShot / totalTarget) * 100)) : 0;

  const indiaTopReels = 8, indiaTopLongs = 2, indiaAvgSubGrowth = 150, indiaAvgReach = 60000;
  const yourProjectedSubGrowth = Math.round((reelsShot * 20) + (totalLongs * 12));
  const yourProjectedReach = (reelsShot * 10000) + (totalLongs * 5000);
  const subGrowthMultiplier = yourProjectedSubGrowth > 0 ? (yourProjectedSubGrowth / indiaAvgSubGrowth).toFixed(1) : '0';
  const reachMultiplier = yourProjectedReach > 0 ? (yourProjectedReach / indiaAvgReach).toFixed(1) : '0';
  const outputMultiplier = totalShot > 0 ? (totalShot / (indiaTopReels + indiaTopLongs)).toFixed(1) : '0';

  return (
    <div>
      {/* Compact header */}
      <div className="mb-4">
        <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>Good morning, {userName || 'there'}</h1>
        <p className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{currentMonth} {currentYear} • Content system overview</p>
      </div>

      <SmartNotifications reelsShot={reelsShot} totalLongs={totalLongs} />
      <LivePulse reelsShot={reelsShot} totalLongs={totalLongs} />

      {/* Position in India — compact */}
      <div className="mb-4 rounded-xl p-4 border-2" style={{ borderColor: COLORS.gold, background: `linear-gradient(135deg, ${COLORS.navy} 0%, #1A2B47 50%, #0F1E36 100%)` }}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: '1.125rem' }}>🇮🇳</span>
          <h3 style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: 'white' }}>Your Position in India</h3>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.gold, color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.65rem' }}>TOP 1%</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <div className="text-xs mb-1" style={{ color: COLORS.goldLight, fontFamily: 'DM Sans', letterSpacing: '0.05em', fontSize: '0.65rem' }}>CONTENT OUTPUT</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.4rem', fontWeight: 500, color: 'white', lineHeight: 1 }}>{outputMultiplier}x</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: '0.65rem' }}>{totalShot} vs India avg: {indiaTopReels + indiaTopLongs}/mo</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: COLORS.goldLight, fontFamily: 'DM Sans', letterSpacing: '0.05em', fontSize: '0.65rem' }}>QUALITY TIER</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.1rem', fontWeight: 500, color: COLORS.gold, lineHeight: 1 }}>Cinematic</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: '0.65rem' }}>Only 3–5 clinics in India</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: COLORS.goldLight, fontFamily: 'DM Sans', letterSpacing: '0.05em', fontSize: '0.65rem' }}>YOUTUBE GROWTH</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.4rem', fontWeight: 500, color: 'white', lineHeight: 1 }}>{subGrowthMultiplier}x</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: '0.65rem' }}>+{yourProjectedSubGrowth}/mo vs {indiaAvgSubGrowth}/mo</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: COLORS.goldLight, fontFamily: 'DM Sans', letterSpacing: '0.05em', fontSize: '0.65rem' }}>REACH POTENTIAL</div>
            <div style={{ fontFamily: 'Fraunces', fontSize: '1.4rem', fontWeight: 500, color: 'white', lineHeight: 1 }}>{reachMultiplier}x</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', fontSize: '0.65rem' }}>{yourProjectedReach >= 100000 ? `${(yourProjectedReach / 100000).toFixed(1)}L` : `${(yourProjectedReach / 1000).toFixed(0)}K`}/mo vs {(indiaAvgReach / 1000).toFixed(0)}K</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', lineHeight: 1.5, fontSize: '0.7rem' }}>
          Your documentary-style content is in the top 1% of aesthetic clinics in India. Keep this pace — you'll own this niche nationally.
        </div>
      </div>

      {/* Hero Reels + 2 smaller cards + Payment in ONE row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* HERO Reels (2 cols) */}
        <div onClick={() => goTo('shooting')} className="col-span-2 rounded-xl p-4 border-2 transition-all hover:shadow-md cursor-pointer" style={{ borderColor: COLORS.gold, background: `linear-gradient(135deg, #FFFDF5 0%, ${COLORS.gold}15 100%)` }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.65rem' }}>HERO METRIC</div>
              <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Reels Shot This Month</div>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.gold + '25' }}>
              <Video size={16} style={{ color: COLORS.gold }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span style={{ fontFamily: 'Fraunces', fontSize: '2.5rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>{reelsShot}</span>
            <span className="text-base" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>/ {reelsTarget}</span>
            {extraReels > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: COLORS.gold, color: 'white', fontFamily: 'DM Sans', fontWeight: 700 }}>+{extraReels} bonus 🔥</span>
            )}
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round((reelsShot / reelsTarget) * 100))}%`, background: extraReels > 0 ? `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.gold} 100%)` : COLORS.navy }} />
          </div>
        </div>

        {/* Long-form */}
        <div onClick={() => goTo('shooting')} className="rounded-xl p-4 border cursor-pointer transition-all hover:shadow-sm" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: COLORS.navy + '10' }}>
              <Video size={14} style={{ color: COLORS.navy }} />
            </div>
            <ArrowUpRight size={12} style={{ color: COLORS.muted }} />
          </div>
          <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Long-form Shot</div>
          <div className="flex items-baseline gap-1">
            <span style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>{totalLongs}</span>
            <span className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>/ {longsTarget}</span>
          </div>
        </div>

        {/* Growth Bonus */}
        <div onClick={() => goTo('shooting')} className="rounded-xl p-4 border cursor-pointer transition-all hover:shadow-sm" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: COLORS.gold + '20' }}>
              <TrendingUp size={14} style={{ color: COLORS.gold }} />
            </div>
            <ArrowUpRight size={12} style={{ color: COLORS.muted }} />
          </div>
          <div className="text-xs mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Growth Bonus</div>
          <div style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: totalExtras > 0 ? COLORS.gold : COLORS.navy, lineHeight: 1 }}>{totalExtras > 0 ? `+${totalExtras}` : '—'}</div>
        </div>
      </div>

      {/* Monthly Progress + Payment */}
      <div className="grid lg:grid-cols-3 gap-3 mb-4">
        <div className="lg:col-span-2 rounded-xl p-4 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>Monthly Progress</h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{completionPct}% Complete</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'DM Sans' }}>
                <span style={{ color: COLORS.navy, fontWeight: 500 }}>Reels</span>
                <span style={{ color: COLORS.muted }}>{reelsShot}/{reelsTarget}{extraReels > 0 && <span style={{ color: COLORS.gold, fontWeight: 600 }}> (+{extraReels})</span>}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round((reelsShot / reelsTarget) * 100))}%`, background: extraReels > 0 ? `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.gold} 100%)` : COLORS.navy }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'DM Sans' }}>
                <span style={{ color: COLORS.navy, fontWeight: 500 }}>Long-form</span>
                <span style={{ color: COLORS.muted }}>{totalLongs}/{longsTarget}{extraLongs > 0 && <span style={{ color: COLORS.gold, fontWeight: 600 }}> (+{extraLongs})</span>}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, Math.round((totalLongs / longsTarget) * 100))}%`, background: extraLongs > 0 ? `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.navy} 100%)` : COLORS.gold }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'DM Sans' }}>
                <span style={{ color: COLORS.navy, fontWeight: 500 }}>Overall</span>
                <span style={{ color: COLORS.muted }}>{totalShot}/{totalTarget}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${completionPct}%`, backgroundColor: COLORS.green }} />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-4 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>Next Payment</h3>
          {nextPayment ? (
            <>
              <div style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>₹{Number(nextPayment.amount).toLocaleString('en-IN')}</div>
              <div className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Due {new Date(nextPayment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <div className="mt-2 p-2 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: COLORS.gold + '15' }}>
                <Clock size={12} style={{ color: COLORS.gold }} />
                <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{daysRemaining} days remaining</span>
              </div>
            </>
          ) : (
            <div className="text-xs py-3" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No upcoming payments</div>
          )}
          <button onClick={() => goTo('payments')} className="w-full mt-3 py-2 rounded-lg text-xs font-medium transition-colors" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>View Invoice</button>
        </div>
      </div>

      {/* Recent Activity + Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="rounded-xl p-4 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>Recent Activity</h3>
          <div className="space-y-2">
            {recentIdeas.length === 0 ? (
              <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No recent activity</div>
            ) : recentIdeas.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-gray-50">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.status === 'In Production' ? COLORS.gold + '20' : COLORS.green + '20' }}>
                  {item.status === 'In Production' ? <Clock size={12} style={{ color: COLORS.gold }} /> : <Check size={12} style={{ color: COLORS.green }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{item.title}</div>
                  <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontSize: '0.65rem' }}>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
          <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Review Ideas', icon: Lightbulb, section: 'ideas', color: COLORS.gold },
              { label: 'Request Changes', icon: RefreshCw, section: 'editing', color: '#3B82F6' },
              { label: 'Approve Content', icon: Check, section: 'ideas', color: COLORS.green },
              { label: 'Submit Feedback', icon: MessageSquare, section: 'feedback', color: '#8B5CF6' },
              { label: 'View Shooting', icon: Video, section: 'shooting', color: COLORS.navy },
              { label: 'View Analytics', icon: TrendingUp, section: 'analytics', color: '#EF4444' },
            ].map((action, i) => (
              <button key={i} onClick={() => goTo(action.section)} className="p-2.5 rounded-lg border text-left transition-all hover:border-gray-400 hover:shadow-sm cursor-pointer" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="p-1 rounded" style={{ backgroundColor: action.color + '15' }}>
                    <action.icon size={12} style={{ color: action.color }} />
                  </div>
                  <ArrowUpRight size={10} style={{ color: COLORS.muted }} />
                </div>
                <div className="text-xs" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 500 }}>{action.label}</div>
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

  const Shooting = ({ userRole }) => {
    const [shootData, setShootData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reelsInput, setReelsInput] = useState(1);
    const [longsInput, setLongsInput] = useState(1);
    const [docsInput, setDocsInput] = useState(1);
    const [error, setError] = useState('');
    const [client, setClient] = useState(null);
  
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
  
    const isAdmin = userRole?.role === 'admin';
  
    const loadData = async () => {
      const { data: clientData } = await supabase.from('clients').select('*').limit(1).single();
      if (clientData) setClient(clientData);
  
      let { data } = await supabase.from('monthly_shoots').select('*')
        .eq('month', currentMonth).eq('year', currentYear).limit(1).maybeSingle();
  
      if (!data) {
        const clientId = clientData?.id || '11111111-1111-1111-1111-111111111111';
        const { data: newRow } = await supabase.from('monthly_shoots')
          .insert({ client_id: clientId, month: currentMonth, year: currentYear, reels_shot: 0, longs_shot: 0, documentaries_shot: 0 })
          .select().single();
        data = newRow;
      }
      setShootData(data);
  
      const { data: hist } = await supabase.from('monthly_shoots').select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });
      if (hist) setHistory(hist);
  
      setLoading(false);
    };
  
    useEffect(() => { loadData(); }, []);
  
    const updateCount = async (field, delta) => {
      if (!shootData) return;
      const currentValue = shootData[field] || 0;
      const newValue = Math.max(0, currentValue + delta);
  
      const { error: updateError } = await supabase.from('monthly_shoots')
        .update({ [field]: newValue, updated_at: new Date().toISOString() })
        .eq('id', shootData.id);
  
      if (updateError) { setError(updateError.message); return; }
      await loadData();
    };
  
    if (loading) return <div className="text-center py-20" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading...</div>;
  
    const reelsShot = shootData?.reels_shot || 0;
    const longsShot = shootData?.longs_shot || 0;
    const docsShot = shootData?.documentaries_shot || 0;
    const totalLongs = longsShot + docsShot;
  
    const reelsTarget = client?.reels_per_month || 15;
    const longsTarget = client?.longs_per_month || 15;
    const extraReelPrice = client?.extra_reel_price || 3900;
    const extraLongPrice = client?.extra_long_price || 12000;
  
    const extraReels = Math.max(0, reelsShot - reelsTarget);
    const extraLongs = Math.max(0, totalLongs - longsTarget);
    const extrasCost = (extraReels * extraReelPrice) + (extraLongs * extraLongPrice);
  
    const reelsPct = Math.min(100, Math.round((reelsShot / reelsTarget) * 100));
    const longsPct = Math.min(100, Math.round((totalLongs / longsTarget) * 100));
  
    const isFullPackage = reelsShot >= reelsTarget && totalLongs >= longsTarget;
    const totalExtras = extraReels + extraLongs;
  
    return (
      <div>
        <SectionHeader
          title="Shooting Tracker"
          subtitle={isAdmin ? `Track videos shot for ${currentMonth} ${currentYear}. Update as you shoot.` : `Your content progress for ${currentMonth} ${currentYear}`}
        />
  
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: COLORS.red + '15', color: COLORS.red, fontFamily: 'DM Sans' }}>{error}</div>
        )}
  
        {totalExtras > 0 && (
          <div className="mb-6 p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)` }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '2rem' }}>🚀</span>
              <div className="flex-1">
                <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>
                  {totalExtras === 1 ? 'Incredible growth!' : totalExtras <= 3 ? 'Amazing momentum!' : 'This is a power month!'}
                </div>
                <div className="text-sm mt-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>
                  You've shot{' '}
                  {extraReels > 0 && `${extraReels} extra reel${extraReels > 1 ? 's' : ''}`}
                  {extraReels > 0 && extraLongs > 0 && ' + '}
                  {extraLongs > 0 && `${extraLongs} extra long video${extraLongs > 1 ? 's' : ''}`}
                  {' '}this month — an investment of ₹{extrasCost.toLocaleString('en-IN')} in faster growth.
                </div>
                <div className="text-xs mt-2" style={{ color: COLORS.navy, fontFamily: 'DM Sans', opacity: 0.8 }}>
                  Bonus deliveries billed at ₹{extraReelPrice.toLocaleString('en-IN')} per reel · ₹{extraLongPrice.toLocaleString('en-IN')} per long video. Added to next month's invoice.
                </div>
              </div>
            </div>
          </div>
        )}
  
        {isFullPackage && totalExtras === 0 && (
          <div className="mb-6 p-5 rounded-2xl" style={{ backgroundColor: COLORS.green + '15', border: `1px solid ${COLORS.green}40` }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <div>
                <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Amazing! Full package delivered</div>
                <div className="text-sm mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{reelsTarget} Reels + {longsTarget} Long-form videos shot this month. Let's keep growing.</div>
              </div>
            </div>
          </div>
        )}
  
        <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: COLORS.border }}>
          <h3 className="mb-5" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>This Month's Progress</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
                <span style={{ color: COLORS.navy, fontWeight: 500 }}>Reels</span>
                <span style={{ color: COLORS.muted }}>{reelsShot} / {reelsTarget}{extraReels > 0 && <span style={{ color: COLORS.gold, fontWeight: 600 }}> (+{extraReels} bonus)</span>}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${reelsPct}%`, background: extraReels > 0 ? `linear-gradient(90deg, ${COLORS.navy} 0%, ${COLORS.gold} 100%)` : COLORS.navy }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm" style={{ fontFamily: 'DM Sans' }}>
                <span style={{ color: COLORS.navy, fontWeight: 500 }}>Long-form Videos</span>
                <span style={{ color: COLORS.muted }}>{totalLongs} / {longsTarget}{extraLongs > 0 && <span style={{ color: COLORS.gold, fontWeight: 600 }}> (+{extraLongs} bonus)</span>}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${longsPct}%`, background: extraLongs > 0 ? `linear-gradient(90deg, ${COLORS.gold} 0%, ${COLORS.navy} 100%)` : COLORS.gold }} />
              </div>
            </div>
          </div>
  
          <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row gap-3 text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1rem' }}>📦</span>
              <div>
                <span style={{ color: COLORS.navy, fontWeight: 600 }}>Your Package:</span>
                <span style={{ color: COLORS.muted }}> {reelsTarget} Reels + {longsTarget} Long-form / month included</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '1rem' }}>⚡</span>
              <div>
                <span style={{ color: COLORS.gold, fontWeight: 600 }}>Growth add-ons:</span>
                <span style={{ color: COLORS.muted }}> ₹{extraReelPrice.toLocaleString('en-IN')} per extra reel · ₹{extraLongPrice.toLocaleString('en-IN')} per extra long video</span>
              </div>
            </div>
          </div>
        </div>
  
        {isAdmin && (
          <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Admin Controls — Log shot videos</h3>
            <p className="text-xs mb-5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Only you see this section. Dr. Vikas sees the progress bars above.</p>
  
            <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.cream }}>
              <div className="flex items-center justify-between mb-2">
                <div style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 500 }}>Reels Shot</div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Current: {reelsShot}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="99" value={reelsInput} onChange={(e) => setReelsInput(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                <button onClick={() => updateCount('reels_shot', reelsInput)} className="flex-1 py-2 rounded-lg text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>
                  + Add {reelsInput} Reel{reelsInput > 1 ? 's' : ''} Shot
                </button>
                <button onClick={() => updateCount('reels_shot', -1)} className="px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }} title="Undo 1">-1</button>
              </div>
            </div>
  
            <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.cream }}>
              <div className="flex items-center justify-between mb-2">
                <div style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 500 }}>Long-form Videos Shot (Talking head)</div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Current: {longsShot}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="99" value={longsInput} onChange={(e) => setLongsInput(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                <button onClick={() => updateCount('longs_shot', longsInput)} className="flex-1 py-2 rounded-lg text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>
                  + Add {longsInput} Long Video{longsInput > 1 ? 's' : ''} Shot
                </button>
                <button onClick={() => updateCount('longs_shot', -1)} className="px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }} title="Undo 1">-1</button>
              </div>
            </div>
  
            <div className="mb-4 p-4 rounded-xl" style={{ backgroundColor: COLORS.cream }}>
              <div className="flex items-center justify-between mb-2">
                <div style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 500 }}>Documentaries Shot</div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Current: {docsShot} (counted as Long-form for client)</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="99" value={docsInput} onChange={(e) => setDocsInput(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                <button onClick={() => updateCount('documentaries_shot', docsInput)} className="flex-1 py-2 rounded-lg text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans', fontWeight: 500 }}>
                  + Add {docsInput} Documentar{docsInput > 1 ? 'ies' : 'y'} Shot
                </button>
                <button onClick={() => updateCount('documentaries_shot', -1)} className="px-3 py-2 rounded-lg text-sm border transition-colors hover:bg-gray-50" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }} title="Undo 1">-1</button>
              </div>
            </div>
  
            {extrasCost > 0 && (
              <div className="mt-4 p-4 rounded-xl border-2" style={{ borderColor: COLORS.gold, backgroundColor: COLORS.gold + '10' }}>
                <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '0.08em' }}>Admin billing preview (hidden from client)</div>
                <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>
                  Base: ₹{(client?.monthly_fee || 225000).toLocaleString('en-IN')}
                  {extraReels > 0 && <div>+ {extraReels} extra reel{extraReels > 1 ? 's' : ''} × ₹{extraReelPrice.toLocaleString('en-IN')} = ₹{(extraReels * extraReelPrice).toLocaleString('en-IN')}</div>}
                  {extraLongs > 0 && <div>+ {extraLongs} extra long × ₹{extraLongPrice.toLocaleString('en-IN')} = ₹{(extraLongs * extraLongPrice).toLocaleString('en-IN')}</div>}
                  <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy, marginTop: 8 }}>
                    Total next billing: ₹{((client?.monthly_fee || 225000) + extrasCost).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
  
        {history.length > 1 && (
          <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: COLORS.border }}>
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Monthly History</h3>
            <div className="space-y-3">
              {history.filter(h => !(h.month === currentMonth && h.year === currentYear)).map(h => {
                const hTotalLongs = (h.longs_shot || 0) + (h.documentaries_shot || 0);
                const hExtraReels = Math.max(0, (h.reels_shot || 0) - reelsTarget);
                const hExtraLongs = Math.max(0, hTotalLongs - longsTarget);
                return (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: COLORS.border }}>
                    <div>
                      <div style={{ fontFamily: 'DM Sans', fontWeight: 500, color: COLORS.navy }}>{h.month} {h.year}</div>
                      <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>
                        {h.reels_shot || 0} reels · {hTotalLongs} long-form {isAdmin && ((h.longs_shot || 0) + ' talking + ' + (h.documentaries_shot || 0) + ' docs')}
                      </div>
                    </div>
                    {(hExtraReels > 0 || hExtraLongs > 0) && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>
                        +{hExtraReels + hExtraLongs} bonus
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const EditingReview = ({ userRole }) => {
    const isEditor = userRole?.role === 'editor';
    const isClient = userRole?.role === 'client';
    const isAdmin = userRole?.role === 'admin';
  // === EDITOR PANEL CONSTANTS ===
  const PAUSE_CATEGORIES = [
    { id: 'song_search', label: 'Song search', icon: '🎵' },
    { id: 'reference_research', label: 'Reference research', icon: '📺' },
    { id: 'break', label: 'Break (counts toward 30/day)', icon: '☕' },
    { id: 'color_grading', label: 'Color grading', icon: '🎨' },
    { id: 'other', label: 'Other (add note)', icon: '⏸' }
  ];

  const ATTENDANCE_TYPES = [
    { id: 'editing', label: 'Editing today', icon: '🎬', auto: true, desc: 'Auto-approved, queue unlocks' },
    { id: 'shoot', label: 'On shoot today', icon: '📸', auto: false, desc: 'Needs Nitin approval' },
    { id: 'sick', label: 'Sick / unwell', icon: '🤒', auto: false, desc: 'Needs Nitin approval' },
    { id: 'leave', label: 'Personal leave', icon: '🏖', auto: false, desc: 'Needs Nitin approval' }
  ];

  const getDeadlineDisplay = (deadline) => {
    if (!deadline) return { text: 'No deadline', color: COLORS.muted, urgent: false };
    const now = new Date();
    const dl = new Date(deadline);
    const diffMs = dl - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffMs < 0) {
      const overDays = Math.abs(diffDays);
      return { text: `OVERDUE ${overDays}d`, color: COLORS.red, urgent: true };
    }
    if (diffHours < 24) return { text: 'Due TOMORROW', color: COLORS.red, urgent: true };
    if (diffDays <= 3) return { text: `Due in ${diffDays}d`, color: COLORS.amber, urgent: false };
    return { text: `Due in ${diffDays}d`, color: COLORS.muted, urgent: false };
  };

  const getPriorityDots = (priority) => {
    const p = priority || 1;
    return '●'.repeat(p) + '○'.repeat(5 - p);
  };

    const [attendance, setAttendance] = useState(null);
    const [videos, setVideos] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [workTimer, setWorkTimer] = useState(0);
    const [breakActive, setBreakActive] = useState(null);
    const [breakTimer, setBreakTimer] = useState(0);
    const [breakMinutesToday, setBreakMinutesToday] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(null);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [helpMessage, setHelpMessage] = useState('');
    const [showReflection, setShowReflection] = useState(false);
    const [reflection, setReflection] = useState({ went_well: '', slowed_down: '', need_from_manager: '' });
    const [showReferenceBoard, setShowReferenceBoard] = useState(false);
    const [references, setReferences] = useState([]);
    const [newRef, setNewRef] = useState({ title: '', category: 'Color LUT', url: '', notes: '' });
    const [idleWarning, setIdleWarning] = useState(false);
    const [breakReminder, setBreakReminder] = useState(false);

   // === NEW STATE FOR PASTE 2 + 3 ===
   const [notifications, setNotifications] = useState([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [showNotifPanel, setShowNotifPanel] = useState(false);
   const [commentChecklist, setCommentChecklist] = useState([]);
   const [attendanceRequest, setAttendanceRequest] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [attendanceType, setAttendanceType] = useState('editing');
    const [attendanceReason, setAttendanceReason] = useState('');
    const [projects, setProjects] = useState([]);
    const [luts, setLuts] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeProjectFilter, setActiveProjectFilter] = useState('all');
    const [expandedVideoId, setExpandedVideoId] = useState(null);
    const [salaryData, setSalaryData] = useState(null);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [pauseCategory, setPauseCategory] = useState(null);
    const [pauseNote, setPauseNote] = useState('');
    const [activePause, setActivePause] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadMethod, setUploadMethod] = useState('drive_link');
    const [uploadDriveLink, setUploadDriveLink] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);
    const [showReviewPanel, setShowReviewPanel] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [newCommentTimestamp, setNewCommentTimestamp] = useState(0);
  
    const today = new Date().toISOString().split('T')[0];
    const todayDisplay = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const currentTime = new Date();
  
 // === AUTO-LOGOUT AT 7 PM ===
 useEffect(() => {
  if (!userRole) return;
  const checkLogout = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 19) {
      supabase.auth.signOut().then(() => {
        window.location.href = '/login';
      });
    }
  };
  checkLogout();
  const interval = setInterval(checkLogout, 60000);
  return () => clearInterval(interval);
}, [userRole]);

// === REQUEST DESKTOP NOTIFICATION PERMISSION ===
useEffect(() => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}, []);

// === LOAD NOTIFICATIONS + POLL EVERY 10 SECONDS ===
useEffect(() => {
  if (!userRole) return;
  let lastNotifId = null;

  const loadNotifs = async () => {
    const { data } = await supabase.from('notifications').select('*').eq('receiver_id', userRole.user_id).order('created_at', { ascending: false }).limit(20);
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);

      // Trigger desktop notification + sound for new ones
      const newest = data[0];
      if (newest && !newest.read && newest.id !== lastNotifId && lastNotifId !== null) {
        // Desktop notification
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Black Pepper — Message from Nitin', {
            body: newest.message,
            icon: '/favicon.ico',
          });
        }
        // Sound
        if (newest.sound_enabled) {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQBvAAAA');
            audio.play().catch(() => {});
            // Fallback: use AudioContext beep
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          } catch (e) {}
        }
      }
      if (newest) lastNotifId = newest.id;
    }
  };

  loadNotifs();
  const interval = setInterval(loadNotifs, 10000);
  return () => clearInterval(interval);
}, [userRole]);

// === LOAD DATA ===
useEffect(() => {
  const loadAll = async () => {
    if (!userRole) return;

    // Load projects (everyone)
    const { data: projs } = await supabase.from('projects').select('*').eq('status', 'active').order('created_at', { ascending: true });
    if (projs) setProjects(projs);

    // Load attendance (editor only)
    if (isEditor) {
      const { data: att } = await supabase.from('attendance').select('*').eq('user_id', userRole.user_id).eq('date', today).maybeSingle();
      if (att) setAttendance(att);

      // Check pending attendance request for today
      const { data: req } = await supabase.from('attendance_requests').select('*').eq('editor_id', userRole.user_id).eq('date', today).maybeSingle();
      if (req) setAttendanceRequest(req);

      const { data: activeSess } = await supabase.from('work_sessions').select('*, videos(*)').eq('editor_id', userRole.user_id).eq('is_active', true).is('ended_at', null).maybeSingle();
      if (activeSess) setActiveSession(activeSess);

      const { data: activeBreak } = await supabase.from('daily_breaks').select('*').eq('user_id', userRole.user_id).eq('date', today).is('ended_at', null).maybeSingle();
      if (activeBreak) setBreakActive(activeBreak);

      const { data: activePauseLog } = await supabase.from('pause_logs').select('*').eq('editor_id', userRole.user_id).is('ended_at', null).maybeSingle();
      if (activePauseLog) setActivePause(activePauseLog);

      const { data: doneBreaks } = await supabase.from('daily_breaks').select('duration_minutes').eq('user_id', userRole.user_id).eq('date', today).not('ended_at', 'is', null);
      if (doneBreaks) setBreakMinutesToday(doneBreaks.reduce((sum, b) => sum + (b.duration_minutes || 0), 0));

      const { data: refs } = await supabase.from('reference_board').select('*').eq('user_id', userRole.user_id).order('created_at', { ascending: false });
      if (refs) setReferences(refs);

      // Load Shravan's salary data (current month)
      const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
      const currentYear = new Date().getFullYear();
      const { data: salary } = await supabase.from('salary_history').select('*').eq('editor_id', userRole.user_id).eq('month', currentMonth).eq('year', currentYear).maybeSingle();
      if (salary) setSalaryData(salary);
    }

    // Load videos with project info
    const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested', 'Approved']).order('deadline', { ascending: true, nullsFirst: false });
    if (vids) setVideos(vids);

    // Load LUTs (for editor when active session exists)
    if (isEditor) {
      const { data: allLuts } = await supabase.from('luts').select('*').order('created_at', { ascending: false });
      if (allLuts) setLuts(allLuts);
    }

    // Load video comments (admin sees all, client sees own, editor sees for active video)
    const { data: allComments } = await supabase.from('video_comments').select('*').order('created_at', { ascending: false });
    if (allComments) setComments(allComments);

    setLoading(false);
  };
  loadAll();
}, [userRole, today, isEditor]);
  
    // === WORK TIMER ===
    useEffect(() => {
      if (!activeSession || breakActive) return;
      const startTime = activeSession.resumed_at ? new Date(activeSession.resumed_at) : new Date(activeSession.started_at);
      const baseSecs = activeSession.total_seconds || 0;
      const interval = setInterval(() => {
        setWorkTimer(baseSecs + Math.floor((new Date() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }, [activeSession, breakActive]);
  
    // === BREAK TIMER ===
    useEffect(() => {
      if (!breakActive) return;
      const startTime = new Date(breakActive.started_at);
      const interval = setInterval(() => {
        setBreakTimer(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }, [breakActive]);
  
    // === IDLE DETECTION (5 min) ===
    useEffect(() => {
      if (!activeSession || breakActive) return;
      let idleTimer;
      const resetIdle = () => {
        clearTimeout(idleTimer);
        setIdleWarning(false);
        idleTimer = setTimeout(() => setIdleWarning(true), 5 * 60 * 1000);
      };
      const events = ['mousemove', 'keydown', 'click'];
      events.forEach(e => window.addEventListener(e, resetIdle));
      resetIdle();
      return () => {
        clearTimeout(idleTimer);
        events.forEach(e => window.removeEventListener(e, resetIdle));
      };
    }, [activeSession, breakActive]);
  
    // === SCREEN BREAK REMINDER (every 90 min) ===
    useEffect(() => {
      if (!activeSession || breakActive) return;
      const timer = setTimeout(() => setBreakReminder(true), 90 * 60 * 1000);
      return () => clearTimeout(timer);
    }, [activeSession, breakActive]);
  
    // === ATTENDANCE CHECK-IN ===
    const handleCheckIn = async () => {
      const now = new Date();
      const tenAM = new Date();
      tenAM.setHours(10, 0, 0, 0);
      const minutesLate = Math.max(0, Math.floor((now - tenAM) / 60000));
      const status = minutesLate === 0 ? 'on_time' : minutesLate <= 15 ? 'on_time' : 'late';
  
      const { data, error } = await supabase.from('attendance').insert({
        user_id: userRole.user_id,
        check_in_time: now.toISOString(),
        date: today,
        minutes_late: minutesLate,
        status: status,
      }).select().single();
  
      if (!error) setAttendance(data);
      else alert('Error marking attendance: ' + error.message);
    };
  
    // === START EDITING (opens project notes modal first) ===
    const openStartModal = (video) => {
      setShowProjectModal({
        video,
        project_file_name: video.project_file_name || '',
        project_ssd_location: video.project_ssd_location || '',
        project_folder_path: video.project_folder_path || '',
        raw_footage_location: video.raw_footage_location || '',
        editing_notes: video.editing_notes || '',
      });
    };
  
    const handleStartEditing = async () => {
      if (!showProjectModal.project_file_name.trim() || !showProjectModal.project_ssd_location.trim()) {
        alert('Please fill in the project file name and SSD location before starting.');
        return;
      }
  
      // Save project notes
      await supabase.from('videos').update({
        project_file_name: showProjectModal.project_file_name,
        project_ssd_location: showProjectModal.project_ssd_location,
        project_folder_path: showProjectModal.project_folder_path,
        raw_footage_location: showProjectModal.raw_footage_location,
        editing_notes: showProjectModal.editing_notes,
        status: 'In Progress',
        editing_started_at: new Date().toISOString(),
        editor_id: userRole.user_id,
      }).eq('id', showProjectModal.video.id);
  
      // Create work session
      const { data: session } = await supabase.from('work_sessions').insert({
        video_id: showProjectModal.video.id,
        editor_id: userRole.user_id,
        started_at: new Date().toISOString(),
        is_active: true,
      }).select('*, videos(*)').single();
  
      setActiveSession(session);
      setShowProjectModal(null);
  
      // Refresh videos
      const { data: vids } = await supabase.from('videos').select('*').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested']).order('created_at', { ascending: false });
      if (vids) setVideos(vids);
    };
  
    // === MARK COMPLETE (checklist first) ===
    const [showChecklist, setShowChecklist] = useState(false);
    const [checklist, setChecklist] = useState({
      color_grading: false, audio_leveled: false, captions_added: false, watermark_visible: false,
      export_rendered: false, thumbnail_saved: false, files_backed_up: false
    });
  
    const handleMarkComplete = async () => {
      const allChecked = Object.values(checklist).every(v => v);
      if (!allChecked) {
        alert('Please tick all checklist items before marking complete.');
        return;
      }
  
      await supabase.from('work_sessions').update({
        ended_at: new Date().toISOString(),
        total_seconds: workTimer,
        is_active: false,
      }).eq('id', activeSession.id);
  
      await supabase.from('videos').update({
        status: 'Ready for Review',
        editing_completed_at: new Date().toISOString(),
        completion_checklist: checklist,
      }).eq('id', activeSession.video_id);
  
      setActiveSession(null);
      setShowChecklist(false);
      setChecklist({ color_grading: false, audio_leveled: false, captions_added: false, watermark_visible: false, export_rendered: false, thumbnail_saved: false, files_backed_up: false });
      setWorkTimer(0);
  
      const { data: vids } = await supabase.from('videos').select('*').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested']).order('created_at', { ascending: false });
      if (vids) setVideos(vids);
    };
  
    // === FOOD BREAK ===
    const handleStartBreak = async () => {
      const { data } = await supabase.from('daily_breaks').insert({
        user_id: userRole.user_id,
        date: today,
        break_type: 'food',
        started_at: new Date().toISOString(),
      }).select().single();
      setBreakActive(data);
    };
  
    const handleEndBreak = async () => {
      const duration = Math.floor((new Date() - new Date(breakActive.started_at)) / 60000);
      await supabase.from('daily_breaks').update({
        ended_at: new Date().toISOString(),
        duration_minutes: duration,
      }).eq('id', breakActive.id);
      setBreakMinutesToday(prev => prev + duration);
      setBreakActive(null);
    };
  
    // === NEED HELP ===
    const handleSendHelp = async () => {
      if (!helpMessage.trim()) return;
      await supabase.from('help_requests').insert({
        editor_id: userRole.user_id,
        video_id: activeSession?.video_id || null,
        message: helpMessage,
        status: 'open',
      });
      setHelpMessage('');
      setShowHelpModal(false);
      alert('Help request sent to Nitin.');
    };
  
    // === SAVE REFLECTION ===
    const handleSaveReflection = async () => {
      await supabase.from('daily_reflections').upsert({
        user_id: userRole.user_id,
        date: today,
        ...reflection,
      });
      setShowReflection(false);
      alert('Reflection saved. Great work today.');
    };
  
    // === ADD REFERENCE ===
    const handleAddReference = async () => {
      if (!newRef.title.trim()) return;
      const { data } = await supabase.from('reference_board').insert({
        user_id: userRole.user_id,
        ...newRef,
      }).select().single();
      setReferences([data, ...references]);
      setNewRef({ title: '', category: 'Color LUT', url: '', notes: '' });
    };
  
    const handleDeleteReference = async (id) => {
      await supabase.from('reference_board').delete().eq('id', id);
      setReferences(references.filter(r => r.id !== id));
    };

    // === NEW HANDLERS FOR PASTE 2 ===

    // Submit attendance (4 types)
    const handleAttendanceSubmit = async () => {
      const selectedType = ATTENDANCE_TYPES.find(t => t.id === attendanceType);
      if (!selectedType) return;

      // Editing = auto-approved (creates regular attendance record)
      if (selectedType.auto) {
        const now = new Date();
        const tenAM = new Date();
        tenAM.setHours(10, 0, 0, 0);
        const minutesLate = Math.max(0, Math.floor((now - tenAM) / 60000));
        const status = minutesLate <= 15 ? 'on_time' : 'late';
        const { data, error } = await supabase.from('attendance').insert({
          user_id: userRole.user_id,
          check_in_time: now.toISOString(),
          date: today,
          minutes_late: minutesLate,
          status: status,
        }).select().single();
        if (!error) setAttendance(data);
        else alert('Error: ' + error.message);
        setShowAttendanceModal(false);
        return;
      }

      // Shoot/Sick/Leave = pending Nitin approval
      if (!attendanceReason.trim()) {
        alert('Please enter a reason for this leave type.');
        return;
      }
      const { data, error } = await supabase.from('attendance_requests').insert({
        editor_id: userRole.user_id,
        date: today,
        request_type: selectedType.id,
        reason: attendanceReason,
        status: 'pending',
      }).select().single();
      if (!error) {
        setAttendanceRequest(data);
        alert('Request submitted to Nitin. You can browse the queue but cannot start editing until approved.');
      } else {
        alert('Error: ' + error.message);
      }
      setShowAttendanceModal(false);
      setAttendanceReason('');
    };

    // Open pause modal (mandatory category)
    const handleOpenPauseModal = () => {
      if (!activeSession) return;
      setShowPauseModal(true);
    };

    // Confirm pause with category
    const handleConfirmPause = async () => {
      if (!pauseCategory) {
        alert('Please pick a pause category.');
        return;
      }
      if (pauseCategory === 'other' && !pauseNote.trim()) {
        alert('Please add a note for "Other" category.');
        return;
      }

      // Insert pause log
      const { data: pauseLog } = await supabase.from('pause_logs').insert({
        editor_id: userRole.user_id,
        video_id: activeSession.video_id,
        work_session_id: activeSession.id,
        category: pauseCategory,
        notes: pauseNote || null,
        started_at: new Date().toISOString(),
      }).select().single();
      setActivePause(pauseLog);

      // If category is "break" — also create daily_breaks entry
      if (pauseCategory === 'break') {
        const { data: brk } = await supabase.from('daily_breaks').insert({
          user_id: userRole.user_id,
          date: today,
          break_type: 'food',
          started_at: new Date().toISOString(),
        }).select().single();
        setBreakActive(brk);
      }

      setShowPauseModal(false);
      setPauseCategory(null);
      setPauseNote('');
    };

    // Resume from pause
    const handleResumePause = async () => {
      if (!activePause) return;
      const endedAt = new Date();
      const durationSecs = Math.floor((endedAt - new Date(activePause.started_at)) / 1000);
      await supabase.from('pause_logs').update({
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSecs,
      }).eq('id', activePause.id);

      // If it was a break — also close daily_breaks
      if (activePause.category === 'break' && breakActive) {
        const durationMins = Math.floor(durationSecs / 60);
        await supabase.from('daily_breaks').update({
          ended_at: endedAt.toISOString(),
          duration_minutes: durationMins,
        }).eq('id', breakActive.id);
        setBreakMinutesToday(prev => prev + durationMins);
        setBreakActive(null);
      }

      setActivePause(null);
    };

    // Submit final video upload (Bunny CDN or Drive link)
  const handleSubmitUpload = async () => {
    if (uploadMethod === 'drive_link' && !uploadDriveLink.trim()) {
      alert('Please paste the Drive link.');
      return;
    }
    if (uploadMethod === 'bunny_upload' && !uploadFile) {
      alert('Please choose a video file to upload.');
      return;
    }

    const updates = {
      status: 'Ready for Review',
      editing_completed_at: new Date().toISOString(),
      completion_checklist: checklist,
      final_video_uploaded_at: new Date().toISOString(),
      upload_method: uploadMethod,
    };

    if (uploadMethod === 'drive_link') {
      updates.final_video_link = uploadDriveLink;
    }

    // BUNNY UPLOAD FLOW
    if (uploadMethod === 'bunny_upload') {
      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Step 1: Create video entry in Bunny
        const createRes = await fetch('/api/cloudflare-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: activeSession.videos.title }),
        });
        const createData = await createRes.json();
        if (!createData.success) {
          alert('Failed to create video on Bunny: ' + (createData.error || 'unknown'));
          setIsUploading(false);
          return;
        }

        // Step 2: Upload file directly to Bunny with progress
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) resolve();
            else reject(new Error('Upload failed: ' + xhr.status));
          });
          xhr.addEventListener('error', () => reject(new Error('Network error')));
          xhr.open('PUT', createData.uploadUrl);
          xhr.setRequestHeader('AccessKey', createData.apiKey);
          xhr.send(uploadFile);
        });

        updates.bunny_video_id = createData.videoId;
        updates.bunny_embed_url = createData.embedUrl;
        updates.final_video_link = createData.embedUrl;

        setIsUploading(false);
      } catch (err) {
        alert('Upload error: ' + err.message);
        setIsUploading(false);
        return;
      }
    }

    // Close work session
    await supabase.from('work_sessions').update({
      ended_at: new Date().toISOString(),
      total_seconds: workTimer,
      is_active: false,
    }).eq('id', activeSession.id);

    // Update video
    await supabase.from('videos').update(updates).eq('id', activeSession.video_id);

    setActiveSession(null);
    setShowUploadModal(false);
    setShowChecklist(false);
    setUploadDriveLink('');
    setUploadFile(null);
    setUploadProgress(0);
    setUploadMethod('drive_link');
    setChecklist({ color_grading: false, audio_leveled: false, captions_added: false, watermark_visible: false, export_rendered: false, thumbnail_saved: false, files_backed_up: false });
    setWorkTimer(0);

    // Refresh
    const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested', 'Approved']).order('deadline', { ascending: true, nullsFirst: false });
    if (vids) setVideos(vids);

    alert('Video sent to client for review!');
  };

    // Post a comment (Dr. Vikas review)
    const handlePostComment = async (videoId, type) => {
      const commentData = {
        video_id: videoId,
        client_id: userRole.client_id,
        author_user_id: userRole.user_id,
        timestamp_seconds: newCommentTimestamp,
        status: 'open',
      };

      if (type === 'text') {
        if (!newCommentText.trim()) return;
        commentData.comment_text = newCommentText;
      }

      const { data } = await supabase.from('video_comments').insert(commentData).select().single();
      if (data) {
        setComments([data, ...comments]);
        setNewCommentText('');
      }
    };

    // Client approves video
    const handleClientApprove = async (videoId) => {
      await supabase.from('videos').update({
        status: 'Approved',
        client_approval_status: 'Approved',
        client_approved_at: new Date().toISOString(),
      }).eq('id', videoId);
      const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested', 'Approved']).order('deadline', { ascending: true, nullsFirst: false });
      if (vids) setVideos(vids);
      setShowReviewPanel(null);
    };

    // Mark notification as read
    const handleMarkNotifRead = async (notifId) => {
      await supabase.from('notifications').update({ read: true }).eq('id', notifId);
      setNotifications(notifications.map(n => n.id === notifId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Toggle comment checklist done/not done (for Shravan)
    const handleToggleCommentDone = async (commentId, currentlyDone) => {
      await supabase.from('video_comments').update({ status: currentlyDone ? 'open' : 'resolved' }).eq('id', commentId);
      setComments(comments.map(c => c.id === commentId ? { ...c, status: currentlyDone ? 'open' : 'resolved' } : c));
    };

    // Client requests changes (with all comments attached)
    const handleClientRequestChanges = async (videoId) => {
      const videoComments = comments.filter(c => c.video_id === videoId);
      const commentSummary = videoComments.length > 0 
        ? `${videoComments.length} comments attached` 
        : 'No specific comments';
      await supabase.from('videos').update({
        status: 'Changes Requested',
        client_approval_status: 'Changes Requested',
        client_feedback_text: commentSummary,
      }).eq('id', videoId);
      const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested', 'Approved']).order('deadline', { ascending: true, nullsFirst: false });
      if (vids) setVideos(vids);
      setShowReviewPanel(null);
    };
  
    // === COUNT COMPLETED TODAY ===
    const completedTodayCount = videos.filter(v => v.editing_completed_at && new Date(v.editing_completed_at).toDateString() === new Date().toDateString()).length;
    const reelsCompletedToday = videos.filter(v => v.format === 'Reel' && v.editing_completed_at && new Date(v.editing_completed_at).toDateString() === new Date().toDateString()).length;
    const longsCompletedToday = videos.filter(v => v.format !== 'Reel' && v.editing_completed_at && new Date(v.editing_completed_at).toDateString() === new Date().toDateString()).length;
  
    const notStarted = videos.filter(v => v.status === 'Shot' || v.status === 'Not Started');
    const inProgress = videos.filter(v => v.status === 'In Progress' && v.id !== activeSession?.video_id);
    const readyForReview = videos.filter(v => v.status === 'Ready for Review');
    const changesRequested = videos.filter(v => v.status === 'Changes Requested');
  
    const formatTime = (secs) => {
      const h = Math.floor(secs / 3600).toString().padStart(2, '0');
      const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };
  
    const formatMins = (secs) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}m ${s}s`;
    };
  
    if (loading) return <div className="text-center py-20" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading...</div>;
  
    // =================================
    // CLIENT VIEW (Dr. Vikas)
    // =================================
    if (isClient) {
      return (
        <div>
          <SectionHeader title="Your Videos in Editing" subtitle="Track your content from shoot to publish" />
  
          {inProgress.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>🔵 In Progress ({inProgress.length})</h3>
              {inProgress.map(v => (
                <div key={v.id} className="bg-white rounded-lg p-3 border mb-2" style={{ borderColor: COLORS.border }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                      <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Your video is being edited right now</div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: COLORS.gold + '20' }}>
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.gold }} />
                      <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>Editing</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
  
  {/* Shravan: Changes Requested — comment checklist */}
  {isEditor && changesRequested.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.red, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>🔧 Changes Requested by Dr. Vikas ({changesRequested.length})</h3>
              {changesRequested.map(v => {
                const videoComments = comments.filter(c => c.video_id === v.id);
                const doneCount = videoComments.filter(c => c.status === 'resolved').length;
                return (
                  <div key={v.id} className="bg-white rounded-lg border mb-3 p-3" style={{ borderColor: COLORS.red + '60' }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                        <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{doneCount} of {videoComments.length} changes done</div>
                      </div>
                      <button onClick={() => openStartModal(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>▶ Resume Editing</button>
                    </div>
                    {videoComments.length > 0 && (
                      <div className="space-y-1">
                        {videoComments.map(c => {
                          const ts = c.timestamp_seconds || 0;
                          const m = Math.floor(ts / 60);
                          const s = Math.floor(ts % 60);
                          const isDone = c.status === 'resolved';
                          return (
                            <label key={c.id} className="flex items-start gap-2 p-2 rounded text-xs cursor-pointer hover:bg-gray-50" style={{ backgroundColor: isDone ? COLORS.green + '10' : COLORS.cream }}>
                              <input type="checkbox" checked={isDone} onChange={() => handleToggleCommentDone(c.id, isDone)} className="mt-0.5" />
                              <span style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 700 }}>📍 {m}:{s.toString().padStart(2, '0')}</span>
                              <span style={{ color: isDone ? COLORS.muted : COLORS.navy, fontFamily: 'DM Sans', textDecoration: isDone ? 'line-through' : 'none' }}>{c.comment_text}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {readyForReview.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>🟡 Ready for Your Review ({readyForReview.length})</h3>
              {readyForReview.map(v => {
                const videoComments = comments.filter(c => c.video_id === v.id);
                const videoEmbed = v.bunny_embed_url ? v.bunny_embed_url : (v.final_video_link ? (() => {
                  const m = v.final_video_link.match(/\/d\/([a-zA-Z0-9_-]+)/);
                  return m ? `https://drive.google.com/file/d/${m[1]}/preview` : v.final_video_link;
                })() : null);

                return (
                  <div key={v.id} className="bg-white rounded-lg border mb-3" style={{ borderColor: COLORS.gold }}>
                    <div className="p-3">
                      <div className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                      <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Ready since {v.editing_completed_at ? new Date(v.editing_completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'today'}</div>
                    </div>

                    {videoEmbed && (
                      <div className="px-3 pb-3">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                        <iframe src={videoEmbed} width="100%" height="100%" allow="autoplay" allowFullScreen style={{ border: 0 }} />
                        </div>
                      </div>
                    )}

                    <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: COLORS.border }}>
                      <div className="flex items-center gap-2 mb-2">
                        <input type="number" min="0" step="0.1" value={newCommentTimestamp} onChange={(e) => setNewCommentTimestamp(parseFloat(e.target.value) || 0)} placeholder="0.0" className="w-20 px-2 py-1 rounded border text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                        <span className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>seconds</span>
                        <input spellCheck="true" type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add comment at this timestamp..." className="flex-1 px-2 py-1 rounded border text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                        <button onClick={() => handlePostComment(v.id, 'text')} className="px-3 py-1 rounded text-xs font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>+ Add</button>
                      </div>

                      {videoComments.length > 0 && (
                        <div className="space-y-1 mb-3 max-h-40 overflow-y-auto">
                          {videoComments.map(c => {
                            const ts = c.timestamp_seconds || 0;
                            const m = Math.floor(ts / 60);
                            const s = Math.floor(ts % 60);
                            return (
                              <div key={c.id} className="flex items-start gap-2 p-2 rounded text-xs" style={{ backgroundColor: COLORS.cream }}>
                                <span style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 700 }}>📍 {m}:{s.toString().padStart(2, '0')}</span>
                                <span style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{c.comment_text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button onClick={() => handleClientApprove(v.id)} className="flex-1 py-2 rounded-lg text-xs font-medium" style={{ backgroundColor: COLORS.green, color: 'white', fontFamily: 'DM Sans' }}>✓ Approve</button>
                        <button onClick={() => handleClientRequestChanges(v.id)} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>✗ Request Changes ({videoComments.length})</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {false && readyForReview.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>🟡 Ready for Your Review ({readyForReview.length})</h3>
              {readyForReview.map(v => (
                <div key={v.id} className="bg-white rounded-lg p-3 border mb-2" style={{ borderColor: COLORS.gold }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                      <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Ready since {v.editing_completed_at ? new Date(v.editing_completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'today'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={async () => { await supabase.from('videos').update({ status: 'Approved', client_approval_status: 'Approved', client_approved_at: new Date().toISOString() }).eq('id', v.id); const { data: vids } = await supabase.from('videos').select('*').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested']).order('created_at', { ascending: false }); if (vids) setVideos(vids); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: COLORS.green, color: 'white', fontFamily: 'DM Sans' }}>Approve</button>
                      <button onClick={async () => { const msg = prompt('What changes do you want?'); if (msg) { await supabase.from('videos').update({ status: 'Changes Requested', client_feedback_text: msg, client_approval_status: 'Changes Requested' }).eq('id', v.id); const { data: vids } = await supabase.from('videos').select('*').in('status', ['Shot', 'Not Started', 'In Progress', 'Ready for Review', 'Changes Requested']).order('created_at', { ascending: false }); if (vids) setVideos(vids); } }} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Request Changes</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
  
          {changesRequested.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>🔁 Changes Requested ({changesRequested.length})</h3>
              {changesRequested.map(v => (
                <div key={v.id} className="bg-white rounded-lg p-3 border mb-2" style={{ borderColor: COLORS.border }}>
                  <div className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                  <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Your feedback: {v.client_feedback_text}</div>
                </div>
              ))}
            </div>
          )}
  
          {notStarted.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>⏳ Waiting to Start ({notStarted.length})</h3>
              {notStarted.map(v => (
                <div key={v.id} className="bg-white rounded-lg p-3 border mb-2" style={{ borderColor: COLORS.border }}>
                  <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                </div>
              ))}
            </div>
          )}
  
          {videos.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No videos in editing yet.</div>
          )}
        </div>
      );
    }
  
    // =================================
    // EDITOR VIEW (Shravan)
    // =================================
    if (isEditor) {
      const checkInTime = attendance ? new Date(attendance.check_in_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : null;
      const targetLongs = 3, targetReels = 2;
      const longProgress = Math.min(100, (longsCompletedToday / targetLongs) * 100);
      const reelProgress = Math.min(100, (reelsCompletedToday / targetReels) * 100);
  
      return (
        <div>
          {/* Header */}
          <div className="mb-4">
          <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', fontWeight: 500, color: COLORS.navy, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Good morning, {userRole?.full_name || 'there'}
            </h1>

            {/* Notification Bell */}
            <div className="absolute top-4 right-4">
              <button onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative p-2 rounded-full hover:bg-gray-100" style={{ backgroundColor: 'white', border: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: '1.25rem' }}>🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: COLORS.red, color: 'white', minWidth: '18px', textAlign: 'center', fontFamily: 'DM Sans' }}>{unreadCount}</span>
                )}
              </button>
              {showNotifPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto" style={{ borderColor: COLORS.border }}>
                  <div className="p-3 border-b" style={{ borderColor: COLORS.border }}>
                    <div className="font-medium" style={{ color: COLORS.navy, fontFamily: 'Fraunces' }}>Notifications</div>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No notifications yet.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => !n.read && handleMarkNotifRead(n.id)} className="p-3 border-b cursor-pointer hover:bg-gray-50" style={{ borderColor: COLORS.border, backgroundColor: !n.read ? COLORS.gold + '10' : 'white' }}>
                        <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: !n.read ? 600 : 400 }}>{n.message}</div>
                        <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{todayDisplay}</p>
          </div>
  
          {/* Attendance + Work Timer + Break */}
          {!attendance && !attendanceRequest ? (
            <div className="mb-4 rounded-xl p-5 border-2 text-center" style={{ borderColor: COLORS.gold, background: `linear-gradient(135deg, #FFFDF5 0%, ${COLORS.gold}15 100%)` }}>
              <div className="text-sm mb-3" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Office hours: 10:00 AM – 7:00 PM</div>
              <button onClick={() => setShowAttendanceModal(true)} className="px-6 py-3 rounded-lg font-medium transition-colors" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans', fontSize: '1rem' }}>
                📝 Mark Today's Status
              </button>
            </div>
          ) : !attendance && attendanceRequest ? (
            <div className="mb-4 rounded-xl p-4 border-2" style={{ borderColor: COLORS.amber, backgroundColor: COLORS.amber + '10' }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: '1.25rem' }}>⏳</span>
                <span style={{ fontFamily: 'Fraunces', fontWeight: 500, color: COLORS.navy }}>Awaiting Nitin's Approval</span>
              </div>
              <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>You requested: <strong>{ATTENDANCE_TYPES.find(t => t.id === attendanceRequest.request_type)?.label}</strong></div>
              <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Reason: {attendanceRequest.reason}</div>
              <div className="text-xs mt-2" style={{ color: COLORS.amber, fontFamily: 'DM Sans', fontWeight: 600 }}>You can browse the queue but cannot start editing until approved.</div>
            </div>
          ) : (
            <div className="mb-4 rounded-xl p-3 border flex items-center gap-4" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
              <div>
                <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Attendance</div>
                <div className="text-sm" style={{ color: attendance.minutes_late > 15 ? COLORS.red : COLORS.green, fontFamily: 'DM Sans', fontWeight: 600 }}>
                  {checkInTime} {attendance.minutes_late > 0 ? `· ${attendance.minutes_late} min late` : '· On time'}
                </div>
              </div>
              {activeSession && !breakActive && (
                <div className="ml-4 pl-4 border-l" style={{ borderColor: COLORS.border }}>
                  <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Editing timer</div>
                  <div className="text-sm" style={{ color: COLORS.navy, fontFamily: 'Fraunces', fontWeight: 500 }}>{formatTime(workTimer)}</div>
                </div>
              )}
              <div className="ml-auto flex gap-2">
                {breakActive ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: COLORS.gold + '20' }}>
                    <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>🍱 On break · {formatMins(breakTimer)}</span>
                    <button onClick={handleEndBreak} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>I'm Back</button>
                  </div>
                ) : (
                  <>
                    <button onClick={handleStartBreak} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>🍱 Going for Food</button>
                    <button onClick={() => setShowHelpModal(true)} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: COLORS.red + '40', color: COLORS.red, fontFamily: 'DM Sans' }}>🆘 Need Help</button>
                    <button onClick={() => setShowReferenceBoard(true)} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>📌 References</button>
                  </>
                )}
              </div>
            </div>
          )}
  
  {/* Salary Widget */}
  {attendance && !salaryData && (
            <div className="mb-4 rounded-xl p-3 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>SALARY</div>
              <div className="text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Salary not set yet. Nitin will update soon.</div>
            </div>
          )}
          {attendance && salaryData && (
            <div className="mb-4 rounded-xl p-4 border" style={{ borderColor: COLORS.gold + '40', background: `linear-gradient(135deg, #FFFDF5 0%, ${COLORS.gold}10 100%)` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wider" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>YOUR SALARY THIS MONTH</div>
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <span style={{ fontFamily: 'Fraunces', fontSize: '2rem', fontWeight: 500, color: COLORS.navy, lineHeight: 1 }}>₹{Number(salaryData.base_salary).toLocaleString('en-IN')}</span>
                {salaryData.next_month_salary && salaryData.next_month_salary !== salaryData.base_salary && (
                  <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: salaryData.next_month_salary > salaryData.base_salary ? COLORS.green + '20' : COLORS.red + '20', color: salaryData.next_month_salary > salaryData.base_salary ? COLORS.green : COLORS.red, fontFamily: 'DM Sans', fontWeight: 600 }}>
                    {salaryData.next_month_salary > salaryData.base_salary ? '↗' : '↘'} ₹{Number(salaryData.next_month_salary).toLocaleString('en-IN')} next month
                  </span>
                )}
              </div>
              <div className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Keep up the good work — your salary updates automatically every month.</div>
            </div>
          )} 

          {/* Daily Target */}
          {attendance && (
            <div className="mb-4 rounded-xl p-4 border" style={{ borderColor: COLORS.border, backgroundColor: 'white' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ fontFamily: 'Fraunces', fontSize: '1rem', fontWeight: 500, color: COLORS.navy }}>Today's Target</h3>
                <span className="text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{completedTodayCount} / 5 videos today</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'DM Sans' }}>
                    <span style={{ color: COLORS.navy }}>Long-form</span>
                    <span style={{ color: COLORS.muted }}>{longsCompletedToday} / {targetLongs}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${longProgress}%`, backgroundColor: COLORS.navy }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs" style={{ fontFamily: 'DM Sans' }}>
                    <span style={{ color: COLORS.navy }}>Reels</span>
                    <span style={{ color: COLORS.muted }}>{reelsCompletedToday} / {targetReels}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${reelProgress}%`, backgroundColor: COLORS.gold }} />
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t text-xs" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>
                Break time used: {breakMinutesToday} / 30 min {breakMinutesToday > 30 && <span style={{ color: COLORS.red }}>· over budget</span>}
              </div>
            </div>
          )}
  
        {/* Active session */}
        {activeSession && (
            <div className="mb-4 rounded-xl p-4 border-2" style={{ borderColor: COLORS.gold, background: `linear-gradient(135deg, white 0%, ${COLORS.gold}10 100%)` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider" style={{ color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>{activePause ? '⏸ PAUSED' : '🔵 IN PROGRESS'}</span>
                <span className="text-sm" style={{ color: COLORS.navy, fontFamily: 'Fraunces', fontWeight: 500 }}>{formatTime(workTimer)}</span>
              </div>
              <div className="text-base" style={{ color: COLORS.navy, fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500 }}>
                {activeSession.videos?.title}
              </div>
              <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>
                Saved on: {activeSession.videos?.project_ssd_location} · {activeSession.videos?.project_file_name}
              </div>

              {(() => {
                const av = activeSession.videos;
                if (!av) return null;
                const activeLuts = luts.filter(l => l.video_id === av.id || (l.lut_type === 'project' && l.project_id === av.project_id));
                if (activeLuts.length === 0) return null;
                return (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                    <div className="text-xs font-medium mb-2" style={{ color: COLORS.gold, fontFamily: 'DM Sans' }}>🎨 LUTs to apply:</div>
                    {activeLuts.map(l => (
                      <div key={l.id} className="flex items-center justify-between mb-1 text-xs bg-white rounded p-2 border" style={{ borderColor: COLORS.border }}>
                        <div>
                          <div style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>{l.lut_type === 'project' ? '📦 Project LUT' : '🎬 Video LUT'} {l.time_range && `· ${l.time_range}`}</div>
                          <div style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{l.name}</div>
                          {l.notes && <div className="mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontSize: '0.7rem' }}>{l.notes}</div>}
                        </div>
                        <a href={l.download_url} target="_blank" rel="noopener noreferrer" className="px-2 py-1 rounded border text-xs whitespace-nowrap" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Download ↗</a>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <div className="flex gap-2 mt-3">
                {activePause ? (
                  <button onClick={handleResumePause} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.green, color: 'white', fontFamily: 'DM Sans' }}>
                    ▶ Resume
                  </button>
                ) : (
                  <button onClick={handleOpenPauseModal} className="px-4 py-2 rounded-lg text-sm font-medium border" style={{ borderColor: COLORS.amber, color: COLORS.amber, fontFamily: 'DM Sans' }}>
                    ⏸ Pause
                  </button>
                )}
                <button onClick={() => setShowChecklist(true)} disabled={!!activePause} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>
                  Mark Complete
                </button>
              </div>
            </div>
          )}
          
         {/* Filter Chips + Queue */}
          {attendance && (
            <div className="mb-4">
              <h3 className="mb-3 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>📝 Your Queue</h3>
              <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={() => setActiveProjectFilter('all')} className="px-3 py-1.5 rounded-full text-xs border transition-all" style={{ borderColor: activeProjectFilter === 'all' ? COLORS.navy : COLORS.border, backgroundColor: activeProjectFilter === 'all' ? COLORS.navy : 'white', color: activeProjectFilter === 'all' ? 'white' : COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
                  All Projects ({notStarted.length})
                </button>
                {projects.map(p => {
                  const count = notStarted.filter(v => v.project_id === p.id).length;
                  return (
                    <button key={p.id} onClick={() => setActiveProjectFilter(p.id)} className="px-3 py-1.5 rounded-full text-xs border transition-all" style={{ borderColor: activeProjectFilter === p.id ? p.color : COLORS.border, backgroundColor: activeProjectFilter === p.id ? p.color : 'white', color: activeProjectFilter === p.id ? 'white' : COLORS.muted, fontFamily: 'DM Sans', fontWeight: 600 }}>
                      {p.icon} {p.name} ({count})
                    </button>
                  );
                })}
              </div>

              {(() => {
                const filtered = activeProjectFilter === 'all' ? notStarted : notStarted.filter(v => v.project_id === activeProjectFilter);
                const sorted = [...filtered].sort((a, b) => {
                  if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
                  if (a.deadline) return -1;
                  if (b.deadline) return 1;
                  if ((b.priority || 1) !== (a.priority || 1)) return (b.priority || 1) - (a.priority || 1);
                  return new Date(a.created_at) - new Date(b.created_at);
                });

                if (sorted.length === 0) {
                  return <div className="bg-white rounded-lg p-6 border text-center text-sm" style={{ borderColor: COLORS.border, color: COLORS.muted, fontFamily: 'DM Sans' }}>No videos in this filter.</div>;
                }

                return sorted.map(v => {
                  const dl = getDeadlineDisplay(v.deadline);
                  const isExpanded = expandedVideoId === v.id;
                  const proj = v.projects || projects.find(p => p.id === v.project_id);
                  const videoLuts = luts.filter(l => l.video_id === v.id || (l.lut_type === 'project' && l.project_id === v.project_id));

                  return (
                    <div key={v.id} className="bg-white rounded-lg border mb-2 transition-all" style={{ borderColor: dl.urgent ? COLORS.red + '60' : COLORS.border }}>
                      <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setExpandedVideoId(isExpanded ? null : v.id)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {proj && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: proj.color + '20', color: proj.color, fontFamily: 'DM Sans', fontWeight: 600 }}>{proj.icon} {proj.name}</span>}
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: v.category === 'Reel' ? COLORS.gold + '20' : COLORS.navy + '10', color: v.category === 'Reel' ? COLORS.gold : COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>{v.category || 'Long'}</span>
                            <span className="text-xs" style={{ color: dl.color, fontFamily: 'DM Sans', fontWeight: 600 }}>⏱ {dl.text}</span>
                            {v.priority && <span className="text-xs" style={{ color: COLORS.gold, fontFamily: 'DM Sans' }}>{getPriorityDots(v.priority)}</span>}
                          </div>
                          <div className="text-sm font-medium mt-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</div>
                          {v.topic && <div className="text-xs mt-0.5 truncate" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{v.topic}</div>}
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {v.script_link && (
                            <a href={v.script_link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-2 py-1 rounded text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>📄 Script</a>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); openStartModal(v); }} disabled={!!activeSession} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>
                            ▶ Start
                          </button>
                          <span style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-0 border-t" style={{ borderColor: COLORS.border }}>
                          {v.topic && <div className="mt-2 text-xs" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}><strong>Topic:</strong> {v.topic}</div>}
                          {v.deadline && <div className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}><strong>Deadline:</strong> {new Date(v.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</div>}
                          {v.raw_footage_location && <div className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}><strong>Raw footage:</strong> {v.raw_footage_location}</div>}
                          {v.editing_notes && <div className="mt-1 text-xs" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}><strong>Notes from Nitin:</strong> {v.editing_notes}</div>}
                          {videoLuts.length > 0 && (
                            <div className="mt-2 pt-2 border-t" style={{ borderColor: COLORS.border }}>
                              <div className="text-xs font-medium mb-1" style={{ color: COLORS.gold, fontFamily: 'DM Sans' }}>🎨 LUTs assigned:</div>
                              {videoLuts.map(l => (
                                <div key={l.id} className="flex items-center justify-between mt-1 text-xs">
                                  <span style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{l.lut_type === 'project' ? '📦' : '🎬'} {l.name} {l.time_range && `(${l.time_range})`}</span>
                                  <a href={l.download_url} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded border text-xs" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Download ↗</a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Completed today */}
          {attendance && completedTodayCount > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-xs uppercase tracking-wider" style={{ color: COLORS.muted, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '0.1em' }}>✅ Completed Today ({completedTodayCount})</h3>
              {videos.filter(v => v.editing_completed_at && new Date(v.editing_completed_at).toDateString() === new Date().toDateString()).map(v => (
                <div key={v.id} className="bg-white rounded-lg p-2 border mb-2" style={{ borderColor: COLORS.green + '40' }}>
                  <span className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>✓ {v.title}</span>
                </div>
              ))}
            </div>
          )}
  
          {/* Daily reflection trigger (after 6 PM) */}
          {attendance && currentTime.getHours() >= 18 && (
            <div className="mb-4 rounded-xl p-3 border-l-4" style={{ borderLeftColor: COLORS.gold, backgroundColor: COLORS.gold + '08' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>End of day. Take 1 min to reflect?</span>
                <button onClick={() => setShowReflection(true)} className="text-xs px-3 py-1 rounded-lg" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Open Reflection</button>
              </div>
            </div>
          )}
  
          {/* === MODALS === */}
  
          {/* Project Notes Modal */}
          {showProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Before you start — project setup</h3>
                <p className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Editing: <strong>{showProjectModal.video.title}</strong></p>
  
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Project file name *</label>
                    <input spellCheck="true" type="text" value={showProjectModal.project_file_name} onChange={(e) => setShowProjectModal({...showProjectModal, project_file_name: e.target.value})} placeholder="e.g., BOTOX-MYTHS-REEL-v1.prproj" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>SSD / Drive location *</label>
                    <input spellCheck="true" type="text" value={showProjectModal.project_ssd_location} onChange={(e) => setShowProjectModal({...showProjectModal, project_ssd_location: e.target.value})} placeholder="e.g., SSD 2 (Samsung T7 Black)" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Folder path</label>
                    <input spellCheck="true" type="text" value={showProjectModal.project_folder_path} onChange={(e) => setShowProjectModal({...showProjectModal, project_folder_path: e.target.value})} placeholder="e.g., /Projects/Kyra/April2026/Reels/" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Raw footage location</label>
                    <input spellCheck="true" type="text" value={showProjectModal.raw_footage_location} onChange={(e) => setShowProjectModal({...showProjectModal, raw_footage_location: e.target.value})} placeholder="e.g., SSD 1 — Card 1 Apr 20 shoot" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Notes before starting</label>
                    <textarea spellCheck="true" rows={3} value={showProjectModal.editing_notes} onChange={(e) => setShowProjectModal({...showProjectModal, editing_notes: e.target.value})} placeholder="Any notes, references, specific requirements..." className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                </div>
  
                <div className="flex gap-2 mt-4">
                  <button onClick={handleStartEditing} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Start & Save Notes</button>
                  <button onClick={() => setShowProjectModal(null)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Checklist Modal */}
          {showChecklist && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Completion Checklist</h3>
                <p className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Tick all items before marking complete.</p>
                <div className="space-y-2">
                {Object.keys(checklist).filter(key => {
                    if (key === 'thumbnail_saved') return false;
                    if (key === 'watermark_visible' && !activeSession?.videos?.requires_watermark) return false;
                    return true;
                  }).map(key => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={checklist[key]} onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })} />
                      <span className="text-sm" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                <button onClick={() => {
                    const requiredKeys = Object.keys(checklist).filter(key => {
                      if (key === 'thumbnail_saved') return false;
                      if (key === 'watermark_visible' && !activeSession?.videos?.requires_watermark) return false;
                      return true;
                    });
                    const allChecked = requiredKeys.every(k => checklist[k]);
                    if (!allChecked) { alert('Please tick all checklist items first.'); return; }
                    setShowChecklist(false);
                    setShowUploadModal(true);
                  }} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.green, color: 'white', fontFamily: 'DM Sans' }}>Next: Upload Final Video →</button>
                  <button onClick={() => setShowChecklist(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Help Modal */}
          {showHelpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Need Help?</h3>
                <textarea spellCheck="true" rows={4} value={helpMessage} onChange={(e) => setHelpMessage(e.target.value)} placeholder="What are you stuck on?" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                <div className="flex gap-2 mt-3">
                  <button onClick={handleSendHelp} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Send to Nitin</button>
                  <button onClick={() => setShowHelpModal(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Reflection Modal */}
          {showReflection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>End of Day Reflection</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>What went well today?</label>
                    <textarea spellCheck="true" rows={2} value={reflection.went_well} onChange={(e) => setReflection({...reflection, went_well: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>What slowed you down?</label>
                    <textarea spellCheck="true" rows={2} value={reflection.slowed_down} onChange={(e) => setReflection({...reflection, slowed_down: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Anything you need from Nitin tomorrow?</label>
                    <textarea spellCheck="true" rows={2} value={reflection.need_from_manager} onChange={(e) => setReflection({...reflection, need_from_manager: e.target.value})} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSaveReflection} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Save & Close</button>
                  <button onClick={() => setShowReflection(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Later</button>
                </div>
              </div>
            </div>
          )}
  
          {/* Reference Board Modal */}
          {showReferenceBoard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>📌 Reference Board</h3>
                  <button onClick={() => setShowReferenceBoard(false)} style={{ color: COLORS.muted }}><X size={18} /></button>
                </div>
                <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: COLORS.border }}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input spellCheck="true" type="text" value={newRef.title} onChange={(e) => setNewRef({...newRef, title: e.target.value})} placeholder="Title" className="px-2 py-1 rounded border text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                    <select value={newRef.category} onChange={(e) => setNewRef({...newRef, category: e.target.value})} className="px-2 py-1 rounded border text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }}>
                      <option>Color LUT</option>
                      <option>Sound Effect</option>
                      <option>Reference Video</option>
                      <option>Aesthetic</option>
                      <option>Tutorial</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <input spellCheck="true" type="text" value={newRef.url} onChange={(e) => setNewRef({...newRef, url: e.target.value})} placeholder="URL (optional)" className="w-full px-2 py-1 rounded border text-xs mb-2" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  <textarea spellCheck="true" rows={2} value={newRef.notes} onChange={(e) => setNewRef({...newRef, notes: e.target.value})} placeholder="Notes" className="w-full px-2 py-1 rounded border text-xs" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  <button onClick={handleAddReference} className="mt-2 w-full py-1 rounded text-xs" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>+ Add Reference</button>
                </div>
                <div className="space-y-2">
                  {references.length === 0 ? (
                    <div className="text-xs text-center py-6" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No references yet.</div>
                  ) : references.map(r => (
                    <div key={r.id} className="p-2 rounded border flex justify-between" style={{ borderColor: COLORS.border }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.gold + '20', color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>{r.category}</span>
                          <span className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{r.title}</span>
                        </div>
                        {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs underline" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Open link</a>}
                        {r.notes && <div className="text-xs mt-1" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>{r.notes}</div>}
                      </div>
                      <button onClick={() => handleDeleteReference(r.id)} className="ml-2" style={{ color: COLORS.red }}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
  
          {/* Idle Warning Banner */}
          {idleWarning && (
            <div className="fixed bottom-4 right-4 z-40 bg-white rounded-xl p-4 border-l-4 shadow-lg max-w-sm" style={{ borderLeftColor: COLORS.gold }}>
              <div className="text-sm font-medium mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Still editing?</div>
              <div className="text-xs mb-2" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Your timer is running. No activity for 5 min.</div>
              <button onClick={() => setIdleWarning(false)} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>I'm still here</button>
            </div>
          )}
  
   {/* Break Reminder */}
   {breakReminder && (
            <div className="fixed bottom-4 right-4 z-40 bg-white rounded-xl p-4 border-l-4 shadow-lg max-w-sm" style={{ borderLeftColor: COLORS.green }}>
              <div className="text-sm font-medium mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>💆 90 minutes of editing</div>
              <div className="text-xs mb-2" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Take a 2-min break?</div>
              <div className="flex gap-2">
                <button onClick={() => setBreakReminder(false)} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>I'm in flow</button>
                <button onClick={() => { setBreakReminder(false); setShowPauseModal(true); }} className="text-xs px-3 py-1 rounded border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Take break</button>
              </div>
            </div>
          )}

          {/* Attendance 4-Option Modal */}
          {showAttendanceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="mb-3" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>📝 What is your day looking like?</h3>
                <div className="space-y-2 mb-4">
                  {ATTENDANCE_TYPES.map(t => (
                    <label key={t.id} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50" style={{ borderColor: attendanceType === t.id ? COLORS.navy : COLORS.border }}>
                      <input type="radio" name="att" value={t.id} checked={attendanceType === t.id} onChange={(e) => setAttendanceType(e.target.value)} className="mt-1" />
                      <div>
                        <div style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: 600 }}>{t.icon} {t.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: t.auto ? COLORS.green : COLORS.amber, fontFamily: 'DM Sans' }}>{t.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {attendanceType !== 'editing' && (
                  <div className="mb-4">
                    <label className="text-xs block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>Reason *</label>
                    <textarea spellCheck="true" rows={2} value={attendanceReason} onChange={(e) => setAttendanceReason(e.target.value)} placeholder="e.g., Mohali wedding shoot with Nitin" className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={handleAttendanceSubmit} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white', fontFamily: 'DM Sans' }}>Submit</button>
                  <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Pause Category Modal (mandatory) */}
          {showPauseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Why are you pausing?</h3>
                <p className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Pick a category to track time accurately.</p>
                <div className="space-y-2 mb-3">
                  {PAUSE_CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setPauseCategory(c.id)} className="w-full flex items-center gap-3 p-3 rounded-lg border text-left" style={{ borderColor: pauseCategory === c.id ? COLORS.navy : COLORS.border, backgroundColor: pauseCategory === c.id ? COLORS.navy + '08' : 'white' }}>
                      <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
                      <span style={{ fontFamily: 'DM Sans', color: COLORS.navy, fontWeight: pauseCategory === c.id ? 600 : 500 }}>{c.label}</span>
                    </button>
                  ))}
                </div>
                {pauseCategory === 'other' && (
                  <textarea spellCheck="true" rows={2} value={pauseNote} onChange={(e) => setPauseNote(e.target.value)} placeholder="Add note..." className="w-full px-3 py-2 rounded-lg border text-sm mb-3" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                )}
                <div className="flex gap-2">
                  <button onClick={handleConfirmPause} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.amber, color: 'white', fontFamily: 'DM Sans' }}>Confirm Pause</button>
                  <button onClick={() => { setShowPauseModal(false); setPauseCategory(null); setPauseNote(''); }} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Final Video Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                <h3 className="mb-1" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>📤 Upload Final Video</h3>
                <p className="text-xs mb-4" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Last step before Dr. Vikas reviews your work.</p>

                {activeSession?.videos?.upload_folder_link && (
                  <a href={activeSession.videos.upload_folder_link} target="_blank" rel="noopener noreferrer" className="block w-full py-2 rounded-lg text-sm text-center mb-3 border-2 border-dashed" style={{ borderColor: COLORS.gold, color: COLORS.gold, fontFamily: 'DM Sans', fontWeight: 600 }}>
                    📂 Open Drive Upload Folder ↗
                  </a>
                )}

            {/* Method toggle */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setUploadMethod('bunny_upload')} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ backgroundColor: uploadMethod === 'bunny_upload' ? COLORS.navy : 'white', color: uploadMethod === 'bunny_upload' ? 'white' : COLORS.navy, borderColor: COLORS.border, fontFamily: 'DM Sans' }}>📤 Upload Video File</button>
              <button onClick={() => setUploadMethod('drive_link')} className="flex-1 py-2 rounded-lg text-xs font-medium border" style={{ backgroundColor: uploadMethod === 'drive_link' ? COLORS.navy : 'white', color: uploadMethod === 'drive_link' ? 'white' : COLORS.navy, borderColor: COLORS.border, fontFamily: 'DM Sans' }}>🔗 Paste Drive Link</button>
            </div>

            {/* BUNNY FILE UPLOAD MODE */}
            {uploadMethod === 'bunny_upload' && (
              <div className="mb-4">
                <label className="text-xs block mb-2" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>Choose final video file:</label>
                <input type="file" accept="video/*" onChange={(e) => setUploadFile(e.target.files[0])} disabled={isUploading} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
                {uploadFile && !isUploading && (
                  <div className="text-xs mt-2" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)
                  </div>
                )}
                {isUploading && (
                  <div className="mt-3">
                    <div className="text-xs mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>Uploading to Bunny CDN... {uploadProgress}%</div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: COLORS.border }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%`, backgroundColor: COLORS.gold }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DRIVE LINK MODE */}
            {uploadMethod === 'drive_link' && (
              <div className="mb-4">
                <label className="text-xs block mb-1" style={{ color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>Paste your final video Drive link:</label>
                <input spellCheck="false" type="text" value={uploadDriveLink} onChange={(e) => setUploadDriveLink(e.target.value)} placeholder="https://drive.google.com/file/d/..." className="w-full px-3 py-2 rounded-lg border text-sm" style={{ borderColor: COLORS.border, fontFamily: 'DM Sans' }} />
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={handleSubmitUpload} disabled={isUploading} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: isUploading ? COLORS.border : COLORS.navy, color: 'white', fontFamily: 'DM Sans', opacity: isUploading ? 0.6 : 1 }}>
                {isUploading ? `Uploading ${uploadProgress}%...` : 'Send to Client for Review'}
              </button>
              <button onClick={() => setShowUploadModal(false)} disabled={isUploading} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy, fontFamily: 'DM Sans' }}>Back</button>
            </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    // =================================
    // ADMIN VIEW (Nitin) — simple queue view
    // =================================
    return (
      <div>
        <SectionHeader title="Editing Queue" subtitle="All videos in editing pipeline" />
        <div className="space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>No videos in editing pipeline.</div>
          ) : videos.map(v => (
            <div key={v.id} className="bg-white rounded-lg p-3 border flex justify-between items-center" style={{ borderColor: COLORS.border }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.navy + '10', color: COLORS.navy, fontFamily: 'DM Sans', fontWeight: 600 }}>{v.format || 'Long'}</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.navy, fontFamily: 'DM Sans' }}>{v.title}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Status: {v.status}</div>
              </div>
            </div>
          ))}
        </div>
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
        if (roleData?.role === 'editor') setSection('editing');
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
    home: <DashboardHome userName={userRole?.full_name} clientId={userRole?.client_id} setSection={setSection} />, ideas: <IdeasScripts clientId={userRole?.client_id} userRole={userRole} />, shooting: <Shooting userRole={userRole} />, editing: <EditingReview userRole={userRole} />,
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
          {navItems.filter((item) => {
  if (userRole?.role === 'editor') return item.id === 'editing';
  return true;
}).map((item) => (
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