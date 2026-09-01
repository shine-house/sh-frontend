import { useEffect } from "react";

export const useAutoPageBack = (
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  itemsLength: number,
  isFetching: boolean,
  totalItems: number | undefined
) => {
  useEffect(() => {
    if (isFetching) return;
    if (page > 1 && itemsLength === 0 && (totalItems ?? 0) > 0) {
      setPage((p) => Math.max(1, p - 1));
    }
  }, [page, itemsLength, isFetching, totalItems, setPage]);
};