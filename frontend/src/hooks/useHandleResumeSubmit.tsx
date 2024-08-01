import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function useHandleResumeSubmit() {
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        if (!file) throw new Error('No file provided');
        const formData = new FormData();
        formData.append('file', file);
        const resp = await fetch(`${API_URL}/resume/parse`, {
          method: 'POST',
          body: formData,
        });

        if (!resp.ok) {
          throw new Error('Something went wrong with your request. Please try again.');
        }

        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'parsed-resume.docx';

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return url;
      } catch (error) {
        console.error(error);
      }
    },
  });
  return mutation;
}

//   const handleSubmit = async () => {
//     setLoading(true);
//     if (!file) return;

//     console.log('file uploaded: ', file);
//     // try {
//     //   const formData = new FormData();
//     //   formData.append('file', file);
//     //   const resp = await fetch('http://localhost:3001/resume/parse', {
//     //     method: 'POST',
//     //     body: formData,
//     //   });

//     //   if (!resp.ok) {
//     //     console.log('Error');
//     //     return;
//     //   }

//     //   const blob = await resp.blob();
//     //   const url = URL.createObjectURL(blob);
//     //   const a = document.createElement('a');
//     //   a.style.display = 'none';
//     //   a.href = url;
//     //   a.download = 'parsed-resume.docx';

//     //   document.body.appendChild(a);
//     //   a.click();
//     //   window.URL.revokeObjectURL(url);
//     //   document.body.removeChild(a);

//     //   setDownloadUrl(url);
//     // } catch (error) {
//     //   console.error(error);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };
