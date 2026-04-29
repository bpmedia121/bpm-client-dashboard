'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const COLORS = {
  navy: '#0A1F3F',
  gold: '#C9A86A',
  cream: '#FFFDF5',
  border: '#E8E5DD',
  muted: '#6B7280',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
};

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [loading, setLoading] = useState(true);

  // Data
  const [videos, setVideos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [luts, setLuts] = useState([]);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [editorUsers, setEditorUsers] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);

  // Forms
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showLutUpload, setShowLutUpload] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  // Form data
  const [newVideo, setNewVideo] = useState({
    title: '', topic: '', project_id: '', category: 'Long', deadline: '',
    priority: 3, requires_watermark: false, raw_footage_location: '',
    editing_notes: '', script_link: '', upload_folder_link: ''
  });
  const [projectForm, setProjectForm] = useState({ name: '', icon: '🎬', color: '#0A1F3F', drive_folder_link: '' });
  const [lutForm, setLutForm] = useState({ name: '', lut_type: 'project', project_id: '', video_id: '', download_url: '', time_range: '', notes: '' });
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState('');
  const [salaryForm, setSalaryForm] = useState({ editor_id: '', base_salary: 15000, next_month_salary: 15000, why_text: '' });

  // === AUTH CHECK ===
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: roleData } = await supabase.from('user_roles').select('*').eq('user_id', session.user.id).single();
      if (!roleData || roleData.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser({ ...session.user, ...roleData });
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // === LOAD DATA ===
  useEffect(() => {
    if (!user) return;
    const loadAll = async () => {
      const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').order('created_at', { ascending: false });
      if (vids) setVideos(vids);

      const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
      if (projs) setProjects(projs);

      const { data: lutData } = await supabase.from('luts').select('*').order('created_at', { ascending: false });
      if (lutData) setLuts(lutData);

      const { data: reqs } = await supabase.from('attendance_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false });
      if (reqs) setAttendanceRequests(reqs);

      const { data: editors } = await supabase.from('user_roles').select('*').eq('role', 'editor');
      if (editors) setEditorUsers(editors);

      const { data: salaries } = await supabase.from('salary_history').select('*').order('created_at', { ascending: false });
      if (salaries) setSalaryHistory(salaries);
    };
    loadAll();
  }, [user]);

  // === ADD VIDEO ===
  const handleAddVideo = async () => {
    if (!newVideo.title.trim() || !newVideo.project_id) {
      alert('Title and Project are required.');
      return;
    }
    const { error } = await supabase.from('videos').insert({
      ...newVideo,
      status: 'Not Started',
      created_at: new Date().toISOString(),
    });
    if (error) {
      alert('Error: ' + error.message);
      return;
    }
    setNewVideo({ title: '', topic: '', project_id: '', category: 'Long', deadline: '', priority: 3, requires_watermark: false, raw_footage_location: '', editing_notes: '', script_link: '', upload_folder_link: '' });
    setShowAddVideo(false);
    const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').order('created_at', { ascending: false });
    if (vids) setVideos(vids);
    alert('Video added!');
  };

  // === EDIT VIDEO ===
  const handleSaveVideoEdit = async () => {
    const { error } = await supabase.from('videos').update({
      title: editingVideo.title,
      topic: editingVideo.topic,
      deadline: editingVideo.deadline,
      priority: editingVideo.priority,
      requires_watermark: editingVideo.requires_watermark,
      raw_footage_location: editingVideo.raw_footage_location,
      editing_notes: editingVideo.editing_notes,
      script_link: editingVideo.script_link,
      upload_folder_link: editingVideo.upload_folder_link,
    }).eq('id', editingVideo.id);
    if (error) { alert('Error: ' + error.message); return; }
    setEditingVideo(null);
    const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').order('created_at', { ascending: false });
    if (vids) setVideos(vids);
    alert('Video updated!');
  };

  // === DELETE VIDEO ===
  const handleDeleteVideo = async (id) => {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    await supabase.from('videos').delete().eq('id', id);
    const { data: vids } = await supabase.from('videos').select('*, projects(name, color, icon)').order('created_at', { ascending: false });
    if (vids) setVideos(vids);
  };

  // === EDIT PROJECT ===
  const handleSaveProject = async () => {
    if (editingProject.id) {
      const { error } = await supabase.from('projects').update(projectForm).eq('id', editingProject.id);
      if (error) { alert('Error: ' + error.message); return; }
    } else {
      const { error } = await supabase.from('projects').insert({ ...projectForm, status: 'active' });
      if (error) { alert('Error: ' + error.message); return; }
    }
    setEditingProject(null);
    setProjectForm({ name: '', icon: '🎬', color: '#0A1F3F', drive_folder_link: '' });
    const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: true });
    if (projs) setProjects(projs);
  };

  // === ADD LUT ===
  const handleAddLut = async () => {
    if (!lutForm.name.trim() || !lutForm.download_url.trim()) {
      alert('Name and Download URL are required.');
      return;
    }
    const payload = { ...lutForm };
    if (payload.lut_type === 'project') payload.video_id = null;
    if (payload.lut_type === 'video') payload.project_id = null;
    const { error } = await supabase.from('luts').insert(payload);
    if (error) { alert('Error: ' + error.message); return; }
    setShowLutUpload(false);
    setLutForm({ name: '', lut_type: 'project', project_id: '', video_id: '', download_url: '', time_range: '', notes: '' });
    const { data: lutData } = await supabase.from('luts').select('*').order('created_at', { ascending: false });
    if (lutData) setLuts(lutData);
  };

  const handleDeleteLut = async (id) => {
    if (!confirm('Delete this LUT?')) return;
    await supabase.from('luts').delete().eq('id', id);
    const { data: lutData } = await supabase.from('luts').select('*').order('created_at', { ascending: false });
    if (lutData) setLuts(lutData);
  };

  // === ATTENDANCE APPROVAL ===
  const handleApproveAttendance = async (req) => {
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('attendance_requests').update({ status: 'approved' }).eq('id', req.id);
    if (req.request_type === 'shoot') {
      await supabase.from('attendance').insert({
        user_id: req.editor_id,
        check_in_time: new Date().toISOString(),
        date: today,
        minutes_late: 0,
        status: 'on_shoot',
      });
    }
    const { data: reqs } = await supabase.from('attendance_requests').select('*').eq('status', 'pending');
    if (reqs) setAttendanceRequests(reqs);
    alert('Approved!');
  };

  const handleRejectAttendance = async (req) => {
    const reason = prompt('Reason for rejection?');
    if (reason === null) return;
    await supabase.from('attendance_requests').update({ status: 'rejected', rejection_reason: reason }).eq('id', req.id);
    const { data: reqs } = await supabase.from('attendance_requests').select('*').eq('status', 'pending');
    if (reqs) setAttendanceRequests(reqs);
  };

  // === SEND NOTIFICATION ===
  const handleSendNotification = async () => {
    if (!notifMessage.trim() || !notifTarget) {
      alert('Message and target user required.');
      return;
    }
    const { error } = await supabase.from('notifications').insert({
      sender_id: user.user_id,
      receiver_id: notifTarget,
      message: notifMessage,
      sound_enabled: true,
      read: false,
    });
    if (error) { alert('Error: ' + error.message); return; }
    setNotifMessage('');
    setShowNotifModal(false);
    alert('Notification sent!');
  };

  // === SET SALARY ===
  const handleSetSalary = async () => {
    if (!salaryForm.editor_id) { alert('Pick an editor.'); return; }
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const currentYear = new Date().getFullYear();
    const existing = salaryHistory.find(s => s.editor_id === salaryForm.editor_id && s.month === currentMonth && s.year === currentYear);
    if (existing) {
      await supabase.from('salary_history').update({
        base_salary: salaryForm.base_salary,
        next_month_salary: salaryForm.next_month_salary,
        why_text: salaryForm.why_text,
      }).eq('id', existing.id);
    } else {
      await supabase.from('salary_history').insert({
        editor_id: salaryForm.editor_id,
        month: currentMonth,
        year: currentYear,
        base_salary: salaryForm.base_salary,
        next_month_salary: salaryForm.next_month_salary,
        why_text: salaryForm.why_text,
      });
    }
    setShowSalaryModal(false);
    const { data: salaries } = await supabase.from('salary_history').select('*').order('created_at', { ascending: false });
    if (salaries) setSalaryHistory(salaries);
    alert('Salary updated!');
  };

  if (loading) return <div className="p-8 text-center" style={{ color: COLORS.muted, fontFamily: 'DM Sans' }}>Loading admin panel...</div>;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.cream, fontFamily: 'DM Sans' }}>
      {/* Sidebar */}
      <div className="w-64 p-4" style={{ backgroundColor: COLORS.navy, color: 'white' }}>
        <div className="mb-6">
          <div style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500 }}>Black Pepper</div>
          <div className="text-xs" style={{ color: COLORS.gold, letterSpacing: '0.1em' }}>ADMIN</div>
        </div>
        <nav className="space-y-1">
          {[
            { id: 'videos', label: '🎬 Videos', count: videos.length },
            { id: 'projects', label: '📁 Projects', count: projects.length },
            { id: 'luts', label: '🎨 LUTs', count: luts.length },
            { id: 'attendance', label: '📝 Attendance', count: attendanceRequests.length },
            { id: 'notifications', label: '🔔 Send Notifications', count: 0 },
            { id: 'salary', label: '💰 Salary', count: 0 },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className="w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center" style={{ backgroundColor: activeTab === t.id ? COLORS.gold : 'transparent', color: activeTab === t.id ? COLORS.navy : 'white', fontWeight: activeTab === t.id ? 600 : 400 }}>
              <span>{t.label}</span>
              {t.count > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: activeTab === t.id ? COLORS.navy : COLORS.gold, color: activeTab === t.id ? 'white' : COLORS.navy }}>{t.count}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => router.push('/')} className="mt-6 w-full text-left px-3 py-2 rounded-lg text-sm" style={{ color: COLORS.gold }}>← Back to Dashboard</button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* VIDEOS TAB */}
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>Videos</h1>
              <button onClick={() => setShowAddVideo(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>+ Add Video</button>
            </div>

            <div className="space-y-2">
              {videos.map(v => (
                <div key={v.id} className="bg-white rounded-lg p-4 border" style={{ borderColor: COLORS.border }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {v.projects && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: v.projects.color + '20', color: v.projects.color, fontWeight: 600 }}>{v.projects.icon} {v.projects.name}</span>}
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: v.category === 'Reel' ? COLORS.gold + '20' : COLORS.navy + '10', color: v.category === 'Reel' ? COLORS.gold : COLORS.navy, fontWeight: 600 }}>{v.category}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: COLORS.cream, color: COLORS.muted, fontWeight: 600 }}>{v.status}</span>
                      </div>
                      <div className="font-medium" style={{ color: COLORS.navy }}>{v.title}</div>
                      {v.topic && <div className="text-xs mt-1" style={{ color: COLORS.muted }}>{v.topic}</div>}
                      {v.deadline && <div className="text-xs mt-1" style={{ color: COLORS.amber }}>⏱ {new Date(v.deadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingVideo(v)} className="px-3 py-1 rounded text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Edit</button>
                      <button onClick={() => handleDeleteVideo(v.id)} className="px-3 py-1 rounded text-xs border" style={{ borderColor: COLORS.red, color: COLORS.red }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && <div className="text-center py-8" style={{ color: COLORS.muted }}>No videos yet. Click "Add Video" to start.</div>}
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>Projects</h1>
              <button onClick={() => { setEditingProject({}); setProjectForm({ name: '', icon: '🎬', color: '#0A1F3F', drive_folder_link: '' }); }} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>+ New Project</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {projects.map(p => (
                <div key={p.id} className="bg-white rounded-lg p-4 border" style={{ borderColor: p.color + '40' }}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                      <span className="font-medium" style={{ color: COLORS.navy }}>{p.name}</span>
                    </div>
                    <button onClick={() => { setEditingProject(p); setProjectForm({ name: p.name, icon: p.icon, color: p.color, drive_folder_link: p.drive_folder_link || '' }); }} className="px-2 py-1 rounded text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Edit</button>
                  </div>
                  {p.drive_folder_link && <div className="text-xs truncate" style={{ color: COLORS.muted }}>📂 {p.drive_folder_link}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LUTS TAB */}
        {activeTab === 'luts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>LUTs</h1>
              <button onClick={() => setShowLutUpload(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>+ Add LUT</button>
            </div>
            <div className="space-y-2">
              {luts.map(l => (
                <div key={l.id} className="bg-white rounded-lg p-3 border flex justify-between items-center" style={{ borderColor: COLORS.border }}>
                  <div>
                    <div className="text-xs mb-1" style={{ color: COLORS.gold, fontWeight: 600 }}>{l.lut_type === 'project' ? '📦 Project LUT' : '🎬 Video LUT'} {l.time_range && `· ${l.time_range}`}</div>
                    <div className="font-medium" style={{ color: COLORS.navy }}>{l.name}</div>
                    {l.notes && <div className="text-xs mt-1" style={{ color: COLORS.muted }}>{l.notes}</div>}
                  </div>
                  <div className="flex gap-2">
                    <a href={l.download_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded text-xs border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Open ↗</a>
                    <button onClick={() => handleDeleteLut(l.id)} className="px-3 py-1 rounded text-xs border" style={{ borderColor: COLORS.red, color: COLORS.red }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div>
            <h1 className="mb-6" style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>Pending Attendance Requests</h1>
            <div className="space-y-2">
              {attendanceRequests.length === 0 && <div className="text-center py-8" style={{ color: COLORS.muted }}>No pending requests.</div>}
              {attendanceRequests.map(r => (
                <div key={r.id} className="bg-white rounded-lg p-4 border" style={{ borderColor: COLORS.amber + '40' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium" style={{ color: COLORS.navy }}>Type: {r.request_type}</div>
                      <div className="text-sm mt-1" style={{ color: COLORS.muted }}>Reason: {r.reason}</div>
                      <div className="text-xs mt-1" style={{ color: COLORS.muted }}>Date: {r.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApproveAttendance(r)} className="px-3 py-1 rounded text-xs font-medium" style={{ backgroundColor: COLORS.green, color: 'white' }}>Approve</button>
                      <button onClick={() => handleRejectAttendance(r)} className="px-3 py-1 rounded text-xs border" style={{ borderColor: COLORS.red, color: COLORS.red }}>Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <h1 className="mb-6" style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>Send Notification</h1>
            <div className="bg-white rounded-lg p-6 border max-w-lg" style={{ borderColor: COLORS.border }}>
              <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Send to:</label>
              <select value={notifTarget} onChange={(e) => setNotifTarget(e.target.value)} className="w-full px-3 py-2 rounded border mb-3 text-sm" style={{ borderColor: COLORS.border }}>
                <option value="">Pick user...</option>
                {editorUsers.map(e => <option key={e.user_id} value={e.user_id}>{e.full_name || e.user_id}</option>)}
              </select>

              <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Message:</label>
              <textarea spellCheck="true" rows={3} value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)} placeholder="e.g., Come to office now / Do the wedding video first / Take a break" className="w-full px-3 py-2 rounded border text-sm mb-3" style={{ borderColor: COLORS.border }} />

              <button onClick={handleSendNotification} className="w-full py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>🔔 Send with Sound</button>
            </div>
          </div>
        )}

        {/* SALARY TAB */}
        {activeTab === 'salary' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 style={{ fontFamily: 'Fraunces', fontSize: '1.75rem', color: COLORS.navy, fontWeight: 500 }}>Salary Management</h1>
              <button onClick={() => setShowSalaryModal(true)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>+ Set / Update Salary</button>
            </div>
            <div className="space-y-2">
              {salaryHistory.map(s => {
                const editor = editorUsers.find(e => e.user_id === s.editor_id);
                return (
                  <div key={s.id} className="bg-white rounded-lg p-4 border" style={{ borderColor: COLORS.gold + '40' }}>
                    <div className="font-medium" style={{ color: COLORS.navy }}>{editor?.full_name || s.editor_id}</div>
                    <div className="text-sm mt-1" style={{ color: COLORS.muted }}>{s.month} {s.year}</div>
                    <div className="flex items-baseline gap-3 mt-2">
                      <span style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', color: COLORS.navy }}>₹{Number(s.base_salary).toLocaleString('en-IN')}</span>
                      {s.next_month_salary && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: s.next_month_salary > s.base_salary ? COLORS.green + '20' : COLORS.red + '20', color: s.next_month_salary > s.base_salary ? COLORS.green : COLORS.red, fontWeight: 600 }}>Next: ₹{Number(s.next_month_salary).toLocaleString('en-IN')}</span>}
                    </div>
                    {s.why_text && <div className="text-xs mt-2" style={{ color: COLORS.muted }}>{s.why_text}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Add Video Modal */}
      {showAddVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Add New Video</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Title *</label>
                <input spellCheck="true" type="text" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Project *</label>
                <select value={newVideo.project_id} onChange={(e) => setNewVideo({ ...newVideo, project_id: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                  <option value="">Pick project...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Category</label>
                <select value={newVideo.category} onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                  <option value="Long">Long-form</option>
                  <option value="Reel">Reel</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Deadline</label>
                <input type="datetime-local" value={newVideo.deadline} onChange={(e) => setNewVideo({ ...newVideo, deadline: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Priority (1-5)</label>
                <input type="number" min="1" max="5" value={newVideo.priority} onChange={(e) => setNewVideo({ ...newVideo, priority: parseInt(e.target.value) || 3 })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="watermark" checked={newVideo.requires_watermark} onChange={(e) => setNewVideo({ ...newVideo, requires_watermark: e.target.checked })} />
                <label htmlFor="watermark" className="text-sm" style={{ color: COLORS.navy }}>Requires Watermark</label>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Topic / Description</label>
                <textarea spellCheck="true" rows={2} value={newVideo.topic} onChange={(e) => setNewVideo({ ...newVideo, topic: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Editing Notes for Shravan</label>
                <textarea spellCheck="true" rows={2} value={newVideo.editing_notes} onChange={(e) => setNewVideo({ ...newVideo, editing_notes: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Raw Footage Location</label>
                <input spellCheck="true" type="text" value={newVideo.raw_footage_location} onChange={(e) => setNewVideo({ ...newVideo, raw_footage_location: e.target.value })} placeholder="e.g., SSD 2 - Card 1 Apr 20" className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Script Drive Link</label>
                <input spellCheck="false" type="text" value={newVideo.script_link} onChange={(e) => setNewVideo({ ...newVideo, script_link: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Upload Folder Link (where Shravan uploads final video)</label>
                <input spellCheck="false" type="text" value={newVideo.upload_folder_link} onChange={(e) => setNewVideo({ ...newVideo, upload_folder_link: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddVideo} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>Add Video</button>
              <button onClick={() => setShowAddVideo(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Edit Video</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Title</label>
                <input spellCheck="true" type="text" value={editingVideo.title || ''} onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Deadline</label>
                <input type="datetime-local" value={editingVideo.deadline ? new Date(editingVideo.deadline).toISOString().slice(0, 16) : ''} onChange={(e) => setEditingVideo({ ...editingVideo, deadline: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Priority</label>
                <input type="number" min="1" max="5" value={editingVideo.priority || 3} onChange={(e) => setEditingVideo({ ...editingVideo, priority: parseInt(e.target.value) || 3 })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="watermark-edit" checked={editingVideo.requires_watermark || false} onChange={(e) => setEditingVideo({ ...editingVideo, requires_watermark: e.target.checked })} />
                <label htmlFor="watermark-edit" className="text-sm" style={{ color: COLORS.navy }}>Requires Watermark</label>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Topic</label>
                <textarea spellCheck="true" rows={2} value={editingVideo.topic || ''} onChange={(e) => setEditingVideo({ ...editingVideo, topic: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Editing Notes</label>
                <textarea spellCheck="true" rows={2} value={editingVideo.editing_notes || ''} onChange={(e) => setEditingVideo({ ...editingVideo, editing_notes: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Raw Footage</label>
                <input spellCheck="true" type="text" value={editingVideo.raw_footage_location || ''} onChange={(e) => setEditingVideo({ ...editingVideo, raw_footage_location: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Script Link</label>
                <input spellCheck="false" type="text" value={editingVideo.script_link || ''} onChange={(e) => setEditingVideo({ ...editingVideo, script_link: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Upload Folder Link</label>
                <input spellCheck="false" type="text" value={editingVideo.upload_folder_link || ''} onChange={(e) => setEditingVideo({ ...editingVideo, upload_folder_link: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveVideoEdit} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>Save Changes</button>
              <button onClick={() => setEditingVideo(null)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Name</label>
                <input spellCheck="true" type="text" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Icon (emoji)</label>
                <input type="text" value={projectForm.icon} onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })} maxLength={2} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Color</label>
                <input type="color" value={projectForm.color} onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })} className="w-full h-10 rounded border" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Drive Folder Link</label>
                <input spellCheck="false" type="text" value={projectForm.drive_folder_link} onChange={(e) => setProjectForm({ ...projectForm, drive_folder_link: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSaveProject} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>Save</button>
              <button onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* LUT Upload Modal */}
      {showLutUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Add LUT</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>LUT Type</label>
                <select value={lutForm.lut_type} onChange={(e) => setLutForm({ ...lutForm, lut_type: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                  <option value="project">Project LUT (applies to all videos in project)</option>
                  <option value="video">Video LUT (specific video only)</option>
                </select>
              </div>
              {lutForm.lut_type === 'project' ? (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Project</label>
                  <select value={lutForm.project_id} onChange={(e) => setLutForm({ ...lutForm, project_id: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                    <option value="">Pick project...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.icon} {p.name}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Video</label>
                  <select value={lutForm.video_id} onChange={(e) => setLutForm({ ...lutForm, video_id: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                    <option value="">Pick video...</option>
                    {videos.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Name</label>
                <input spellCheck="true" type="text" value={lutForm.name} onChange={(e) => setLutForm({ ...lutForm, name: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Time Range (optional, e.g., "00:00–01:30")</label>
                <input spellCheck="false" type="text" value={lutForm.time_range} onChange={(e) => setLutForm({ ...lutForm, time_range: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Download URL</label>
                <input spellCheck="false" type="text" value={lutForm.download_url} onChange={(e) => setLutForm({ ...lutForm, download_url: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Notes</label>
                <textarea spellCheck="true" rows={2} value={lutForm.notes} onChange={(e) => setLutForm({ ...lutForm, notes: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddLut} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>Add LUT</button>
              <button onClick={() => setShowLutUpload(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Modal */}
      {showSalaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="mb-4" style={{ fontFamily: 'Fraunces', fontSize: '1.25rem', fontWeight: 500, color: COLORS.navy }}>Set / Update Salary</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Editor</label>
                <select value={salaryForm.editor_id} onChange={(e) => setSalaryForm({ ...salaryForm, editor_id: e.target.value })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }}>
                  <option value="">Pick editor...</option>
                  {editorUsers.map(e => <option key={e.user_id} value={e.user_id}>{e.full_name || e.user_id}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Current Month Salary (₹)</label>
                <input type="number" value={salaryForm.base_salary} onChange={(e) => setSalaryForm({ ...salaryForm, base_salary: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Next Month Salary (₹) — projected</label>
                <input type="number" value={salaryForm.next_month_salary} onChange={(e) => setSalaryForm({ ...salaryForm, next_month_salary: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: COLORS.navy }}>Why text (shown to editor)</label>
                <textarea spellCheck="true" rows={3} value={salaryForm.why_text} onChange={(e) => setSalaryForm({ ...salaryForm, why_text: e.target.value })} placeholder="e.g., On-time delivery 90%. Quality consistent. Increment ₹1000 next month." className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: COLORS.border }} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleSetSalary} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: COLORS.navy, color: 'white' }}>Save Salary</button>
              <button onClick={() => setShowSalaryModal(false)} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: COLORS.border, color: COLORS.navy }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}