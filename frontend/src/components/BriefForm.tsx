import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputMask from "react-input-mask";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFiles, submitBriefSubmission } from "@/lib/api";
import { briefFormSchema, BriefFormData, FileMetadata } from "@/lib/validations/briefForm";
import { FileUpload } from "./FileUpload";
import { SuccessModal } from "./SuccessModal";
import { Button } from "./common/Button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export const BriefForm = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BriefFormData>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      privacyConsent: false,
    },
  });

  const privacyConsent = watch("privacyConsent");

  const handleFileUpload = async (submissionId: string): Promise<FileMetadata[]> => {
    if (files.length === 0) return [];
    
    const result = await uploadFiles(files, submissionId);
    
    if (!result.success) {
      throw new Error(result.message || 'Ошибка загрузки файлов');
    }
    
    return (result.files || []) as FileMetadata[];
  };

  const onSubmit = async (data: BriefFormData) => {
    try {
      setIsSubmitting(true);

      // Generate submission ID
      const submissionId = crypto.randomUUID();

      // Upload files if any
      let fileMetadata: FileMetadata[] = [];
      if (files.length > 0) {
        fileMetadata = await handleFileUpload(submissionId);
      }

      // Insert to database and send to Telegram (handled by backend)
      const result = await submitBriefSubmission({
        name: data.name,
        company: data.company,
        role: data.role,
        project_name: data.projectName,
        description: data.description,
        phone: data.phone,
        email: data.email,
        files: fileMetadata,
      });

      if (!result.success) {
        throw new Error(result.message || 'Ошибка отправки');
      }

      // Show success modal
      setShowSuccess(true);

      // Reset form
      reset();
      setFiles([]);

      toast.success("Заявка успешно отправлена!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name and Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Ваше имя <span className="text-primary">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Иван Иванов"
              className="bg-surface/80 border-white/10 focus:border-primary focus:ring-primary/30"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-error">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium text-foreground">
              Компания
            </Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="ООО «Компания»"
              className="bg-surface/80 border-white/10 focus:border-cyan focus:ring-cyan/30"
            />
          </div>
        </div>

        {/* Role and Project Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-foreground">
              Роль / Чем вы занимаетесь <span className="text-primary">*</span>
            </Label>
            <Input
              id="role"
              {...register("role")}
              placeholder="Директор по маркетингу"
              className="bg-surface/80 border-white/10 focus:border-cyan focus:ring-cyan/30"
              aria-invalid={errors.role ? "true" : "false"}
              aria-describedby={errors.role ? "role-error" : undefined}
            />
            {errors.role && (
              <p id="role-error" className="text-sm text-error">
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
              Название проекта (если есть)
            </Label>
            <Input
              id="projectName"
              {...register("projectName")}
              placeholder="Название вашего проекта"
              className="bg-surface/80 border-white/10 focus:border-cyan focus:ring-cyan/30"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-foreground">
              Опишите задачу <span className="text-primary">*</span>
            </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Расскажите подробнее о том, что вам нужно..."
            rows={6}
            className="bg-surface/80 border-white/10 focus:border-cyan focus:ring-cyan/30 resize-none"
            aria-invalid={errors.description ? "true" : "false"}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-error">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Phone and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-foreground">
              Телефон <span className="text-primary">*</span>
            </Label>
            <InputMask
              mask="+7 (999) 999-99-99"
              {...register("phone")}
            >
              {/* @ts-ignore - InputMask types issue */}
              {(inputProps: any) => (
                <Input
                  {...inputProps}
                  id="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="bg-surface/80 border-white/10 focus:border-primary focus:ring-primary/30"
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              )}
            </InputMask>
            {errors.phone && (
              <p id="phone-error" className="text-sm text-error">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-primary">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="your@email.com"
              className="bg-surface/80 border-white/10 focus:border-primary focus:ring-primary/30"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-error">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Приложить файлы (опционально)
          </Label>
          <FileUpload files={files} onFilesChange={setFiles} />
        </div>

        {/* Privacy Consent */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="privacy"
            checked={privacyConsent}
            onCheckedChange={(checked) => setValue("privacyConsent", checked as boolean)}
            className="mt-1"
            aria-invalid={errors.privacyConsent ? "true" : "false"}
            aria-describedby={errors.privacyConsent ? "privacy-error" : undefined}
          />
          <Label
            htmlFor="privacy"
            className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            Я даю согласие на обработку персональных данных в соответствии с{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              политикой обработки персональных данных
            </a>
          </Label>
        </div>
        {errors.privacyConsent && (
          <p id="privacy-error" className="text-sm text-error -mt-2">
            {errors.privacyConsent.message}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto md:min-w-[240px] h-14 text-base font-semibold
            bg-gradient-to-r from-primary to-secondary md:hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 shadow-glow-primary
            hover:shadow-[0_0_32px_hsl(var(--primary)/0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            "Отправить заявку"
          )}
        </Button>
      </form>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
};
