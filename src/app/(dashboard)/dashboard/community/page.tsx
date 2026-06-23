"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame, MessageSquare, Heart, Share2, Award, Trophy, MoreHorizontal, Loader2, CornerDownRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";

export default function CommunityPage() {
  const coachId = useStore(state => state.coachId);
  const coachName = useStore(state => state.coachName);
  const coachAvatar = useStore(state => state.coachAvatar);
  const posts = useStore(state => state.posts);
  const addPost = useStore(state => state.addPost);
  const deletePost = useStore(state => state.deletePost);
  const likePost = useStore(state => state.likePost);
  const unlikePost = useStore(state => state.unlikePost);
  const comments = useStore(state => state.comments);
  const addComment = useStore(state => state.addComment);
  const mutedUsers = useStore(state => state.mutedUsers);
  const reportedPosts = useStore(state => state.reportedPosts);
  const muteUser = useStore(state => state.muteUser);
  const unmuteUser = useStore(state => state.unmuteUser);
  const reportPost = useStore(state => state.reportPost);
  
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isCommenting, setIsCommenting] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showMutedModal, setShowMutedModal] = useState(false);

  const visiblePosts = posts.filter(p => !mutedUsers.some(u => u.id === p.coach_id) && !reportedPosts.includes(p.id));

  useEffect(() => {
    const loadLikes = (id: string) => {
      const saved = localStorage.getItem(`fitforge_liked_posts_${id}`);
      if (saved) {
        try {
          setLikedPosts(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error("Failed to parse liked posts", e);
        }
      }
    };

    // Initial check
    const currentCoachId = useStore.getState().coachId;
    if (currentCoachId) loadLikes(currentCoachId);

    // Subscribe to coachId changes
    const unsub = useStore.subscribe((state, prevState) => {
      if (state.coachId && state.coachId !== prevState.coachId) {
        loadLikes(state.coachId);
      }
    });

    return unsub;
  }, []);

  const toggleComments = (postId: string) => {
    const newSet = new Set(expandedComments);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
    }
    setExpandedComments(newSet);
  };

  const handleComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    setIsCommenting(prev => ({ ...prev, [postId]: true }));
    await addComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    setIsCommenting(prev => ({ ...prev, [postId]: false }));
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setIsPosting(true);
    await addPost(content);
    setContent("");
    setIsPosting(false);
  };

  const handleLike = (id: string) => {
    if (!coachId) return;
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        unlikePost(id);
      } else {
        newSet.add(id);
        likePost(id);
      }
      localStorage.setItem(`fitforge_liked_posts_${coachId}`, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleShare = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Post content copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10 flex flex-col lg:flex-row gap-6">
      
      {/* Main Feed */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Community Feed</h2>
            <p className="text-muted-foreground mt-1">See what your roster is achieving.</p>
          </div>
          <button 
            onClick={() => setShowMutedModal(true)} 
            className="text-xs font-medium text-muted-foreground hover:text-white transition-colors bg-[#131B23] px-3 py-1.5 rounded-lg border border-white/5"
          >
            Manage Muted Users
          </button>
        </div>

        {/* Post Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#131B23] border border-white/5 rounded-2xl p-4 flex gap-4 shadow-xl">
          <Avatar className="h-10 w-10 border border-primary/20">
            {coachAvatar && <AvatarImage src={coachAvatar} />}
            <AvatarFallback>{coachName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Post an announcement or encourage your team..."
              className="w-full bg-[#1E293B] border-none rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none resize-none min-h-[80px]"
            />
            <div className="flex justify-end mt-3">
              <button 
                onClick={handlePost} 
                disabled={isPosting || !content.trim()} 
                className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform disabled:opacity-50 disabled:pointer-events-none"
              >
                {isPosting && <Loader2 className="h-4 w-4 animate-spin" />} Post Update
              </button>
            </div>
          </div>
        </motion.div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {visiblePosts.length === 0 ? (
            <div className="text-center py-12 bg-[#131B23] border border-white/5 rounded-2xl">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white">No Posts Yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Start the conversation by posting an update above.</p>
            </div>
          ) : (
            visiblePosts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 * (i % 5) }}
                className="bg-[#131B23] border border-white/5 rounded-2xl p-5 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.user_name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{post.user_name}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === post.id ? null : post.id); }} 
                      className="text-muted-foreground hover:text-white transition-colors p-1"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    
                    {openMenuId === post.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}></div>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-[#1A242F] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden py-1" onClick={(e) => e.stopPropagation()}>
                          {(post.coach_id === coachId || post.user_name === coachName) ? (
                            <>
                              <button onClick={() => { handleShare(post.content); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Copy Link</button>
                              <button onClick={() => { deletePost(post.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium">Delete Post</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { handleShare(post.content); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Copy Link</button>
                              <button onClick={() => { muteUser(post.coach_id, post.user_name); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">Mute User</button>
                              <button onClick={() => { reportPost(post.id); alert("Post sent to moderation."); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium">Report Post</button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{post.content}</p>

                {post.metric && post.metric_type && (
                  <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-4 mb-4 flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Flame className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary font-semibold uppercase tracking-wider">{post.metric_type}</p>
                      <p className="text-xl font-bold text-white">{post.metric}</p>
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${likedPosts.has(post.id) ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'}`}
                >
                  <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-secondary' : ''}`} /> {post.likes} Likes
                </button>
                <button 
                  onClick={() => toggleComments(post.id)} 
                  className={`flex items-center gap-2 text-xs font-medium transition-colors ${expandedComments.has(post.id) ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
                >
                  <MessageSquare className="h-4 w-4" /> {post.comments} Comments
                </button>
                <button onClick={() => handleShare(post.content)} className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-white transition-colors ml-auto">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>
              
              {expandedComments.has(post.id) && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                  {/* List of comments */}
                  <div className="space-y-3 pl-2 border-l-2 border-white/5">
                    {comments.filter(c => c.post_id === post.id).map(comment => (
                      <div key={comment.id} className="flex gap-3 items-start">
                        <Avatar className="h-6 w-6 border border-white/10 mt-1">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>{comment.user_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-[#1A242F] rounded-2xl rounded-tl-sm p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-white">{comment.user_name}</span>
                            <span className="text-[10px] text-muted-foreground">{new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-xs text-gray-300">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    {comments.filter(c => c.post_id === post.id).length === 0 && (
                      <p className="text-xs text-muted-foreground italic py-2">No comments yet. Be the first to reply!</p>
                    )}
                  </div>
                  
                  {/* Input area */}
                  <div className="flex gap-3 items-center">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      {coachAvatar && <AvatarImage src={coachAvatar} />}
                      <AvatarFallback>{coachName[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative">
                      <input 
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs(prev => ({...prev, [post.id]: e.target.value}))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post.id); }}
                        placeholder="Write a comment..."
                        className="w-full bg-[#1E293B] border border-white/5 rounded-full py-2 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-primary/30 transition-colors"
                      />
                      <button 
                        onClick={() => handleComment(post.id)}
                        disabled={isCommenting[post.id] || !commentInputs[post.id]?.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white disabled:opacity-50 transition-colors p-1"
                      >
                        {isCommenting[post.id] ? <Loader2 className="h-3 w-3 animate-spin" /> : <CornerDownRight className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Leaderboards */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-80 space-y-6 pt-16 lg:pt-0">
        
        <div className="bg-[#131B23] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/5 bg-gradient-to-r from-secondary/10 to-transparent">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-secondary" /> Weekly Leaderboard
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Highest adherence & effort.</p>
          </div>
          <div className="p-5 space-y-5">
            {[
              { rank: 1, name: "Amos Burton", score: "99%", avatar: "https://i.pravatar.cc/150?u=5" },
              { rank: 2, name: "Sarah Connor", score: "96%", avatar: "https://i.pravatar.cc/150?u=2" },
              { rank: 3, name: "Alex Mercer", score: "90%", avatar: "https://i.pravatar.cc/150?u=1" },
            ].map((person) => (
              <div key={person.rank} className="flex items-center gap-4">
                <div className={`w-6 text-center font-bold ${person.rank === 1 ? 'text-secondary' : 'text-muted-foreground'}`}>
                  #{person.rank}
                </div>
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage src={person.avatar} />
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{person.name}</p>
                </div>
                <div className="text-sm font-bold text-primary">{person.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131B23] border border-white/5 rounded-2xl p-5 shadow-xl text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Roster Challenge</h3>
          <p className="text-xs text-muted-foreground mb-4">"10,000 Steps a Day" challenge ends in 3 days.</p>
          <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden mb-2">
             <div className="h-full bg-primary" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs font-semibold text-primary">75% Completion Rate</p>
        </div>
      </motion.div>

      <Dialog open={showMutedModal} onOpenChange={setShowMutedModal}>
        <DialogContent className="bg-[#131B23] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Muted Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {mutedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">You haven't muted anyone.</p>
            ) : (
              mutedUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-[#1A242F] rounded-xl border border-white/5 shadow-inner">
                  <span className="text-sm font-medium text-white">{u.name}</span>
                  <button onClick={() => unmuteUser(u.id)} className="text-xs text-primary hover:underline font-bold transition-all hover:scale-105">Unmute</button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
