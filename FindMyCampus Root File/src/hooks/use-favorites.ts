'use client';

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'college_favorites_list';

export function useFavorites() {
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(FAVORITES_KEY);
      if (item) {
        setFavoritesList(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error reading localStorage:', error);
    }
  }, []);

  const updateLocalStorage = useCallback((list: string[]) => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }, []);

  const addToFavorites = useCallback((collegeId: string) => {
    setFavoritesList(prevList => {
      if (prevList.includes(collegeId)) {
        return prevList;
      }
      const newList = [...prevList, collegeId];
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);

  const removeFromFavorites = useCallback((collegeId: string) => {
    setFavoritesList(prevList => {
      const newList = prevList.filter(id => id !== collegeId);
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);
  
  const toggleFavorite = useCallback((collegeId: string) => {
    setFavoritesList(prevList => {
      let newList;
      if (prevList.includes(collegeId)) {
        newList = prevList.filter(id => id !== collegeId);
      } else {
        newList = [...prevList, collegeId];
      }
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);

  const clearFavorites = useCallback(() => {
    setFavoritesList([]);
    updateLocalStorage([]);
  }, [updateLocalStorage]);

  return { 
    favoritesList: isClient ? favoritesList : [],
    addToFavorites, 
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    favoritesCount: isClient ? favoritesList.length : 0,
  };
}
