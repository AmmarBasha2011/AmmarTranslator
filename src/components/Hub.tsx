
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Plus, Send, AlertCircle, CheckCircle2, Languages, Loader2 } from 'lucide-react';
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
      const response = await fetch('/hub-get');
      const data = await response.json();

      if (data.error === 'TABLE_NOT_FOUND') {
        setStatus({ type: 'error', message: data.message });
        setIsLoading(false);
        return;
      }

      if (!Array.isArray(data)) {
        throw new Error(data.details || 'Unexpected API response format');
      }

      // Decode Unicode in response
      const decodedData = data.map((post: any) => ({
        ...post,
        text_ar: decodeUnicode(post.text_ar || ''),
        text_am: decodeUnicode(post.text_am || '')
      }));

      setPosts(decodedData);
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
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between bg-card-bg p-4 rounded-3xl border border-border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-text-main">{t('hub.title')}</h2>
          <p className="text-xs text-text-muted">{t('hub.subtitle')}</p>
        </div>
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

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card-bg p-5 rounded-3xl border border-border shadow-sm space-y-4 mb-6">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={t('hub.post_placeholder')}
                className="w-full h-32 p-4 bg-app-bg rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
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
                      Post Anyway
                    </button>
                    <button
                      onClick={() => { setShowConfirm(false); setValidationErrors([]); }}
                      className="flex-1 bg-white dark:bg-slate-800 text-slate-600 py-2 rounded-xl text-xs font-bold border border-border transition-colors"
                    >
                      Fix Errors
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
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-text-muted">
            <Loader2 className="animate-spin text-primary" size={40} />
            <span className="text-xs font-bold uppercase tracking-widest">{t('common.processing')}</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-card-bg p-12 rounded-3xl border border-border text-center">
            <LayoutGrid size={48} className="mx-auto text-text-muted/20 mb-4" />
            <p className="text-text-muted font-bold">{t('hub.empty')}</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card-bg p-5 rounded-3xl border border-border shadow-sm group hover:border-primary/30 transition-all"
            >
              <div className="space-y-4">
                <p className="text-lg font-bold leading-relaxed text-text-main" dir="auto">
                  {post.text_am}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onTranslate?.(post.text_am)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary text-primary hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    <Languages size={14} />
                    {t('common.translate')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
