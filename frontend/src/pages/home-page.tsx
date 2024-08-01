import { Card } from '@/components/ui/card';
import { UploadIcon } from 'lucide-react';
import logo from '@/assets/resource.jpeg';
import Dropzone from 'react-dropzone';
import useHandleResumeSubmit from '@/hooks/useHandleResumeSubmit';
import DataLoader from '@/components/ui/data-loader';

const acceptedFileTypes = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/pdf': ['.pdf'],
};

export default function HomePage() {
  const { mutateAsync: uploadResume, isPending, isError, error } = useHandleResumeSubmit();

  const handleChange = async (acceptedFile: File) => {
    try {
      await uploadResume(acceptedFile);
    } catch (error) {
      console.error(error);
    }
  };

  if (isPending) {
    return <DataLoader />;
  }

  return (
    <div className='flex flex-col min-h-dvh container'>
      <header className=' px-4 lg:px-6 h-14 flex items-center'>
        <div className='flex items-center justify-center'>
          <img
            src={logo}
            alt='The Resource'
            className='h-8 w-auto'
          />
          <span className='sr-only'>The Resource</span>
        </div>
      </header>
      <main className='flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24'>
        <div className='w-full max-w-md space-y-6'>
          <div className='grid gap-2'>
            <h1 className='text-3xl font-bold tracking-tighter text-center'>
              Upload Your Document
            </h1>
            <p className='text-muted-foreground text-center'>
              Drag and drop your file or click to browse.
            </p>
          </div>
          <Dropzone
            disabled={isPending}
            accept={acceptedFileTypes}
            onDropRejected={() => alert('invalid file type')}
            onDrop={(accptedFiles) => handleChange(accptedFiles[0])}
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => {
              return (
                <Card
                  {...getRootProps()}
                  className='border-2 min-h-[300px] border-dashed border-black p-8 flex flex-col items-center justify-center space-y-4'
                >
                  <div>
                    <div className='flex flex-col items-center justify-center space-y-2'>
                      <UploadIcon className='size-8 text-primary-foreground' />
                      <input
                        {...getInputProps()}
                        disabled={isPending}
                      />
                      <p className='text-muted-foreground'>Drag &amp; drop your file here</p>
                      <p className='text-xs text-muted-foreground'>or click to browse</p>
                    </div>
                  </div>
                </Card>
              );
            }}
          </Dropzone>
          <div className='grid gap-2'>
            <p className='text-center text-muted-foreground'>
              Accepted file types: .docx, .doc, .pdf
            </p>
          </div>
          {isError && <p className='text-red-500 text-center'>{error.message}</p>}
        </div>
      </main>
    </div>
  );
}
