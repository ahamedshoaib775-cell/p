import React, { useState } from 'react';
import type { PostItem, ApprovalStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { getImageGenerationProvider } from '../../services/ai/ImageGenerationProvider';
import { getVideoGenerationProvider } from '../../services/ai/VideoGenerationProvider';
import { CommentThread } from './CommentThread';
import { 
  X, Play, RefreshCw, Sparkles, 
  CheckCircle2, ThumbsUp, 
  ChevronLeft, ChevronRight
} from 'lucide-react';

interface ContentEditorModalProps {
  post: PostItem;
  onClose: () => void;
  onSave: (updated: PostItem) => void;
}

export const EnhancedContentEditorModal: React.FC<ContentEditorModalProps> = ({
  post,
  onClose,
  onSave
}) => {
  const { addToast } = useApp();
  const [editedPost, setEditedPost] = useState<PostItem>({ ...post });
  const [activeTab, setActiveTab] = useState<'content' | 'visual' | 'prediction' | 'team'>('content');

  // Video preview state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // AI Visual Asset state
  const [generationPrompt, setGenerationPrompt] = useState(
    editedPost.visualAsset?.generation_prompt || editedPost.concept || editedPost.title
  );
  const [selectedStyle, setSelectedStyle] = useState(editedPost.visualAsset?.style_direction || 'Modern, Minimalist');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:5'>(
    editedPost.visualAsset?.aspect_ratio || '1:1'
  );
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);

  // New Comment state
  const handleAddComment = (text: string, fieldLink?: string, parentId?: string) => {
    const newComment = {
      id: `cmt_${Date.now()}`,
      content_item_id: editedPost.id,
      user_id: 'usr_demo_1',
      user_name: 'Alex Morgan',
      comment_text: text,
      created_at: new Date().toISOString(),
      field_link: fieldLink,
      parent_comment_id: parentId
    };

    const updatedComments = [...(editedPost.comments || []), newComment];
    setEditedPost(prev => ({ ...prev, comments: updatedComments }));
    addToast('success', 'Comment added to thread');
  };

  const handleResolveComment = (commentId: string) => {
    const updated = (editedPost.comments || []).map(c =>
      c.id === commentId ? { ...c, resolved_at: new Date().toISOString() } : c
    );
    setEditedPost(prev => ({ ...prev, comments: updated }));
    addToast('info', 'Comment marked as resolved');
  };

  // AI Regenerate Visual Asset
  const handleRegenerateAsset = async () => {
    setIsGeneratingAsset(true);
    addToast('info', `AI generating visual asset using ${editedPost.type === 'REEL' ? 'Runway ML' : 'DALL-E 3'}...`);

    try {
      if (editedPost.type === 'REEL') {
        const videoProvider = getVideoGenerationProvider('runway');
        const asset = await videoProvider.generateVideo(generationPrompt, selectedStyle, 30);
        setEditedPost(prev => ({ ...prev, visualAsset: asset, media_url: asset.storage_url }));
      } else if (editedPost.type === 'CAROUSEL') {
        const imageProvider = getImageGenerationProvider('dalle3');
        const asset = await imageProvider.generateCarousel(generationPrompt, selectedStyle, 3);
        setEditedPost(prev => ({ ...prev, visualAsset: asset, media_url: asset.storage_url }));
      } else {
        const imageProvider = getImageGenerationProvider('dalle3');
        const asset = await imageProvider.generateImage(generationPrompt, selectedStyle, selectedAspectRatio);
        setEditedPost(prev => ({ ...prev, visualAsset: asset, media_url: asset.storage_url }));
      }
      addToast('success', 'New AI visual asset generated!');
    } catch (e) {
      addToast('error', 'Failed to generate visual asset.');
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  // Approval Workflow Handlers
  const handleStatusChange = (newApprovalStatus: ApprovalStatus) => {
    let postStatus = editedPost.status;
    if (newApprovalStatus === 'approved') postStatus = 'APPROVED';
    if (newApprovalStatus === 'rejected') postStatus = 'DRAFT';

    const updated = {
      ...editedPost,
      approval_status: newApprovalStatus,
      status: postStatus,
      approved_at: newApprovalStatus === 'approved' ? new Date().toISOString() : editedPost.approved_at,
      approved_by: newApprovalStatus === 'approved' ? 'Alex Morgan' : undefined
    };

    setEditedPost(updated);
    addToast('success', `Content status updated to ${newApprovalStatus.toUpperCase()}`);
  };

  const handleSaveAndClose = () => {
    onSave(editedPost);
    onClose();
  };

  const isReel = (editedPost.content_type || editedPost.type || '').toString().toUpperCase().includes('REEL');
  const isCarousel = (editedPost.content_type || editedPost.type || '').toString().toUpperCase().includes('CAROUSEL');
  const carouselUrls = editedPost.visualAsset?.carousel_urls || [editedPost.media_url || ''];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 font-bold text-xs border border-indigo-500/20">
              {editedPost.content_type || editedPost.type}
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight truncate max-w-md">
              {editedPost.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${
              editedPost.approval_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              editedPost.approval_status === 'submitted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              editedPost.approval_status === 'changes_requested' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              'bg-slate-800 text-slate-400'
            }`}>
              {editedPost.approval_status || 'Draft'}
            </span>

            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md cursor-pointer transition-colors"
            >
              Save & Apply
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Panel: Preview & Live Visual Renderer (5 Cols) */}
          <div className="md:col-span-5 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instagram Live Preview</span>
                <span className="text-[11px] text-slate-400 font-mono">9:16 / 1:1 Aspect Ratio</span>
              </div>

              {/* Visual Asset Screen Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
                {isReel ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={editedPost.visualAsset?.storage_url || 'https://assets.mixkit.co/videos/preview/mixkit-working-late-in-a-modern-office-4330-large.mp4'}
                      poster={editedPost.visualAsset?.thumbnail_url || editedPost.media_url}
                      className="w-full h-full object-cover"
                      controls={isPlayingVideo}
                    />
                    {!isPlayingVideo && (
                      <button
                        onClick={() => setIsPlayingVideo(true)}
                        className="absolute inset-0 m-auto w-14 h-14 bg-indigo-600/90 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Play className="w-6 h-6 ml-1" />
                      </button>
                    )}
                  </div>
                ) : isCarousel ? (
                  <div className="relative w-full h-full">
                    <img
                      src={carouselUrls[carouselIndex] || editedPost.media_url}
                      alt="Carousel slide"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                      Slide {carouselIndex + 1} / {carouselUrls.length}
                    </div>
                    {carouselUrls.length > 1 && (
                      <>
                        <button
                          onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/80"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCarouselIndex(prev => Math.min(carouselUrls.length - 1, prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/80"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <img
                    src={editedPost.visualAsset?.storage_url || editedPost.media_url}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Caption Overlay Preview */}
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
                <p className="font-semibold text-white truncate">{editedPost.title}</p>
                <p className="text-slate-300 whitespace-pre-line line-clamp-4 leading-relaxed">
                  {editedPost.caption}
                </p>
                <div className="flex flex-wrap gap-1 text-[11px] text-indigo-400">
                  {editedPost.hashtags?.map((h, i) => (
                    <span key={i}>{h}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Prediction Pill */}
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-indigo-400" />
                <span className="font-medium text-indigo-200">Predicted Likes:</span>
                <span className="font-bold text-white">{editedPost.performancePrediction?.predicted_likes || 185}</span>
              </div>
              <span className="text-emerald-400 font-bold">
                ⚡ {editedPost.performancePrediction?.predicted_engagement_rate || 3.7}% Rate
              </span>
            </div>
          </div>

          {/* Right Panel: Editable Sections (7 Cols) */}
          <div className="md:col-span-7 p-6 flex flex-col space-y-5 overflow-y-auto bg-slate-900/40">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'content', label: 'Caption & Copy' },
                { id: 'visual', label: 'AI Visual Generator' },
                { id: 'prediction', label: 'Predictions & Factors' },
                { id: 'team', label: 'Team Approval & Comments' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Content Copy & Caption */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Headline / Concept Title</label>
                  <input
                    type="text"
                    value={editedPost.title}
                    onChange={(e) => setEditedPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-300">Instagram Caption</label>
                    <span className="text-[11px] text-slate-400 font-mono">{editedPost.caption.length} chars</span>
                  </div>
                  <textarea
                    rows={6}
                    value={editedPost.caption}
                    onChange={(e) => setEditedPost(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Call-To-Action (CTA)</label>
                  <input
                    type="text"
                    value={editedPost.cta}
                    onChange={(e) => setEditedPost(prev => ({ ...prev, cta: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hashtags (Comma Separated)</label>
                  <input
                    type="text"
                    value={editedPost.hashtags?.join(', ')}
                    onChange={(e) => setEditedPost(prev => ({ ...prev, hashtags: e.target.value.split(',').map(s => s.trim()) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: AI Visual Asset Generation */}
            {activeTab === 'visual' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      AI Visual Asset Engine
                    </span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      Est. Cost: ${isReel ? '0.12' : (isCarousel ? '0.08' : '0.04')}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Generation Prompt</label>
                    <textarea
                      rows={3}
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Style Direction</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-2 text-xs"
                      >
                        <option value="Modern, Minimalist">Minimalist Modern</option>
                        <option value="Bold, Vibrant">Bold & Vibrant</option>
                        <option value="Luxury, Professional">Luxury Professional</option>
                        <option value="Playful, Energetic">Playful Energetic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Aspect Ratio</label>
                      <select
                        value={selectedAspectRatio}
                        onChange={(e) => setSelectedAspectRatio(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg p-2 text-xs"
                      >
                        <option value="1:1">1:1 Square (Feed)</option>
                        <option value="9:16">9:16 Vertical (Reels/Stories)</option>
                        <option value="16:9">16:9 Widescreen</option>
                        <option value="4:5">4:5 Portrait</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleRegenerateAsset}
                    disabled={isGeneratingAsset}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAsset ? 'animate-spin' : ''}`} />
                    {isGeneratingAsset ? 'Generating Asset via AI...' : 'Regenerate Visual Asset'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Performance Prediction & Factors */}
            {activeTab === 'prediction' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Forecasting Engagement Analysis</h3>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded">
                      Confidence 84%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-400">Likes</p>
                      <p className="text-base font-bold text-white">185 - 240</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-400">Comments</p>
                      <p className="text-base font-bold text-white">12 - 18</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-400">Saves</p>
                      <p className="text-base font-bold text-white">28 - 35</p>
                    </div>
                    <div className="p-2 bg-slate-900 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-400">Engagement</p>
                      <p className="text-base font-bold text-emerald-400">3.7%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-300">Factor Impact Breakdown</h4>
                  {editedPost.performancePrediction?.factors.map((f, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">{f.name}</p>
                        <p className="text-[11px] text-slate-400">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Team Approval & Comment Thread */}
            {activeTab === 'team' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Approval Workflow Controls</h3>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => handleStatusChange('submitted')}
                      className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-semibold cursor-pointer"
                    >
                      Submit for Review
                    </button>
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-semibold cursor-pointer"
                    >
                      Approve & Schedule
                    </button>
                    <button
                      onClick={() => handleStatusChange('changes_requested')}
                      className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg font-semibold cursor-pointer"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleStatusChange('rejected')}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Inline Comment Thread */}
                <CommentThread
                  contentItemId={editedPost.id}
                  comments={editedPost.comments || []}
                  onAddComment={handleAddComment}
                  onResolveComment={handleResolveComment}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
