import {create} from "zustand";

interface GameStats {
  score: number;
  time: number;
  hits: number;
  level: number;
  isGameOver: boolean;
  isGameOn: boolean;
  setGameOn:(state: boolean) => void;
  setGameOver:(state: boolean) => void;
}

export const useGameStore=create<GameStats>((set)=>({
  score:0,
  time:0,
  hits:0,
  level:0,
  isGameOver:false,
  isGameOn:true,
  setGameOn:(state: boolean) => set({isGameOn:state}),
  setGameOver:(state: boolean) => set({isGameOver:state}),
}))