import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function useHandleResumeSubmit() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      if (!file) throw new Error('No file provided');
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/resume/parse`, formData, {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 400) {
          throw new Error('Document was not a valid resume or supported file type');
        }

        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'formatted-resume.docx';

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return url;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            throw new Error('Document was not a valid resume or supported file type');
          }
        }
        throw new Error('An unexpected error occurred');
      }
    },
  });

  return mutation;
}
