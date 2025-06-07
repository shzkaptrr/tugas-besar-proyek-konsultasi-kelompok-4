import React from 'react';

import emailIcon from '../assets/medsos/email.png';
import whatsappIcon from '../assets/medsos/whatsapp.webp';
import twitterIcon from '../assets/medsos/twitter.png';
import instagramIcon from '../assets/medsos/instagram.png';
import youtubeIcon from '../assets/medsos/youtube.png';
import linkedinIcon from '../assets/medsos/linkedin.png';
import logo from '../assets/logo_medukasi.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-red-400 to-indigo-900 text-white px-10 py-8 rounded-b-xl ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* KIRI: Logo dan Info Perusahaan */}
        <div className="flex flex-col items-center lg:items-center text-center">
          <div className="flex items-center gap-3 mb-3">
            <img src={logo} alt="FME Logo" className="h-8 w-auto" />
            <h1 className="text-lg font-bold">PT MANDIRI EDUKASI INDONESIA</h1>
          </div>
          <p className="text-sm italic mb-4">
            “National Edustartup to help young learner<br />
            achieving their great potentials”
          </p>
          <p className="text-sm leading-relaxed">
            Cengkareng Business City IOT 12 Unit 18-19 Lt.1,<br />
            Jalan Atang Sanjaya No.2A1, R.T.006/R.W.007, Benda, Kota<br />
            Tangerang, Banten 15125.
          </p>
        </div>

        {/* KANAN: Kontak dan Media Sosial */}
        <div className="flex-1 flex flex-col items-center text-center mt-4 lg:mt-5">
          <h2 className="text-md font-semibold mb-3">Hubungi Kami</h2>
          <div className="flex items-center space-x-2 mb-2">
            <img src={emailIcon} alt="Email" className="h-5 w-5" />
            <a href="mailto:akademik@medukasi.id" className="text-sm underline">akademik@medukasi.id</a>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <img src={whatsappIcon} alt="WhatsApp" className="h-7 w-7" />
            <span className="text-sm">082274152348</span>
          </div>
          <div className="flex space-x-4">
            <img src={twitterIcon} alt="X" className="h-5 w-5 mr-2.5" />
            <img src={instagramIcon} alt="Instagram" className="h-8 w-8 -mt-1.5" />
            <img src={youtubeIcon} alt="YouTube" className="h-7 w-15 -mt-1 mr-3" />
            <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6 -mt-0.5" />
          </div>
        </div>
        
      </div>
    </footer>
  );
}
