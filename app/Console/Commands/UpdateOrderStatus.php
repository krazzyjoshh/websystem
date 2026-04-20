<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateOrderStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:update-status';

    protected $description = 'Automatically update pending and confirmed orders after 5 minutes';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $fiveMinsAgo = \Carbon\Carbon::now()->subMinutes(5);

        // Pending -> Confirmed
        $pendingCount = \App\Models\Order::where('status', 'pending')
            ->where('created_at', '<=', $fiveMinsAgo)
            ->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
            ]);

        // Confirmed -> Processing
        $confirmedCount = \App\Models\Order::where('status', 'confirmed')
            ->where('confirmed_at', '<=', $fiveMinsAgo)
            ->update([
                'status' => 'processing',
            ]);

        $this->info("Updated {$pendingCount} to Confirmed and {$confirmedCount} to Processing.");
        return 0;
    }
}
