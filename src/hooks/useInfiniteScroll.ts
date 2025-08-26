"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type useInfinitePostsProps<T> = {
  initialData: T[];
  fetcher: (page: number, pageSize: number) => Promise<T[]>;
  pageSize: number;
};

export function useInfiniteScroll<T>({ initialData, fetcher, pageSize }: useInfinitePostsProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [hasMore, setHasMore] = useState(initialData.length > 0);
  const [isLoading, setIsLoading] = useState(false);
  const pageRef = useRef(2);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px",
  });

  const loadMoreData = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newData = await fetcher(pageRef.current, pageSize);

      if (newData.length > 0) {
        pageRef.current += 1;
        setData((prevData) => [...prevData, ...newData]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, pageSize, fetcher]);

  useEffect(() => {
    setData(initialData);
    pageRef.current = 2;
    setHasMore(initialData.length > 0);
  }, [initialData]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreData();
    }
  }, [inView, hasMore, loadMoreData]);

  return { data, isLoading, hasMore, ref };
}
