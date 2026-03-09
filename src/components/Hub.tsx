
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Plus, Send, AlertCircle, CheckCircle2, Languages, Loader2, RefreshCw } from 'lucide-react';
import { Language, getTranslation } from '../lib/i18n';
import { validateAmmarInput, ValidationError } from '../services/validator';
import { cn } from '../lib/utils';

interface HubPost {
  id: string;
  text_ar: string;
  text_am: string;
  created_at: string;
}

interface HubProps {
  uiLang: Language;
  onTranslate?: (text: string) => void;
}

export default function Hub({ uiLang, onTranslate }: HubProps) {
  const t = (key: string) => getTranslation(key, uiLang);
  const [posts, setPosts] = useState<HubPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const decodeUnicode = (str: string) => {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    });
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/hub-get', { cache: 'no-store' });
      const data = await response.json();

      if (data.error === 'TABLE_NOT_FOUND') {
        setStatus({ type: 'error', message: data.message });
        setIsLoading(false);
        return;
      }

      if (!Array.isArray(data)) {
        throw new Error(data.details || 'Unexpected API response format');
      }

      // Decode and Deduplicate
      const seen = new Set();
      const decodedData = data.map((post: any) => ({
        ...post,
        text_ar: decodeUnicode(post.text_ar || ''),
        text_am: decodeUnicode(post.text_am || '')
      })).filter(post => {
        const isDuplicate = seen.has(post.text_am);
        seen.add(post.text_am);
        return !isDuplicate;
      });

      // Caching logic
      const cachedPosts = JSON.parse(localStorage.getItem('ammar_hub_cache') || '[]');
      const combinedPosts = [...decodedData];

      // Merge with cache for posts not returned by the server this time
      cachedPosts.forEach((cp: any) => {
        if (!seen.has(cp.text_am)) {
           combinedPosts.push(cp);
        }
      });

      // Sort by date again just in case
      combinedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPosts(combinedPosts);
      localStorage.setItem('ammar_hub_cache', JSON.stringify(combinedPosts));
    } catch (error: any) {
      console.error('Failed to fetch posts:', error);
      setStatus({ type: 'error', message: 'Connection to Hub failed. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostSubmit = async (force = false) => {
    if (!newPostText.trim()) return;

    const errors = validateAmmarInput(newPostText);
    if (errors.length > 0 && !force) {
      setValidationErrors(errors);
      setShowConfirm(true);
      return;
    }

    setIsPosting(true);
    try {
      const response = await fetch(`/hub-add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_am: newPostText, text_ar: 'From User', force })
      });
      const data = await response.json();
      if (data.success || data.sucsess) {
        setStatus({ type: 'success', message: t('hub.post_success') });
        setNewPostText('');
        setShowAddForm(false);
        fetchPosts();
      } else {
        setStatus({ type: 'error', message: t('hub.post_error') });
      }
    } catch (error) {
      setStatus({ type: 'error', message: t('hub.post_error') });
    } finally {
      setIsPosting(false);
      setShowConfirm(false);
      setValidationErrors([]);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{t('hub.title')}</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">{t('hub.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchPosts}
            disabled={isLoading}
            className="p-3 rounded-2xl bg-app-bg border border-border text-text-muted hover:text-primary hover:border-primary/30 transition-all active:scale-95 disabled:opacity-50"
            title={t('hub.refresh')}
          >
            <RefreshCw className={cn(isLoading && "animate-spin")} size={20} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={cn(
              "p-3 rounded-2xl transition-all shadow-lg active:scale-95",
              showAddForm ? "bg-red-500 text-white shadow-red-500/20" : "bg-primary text-white shadow-primary/20"
            )}
          >
            <Plus className={cn("transition-transform duration-300", showAddForm && "rotate-45")} size={24} />
          </button>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl space-y-6 mb-8">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={t('hub.post_placeholder')}
                className="w-full h-40 p-6 bg-black/20 rounded-2xl border border-white/5 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all resize-none font-black text-white placeholder:text-white/10"
              />

              {showConfirm && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle size={16} />
                    <span>{t('hub.validation_title')}</span>
                  </div>
                  <div className="space-y-1">
                    {validationErrors.map((err, i) => (
                      <p key={i} className="text-[10px] text-amber-700 font-medium">• {err.message}</p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePostSubmit(true)}
                      className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
                    >
                      {t('hub.post_anyway')}
                    </button>
                    <button
                      onClick={() => { setShowConfirm(false); setValidationErrors([]); }}
                      className="flex-1 bg-white dark:bg-slate-800 text-slate-600 py-2 rounded-xl text-xs font-bold border border-border transition-colors"
                    >
                      {t('hub.fix_errors')}
                    </button>
                  </div>
                </div>
              )}

              <button
                disabled={isPosting || !newPostText.trim()}
                onClick={() => handlePostSubmit()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wide disabled:opacity-50 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                {isPosting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {t('hub.post_button')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-sm",
              status.type === 'success' ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
            )}
          >
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.message}</span>
            <button onClick={() => setStatus(null)} className="ml-auto opacity-50 hover:opacity-100">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <motion.div
        layout
        className="space-y-6"
      >
        {isLoading && posts.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center gap-6 text-text-muted">
            <div className="relative">
              <Loader2 className="animate-spin text-primary/40" size={60} />
              <Loader2 className="animate-spin text-primary absolute inset-0" size={60} style={{ animationDirection: 'reverse', opacity: 0.5 }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{t('common.processing')}</span>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/5 p-20 rounded-[3rem] border border-white/10 text-center backdrop-blur-xl"
          >
            <LayoutGrid size={80} className="mx-auto text-white/5 mb-6" />
            <p className="text-white/20 font-black uppercase tracking-widest">{t('hub.empty')}</p>
          </motion.div>
        ) : (
          <AnimatePresence mode='popLayout'>
            {posts.map((post, index) => (
              <motion.div
                layout
                key={post.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.01, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="bg-white/5 p-8 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl group transition-all backdrop-blur-3xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 group-hover:bg-primary/10 transition-colors" />
                <div className="space-y-8">
                  <p className="text-2xl sm:text-3xl font-black leading-relaxed text-white tracking-tighter" dir="auto">
                    {post.text_am}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-8 border-t border-white/5">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                      {t('hub.created_at')}: {new Date(post.created_at).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => onTranslate?.(post.text_am)}
                      className="flex items-center justify-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
                    >
                      <Languages size={16} />
                      {t('common.translate')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
