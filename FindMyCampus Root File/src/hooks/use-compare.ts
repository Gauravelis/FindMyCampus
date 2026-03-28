'use client';

import { useState, useEffect, useCallback } from 'react';

const COMPARE_KEY = 'college_compare_list';
const MAX_COMPARE = 4;

export function useCompare() {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(COMPARE_KEY);
      if (item) {
        setCompareList(JSON.parse(item));
      }
    } catch (error) {
      console.warn('Error reading localStorage:', error);
    }
  }, []);

  const updateLocalStorage = useCallback((list: string[]) => {
    try {
      window.localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }, []);

  const addToCompare = useCallback((collegeId: string) => {
    setCompareList(prevList => {
      if (prevList.includes(collegeId) || prevList.length >= MAX_COMPARE) {
        return prevList;
      }
      const newList = [...prevList, collegeId];
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);

  const removeFromCompare = useCallback((collegeId: string) => {
    setCompareList(prevList => {
      const newList = prevList.filter(id => id !== collegeId);
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);
  
  const toggleCompare = useCallback((collegeId: string) => {
    setCompareList(prevList => {
      let newList;
      if (prevList.includes(collegeId)) {
        newList = prevList.filter(id => id !== collegeId);
      } else {
         if (prevList.length >= MAX_COMPARE) {
            // Optionally, provide feedback that the limit is reached
            alert(`You can only compare up to ${MAX_COMPARE} colleges.`);
            return prevList;
         }
        newList = [...prevList, collegeId];
      }
      updateLocalStorage(newList);
      return newList;
    });
  }, [updateLocalStorage]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    updateLocalStorage([]);
  }, [updateLocalStorage]);

  return { 
    compareList: isClient ? compareList : [],
    addToCompare, 
    removeFromCompare,
    toggleCompare,
    clearCompare,
    compareCount: isClient ? compareList.length : 0,
  };
}
