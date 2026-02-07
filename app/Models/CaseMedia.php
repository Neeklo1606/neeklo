<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use App\Models\CaseModel;

class CaseMedia extends Model
{
    protected $table = 'case_media';

    protected $fillable = ['case_id', 'type', 'file_path', 'order'];

    protected $casts = ['order' => 'integer'];

    public function case(): BelongsTo
    {
        return $this->belongsTo(CaseModel::class, 'case_id');
    }

    /** URL для доступа к файлу (storage/app/public) */
    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->file_path);
    }

    public function getAltAttribute(): string
    {
        return pathinfo($this->file_path, PATHINFO_FILENAME);
    }
}
