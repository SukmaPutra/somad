// features/posts/components/CreatePostForm.tsx
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import { Avatar, Button, Card, Toast } from '@/shared/components';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useCreatePost } from '../hooks/useCreatePost';
import { LIMITS } from '@/shared/constant/index';
import { useToast } from '@/shared/hooks/useToast';

export const CreatePostForm = () => {
  const { user } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast, hideToast } = useToast();

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const { form, submit, isSubmitting } = useCreatePost(() => setPreview(null));
  const { register, watch, setValue, formState: { errors } } = form;
  const content = watch('content') ?? '';

  const isOverLimit  = content.length > LIMITS.POST_MAX_CHARS;
  const isNearLimit  = content.length > LIMITS.POST_MAX_CHARS * 0.9;
  const isDisabled   = !content.trim() || isOverLimit;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setValue('image', file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setValue('image', null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  if (!user) return null;

  const { ref: registerRef, ...registerRest } = register('content');

  return (
    <>
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast key={toast.id} type={toast.type} message={toast.message} onClose={hideToast} />
        </div>
      )}

      <Card padding="md" className="flex gap-3">
        <Avatar src={user.photoURL} alt={user.displayName} size="md" />

        <form onSubmit={submit} className="flex-1 flex flex-col gap-3">
          {/* Textarea */}
          <textarea
            {...registerRest}
            ref={(el) => {
              registerRef(el);
              (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
            }}
            aria-label="Tulis postingan"
            placeholder="Ada apa hari ini?"
            rows={3}
            className="
              w-full bg-transparent resize-none overflow-hidden
              text-[var(--color-text-primary)] text-sm
              placeholder:text-[var(--color-text-subtle)]
              focus:outline-none
            "
          />

          {errors.content && (
            <span className="text-[var(--color-error)] text-xs">{errors.content.message}</span>
          )}

          {/* Preview gambar */}
          {preview && (
            <div className="relative w-fit max-w-full">
              <img
                src={preview}
                alt="preview"
                className="max-h-48 rounded-lg border border-[var(--color-border)] object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                aria-label="Hapus gambar"
                className="
                  absolute top-1.5 right-1.5
                  bg-black/70 hover:bg-black/90
                  text-white rounded-full w-6 h-6
                  flex items-center justify-center
                  transition-colors
                "
              >
                <X size={13} />
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload gambar"
                className="
                  text-[var(--color-text-muted)] hover:text-sky-400
                  p-1.5 rounded-full hover:bg-sky-400/10
                  transition-colors
                "
              >
                <ImagePlus size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className={`
                text-xs tabular-nums transition-colors
                ${isOverLimit
                  ? 'text-[var(--color-error)] font-medium'
                  : isNearLimit
                    ? 'text-[var(--color-warning)]'
                    : 'text-[var(--color-text-muted)]'
                }
              `}>
                {content.length}/{LIMITS.POST_MAX_CHARS}
              </span>

              <Button type="submit" size="sm" isLoading={isSubmitting} disabled={isDisabled}>
                <Send size={15} />
                Kirim
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};