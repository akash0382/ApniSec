import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Secure Your Digital Future
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto">
                ApniSec provides comprehensive cybersecurity solutions to protect
                your business from evolving threats
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/#services"
                  className="bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all border-2 border-primary-500"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Our Services
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Comprehensive cybersecurity solutions tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700">
                <div className="w-16 h-16 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Cloud Security
                </h3>
                <p className="text-slate-300">
                  Comprehensive security assessments for your cloud infrastructure
                  to identify vulnerabilities and ensure compliance with industry
                  standards.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700">
                <div className="w-16 h-16 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Red Team Assessment
                </h3>
                <p className="text-slate-300">
                  Simulated attack scenarios to test your security defenses and
                  identify weaknesses before malicious actors can exploit them.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-700">
                <div className="w-16 h-16 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  VAPT
                </h3>
                <p className="text-slate-300">
                  Vulnerability Assessment and Penetration Testing to identify
                  and remediate security vulnerabilities in your systems and
                  applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Why Choose ApniSec?
                </h2>
                <p className="text-lg text-slate-300 mb-4">
                  With years of experience in cybersecurity, ApniSec has helped
                  hundreds of organizations protect their digital assets and
                  maintain compliance with industry regulations.
                </p>
                <p className="text-lg text-slate-300 mb-4">
                  Our team of certified security professionals uses cutting-edge
                  tools and methodologies to provide comprehensive security
                  assessments tailored to your specific needs.
                </p>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Industry-leading security expertise
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Comprehensive reporting and recommendations
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    24/7 support and monitoring
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary-900/30 to-primary-800/30 rounded-xl p-8 border border-primary-800">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary-400 mb-4">500+</div>
                  <div className="text-2xl text-white mb-4">Clients Trust Us</div>
                  <div className="text-lg text-slate-300">
                    Join hundreds of organizations that rely on ApniSec for their
                    cybersecurity needs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Ready to secure your digital assets? Contact us today for a
                consultation.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-slate-700">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 placeholder-slate-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 placeholder-slate-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-slate-200 placeholder-slate-500"
                    placeholder="Tell us about your security needs..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

