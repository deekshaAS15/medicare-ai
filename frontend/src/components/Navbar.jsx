import { useState } from "react";
import { HeartPulse , Menu , X} from "lucide-react";

const Navbar = ({onLogout,onMyAppointments}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
       <nav className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-xl">
         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg
             shadow-blue-200">
              <HeartPulse size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                MediCare<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Smart Healthcare
              </p>
            </div>
          </a>

          {/* Desktop menu */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-semibold text-blue-600">
              Home
            </a>

            <a href="#services" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Services
            </a>

            <a href="#doctors" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Doctors
            </a>

            <a href="#departments" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Departments
            </a>

            <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              About
            </a>

            <a href="#contact" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Contact
            </a>
          </div>

          {/* Desktop button */}
          <button 
          type="button"
          onClick={onMyAppointments}
          className="hidden rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg
           shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 md:block">
            My Appointments
          </button>

           <button 
             onClick={onLogout} 
             className="px-5 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition">
                Logout
            </button>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)}
             className="rounded-xl p-2 text-slate-700 md:hidden">
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5">

              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-blue-600">
                Home
              </a>

              <a
                href="#services"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-slate-600">
                Services
              </a>

              <a
                href="#departments"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-slate-600">
                Departments
              </a>

              <a
                href="#doctors"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-slate-600">
                Doctors
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-slate-600">
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="font-medium text-slate-600">
                Contact
              </a>

              <button 
              type="button"
              onClick={onMyAppointments}
              className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">
                My Appointments 
              </button>
            </div>
          </div>
        )}
      </nav>
    )
  }
  
  export default Navbar



  
  
  
  