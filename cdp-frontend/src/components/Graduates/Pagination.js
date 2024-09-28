// src/components/Graduates/Pagination.js
import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <MuiPagination
      count={totalPages}
      page={currentPage}
      onChange={(event, value) => onPageChange(value)}
      color="primary"
      sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
    />
  );
};

export default Pagination;
