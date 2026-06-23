import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Client {
  id: string;
  name: string;
  goal: string;
  lastSession: string;
  progress: number;
  avatar: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  user_name: string;
  avatar: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  coach_id: string;
  user_name: string;
  avatar: string;
  content: string;
  metric?: string;
  metric_type?: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MutedUser {
  id: string;
  name: string;
}

export interface WorkoutSection {
  name: string;
  exercises: { name: string; sets: number; reps: string; rest: string; completed?: boolean }[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  sections: WorkoutSection[];
  date: string;
}

interface AppState {
  coachId: string | null;
  coachName: string;
  coachAvatar: string | null;
  clients: Client[];
  workouts: WorkoutPlan[];
  posts: CommunityPost[];
  comments: CommunityComment[];
  notifications: AppNotification[];
  mutedUsers: MutedUser[];
  reportedPosts: string[];
  activeWorkout: WorkoutPlan | null;
  plan: 'free' | 'pro';
  loading: boolean;
  
  fetchDashboardData: () => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  saveWorkout: (workout: Omit<WorkoutPlan, 'id' | 'date'>) => Promise<void>;
  addPost: (content: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  toggleExerciseStatus: (workoutId: string, sectionIndex: number, exerciseIndex: number) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  updateAvatar: (url: string) => void;
  upgradeToPro: () => Promise<void>;
  cancelProPlan: () => Promise<void>;
  clearStore: () => void;
  muteUser: (id: string, name: string) => void;
  unmuteUser: (id: string) => void;
  reportPost: (postId: string) => Promise<void>;
  addNotification: (notif: AppNotification) => void;
  pollNotifications: () => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  coachId: null,
  coachName: "Coach",
  coachAvatar: null,
  clients: [],
  workouts: [],
  posts: [],
  comments: [],
  notifications: [],
  mutedUsers: [],
  reportedPosts: [],
  activeWorkout: null,
  plan: 'free',
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [clientsRes, workoutsRes, postsRes, commentsRes, profileRes, notifsRes] = await Promise.all([
        supabase.from('clients').select('*').eq('coach_id', user.id).order('created_at', { ascending: false }),
        supabase.from('workouts').select('*').eq('coach_id', user.id).order('date', { ascending: false }),
        supabase.from('community_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('community_comments').select('*').order('created_at', { ascending: true }),
        supabase.from('profiles').select('plan_tier').eq('id', user.id).maybeSingle(),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      let dismissedNotifs: string[] = [];
      let loadedMutedUsers: MutedUser[] = [];
      let loadedReportedPosts: string[] = [];
      try {
        const saved = localStorage.getItem('fitforge_dismissed_notifs');
        if (saved) dismissedNotifs = JSON.parse(saved);
        const savedMuted = localStorage.getItem('fitforge_muted_users');
        if (savedMuted) loadedMutedUsers = JSON.parse(savedMuted);
        const savedReported = localStorage.getItem('fitforge_reported_posts');
        if (savedReported) loadedReportedPosts = JSON.parse(savedReported);
      } catch (e) {}

      set({
        coachId: user.id,
        coachName: user.user_metadata?.display_name || user.email?.split('@')[0] || "Coach",
        coachAvatar: user.user_metadata?.avatar || null,
        plan: profileRes.data?.plan_tier === 'pro' ? 'pro' : 'free',
        mutedUsers: loadedMutedUsers,
        reportedPosts: loadedReportedPosts,
        clients: clientsRes.data?.map(c => ({
          id: c.id,
          name: c.name,
          goal: c.goal,
          lastSession: c.last_session,
          progress: c.progress,
          avatar: c.avatar
        })) || [],
        workouts: workoutsRes.data?.map(w => ({
          id: w.id,
          title: w.title,
          duration: w.duration,
          difficulty: w.difficulty,
          sections: w.sections,
          date: w.date
        })) || [],
        posts: postsRes.data?.map(p => ({
          id: p.id,
          coach_id: p.coach_id,
          user_name: p.user_name,
          avatar: p.avatar,
          content: p.content,
          metric: p.metric,
          metric_type: p.metric_type,
          likes: p.likes,
          comments: p.comments,
          created_at: p.created_at
        })) || [],
        comments: commentsRes.data?.map(c => ({
          id: c.id,
          post_id: c.post_id,
          user_name: c.user_name,
          avatar: c.avatar,
          content: c.content,
          created_at: c.created_at
        })) || [],
        notifications: notifsRes.data?.filter(n => !dismissedNotifs.includes(n.id)).map(n => ({
          id: n.id,
          user_id: n.user_id,
          type: n.type,
          message: n.message,
          is_read: n.is_read,
          created_at: n.created_at
        })) || [],
        activeWorkout: workoutsRes.data && workoutsRes.data.length > 0 ? {
          id: workoutsRes.data[0].id,
          title: workoutsRes.data[0].title,
          duration: workoutsRes.data[0].duration,
          difficulty: workoutsRes.data[0].difficulty,
          sections: workoutsRes.data[0].sections,
          date: workoutsRes.data[0].date
        } : null,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      set({ loading: false });
    }
  },

  clearStore: () => set({
    coachId: null,
    coachName: "Coach",
    coachAvatar: null,
    clients: [],
    workouts: [],
    posts: [],
    comments: [],
    notifications: [],
    mutedUsers: [],
    reportedPosts: [],
    activeWorkout: null,
    plan: 'free',
  }),

  addClient: async (client) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('clients').insert([{
      coach_id: user.id,
      name: client.name,
      goal: client.goal,
      last_session: client.lastSession,
      progress: client.progress,
      avatar: client.avatar
    }]).select().single();

    let newClient: Client;

    if (error || !data) {
      console.warn('Supabase save failed. Falling back to local state:', error);
      newClient = {
        id: "local-" + Date.now().toString(),
        name: client.name,
        goal: client.goal,
        lastSession: client.lastSession,
        progress: client.progress,
        avatar: client.avatar
      };
    } else {
      newClient = {
        id: data.id,
        name: data.name,
        goal: data.goal,
        lastSession: data.last_session,
        progress: data.progress,
        avatar: data.avatar
      };
    }

    set((state) => ({
      clients: [newClient, ...state.clients]
    }));
  },

  saveWorkout: async (workout) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.from('workouts').insert([{
      coach_id: user.id,
      title: workout.title,
      duration: workout.duration,
      difficulty: workout.difficulty,
      sections: workout.sections
    }]).select().single();

    let newWorkout: WorkoutPlan;

    if (error || !data) {
      console.warn('Supabase save failed. Falling back to local state:', error);
      newWorkout = {
        id: "local-" + Date.now().toString(),
        title: workout.title,
        duration: workout.duration,
        difficulty: workout.difficulty,
        sections: workout.sections,
        date: new Date().toISOString()
      };
    } else {
      newWorkout = {
        id: data.id,
        title: data.title,
        duration: data.duration,
        difficulty: data.difficulty,
        sections: data.sections,
        date: data.date
      };
    }

    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
      activeWorkout: newWorkout
    }));
  },

  toggleExerciseStatus: async (workoutId, sectionIndex, exerciseIndex) => {
    const state = get();
    const workoutToUpdate = state.workouts.find(w => w.id === workoutId) || (state.activeWorkout?.id === workoutId ? state.activeWorkout : null);
    
    if (!workoutToUpdate) return;

    // Deep clone to avoid mutating state directly
    const newSections = JSON.parse(JSON.stringify(workoutToUpdate.sections));
    newSections[sectionIndex].exercises[exerciseIndex].completed = !newSections[sectionIndex].exercises[exerciseIndex].completed;

    // Optimistic UI update
    const updatedWorkout = { ...workoutToUpdate, sections: newSections };
    set((state) => ({
      activeWorkout: state.activeWorkout?.id === workoutId ? updatedWorkout : state.activeWorkout,
      workouts: state.workouts.map(w => w.id === workoutId ? updatedWorkout : w)
    }));

    // Persist to Supabase
    const { error } = await supabase.from('workouts')
      .update({ sections: newSections })
      .eq('id', workoutId);

    if (error) {
      console.error('Error toggling exercise:', error);
    }
  },

  addPost: async (content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const state = get();
    
    const { data, error } = await supabase.from('community_posts').insert([{
      coach_id: user.id,
      user_name: state.coachName,
      avatar: state.coachAvatar || "",
      content: content,
      likes: 0,
      comments: 0
    }]).select().single();

    let newPost: CommunityPost;

    if (error || !data) {
      console.warn('Supabase post failed. Falling back to local state:', error);
      newPost = {
        id: "local-" + Date.now().toString(),
        coach_id: user.id,
        user_name: state.coachName,
        avatar: state.coachAvatar || "",
        content: content,
        likes: 0,
        comments: 0,
        created_at: new Date().toISOString()
      };
    } else {
      newPost = {
        id: data.id,
        coach_id: data.coach_id,
        user_name: data.user_name,
        avatar: data.avatar,
        content: data.content,
        metric: data.metric,
        metric_type: data.metric_type,
        likes: data.likes,
        comments: data.comments,
        created_at: data.created_at
      };
    }

    set((state) => ({
      posts: [newPost, ...state.posts]
    }));
  },

  deletePost: async (postId) => {
    // Optimistic UI update
    set((state) => ({
      posts: state.posts.filter(p => p.id !== postId)
    }));
    
    if (!postId.startsWith("local-")) {
      const { error } = await supabase.from('community_posts').delete().eq('id', postId);
      if (error) {
        console.error('Error deleting post:', error);
      }
    }
  },

  likePost: async (postId) => {
    // Optimistic UI Update
    set((state) => ({
      posts: state.posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    }));

    // If it's a real Supabase post (not a local mock), sync it
    if (!postId.startsWith("local-")) {
      const state = get();
      const updatedPost = state.posts.find(p => p.id === postId);
      if (updatedPost) {
        const { error } = await supabase.from('community_posts')
          .update({ likes: updatedPost.likes })
          .eq('id', postId);
        
        if (error) {
          console.error('Error syncing like to Supabase:', error);
        } else {
          // Fire Notification
          await supabase.from('notifications').insert([{
            user_id: updatedPost.coach_id,
            type: 'like',
            message: `${state.coachName} liked your post.`,
            is_read: false
          }]);
        }
      }
    } else {
      // Mock local notification
      const state = get();
      const updatedPost = state.posts.find(p => p.id === postId);
      if (updatedPost) {
        set({
          notifications: [{
            id: 'local-notif-' + Date.now().toString(),
            user_id: updatedPost.coach_id,
            type: 'like',
            message: `${state.coachName} liked your post.`,
            is_read: false,
            created_at: new Date().toISOString()
          }, ...state.notifications]
        });
      }
    }
  },

  unlikePost: async (postId) => {
    // Optimistic UI Update
    set((state) => ({
      posts: state.posts.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p)
    }));

    // If it's a real Supabase post (not a local mock), sync it
    if (!postId.startsWith("local-")) {
      const state = get();
      const updatedPost = state.posts.find(p => p.id === postId);
      if (updatedPost) {
        const { error } = await supabase.from('community_posts')
          .update({ likes: updatedPost.likes })
          .eq('id', postId);
        
        if (error) {
          console.error('Error syncing unlike to Supabase:', error);
        }
      }
    }
  },

  addComment: async (postId, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const state = get();
    
    const { data, error } = await supabase.from('community_comments').insert([{
      post_id: postId,
      coach_id: user.id,
      user_name: state.coachName,
      avatar: state.coachAvatar || "",
      content: content
    }]).select().single();

    let newComment: CommunityComment;

    if (error || !data) {
      console.warn('Supabase comment failed. Falling back to local state:', error);
      newComment = {
        id: "local-" + Date.now().toString(),
        post_id: postId,
        user_name: state.coachName,
        avatar: state.coachAvatar || "",
        content: content,
        created_at: new Date().toISOString()
      };
    } else {
      newComment = {
        id: data.id,
        post_id: data.post_id,
        user_name: data.user_name,
        avatar: data.avatar,
        content: data.content,
        created_at: data.created_at
      };
    }

    set((state) => ({
      comments: [...state.comments, newComment],
      posts: state.posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p)
    }));

    if (!postId.startsWith("local-") && !newComment.id.startsWith("local-")) {
      const updatedPost = get().posts.find(p => p.id === postId);
      if (updatedPost) {
        await supabase.from('community_posts').update({ comments: updatedPost.comments }).eq('id', postId);
        // Fire Notification
        await supabase.from('notifications').insert([{
          user_id: updatedPost.coach_id,
          type: 'comment',
          message: `${state.coachName} commented on your post.`,
          is_read: false
        }]);
      }
    } else {
      // Mock local notification
      const updatedPost = get().posts.find(p => p.id === postId);
      if (updatedPost) {
        set({
          notifications: [{
            id: 'local-notif-' + Date.now().toString(),
            user_id: updatedPost.coach_id,
            type: 'comment',
            message: `${state.coachName} commented on your post.`,
            is_read: false,
            created_at: new Date().toISOString()
          }, ...state.notifications]
        });
      }
    }
  },

  markNotificationsAsRead: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic UI Update
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, is_read: true }))
    }));

    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
  },

  deleteNotification: async (id: string) => {
    // Optimistic UI update
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
    
    // Persist to local storage to hide it on refresh instead of deleting from DB
    try {
      const saved = localStorage.getItem('fitforge_dismissed_notifs');
      const dismissed = saved ? JSON.parse(saved) : [];
      if (!dismissed.includes(id)) {
        dismissed.push(id);
        localStorage.setItem('fitforge_dismissed_notifs', JSON.stringify(dismissed));
      }
    } catch (e) {}
  },

  updateAvatar: (url: string) => set({ coachAvatar: url }),

  upgradeToPro: async () => {
    // Optimistically update UI
    set({ plan: 'pro' });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Persist to Supabase
    const { error } = await supabase.from('profiles')
      .update({ plan_tier: 'pro' })
      .eq('id', user.id);

    if (error) {
      console.warn('Supabase profile upgrade failed. Staying on local Pro plan state.', error);
    }
  },

  cancelProPlan: async () => {
    // Optimistically update UI
    set({ plan: 'free' });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Persist to Supabase
    const { error } = await supabase.from('profiles')
      .update({ plan_tier: 'free' })
      .eq('id', user.id);

    if (error) {
      console.warn('Supabase profile cancellation failed. Staying on local Free plan state.', error);
    }
  },

  muteUser: (id, name) => set((state) => {
    const newMuted = [...state.mutedUsers, { id, name }];
    try {
      localStorage.setItem('fitforge_muted_users', JSON.stringify(newMuted));
    } catch (e) {}
    return { mutedUsers: newMuted };
  }),

  unmuteUser: (id) => set((state) => {
    const newMuted = state.mutedUsers.filter(u => u.id !== id);
    try {
      localStorage.setItem('fitforge_muted_users', JSON.stringify(newMuted));
    } catch (e) {}
    return { mutedUsers: newMuted };
  }),

  reportPost: async (postId) => {
    const state = get();
    const newReported = [...state.reportedPosts, postId];
    try {
      localStorage.setItem('fitforge_reported_posts', JSON.stringify(newReported));
    } catch (e) {}

    const newNotif = {
      id: 'local-notif-' + Date.now().toString(),
      user_id: state.coachId || 'local-user',
      type: 'system',
      message: 'Your report for the post is currently under review by our moderation team.',
      is_read: false,
      created_at: new Date().toISOString()
    };

    set({ 
      reportedPosts: newReported,
      notifications: [newNotif, ...state.notifications]
    });

    // Notify the user who was reported
    const post = state.posts.find(p => p.id === postId);
    if (post && post.coach_id !== state.coachId && !postId.startsWith("local-")) {
      await supabase.from('notifications').insert([{
        user_id: post.coach_id,
        type: 'system',
        message: 'A post you created has been reported by a community member and is currently under review by our moderation team.',
        is_read: false
      }]);
    }
  },

  addNotification: (notif) => set((state) => {
    // Prevent duplicates
    if (state.notifications.some(n => n.id === notif.id)) return state;
    return { notifications: [notif, ...state.notifications] };
  }),

  pollNotifications: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase.from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) {
      let dismissedNotifs: string[] = [];
      try {
        const saved = localStorage.getItem('fitforge_dismissed_notifs');
        if (saved) dismissedNotifs = JSON.parse(saved);
      } catch (e) {}
      
      const serverNotifs = data.filter(n => !dismissedNotifs.includes(n.id)).map(n => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type,
        message: n.message,
        is_read: n.is_read,
        created_at: n.created_at
      }));

      // Merge server notifications with local mock notifications
      set((state) => {
        const localNotifs = state.notifications.filter(n => n.id.startsWith('local-'));
        // Keep unique server notifs
        const uniqueServerNotifs = serverNotifs.filter(sn => !localNotifs.some(ln => ln.id === sn.id));
        return { notifications: [...localNotifs, ...uniqueServerNotifs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) };
      });
    }
  }
}));
