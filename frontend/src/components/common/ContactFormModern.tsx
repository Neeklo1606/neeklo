"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, FileUp, X, File as FileIcon, ArrowUpRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const TELEGRAM_BOT_URL = "https://t.me/neeklo_studio_bot";
const TELEGRAM_DIRECT_URL = "https://t.me/neeklo_studio";
const MAX_FILES = 5;

const inputBase =
  "w-full bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 " +
  "focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 " +
  "px-4 py-3 transition-colors duration-200";
const labelBase = "text-sm font-medium text-white mb-2 block";

interface ContactFormModernProps {
  onSuccess?: () => void;
  title?: string;
}

export function ContactFormModern({ onSuccess, title }: ContactFormModernProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const [personalData, setPersonalData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contact = telegram.trim() || phone.trim();
  const canSubmit =
    name.trim().length >= 2 &&
    contact.length >= 5 &&
    privacy &&
    personalData;

  const buildTelegramMessage = () => {
    const parts = ["📋 Заявка с сайта\n", `Имя: ${name.trim()}`];
    if (phone.trim()) parts.push(`Телефон: ${phone.trim()}`);
    if (telegram.trim()) parts.push(`Telegram: ${telegram.trim()}`);
    if (email.trim()) parts.push(`Email: ${email.trim()}`);
    if (message.trim()) parts.push(`\nСообщение:\n${message.trim()}`);
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

  const handleSendRequest = () => {
    if (!canSubmit) return;
    const url = `${TELEGRAM_BOT_URL}?text=${encodeURIComponent(buildTelegramMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    onSuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={cn(
          "rounded-2xl overflow-hidden",
          "bg-[#0f2744] shadow-xl",
          "p-6 sm:p-8 md:p-10"
        )}
      >
        <div className="space-y-6">
          {/* Заголовок */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {title ?? "Свяжитесь с нами"}
            </h2>
            <p className="text-sm text-white/80">
              Расскажите о задаче — мы подготовим предложение
            </p>
          </div>

          {/* Сетка: Имя*, Телефон | Телеграм, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cf-name" className={labelBase}>
                Имя <span className="text-red-400">*</span>
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
            <div>
              <label htmlFor="cf-phone" className={labelBase}>
                Телефон
              </label>
              <input
                id="cf-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 999 000 00 00"
                className={inputBase}
              />
            </div>
            <div>
              <label htmlFor="cf-telegram" className={labelBase}>
                Телеграм
              </label>
              <input
                id="cf-telegram"
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className={inputBase}
              />
            </div>
            <div>
              <label htmlFor="cf-email" className={labelBase}>
                Электронная почта
              </label>
              <input
                id="cf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputBase}
              />
            </div>
          </div>

          {/* Сообщение */}
          <div>
            <label htmlFor="cf-message" className={labelBase}>
              Ваше сообщение
            </label>
            <textarea
              id="cf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Например: сделать сайт, Telegram-бот для заявок..."
              rows={4}
              className={cn(inputBase, "resize-none")}
            />
          </div>

          {/* Нижний ряд: Прикрепить файл | Отправить заявку | Чекбоксы */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-2">
            <div className="flex flex-wrap items-center gap-4">
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
                  "inline-flex items-center gap-2 px-4 py-3 rounded-lg",
                  "bg-white border border-gray-300 text-gray-800",
                  "hover:bg-gray-50 hover:border-gray-400",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <FileUp className="w-4 h-4 shrink-0" />
                <span>Прикрепить файл</span>
              </button>

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={!canSubmit}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold",
                  "bg-black text-white",
                  "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                )}
              >
                <span>Отправить заявку</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="flex flex-col gap-3 min-w-0 lg:max-w-xs">
              <label
                htmlFor="cf-privacy"
                className="flex items-start gap-3 cursor-pointer"
              >
                <Checkbox
                  id="cf-privacy"
                  checked={privacy}
                  onCheckedChange={(v) => setPrivacy(!!v)}
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded border-2 border-white/40 shrink-0",
                    "data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500",
                    "focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                />
                <span className="text-sm text-white/90 leading-snug">
                  Я даю согласие на обработку персональных данных в целях, указанных в{" "}
                  <a
                    href="/privacy"
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-300 hover:underline underline-offset-2"
                  >
                    Политике конфиденциальности
                  </a>
                  .
                </span>
              </label>
              <label
                htmlFor="cf-personal"
                className="flex items-start gap-3 cursor-pointer"
              >
                <Checkbox
                  id="cf-personal"
                  checked={personalData}
                  onCheckedChange={(v) => setPersonalData(!!v)}
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded border-2 border-white/40 shrink-0",
                    "data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500",
                    "focus-visible:ring-2 focus-visible:ring-white/50"
                  )}
                />
                <span className="text-sm text-white/90 leading-snug">
                  Согласен с обработкой персональных данных
                </span>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs"
                >
                  <FileIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[120px]">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 text-white/70 hover:text-white rounded p-0.5"
                    aria-label={`Удалить ${f.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-white/60">
            Или{" "}
            <a
              href={TELEGRAM_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline"
            >
              напишите нам напрямую в Telegram
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
