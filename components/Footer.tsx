import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold">ApniSec</span>
            </div>
            <p className="text-slate-400">
              Your trusted partner for comprehensive cybersecurity solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition-colors">
                  Cloud Security
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition-colors">
                  Red Team Assessment
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-primary-400 transition-colors">
                  VAPT
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/#about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Email: info@apnisec.com</li>
              <li>Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} ApniSec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

