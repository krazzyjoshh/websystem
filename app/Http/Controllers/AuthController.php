<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Models\SellerInviteCode;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();

            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            }
            if ($user->role === 'seller') {
                return redirect()->route('seller.dashboard');
            }
            return redirect()->route('home');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
        ]);

        Auth::login($user);

        return redirect()->route('home');
    }

    public function showSellerLogin()
    {
        return Inertia::render('Auth/SellerLogin');
    }

    public function sellerLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();
            if ($user->role !== 'seller') {
                Auth::logout();
                return back()->withErrors(['email' => 'This account is not a seller account.']);
            }
            $request->session()->regenerate();
            return redirect()->route('seller.dashboard');
        }

        return back()->withErrors(['email' => 'The provided credentials do not match our records.']);
    }

    public function showSellerRegister()
    {
        return Inertia::render('Auth/SellerRegister');
    }

    public function sellerRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'shop_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'invite_code' => 'required|string|exists:seller_invite_codes,code',
        ]);

        $invite = SellerInviteCode::where('code', $request->invite_code)->first();
        if ($invite->is_used) {
            return back()->withErrors(['invite_code' => 'This invite code has already been used.']);
        }

        // Create as inactive seller pending admin approval
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'seller',
        ]);

        // Store shop name in seller profile
        \App\Models\SellerProfile::create([
            'user_id' => $user->id,
            'shop_name' => $request->shop_name,
            'is_verified' => false,
        ]);

        $invite->update([
            'used_by' => $user->id,
            'is_used' => true,
            'used_at' => now(),
        ]);

        return redirect('/seller/login')->with('status', 'Application submitted! Please wait for admin approval, then login.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('home');
    }
}
