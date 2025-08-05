import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileAPI } from '../../services/apiService';

const Files: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fileAPI.list();
      return res.data;
    },
  });

  if (isLoading) return <div>Loading files...</div>;
  if (error) return <div>Error loading files</div>;

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {data?.map((file: any) => (
          <li key={file.id}>{file.filename}</li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
