import { create } from "zustand";

interface AuthState {
	hasOnboarded: boolean;
	isReady: boolean;
	setHasOnboarded: (value: boolean) => void;
	setIsReady: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	hasOnboarded: false,
	isReady: false,
	setHasOnboarded: (value) => set({ hasOnboarded: value }),
	setIsReady: (value) => set({ isReady: value }),
}));
