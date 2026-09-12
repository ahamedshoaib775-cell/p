import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from '../common/ToastContainer';
import { EnhancedContentEditorModal } from '../editor/EnhancedContentEditorModal';
import { AuthModal } from '../auth/AuthModal';
import { useApp } from '../../context/AppContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { editingPost, setEditingPost, updatePost } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <ToastContainer />
      <AuthModal />
      {editingPost && (
        <EnhancedContentEditorModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(updated) => {
            updatePost(updated.id, updated);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
};
