import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseTableURLStateOptions {
  defaultRowsPerPage?: number;
  searchDebounceMs?: number;
  enableSearch?: boolean;
  enablePagination?: boolean;
}

interface TableURLState {
  searchTerm: string;
  currentPage: number;
  rowsPerPage: string;
  debouncedSearchTerm: string;
}

interface TableURLActions {
  setSearchTerm: (search: string) => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: string) => void;
  resetToFirstPage: () => void;
}

export function useTableURLState(options: UseTableURLStateOptions = {}): [TableURLState, TableURLActions] {
  const {
    defaultRowsPerPage = 10,
    searchDebounceMs = 500,
    enableSearch = true,
    enablePagination = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Get initial values from URL or defaults
  const getInitialState = useCallback(() => ({
    searchTerm: enableSearch ? (searchParams.get('search') || '') : '',
    currentPage: enablePagination ? parseInt(searchParams.get('page') || '1') : 1,
    rowsPerPage: enablePagination ? (searchParams.get('limit') || defaultRowsPerPage.toString()) : defaultRowsPerPage.toString(),
  }), [searchParams, defaultRowsPerPage, enableSearch, enablePagination]);

  const [state, setState] = useState(getInitialState);

  // Debounce search term
  useEffect(() => {
    if (!enableSearch) return;

    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(state.searchTerm);
    }, searchDebounceMs);

    return () => clearTimeout(timeoutId);
  }, [state.searchTerm, searchDebounceMs, enableSearch]);

  // Update URL when state changes
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (enableSearch && state.searchTerm) {
      newParams.set('search', state.searchTerm);
    }

    if (enablePagination) {
      if (state.currentPage > 1) {
        newParams.set('page', state.currentPage.toString());
      }
      
      if (state.rowsPerPage !== defaultRowsPerPage.toString()) {
        newParams.set('limit', state.rowsPerPage);
      }
    }

    const newParamsString = newParams.toString();
    const currentParamsString = searchParams.toString();

    if (newParamsString !== currentParamsString) {
      setSearchParams(newParams, { replace: true });
    }
  }, [state, searchParams, setSearchParams, defaultRowsPerPage, enableSearch, enablePagination]);

  // Update state when URL changes (browser back/forward)
  useEffect(() => {
    const newState = getInitialState();
    setState(prevState => {
      const hasChanged = 
        prevState.searchTerm !== newState.searchTerm ||
        prevState.currentPage !== newState.currentPage ||
        prevState.rowsPerPage !== newState.rowsPerPage;

      return hasChanged ? newState : prevState;
    });
  }, [getInitialState]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== state.searchTerm && state.currentPage > 1) {
      setState(prev => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearchTerm, state.searchTerm, state.currentPage]);

  const actions: TableURLActions = {
    setSearchTerm: useCallback((search: string) => {
      setState(prev => ({ ...prev, searchTerm: search }));
    }, []),

    setCurrentPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, currentPage: Math.max(1, page) }));
    }, []),

    setRowsPerPage: useCallback((rows: string) => {
      setState(prev => ({ ...prev, rowsPerPage: rows, currentPage: 1 }));
    }, []),

    resetToFirstPage: useCallback(() => {
      setState(prev => ({ ...prev, currentPage: 1 }));
    }, []),
  };

  return [
    {
      ...state,
      debouncedSearchTerm,
    },
    actions,
  ];
}
