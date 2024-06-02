import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className='grid grid-cols-3 items-center justify-center h-screen'>
      <div className='col-start-2'>
        <div className='text-center'>
          <label className='font-bold text-2xl'>Please Login to Demo</label>
        </div>
        <div className='flex flex-col items-center my-3'>
          <div className='w-10/12'>
            <input type="text" className='rounded-md border bg-transparent py-2 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full' placeholder='Enter you name here' />
          </div>
          <div className='w-10/12 my-2'>
            <button className="btn rounded-md border w-full py-2.5 bg-violet-600 text-white font-bold">
              <Link href="/messenger">
                Login
              </Link>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
