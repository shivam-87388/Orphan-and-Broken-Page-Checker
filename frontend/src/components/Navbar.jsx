'use client'
import { IconUserCircle, IconUsers, IconLogout, IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react' 
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link';

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) 
  const dropdownRef = useRef(null)

  // Fix: Dropdown ke bahar click karne par hi menu band hoga
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const [user, setUser] = useState(null); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Hydration error fix
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); 
    localStorage.removeItem("token");
    window.location.href = "/signin"; 
  };

  const getButtonName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.email) {
      const emailPart = user.email.split('@')[0];
      return emailPart.replace(/[0-9]/g, ''); 
    }
    return "User";
  };

  if (!mounted) return null;

  return (
    <header className="body-font mt-4 mx-4 md:mx-8 bg-[#ED6D07] rounded-md transition-all duration-300">
      {/* Container holding everything */}
      <div className="mx-auto flex items-center justify-between p-3 relative">
        
       
        <div className="flex-shrink-0">
          <img src="/logo/logo.png" alt="logo" className="h-16 w-auto max-w-[180px] object-contain" />
        </div>

        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-white focus:outline-none p-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          {mobileMenuOpen ? <IconX size={30} /> : <IconMenu2 size={30} />}
        </button>

        
        <div className="hidden lg:flex items-center justify-between w-full ml-6">
          
        
          <nav className="flex items-center justify-center gap-6 lg:gap-8 mx-auto">
            <a href='/' className="inline-flex justify-center text-center items-center cursor-pointer hover:bg-red-600 rounded-lg p-2 text-white text-xl font-bold font-['Nunito'] transition-all">Home</a>
            <a href='/about-us' className="inline-flex justify-center text-center items-center cursor-pointer hover:bg-red-600 rounded-lg p-2 text-white text-xl font-bold font-['Nunito'] transition-all">About Us</a>
            
           
            <div 
              className="relative"
              ref={dropdownRef}
            >
              <button 
                onClick={() => setOpen(!open)} // Click handle toggle logic
                className="inline-flex items-center justify-center text-center cursor-pointer hover:bg-red-600 rounded-lg p-2 text-white text-xl font-bold font-['Nunito'] transition-all focus:outline-none"
              >
                SEO Audit Tool
                <IconChevronDown size={20} className={`ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </button>

              {open && (
                <div className="absolute left-0 mt-2 w-52 bg-gray-100 rounded-xl shadow-xl z-50 border border-gray-200 animate-fadeIn">
                  <ul className="py-2 text-gray-700 flex flex-col">
                    <a 
                      href="/broken-link-checker" 
                      onClick={() => setOpen(false)} // Link click hone par menu close hoga
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-base font-bold transition-colors"
                    >
                      Broken Link Checker
                    </a>
                    <hr className="border-gray-300 mx-2 my-1" />
                    <a 
                      href="/orphan-page-checker" 
                      onClick={() => setOpen(false)} // Link click hone par menu close hoga
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-base font-bold transition-colors"
                    >
                      Orphan Page Checker
                    </a>
                  </ul>
                </div>
              )}
            </div>

            <a href='/blog' className="inline-flex items-center justify-center text-center cursor-pointer hover:bg-red-600 rounded-lg p-2 text-white text-xl font-bold font-['Nunito'] transition-all">Blog</a>
          </nav>

          
          <div className="flex gap-3.5 relative flex-shrink-0"> 
            {!user ? (
              <>
                <a href='/createaccount' className="inline-flex text-center items-center justify-center hover:bg-red-600 bg-white rounded-lg px-5 py-2 text-black hover:text-white text-xl font-bold font-['Nunito'] transition-all shadow-sm">
                  <IconUsers size={26} className="mr-1.5" />Signup
                </a>
                <a href='/signin' className="inline-flex text-center items-center justify-center hover:bg-red-600 rounded-lg bg-white hover:text-white px-5 py-2 gap-1 text-black text-xl font-bold font-['Nunito'] transition-all shadow-sm">
                  <IconUserCircle size={26} />Login
                </a>
              </>
            ) : (
              <div 
                className="relative" 
                onMouseEnter={() => setShowDropdown(true)} 
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="inline-flex items-center justify-center bg-white rounded-lg px-5 py-2 gap-2 text-black text-xl font-bold font-['Nunito'] cursor-pointer shadow-md min-w-[130px]">
                  <IconUserCircle size={30} className="text-[#ED6D07]" />
                  <span className="capitalize">{getButtonName()}</span> 
                  <IconChevronDown size={20} className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-0 w-64 pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 text-left">
                      <div className="border-b pb-3 mb-3">
                        <p className="text-md text-gray-500 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link href="/history" className="w-full flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg font-bold transition-all text-base cursor-pointer mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ED6D07]">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        Scan History
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg font-['Nunito'] font-bold transition-all text-base cursor-pointer">
                        <IconLogout size={20} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE ONLY MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full px-4 pb-4 border-t border-orange-400 dynamic-mobile-menu">
          <nav className="flex flex-col gap-2 mt-2">
            <a href='/' className="text-white text-xl font-bold font-['Nunito'] p-2 hover:bg-red-600 rounded-lg">Home</a>
            <a href='/about-us' className="text-white text-xl font-bold font-['Nunito'] p-2 hover:bg-red-600 rounded-lg">About Us</a>
            
            <div className="flex flex-col pl-3 border-l-2 border-orange-300 gap-1 my-1">
              <span className="text-orange-200 text-lg font-bold font-['Nunito'] px-2">SEO Audit Tools:</span>
              <a href="/broken-link-checker" className="text-white text-lg font-semibold font-['Nunito'] p-2 hover:bg-red-600 rounded-lg pl-4">Broken Link Checker</a>
              <a href="/orphan-page-checker" className="text-white text-lg font-semibold font-['Nunito'] p-2 hover:bg-red-600 rounded-lg pl-4">Orphan Page Checker</a>
            </div>

            <a href='/blog' className="text-white text-xl font-bold font-['Nunito'] p-2 hover:bg-red-600 rounded-lg">Blog</a>
            
            <hr className="border-orange-400 my-2" />

            <div className="flex flex-col gap-2 pt-1">
              {!user ? (
                <>
                  <a href='/createaccount' className="inline-flex items-center justify-center bg-white rounded-lg py-2.5 text-black text-xl font-bold font-['Nunito'] shadow-md hover:bg-gray-100">
                    <IconUsers size={24} className="mr-2" /> Signup
                  </a>
                  <a href='/signin' className="inline-flex items-center justify-center bg-white rounded-lg py-2.5 text-black text-xl font-bold font-['Nunito'] shadow-md hover:bg-gray-100">
                    <IconUserCircle size={24} className="mr-2" /> Login
                  </a>
                </>
              ) : (
                <div className="bg-orange-600 rounded-lg p-4 text-white shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                    <IconUserCircle size={30} />
                    <span className="capitalize font-bold text-lg">{getButtonName()}</span>
                  </div>
                  <p className="text-sm text-orange-200 truncate mb-3">{user.email}</p>
                  
                  <Link href="/history" className="flex items-center gap-2 bg-white text-black p-2.5 rounded-lg font-bold text-base mb-2 justify-center transition-all">
                    Scan History
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 p-2.5 rounded-lg font-bold text-base text-white transition-all">
                    <IconLogout size={20} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar;