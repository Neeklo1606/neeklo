<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Импорт изображений из папки в кейс-стади (обложка + card_gallery + галерея).
 * Использование:
 *   php artisan cms:case-study-import-media 3 storage/app/batnorton-5
 *   php artisan cms:case-study-import-media batnorton /path/to/images
 * На сервере: после заливки 5 фото в storage/app/batnorton-5 выполнить команду с id кейса 3.
 */
class ImportCaseStudyMedia extends Command
{
    protected $signature = 'cms:case-study-import-media
                            {case_study : ID или slug кейс-стади}
                            {path : Путь к папке с изображениями (jpg, jpeg, png, webp, gif)}';

    protected $description = 'Импортировать изображения из папки в кейс-стади (обложка, карточка, галерея)';

    public function handle(): int
    {
        $caseStudyIdOrSlug = $this->argument('case_study');
        $path = $this->argument('path');

        $caseStudy = is_numeric($caseStudyIdOrSlug)
            ? CaseStudy::find($caseStudyIdOrSlug)
            : CaseStudy::where('slug', $caseStudyIdOrSlug)->first();

        if (! $caseStudy) {
            $this->error("Кейс-стади не найден: {$caseStudyIdOrSlug}");
            return self::FAILURE;
        }

        $dir = str_starts_with($path, '/') ? $path : base_path($path);
        if (! is_dir($dir)) {
            $this->error("Папка не найдена: {$dir}");
            return self::FAILURE;
        }

        $extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        $files = [];
        foreach (File::files($dir) as $file) {
            if (in_array(strtolower($file->getExtension()), $extensions)) {
                $files[] = $file;
            }
        }

        if (empty($files)) {
            $this->warn('В папке нет подходящих изображений.');
            return self::SUCCESS;
        }

        $uploadDir = 'upload/case-' . $caseStudy->id;
        $fullUploadDir = public_path($uploadDir);
        if (! File::isDirectory($fullUploadDir)) {
            File::makeDirectory($fullUploadDir, 0755, true);
        }

        $mediaIds = [];
        foreach ($files as $index => $file) {
            $name = uniqid('cs') . '_' . time() . '_' . ($index + 1) . '.' . $file->getExtension();
            $dest = $fullUploadDir . '/' . $name;
            File::copy($file->getPathname(), $dest);

            $relativePath = $uploadDir . '/' . $name;
            $size = filesize($dest);
            $imageInfo = @getimagesize($dest);
            $width = $imageInfo[0] ?? null;
            $height = $imageInfo[1] ?? null;

            $media = Media::create([
                'name' => $name,
                'original_name' => $file->getFilename(),
                'extension' => $file->getExtension(),
                'disk' => $uploadDir,
                'width' => $width,
                'height' => $height,
                'type' => 'photo',
                'size' => $size,
                'folder_id' => null,
                'user_id' => null,
                'temporary' => false,
                'metadata' => json_encode([
                    'path' => $relativePath,
                    'mime_type' => $file->getMimeType(),
                ]),
            ]);
            $mediaIds[] = $media->id;
        }

        $relation = $caseStudy->media();

        if (count($mediaIds) > 0) {
            $relation->attach($mediaIds[0], [
                'collection' => 'cover',
                'position' => 0,
                'meta' => null,
            ]);
        }
        foreach ($mediaIds as $pos => $id) {
            $relation->attach($id, [
                'collection' => 'card_gallery',
                'position' => $pos,
                'meta' => null,
            ]);
        }
        foreach ($mediaIds as $pos => $id) {
            $relation->attach($id, [
                'collection' => 'gallery',
                'position' => $pos,
                'meta' => null,
            ]);
        }

        $this->info("Добавлено изображений: " . count($mediaIds) . " в кейс «{$caseStudy->title}» (id: {$caseStudy->id}).");
        return self::SUCCESS;
    }
}
