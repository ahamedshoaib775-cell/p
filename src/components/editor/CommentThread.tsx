import React, { useState } from 'react';
import type { ContentComment } from '../../types';
import { MessageSquare, Send, CheckCircle2, CornerDownRight } from 'lucide-react';

interface CommentThreadProps {
  contentItemId?: string;
  comments: ContentComment[];
  onAddComment: (text: string, fieldLink?: string, parentId?: string) => void;
  onResolveComment: (commentId: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments = [],
  onAddComment,
  onResolveComment
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedFieldLink, setSelectedFieldLink] = useState<string>('caption');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    onAddComment(newCommentText, selectedFieldLink, replyingToId || undefined);
    setNewCommentText('');
    setReplyingToId(null);
  };

  // Group top-level vs child comments
  const parentComments = comments.filter(c => !c.parent_comment_id);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          Team Feedback & Comments
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {comments.filter(c => !c.resolved_at).length} unresolved
        </span>
      </div>

      {/* Field Tag selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
        <span className="text-slate-400 font-medium mr-1">Context:</span>
        {['caption', 'visualAsset', 'hashtags', 'cta'].map(field => (
          <button
            key={field}
            type="button"
            onClick={() => setSelectedFieldLink(field)}
            className={`px-2.5 py-1 rounded-md capitalize text-xs transition-colors cursor-pointer ${
              selectedFieldLink === field
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {field === 'visualAsset' ? 'Visual Asset' : field}
          </button>
        ))}
      </div>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-80 pr-1 text-xs">
        {parentComments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-1">
            <MessageSquare className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            <p className="font-medium">No comments yet</p>
            <p className="text-[11px]">Leave inline notes or @mention team members for review.</p>
          </div>
        ) : (
          parentComments.map((comment) => {
            const replies = comments.filter(c => c.parent_comment_id === comment.id);
            const isResolved = !!comment.resolved_at;

            return (
              <div
                key={comment.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isResolved
                    ? 'bg-slate-900/40 border-slate-800/50 opacity-60'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                {/* Author Info & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-[10px] border border-purple-500/30">
                      {comment.user_name.charAt(0)}
                    </div>
                    <span className="font-semibold text-white">{comment.user_name}</span>
                    {comment.field_link && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 capitalize">
                        #{comment.field_link}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onResolveComment(comment.id)}
                    className={`text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                      isResolved ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isResolved ? 'Resolved' : 'Resolve'}
                  </button>
                </div>

                {/* Comment Text with @mention highlighting */}
                <p className="mt-1.5 text-slate-300 leading-relaxed">
                  {comment.comment_text.split(/(@\w+)/g).map((part, i) =>
                    part.startsWith('@') ? (
                      <span key={i} className="text-indigo-400 font-semibold bg-indigo-500/10 px-1 py-0.5 rounded">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>

                {/* Reply Trigger */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                  <span>{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <button
                    onClick={() => setReplyingToId(comment.id)}
                    className="hover:text-indigo-400 font-medium cursor-pointer"
                  >
                    Reply
                  </button>
                </div>

                {/* Child Replies */}
                {replies.length > 0 && (
                  <div className="mt-2 pl-3 border-l-2 border-slate-700 space-y-2 pt-1">
                    {replies.map((reply) => (
                      <div key={reply.id} className="text-xs">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                          <CornerDownRight className="w-3 h-3 text-slate-500" />
                          <span>{reply.user_name}</span>
                        </div>
                        <p className="pl-4 text-slate-400 text-[11px] mt-0.5">{reply.comment_text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-800 space-y-2">
        {replyingToId && (
          <div className="flex items-center justify-between text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
            <span>Replying to thread...</span>
            <button onClick={() => setReplyingToId(null)} className="text-slate-400 hover:text-white">
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Leave feedback or @mention member..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
