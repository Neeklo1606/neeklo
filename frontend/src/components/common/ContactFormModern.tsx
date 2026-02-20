"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Paperclip, X, File as FileIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const TELEGRAM_BOT_URL = "https://t.me/neeklo_studio_bot";
const TELEGRAM_DIRECT_URL = "https://t.me/neeklo_studio";
const MAX_FILES = 5;

const inputBase =
  "w-full bg-white/5 border-2 border-white/25 rounded-xl text-white placeholder-white/40 " +
  "focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 " +
  "px-4 py-3 transition-colors duration-200";
const labelBase = "text-sm font-medium text-white/70 mb-2 block";

interface ContactFormModernProps {
  onSuccess?: () => void;
  title?: string;
}

export function ContactFormModern({ onSuccess, title }: ContactFormModernProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const [personalData, setPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    name.trim().length >= 2 &&
    contact.trim().length >= 5 &&
    privacy &&
    personalData;

  const buildTelegramMessage = () => {
    const parts = ["📋 Заявка с сайта\n", `Имя: ${name.trim()}`, `Контакт: ${contact.trim()}`];
    if (showEmail && email.trim()) parts.push(`Email: ${email.trim()}`);
    if (message.trim()) parts.push(`\nЧто нужно:\n${message.trim()}`);
    if (files.length > 0) {
      parts.push(`\nФайлов прикреплено: ${files.length}`);
      files.forEach((f) => parts.push(`• ${f.name}`));
    }
    return parts.join("\n");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const arr = Array.from(list);
    const rest = MAX_FILES - files.length;
    if (rest <= 0) return;
    setFiles((prev) => [...prev, ...arr.slice(0, rest)]);
    e.target.value = "";
  };

  const removeFile = (i: number) => setFiles((p) => p.filter((_, idx) => idx !== i));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={cn(
          "rounded-2xl border-2 border-white/25 overflow-hidden",
          "bg-black/60 backdrop-blur-xl",
          "shadow-2xl shadow-black/50",
          "p-4 sm:p-6 md:p-8"
        )}
      >
        <div className="space-y-5">
          {/* Заголовок */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              {title ?? "Давайте познакомимся"}
            </h2>
            <p className="text-sm text-white/70">
              Расскажите о задаче — мы подготовим предложение
            </p>
          </div>

          {/* Имя */}
          <div>
            <label htmlFor="cf-name" className={labelBase}>
              Имя
            </label>
            <input
              id="cf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
              required
              className={inputBase}
            />
          </div>

          {/* Telegram или Телефон */}
          <div>
            <label htmlFor="cf-contact" className={labelBase}>
              Telegram или телефон
            </label>
            <input
              id="cf-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="@username или +7 999..."
              required
              className={inputBase}
            />
          </div>

          {/* + Добавить email */}
          <div>
            {!showEmail ? (
              <button
                type="button"
                onClick={() => setShowEmail(true)}
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить email
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
              >
                <label htmlFor="cf-email" className={labelBase}>
                  Email
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    id="cf-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className={cn(inputBase, "w-full sm:flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmail(false);
                      setEmail("");
                    }}
                    className="p-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 shrink-0"
                    aria-label="Убрать email"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Что нужно сделать */}
          <div>
            <label htmlFor="cf-message" className={labelBase}>
              Что нужно сделать
            </label>
            <textarea
              id="cf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Например: сделать сайт, Telegram-бот для заявок..."
              rows={3}
              className={cn(inputBase, "resize-none")}
            />
          </div>

          {/* Файлы */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Прикрепить файлы"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= MAX_FILES}
              className={cn(
                "flex items-center gap-3 text-sm text-white/60",
                "hover:text-white/80 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg"
              )}
            >
              <Paperclip className="w-4 h-4 shrink-0" />
              <span>Прикрепить файлы (до 5 шт.)</span>
            </button>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {files.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-2 text-xs text-white/60"
                  >
                    <FileIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate flex-1">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                      aria-label={`Удалить ${f.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Чекбоксы — заметные, 44×44 зона нажатия на мобильных */}
          <div className="space-y-4 pt-1">
            <label
              htmlFor="cf-privacy"
              className="flex items-start gap-3 sm:gap-4 cursor-pointer"
            >
              <div className="flex shrink-0 items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0">
                <Checkbox
                  id="cf-privacy"
                  checked={privacy}
                  onCheckedChange={(v) => setPrivacy(!!v)}
                  className={cn(
                    "w-7 h-7 sm:w-6 sm:h-6 rounded-md border-2 shrink-0",
                    "border-white/30 hover:border-white/50",
                    "data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400",
                    "data-[state=checked]:[&_svg]:text-white",
                    "data-[state=checked]:shadow-[0_0_12px_rgba(34,211,238,0.4)]",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
                  )}
                />
              </div>
              <span className="text-sm leading-relaxed text-white/80 min-w-0 pt-2 sm:pt-0">
                Даю согласие на обработку данных согласно{" "}
                <a
                  href="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  className="text-cyan-400 hover:underline underline-offset-2"
                >
                  политике конфиденциальности
                </a>
              </span>
            </label>
            <label
              htmlFor="cf-personal"
              className="flex items-start gap-3 sm:gap-4 cursor-pointer"
            >
              <div className="flex shrink-0 items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0">
                <Checkbox
                  id="cf-personal"
                  checked={personalData}
                  onCheckedChange={(v) => setPersonalData(!!v)}
                  className={cn(
                    "w-7 h-7 sm:w-6 sm:h-6 rounded-md border-2 shrink-0",
                    "border-white/30 hover:border-white/50",
                    "data-[state=checked]:bg-cyan-400 data-[state=checked]:border-cyan-400",
                    "data-[state=checked]:[&_svg]:text-white",
                    "data-[state=checked]:shadow-[0_0_12px_rgba(34,211,238,0.4)]",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
                  )}
                />
              </div>
              <span className="text-sm leading-relaxed text-white/80 min-w-0 pt-2 sm:pt-0">
                Согласен с обработкой персональных данных
              </span>
            </label>
          </div>

          {/* Кнопки Telegram */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a
              href={canSubmit ? `${TELEGRAM_BOT_URL}?text=${encodeURIComponent(buildTelegramMessage())}` : TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => canSubmit && onSuccess?.()}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-base text-center",
                "bg-gradient-to-r from-cyan-400 to-violet-500 text-white",
                "hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black/60"
              )}
            >
              Оставить заявку через бота 🤖
            </a>

            <a
              href={TELEGRAM_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-semibold text-base text-center",
                "bg-white/12 border-2 border-white/40 text-white",
                "shadow-[0_2px_16px_rgba(0,0,0,0.4)]",
                "hover:bg-white/20 hover:border-cyan-400/80 hover:shadow-lg",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black/60"
              )}
            >
              Написать напрямую 💬
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
