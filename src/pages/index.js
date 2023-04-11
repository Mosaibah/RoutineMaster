import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
  <>
    <div className="flex flex-col min-h-screen">
    <Navbar/>
    <div className="flex-1">
      <div>
        RoutineMaster is here
      </div>
    </div>
    <Footer/>
    </div>
  </>
  )
}
