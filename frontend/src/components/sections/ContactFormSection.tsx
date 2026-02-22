import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Paperclip, X, Check, Plus, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { uploadFiles, submitBriefSubmission } from "@/lib/api";
import { Container } from "../common/Container";

// Simplified schema
const contactSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  contact: z.string().min(3, "Введите телефон или Telegram"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  description: z.string().min(10, "Опишите задачу подробнее"),
  privacyConsent: z.boolean().refine((val) => val === true, "Необходимо согласие"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactFormSection = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange", // Enable live validation
    defaultValues: {
      privacyConsent: false,
      email: "",
    },
  });

  const privacyConsent = watch("privacyConsent");
  const watchedFields = watch();

  // Helper to check if field is valid
  const isFieldValid = (fieldName: keyof ContactFormData) => {
    return dirtyFields[fieldName] && !errors[fieldName];
  };

  const isFieldError = (fieldName: keyof ContactFormData) => {
    return touchedFields[fieldName] && errors[fieldName];
  };
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - files.length);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (submissionId: string) => {
    if (files.length === 0) return [];
    
    const result = await uploadFiles(files, submissionId);
    
    if (!result.success) {
      throw new Error(result.message || 'Ошибка загрузки файлов');
    }
    
    return result.files || [];
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      const submissionId = crypto.randomUUID();

      let fileMetadata: any[] = [];
      if (files.length > 0) {
        fileMetadata = await handleFileUpload(submissionId);
      }

      // Send to database and Telegram (handled by backend)
      const result = await submitBriefSubmission({
        name: data.name,
        role: "Клиент",
        description: data.description,
        phone: data.contact,
        email: data.email || "",
        files: fileMetadata,
      });

      if (!result.success) {
        throw new Error(result.message || 'Ошибка отправки');
      }

      setShowSuccess(true);
      reset();
      setFiles([]);
      setShowEmailField(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <section id="brief-form" className="relative py-12 md:py-16 overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30">
              <Check className="w-10 h-10 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Заявка отправлена!
            </h2>
            <p className="text-muted-foreground mb-8">
              Мы ответим в ближайшее время
            </p>

            <a
              href="https://t.me/neeekn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-lg
                bg-gradient-to-r from-[#0088cc] to-[#00a8e8] text-white font-medium text-sm
                hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-[40px]"
            >
              <MessageCircle className="w-4 h-4" />
              Написать в Telegram
            </a>

            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Отправить ещё заявку
            </button>
          </motion.div>
        </Container>
      </section>
    );
  }

  return (
    <section id="brief-form" className="relative py-8 sm:py-12 md:py-24 overflow-hidden bg-muted/30 dark:bg-background">
      {/* Background Effects - Light themed */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 dark:bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/5 dark:bg-secondary/8 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Давайте познакомимся
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Расскажите о задаче — мы подготовим предложение
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative rounded-3xl p-6 md:p-10 backdrop-blur-xl border border-border/50 bg-card shadow-2xl shadow-foreground/5">
            {/* Subtle glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-primary/10 via-transparent to-secondary/10 opacity-60 pointer-events-none" />
            
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Имя <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("name")}
                    placeholder="Как к вам обращаться"
                    className={`w-full h-12 md:h-14 px-4 pr-12 rounded-xl bg-background/60 border-2
                      text-foreground placeholder:text-muted-foreground/60
                      focus:outline-none focus:ring-2 focus:ring-primary/30
                      transition-all duration-200
                      ${isFieldError("name") 
                        ? "border-destructive focus:border-destructive" 
                        : isFieldValid("name")
                          ? "border-green-500/50 focus:border-green-500"
                          : "border-border/60 focus:border-primary/50"
                      }`}
                  />
                  {/* Validation icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isFieldValid("name") && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {isFieldError("name") && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                {isFieldError("name") && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    {errors.name?.message}
                  </p>
                )}
              </div>

              {/* Contact (Phone or Telegram) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Телефон или Telegram <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("contact")}
                    placeholder="+7 999 123-45-67 или @username"
                    className={`w-full h-12 md:h-14 px-4 pr-12 rounded-xl bg-background/60 border-2
                      text-foreground placeholder:text-muted-foreground/60
                      focus:outline-none focus:ring-2 focus:ring-primary/30
                      transition-all duration-200
                      ${isFieldError("contact") 
                        ? "border-destructive focus:border-destructive" 
                        : isFieldValid("contact")
                          ? "border-green-500/50 focus:border-green-500"
                          : "border-border/60 focus:border-primary/50"
                      }`}
                  />
                  {/* Validation icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isFieldValid("contact") && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {isFieldError("contact") && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                {isFieldError("contact") && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    {errors.contact?.message}
                  </p>
                )}
              </div>

              {/* Optional Email */}
              <AnimatePresence>
                {showEmailField ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="email@example.com"
                      className="w-full h-12 md:h-14 px-4 rounded-xl bg-background/60 border border-border/60
                        text-foreground placeholder:text-muted-foreground/60
                        focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                        transition-all duration-200"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => setShowEmailField(true)}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Добавить email
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Что нужно сделать <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register("description")}
                    placeholder="Например: сделать сайт, автоматизировать заявки, Telegram-бот для продаж…"
                    rows={3}
                    onInput={handleTextareaInput}
                    className={`w-full min-h-[100px] px-4 py-3 pr-12 rounded-xl bg-background/60 border-2
                      text-foreground placeholder:text-muted-foreground/60 resize-none
                      focus:outline-none focus:ring-2 focus:ring-primary/30
                      transition-all duration-200
                      ${isFieldError("description") 
                        ? "border-destructive focus:border-destructive" 
                        : isFieldValid("description")
                          ? "border-green-500/50 focus:border-green-500"
                          : "border-border/60 focus:border-primary/50"
                      }`}
                  />
                  {/* Validation icon */}
                  <div className="absolute right-4 top-4">
                    {isFieldValid("description") && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {isFieldError("description") && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
                {isFieldError("description") && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    {errors.description?.message}
                  </p>
                )}
              </div>

              {/* Compact File Upload */}
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                
                {files.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                    Прикрепить файлы (до 5 шт.)
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/60 border border-border/40 text-sm"
                        >
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {files.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Добавить ещё
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Privacy Consent */}
              <div className="flex items-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setValue("privacyConsent", !privacyConsent)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200
                    ${privacyConsent 
                      ? "bg-primary border-primary" 
                      : "border-border hover:border-primary/50"
                    }`}
                >
                  {privacyConsent && <Check className="w-3 h-3 text-primary-foreground" />}
                </button>
                <label
                  onClick={() => setValue("privacyConsent", !privacyConsent)}
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer select-none"
                >
                  Даю согласие на обработку данных согласно{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-primary hover:underline"
                  >
                    политике конфиденциальности
                  </a>
                </label>
              </div>
              {errors.privacyConsent && (
                <p className="text-xs text-destructive -mt-2">{errors.privacyConsent.message}</p>
              )}

              {/* Submit Button - Enhanced */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 md:h-16 rounded-2xl font-bold text-base md:text-lg
                  bg-gradient-to-r from-cyan-500 via-primary to-violet-600 text-white
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30
                  active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none
                  transition-all duration-300 shadow-lg shadow-primary/25
                  flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Отправляем...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Отправить заявку</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Alternative Contact */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Или напишите нам в{" "}
            <a
              href="https://t.me/neeekn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Telegram
            </a>
          </p>
        </motion.div>
      </Container>
    </section>
  );
};
