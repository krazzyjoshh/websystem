<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SellerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'shop_name', 'shop_description', 'shop_logo',
        'shop_banner', 'total_earnings', 'total_sales', 'rating', 'is_verified',
    ];

    protected $casts = [
        'total_earnings' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_verified' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
