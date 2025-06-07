<?php

namespace App\Http\Controllers;

use App\Models\SubMateri;
use App\Models\SubMateriUserStatus;
use App\Models\MateriProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SubMateriStatusController extends Controller
{
    public function lihat($id)
    {
        $user = Auth::user();
        $subMateri = SubMateri::findOrFail($id);
        $materiId = $subMateri->materi_id;

        // Update status sub materi ke "lihat"
        SubMateriUserStatus::updateOrCreate(
            ['user_id' => $user->user_id, 'sub_materi_id' => $id],
            ['status' => 'lihat']
        );

        // Hitung progress
        $total = SubMateri::where('materi_id', $materiId)->count();
        $lihat = SubMateriUserStatus::whereHas('subMateri', function ($q) use ($materiId) {
            $q->where('materi_id', $materiId);
        })->where('user_id', $user->user_id)
          ->where('status', 'lihat')->count();

        $progress = $total > 0 ? round(($lihat / $total) * 100, 2) : 0;

        // Simpan progress
        MateriProgress::updateOrCreate(
            ['user_id' => $user->user_id, 'materi_id' => $materiId],
            ['progress' => $progress]
        );

        return response()->json(['message' => 'Status diperbarui', 'progress' => $progress]);
    }

    public function list($materiId)
    {
        $userId = Auth::id();

        $subMateris = SubMateri::where('materi_id', $materiId)
            ->with(['userStatus' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }])->get()
            ->map(function ($item) {
                $item->status = $item->userStatus->first()->status ?? 'buka';
                unset($item->userStatus);
                return $item;
            });

        return response()->json($subMateris);
    }
}
