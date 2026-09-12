import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TeamMember, TeamRole } from '../../types';
import { 
  Users, UserPlus, Shield, Check, X, Mail, AlertCircle, 
  Trash2, RefreshCw
} from 'lucide-react';

const SAMPLE_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm_1',
    team_id: 'team_1',
    user_id: 'usr_demo_1',
    name: 'Alex Morgan (You)',
    email: 'alex@artisanbloom.com',
    role: 'owner',
    invited_at: '2026-01-01T00:00:00Z',
    joined_at: '2026-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'tm_2',
    team_id: 'team_1',
    user_id: 'usr_2',
    name: 'Maria Manager',
    email: 'maria@artisanbloom.com',
    role: 'manager',
    invited_at: '2026-01-10T00:00:00Z',
    joined_at: '2026-01-11T00:00:00Z',
    status: 'active'
  },
  {
    id: 'tm_3',
    team_id: 'team_1',
    user_id: 'usr_3',
    name: 'David Designer',
    email: 'david@artisanbloom.com',
    role: 'editor',
    invited_at: '2026-01-14T00:00:00Z',
    status: 'pending'
  },
  {
    id: 'tm_4',
    team_id: 'team_1',
    user_id: 'usr_4',
    name: 'Sarah Strategy',
    email: 'sarah@artisanbloom.com',
    role: 'viewer',
    invited_at: '2026-01-12T00:00:00Z',
    joined_at: '2026-01-13T00:00:00Z',
    status: 'active'
  }
];

export const TeamView: React.FC = () => {
  const { addToast } = useApp();
  const [members, setMembers] = useState<TeamMember[]>(SAMPLE_TEAM_MEMBERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamRole>('editor');
  const [inviteMessage, setInviteMessage] = useState('You are invited to collaborate on Social AI');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `tm_${Date.now()}`,
      team_id: 'team_1',
      user_id: `usr_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      invited_at: new Date().toISOString(),
      status: 'pending'
    };

    setMembers(prev => [...prev, newMember]);
    addToast('success', `Invitation sent to ${inviteEmail} as ${inviteRole.toUpperCase()}`);
    setIsInviteOpen(false);
    setInviteEmail('');
  };

  const handleRemoveMember = (id: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast('info', `Removed ${name} from team.`);
  };

  const handleRoleChange = (id: string, newRole: TeamRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    addToast('success', `Updated member role to ${newRole.toUpperCase()}`);
  };

  const handleResendInvite = (email: string) => {
    addToast('info', `Resent invitation email to ${email}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Team Management & Roles</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Invite collaborators, manage role permissions, and streamline multi-step content approvals.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Invite Team Member
        </button>
      </div>

      {/* Team Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Total Members</p>
          <p className="text-2xl font-bold text-white mt-1">{members.length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Active Collaborators</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{members.filter(m => m.status === 'active').length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Pending Invites</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{members.filter(m => m.status === 'pending').length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Approval Required</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">Manager & Owner</p>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
          <span className="text-xs text-slate-400">4 total seats allocated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                      {member.name.charAt(0)}
                    </div>
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{member.email}</td>
                  <td className="px-6 py-4">
                    {member.role === 'owner' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Shield className="w-3.5 h-3.5" />
                        Owner
                      </span>
                    ) : (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as TeamRole)}
                        className="bg-slate-800 border border-slate-700 text-xs text-white rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {member.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <AlertCircle className="w-3 h-3" />
                        Pending Invite
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {member.status === 'pending' && (
                      <button
                        onClick={() => handleResendInvite(member.email)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend
                      </button>
                    )}
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer ml-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Role Permission Matrix</h3>
        <p className="text-sm text-slate-400">Detailed breakdown of operational rights across workspace modules.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="p-3 border border-slate-700">Permission</th>
                <th className="p-3 border border-slate-700 text-center text-purple-400">Owner</th>
                <th className="p-3 border border-slate-700 text-center text-indigo-400">Manager</th>
                <th className="p-3 border border-slate-700 text-center text-blue-400">Editor</th>
                <th className="p-3 border border-slate-700 text-center text-slate-400">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { name: 'View Calendar & Dashboard', owner: true, manager: true, editor: true, viewer: true },
                { name: 'Create & AI Generate Content', owner: true, manager: true, editor: true, viewer: false },
                { name: 'Edit Content Captions & Visuals', owner: true, manager: true, editor: true, viewer: false },
                { name: 'Approve & Schedule Content', owner: true, manager: true, editor: false, viewer: false },
                { name: 'Publish Content to Meta APIs', owner: true, manager: true, editor: false, viewer: false },
                { name: 'View Analytics & Performance Predictions', owner: true, manager: true, editor: true, viewer: true },
                { name: 'Manage Brand Profile & Preferences', owner: true, manager: true, editor: false, viewer: false },
                { name: 'Invite Team Members & Assign Roles', owner: true, manager: false, editor: false, viewer: false },
                { name: 'Manage Billing & AI Generation Limits', owner: true, manager: false, editor: false, viewer: false }
              ].map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 border border-slate-800 font-medium text-slate-200">{perm.name}</td>
                  <td className="p-3 border border-slate-800 text-center">{perm.owner ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="p-3 border border-slate-800 text-center">{perm.manager ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="p-3 border border-slate-800 text-center">{perm.editor ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="p-3 border border-slate-800 text-center">{perm.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Invite New Team Member
              </h3>
              <button onClick={() => setIsInviteOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="colleague@yourcompany.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="manager">Manager (Can approve & publish content)</option>
                  <option value="editor">Editor (Can create & edit content)</option>
                  <option value="viewer">Viewer (Read-only access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Message (Optional)</label>
                <textarea
                  rows={2}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
