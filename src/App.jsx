import React, { useState, useEffect } from 'react';

// --- Helper Components & Icons ---
// Using inline SVGs for icons to avoid external dependencies and ensure they always load.
const CheckCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const SunIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const MenuIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


// --- Main Page Components ---

const Header = ({ setPage, theme, handleThemeSwitch }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = (
        <>
            <a href="#features" onClick={() => { setPage('home'); setIsMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#comparison" onClick={() => { setPage('home'); setIsMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Comparison</a>
            <a href="#contact" onClick={() => { setPage('contact'); setIsMenuOpen(false); }} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a>
        </>
    );

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer" onClick={() => setPage('home')}>
                    FE<span className="text-blue-600 dark:text-blue-400">·</span>Timesheets
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks}
                    <button onClick={handleThemeSwitch} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
                    </button>
                    <button onClick={() => setPage('contact')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Get a Quote
                    </button>
                </nav>
                <div className="md:hidden flex items-center gap-4">
                     <button onClick={handleThemeSwitch} className="text-gray-800 dark:text-gray-100 focus:outline-none">
                        {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 dark:text-gray-100 focus:outline-none">
                        {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        {navLinks}
                        <button onClick={() => { setPage('contact'); setIsMenuOpen(false); }} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-4/5">
                            Get a Quote
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

const Footer = ({ setPage }) => (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-xl font-bold text-white">FE<span className="text-blue-400">·</span>Timesheets</h3 >
                    <p className="text-gray-400 mt-2">A no-fuss, highly efficient timesheet approval tool built for field teams.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                    <ul>
                        <li className="mb-2"><a href="#features" onClick={() => setPage('home')} className="text-gray-400 hover:text-white">Features</a></li>
                        <li className="mb-2"><a href="#comparison" onClick={() => setPage('home')} className="text-gray-400 hover:text-white">Comparison</a></li>
                        <li className="mb-2"><a href="#" onClick={() => setPage('contact')} className="text-gray-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-lg mb-4">Get Started</h4>
                    <p className="text-gray-400 mb-4">Streamline your field operations without breaking the bank.</p>
                    <button onClick={() => setPage('contact')} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Request a Demo
                    </button>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} FE Timesheets. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


const LandingPage = ({ setPage }) => {
    const features = [
        { title: "Ultra-Simple & Intuitive", description: "Designed for field engineers, not software experts. Submission is one-click, approval is just as easy." },
        { title: "Multistage, Multilocation Workflow", description: "Hours go to a designated client contact by region. After client approval, it goes to an admin for final review." },
        { title: "Transparent Communication", description: "Rejected timesheets require a note, ensuring accountability and minimizing back-and-forth emails." },
        { title: "Audit Trail for Compliance", description: "Every step is timestamped and recorded — who approved, when, and why. Perfect for resolving disputes and supporting audits." },
        { title: "Save Time, Cut Costs", description: "Automates repetitive steps, reduces manual mistakes, and minimizes administrative workload." }
    ];
    
    const comparisonData = [
        { feature: "Mobile-friendly submission", offered: true, benefit: "Enter hours anywhere — eliminates pencil-and-paper hassle." },
        { feature: "Client-specific approvals", offered: true, benefit: "Ensures accurate billing and builds trust with clients." },
        { feature: "Admin oversight", offered: true, benefit: "Final check to catch any errors before payroll." },
        { feature: "Feedback-required for rejects", offered: true, benefit: "Fields communication gaps → faster resolution." },
        { feature: "Email notifications", offered: true, benefit: "Keeps everyone informed — no reminders needed." },
        { feature: "Approval audit logs", offered: true, benefit: "Essential compliance & dispute resolution tool." },
    ];

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
                        Timesheets, Simplified for the Field.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        A no-fuss, highly efficient timesheet approval tool built for global field teams. It’s intuitive, fast, and priced to fit smaller budgets.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={() => setPage('contact')} className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                            Request a Quote
                        </button>
                        <a href="#features" className="w-full sm:w-auto bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-blue-200 dark:border-gray-700">
                           Learn More
                        </a>
                    </div>
                </div>
            </section>

            {/* Why It Works Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Why It Works for You</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Streamline field operations without breaking the bank.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                             <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-xl shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/40 transition-shadow duration-300 border border-transparent dark:hover:border-blue-800">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{feature.title}</h3>
                                <p className="mt-3 text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Comparison Table Section */}
            <section id="comparison" className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Feature-by-Feature Comparison</h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                           <div className="hidden md:grid md:grid-cols-3 bg-gray-100 dark:bg-gray-700/50 font-semibold text-gray-700 dark:text-gray-200 text-left px-6 py-4">
                                <div>Feature</div>
                                <div>FE·Timesheets</div>
                                <div>Benefit for You</div>
                           </div>
                            {comparisonData.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-6 md:px-6 md:py-4 items-center">
                                    <div className="font-semibold text-gray-800 dark:text-gray-100">{item.feature}</div>
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400 mr-2" />
                                        <span className="md:hidden text-gray-600 dark:text-gray-300">Offered</span>
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">{item.benefit}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why it Outshines Section */}
            <section className="py-20">
                 <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Why It Outshines the Rest</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">FE·Timesheets delivers what you need, but is specifically tailored for service-oriented teams working onsite globally.</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">Adds a Client-Project Layer</h3>
                            <p className="text-blue-700 dark:text-blue-400 mt-2">Most generic time-tracking systems ignore this crucial step. We build it in to ensure project accuracy.</p>
                        </div>
                         <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">Enforces Dual Approval</h3>
                            <p className="text-blue-700 dark:text-blue-400 mt-2">Structured approval from both client and admin reduces errors and improves accountability.</p>
                        </div>
                         <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">Lightweight & Tailored Interface</h3>
                            <p className="text-blue-700 dark:text-blue-400 mt-2">Perfect for non-tech users — no excess tabs, bloated features, or hidden menus.</p>
                        </div>
                         <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 text-lg">Audit-Ready & Transparent</h3>
                            <p className="text-blue-700 dark:text-blue-400 mt-2">Fast, transparent, and audit-ready — all at an affordable price designed for small-to-medium teams.</p>
                        </div>
                    </div>
                 </div>
            </section>

             {/* Bottom Line CTA */}
            <section id="contact" className="bg-blue-600">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Make Time-Tracking Painless.</h2>
                    <p className="mt-4 text-blue-200 max-w-2xl mx-auto">
                        Clients review with one click. Administrators retain control. Technicians get clear, guided feedback.
                    </p>
                    <button onClick={() => setPage('contact')} className="mt-8 bg-white text-blue-600 font-bold py-4 px-10 rounded-lg shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                        Get Your Free Quote
                    </button>
                </div>
            </section>
        </div>
    );
};

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        console.log("Form Data Submitted:", formData);
        console.log(`This would be sent to: shawn.shiobara@gmail.com`);

        setTimeout(() => {
            setStatus('success');
             setTimeout(() => {
                setStatus('idle');
                setFormData({ name: '', company: '', email: '', message: '' });
            }, 5000);
        }, 1500);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Contact Us</h2>
                        <p className="mt-3 text-gray-600 dark:text-gray-300">Get a quote or ask for more information. We'll get back to you shortly!</p>
                    </div>
                    
                    {status === 'success' ? (
                        <div className="text-center p-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto" />
                            <h3 className="text-2xl font-semibold text-green-800 dark:text-green-300 mt-4">Thank You!</h3>
                            <p className="text-green-700 dark:text-green-400 mt-2">Your message has been sent successfully. We will be in touch soon.</p>
                        </div>
                    ) : (
                         <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"/>
                                </div>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                    <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"/>
                                </div>
                                <div>
                                     <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                     <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"></textarea>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
                                    {status === 'submitting' ? 'Submitting...' : 'Send Message'}
                                </button>
                            </div>
                             {status === 'error' && <p className="text-red-600 mt-4 text-center">Something went wrong. Please try again.</p>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- App Component (Router & Theme Manager) ---
export default function App() {
    // This state hook mimics a router.
    const [page, setPage] = useState('home');
    const [theme, setTheme] = useState(null);
    
    // Effect to set initial theme and handle theme changes
    useEffect(() => {
        // 1. Set initial theme
        if (theme === null) {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        }
        
        // 2. Apply theme to HTML tag and save to localStorage
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);


    const handleThemeSwitch = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);
    
    // Listen for hash changes to allow nav links to work
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#contact') {
                setPage('contact');
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Avoid rendering a flash of unstyled content
    if (theme === null) {
        return null;
    }

    return (
        <div className="font-sans antialiased text-gray-800 dark:text-gray-200">
            <Header setPage={setPage} theme={theme} handleThemeSwitch={handleThemeSwitch} />
            <main>
                {page === 'home' && <LandingPage setPage={setPage} />}
                {page === 'contact' && <ContactPage />}
            </main>
            <Footer setPage={setPage} />
        </div>
    );
}
