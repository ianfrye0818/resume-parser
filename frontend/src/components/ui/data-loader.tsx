import { InfinitySpin } from 'react-loader-spinner';

export default function DataLoader() {
  return (
    <div className='w-full h-dvh flex justify-center items-center'>
      <InfinitySpin
        width='200'
        color='#4fa94d'
      />
    </div>
  );
}
