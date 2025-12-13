import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingCart, Menu, X, Search, CreditCard, Mail, MessageSquare, Send, 
  ChevronRight, Star, CheckCircle, HelpCircle, Phone, Bot, User as UserIcon, 
  LogOut, Package, Globe, Gamepad2, Megaphone, Users, ShoppingBag, TrendingUp, 
  ChevronDown, ChevronUp, Code, Facebook, Twitter 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- ENV SETUP ---
// Replace 'YOUR_GEMINI_API_KEY' with your actual key for GitHub Pages
window.process = { env: { API_KEY: 'AIzaSyDLLhlTqQLbSzR-uPoUqtLN91o1XzK9wk4' } };

// --- DATA & TYPES ---
const PRODUCTS = [
  {
    id: '1',
    title: 'নেটফ্লিক্স প্রিমিয়াম (4K) - ১ স্ক্রিন',
    category: 'স্ট্রিমিং',
    price: 350,
    originalPrice: 450,
    description: 'প্রাইভেট প্রোফাইল, 4K আল্ট্রা এইচডি। ১ মাসের গ্যারান্টি সহ। পিন সেট করা যাবে।',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      '"Add to Cart" এ ক্লিক করুন',
      'Checkout পেজে যান',
      'বিকাশ/নগদ এর মাধ্যমে ৩৫০ টাকা পাঠান',
      'আপনার ইমেইল এবং TrxID দিন',
      'মেইলে সাথে সাথে লগইন ডিটেইলস পাবেন'
    ]
  },
  {
    id: '2',
    title: 'স্পটিফাই প্রিমিয়াম - ইন্ডিভিজুয়াল',
    category: 'মিউজিক',
    price: 150,
    originalPrice: 200,
    description: 'আপনার নিজের ইমেইলে আপগ্রেড। কোনো অ্যাড নেই, অফলাইন ডাউনলোড করা যাবে। ১ মাস মেয়াদ।',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      'অর্ডার করার সময় আপনার স্পটিফাই ইমেইল দিন',
      'পেমেন্ট কমপ্লিট করুন',
      'আমরা আপনার মেইলে ইনভাইট লিংক পাঠাবো',
      'লিংকে ক্লিক করে প্রিমিয়াম চালু করুন'
    ]
  },
  {
    id: '3',
    title: 'পাবজি মোবাইল - ৬৬০ ইউসি',
    category: 'গেমিং',
    price: 950,
    originalPrice: 1050,
    description: 'প্লেয়ার আইডি দিয়ে সরাসরি টপ-আপ। গ্লোবাল সার্ভার। ৫-১০ মিনিটে ডেলিভারি।',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      'আপনার পাবজি প্লেয়ার আইডি কপি করুন',
      'চেকআউটে প্লেয়ার আইডি দিন',
      'পেমেন্ট সম্পন্ন করুন',
      'কিছুক্ষণের মধ্যে অ্যাকাউন্টে ইউসি চলে যাবে'
    ]
  },
  {
    id: '4',
    title: 'নর্ড ভিপিএন প্রিমিয়াম - ১ মাস',
    category: 'সিকিউরিটি',
    price: 250,
    originalPrice: 500,
    description: 'হাই স্পিড সিকিউর ইন্টারনেট। শেয়ার্ড অ্যাকাউন্ট। পাসওয়ার্ড পরিবর্তন করা যাবে না।',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      'অর্ডার কনফার্ম করুন',
      'ইমেইলে ইউজারনেম ও পাসওয়ার্ড পাবেন',
      'লগইন করে কানেক্ট করুন',
      'কোনো সমস্যা হলে সাপোর্টে জানান'
    ]
  },
  {
    id: '5',
    title: 'ক্যানভা প্রো - লাইফটাইম',
    category: 'টুলস',
    price: 99,
    originalPrice: 500,
    description: 'এডুকেশন টিম ইনভাইট। সব প্রো ফিচার আনলকড। আপনার পার্সোনাল ইমেইলে।',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      'আপনার ক্যানভা ইমেইলটি দিন',
      'আমরা একটি ইনভাইটেশন লিংক পাঠাবো',
      'লিংকে ক্লিক করে টিমে জয়েন করুন',
      'প্রো ফিচার উপভোগ করুন'
    ]
  },
  {
    id: '6',
    title: 'চ্যাটজিপিটি প্লাস (শেয়ার্ড)',
    category: 'এআই',
    price: 450,
    originalPrice: 2200,
    description: 'GPT-4 এক্সেস। শেয়ার্ড লগইন, ব্রাউজার প্রোফাইল সিস্টেমে ব্যবহার করতে হবে।',
    image: 'https://images.unsplash.com/photo-1680411636932-261559f5b244?q=80&w=1000&auto=format&fit=crop',
    instructions: [
      'কেনার পর লগইন ডিটেইলস পাবেন',
      'নির্দিষ্ট ব্রাউজার প্রোফাইল ব্যবহার করুন',
      'অন্য কারো চ্যাট ডিলিট করবেন না'
    ]
  }
];

const FAQS = [
  {
    q: "অর্ডার ডেলিভারি হতে কত সময় লাগে?",
    a: "সাধারণত ৫-১০ মিনিটের মধ্যে ডেলিভারি সম্পন্ন হয়। তবে সার্ভার সমস্যার কারণে সর্বোচ্চ ৩০ মিনিট সময় লাগতে পারে।"
  },
  {
    q: "কিভাবে পেমেন্ট করবো?",
    a: "বিকাশ বা নগদ এর 'Send Money' অপশন ব্যবহার করে আমাদের নাম্বারে টাকা পাঠাতে হবে এবং ট্রানজেকশন আইডি দিতে হবে।"
  },
  {
    q: "রিফান্ড পলিসি কি?",
    a: "যদি পণ্য কাজ না করে বা আমরা ডেলিভারি দিতে ব্যর্থ হই, তবে পূর্ণ রিফান্ড পাবেন। ডিজিটাল পণ্যের ক্ষেত্রে ডেলিভারির পর সাধারণ রিফান্ড হয় না।"
  },
  {
    q: "সাপোর্ট কখন পাওয়া যায়?",
    a: "আমাদের হিউম্যান সাপোর্ট সকাল ১০টা থেকে রাত ১০টা পর্যন্ত একটিভ থাকে। তবে অর্ডার অটোমেটেড সিস্টেমে ২৪/৭ প্রসেস হয়।"
  }
];

// --- SERVICES ---

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sendOrderToDiscord = async (order) => {
  console.log("MTQ0OTUxNDEyNjc3MzcxOTI1MQ.GaZ9NL.5ytGdHP3YsVAxXwKEJvg_55s9UBFsvM8y7ZRhc");
  await delay(1500); 
  console.log("1449514687300501765", order.id);
  return true;
};

const sendTicketToDiscord = async (ticket) => {
  console.log("MTQ0OTUxNDEyNjc3MzcxOTI1MQ.GaZ9NL.5ytGdHP3YsVAxXwKEJvg_55s9UBFsvM8y7ZRhc");
  await delay(1500);
  console.log("1449514738097590372", ticket.id);
  return true;
};

// Gemini Service
const apiKey = window.process?.env?.API_KEY || '';
const ai = apiKey && apiKey !== 'AIzaSyDLLhlTqQLbSzR-uPoUqtLN91o1XzK9wk4' ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are the AI Support Agent for "MOHOLLA BD SHOP". 
We sell premium digital subscriptions like Netflix, Spotify, YouTube Premium, VPNs, and Gaming Top-ups in Bangladesh.
Our payment methods are bKash and Nagad.
When a user orders, they get the details via Email instantly (simulated).
If asked about prices, be polite and ask them to check the product list.
If asked how to order: Tell them to click a product, read instructions, add to cart, and provide their Transaction ID.
Keep answers short, friendly, and helpful. Use Bengali or English based on user input.
`;

const sendMessageToGemini = async (message) => {
  if (!ai) {
    return "AI Support is currently unavailable (Missing API Key). Please contact human support.";
  }
  try {
    const model = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    const response = await model;
    return response.text || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the server right now.";
  }
};

// --- COMPONENTS ---

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 border ${type === 'success' ? 'bg-green-600/90 border-green-400' : 'bg-red-600/90 border-red-400'} backdrop-blur-md text-white flex items-center gap-2`}>
      {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const App = () => {
  // Global State
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  // UI State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [policyView, setPolicyView] = useState(null);
  
  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [email, setEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  // Tracking State
  const [trackInput, setTrackInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: 'আসসালামু আলাইকুম! মহল্লা বিডি শপে আপনাকে স্বাগতম। আমি কিভাবে সাহায্য করতে পারি?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Support Ticket State
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', issue: '' });
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);

  // Helpers
  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const login = (provider) => {
    const mockUser = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name: 'Moholla Customer',
      email: 'customer@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      provider
    };
    setUser(mockUser);
    setIsLoginModalOpen(false);
    showNotification(`Logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`, 'success');
  };

  const logout = () => {
    setUser(null);
    setActiveTab('home');
    showNotification('Logged out successfully', 'success');
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`${product.title} কার্টে যোগ করা হয়েছে!`, 'success');
    setSelectedProduct(null); 
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!email || !trxId) {
      showNotification('সব তথ্য পূরণ করুন', 'error');
      return;
    }

    setIsOrdering(true);
    
    const newOrder = {
      id: 'MBD-' + Math.floor(1000 + Math.random() * 9000),
      items: [...cart],
      total: cartTotal,
      email: email,
      paymentMethod: paymentMethod,
      transactionId: trxId,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      userId: user?.id
    };

    try {
      await sendOrderToDiscord(newOrder);
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setIsCartOpen(false);
      setEmail('');
      setTrxId('');
      setIsOrdering(false);
      showNotification(`অর্ডার সফল! কোড: ${newOrder.id}। ইমেইল চেক করুন।`, 'success');
      alert(`অর্ডার সফল হয়েছে!\nআপনার অর্ডার কোড: ${newOrder.id}\nএই কোডটি সংরক্ষণ করুন।`);
    } catch (error) {
      setIsOrdering(false);
      showNotification('কিছু ভুল হয়েছে। আবার চেষ্টা করুন।', 'error');
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsTicketSubmitting(true);
    const newTicket = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...ticketForm,
      status: 'Open'
    };
    await sendTicketToDiscord(newTicket);
    setTickets([...tickets, newTicket]);
    setTicketForm({ name: '', email: '', issue: '' });
    setIsTicketSubmitting(false);
    showNotification('সাপোর্ট টিকেট ডিসকর্ডে পাঠানো হয়েছে!', 'success');
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    const found = orders.find(o => o.id === trackInput.trim() || o.id === `MBD-${trackInput.trim()}`);
    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackedOrder(null);
      showNotification('অর্ডার পাওয়া যায়নি। কোড চেক করুন।', 'error');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    const aiText = await sendMessageToGemini(userMsg);
    setChatMessages(prev => [...prev, { role: 'model', text: aiText }]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="min-h-screen font-sans text-gray-100 bg-[#0B0F19] selection:bg-primary selection:text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] opacity-30"></div>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="relative z-50 bg-gradient-to-r from-secondary to-primary text-white text-xs sm:text-sm py-2 px-4 text-center font-bold shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex-1 flex justify-center items-center gap-2">
              <Megaphone size={16} className="animate-pulse" />
              <span>ধামাকা অফার! নেটফ্লিক্স প্রিমিয়াম কিনলেই পাচ্ছেন ১০% ক্যাশব্যাক! সীমিত সময়ের জন্য।</span>
            </div>
            <button onClick={() => setShowAnnouncement(false)} className="ml-4 hover:bg-white/20 rounded-full p-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-all">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent block leading-tight">MOHOLLA</span>
                <span className="text-xs text-primary font-semibold tracking-widest">BD SHOP</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-medium transition-all ${activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>স্টোর</button>
              <button onClick={() => setActiveTab('track')} className={`text-sm font-medium transition-all ${activeTab === 'track' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>অর্ডার ট্র্যাক করুন</button>
              <button onClick={() => setActiveTab('support')} className={`text-sm font-medium transition-all ${activeTab === 'support' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>সাপোর্ট</button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button 
                 onClick={() => setIsCartOpen(true)}
                 className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
              >
                <ShoppingCart className="text-gray-400 group-hover:text-primary transition-colors" size={24} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#0B0F19]">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>

              {user ? (
                 <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <button onClick={() => setActiveTab('profile')} className="flex items-center gap-2 group">
                       <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-primary/50 group-hover:border-primary transition-colors" />
                       <span className="text-sm font-medium hidden sm:block group-hover:text-white transition-colors">{user.name.split(' ')[0]}</span>
                    </button>
                 </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                >
                  <UserIcon size={16} /> লগইন
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 min-h-[calc(100vh-80px)]">
        
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <div className="relative border-b border-white/5 bg-[#0B0F19]">
              <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-fade-in-up">
                  <Star size={12} fill="currentColor"/> #১ বিশ্বস্ত ডিজিটাল শপ
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                  সেরা দামে <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">প্রিমিয়াম সাবস্ক্রিপশন</span>
                </h1>
                <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-400 mb-10">
                  নেটফ্লিক্স, স্পটিফাই, গেমস টপ-আপ এবং প্রিমিয়াম টুলস নিন মুহূর্তেই। অটোমেটেড ডেলিভারি এবং ২৪/৭ সাপোর্ট।
                </p>
                
                {/* Statistics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center gap-2 text-primary mb-1">
                      <Users size={20} />
                      <span className="text-2xl font-bold text-white">৫০০০+</span>
                    </div>
                    <p className="text-xs text-gray-400">হ্যাপি কাস্টমার</p>
                  </div>
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center gap-2 text-secondary mb-1">
                      <ShoppingBag size={20} />
                      <span className="text-2xl font-bold text-white">১২০০০+</span>
                    </div>
                    <p className="text-xs text-gray-400">অর্ডার সম্পন্ন</p>
                  </div>
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
                      <Star size={20} fill="currentColor" />
                      <span className="text-2xl font-bold text-white">৪.৯</span>
                    </div>
                    <p className="text-xs text-gray-400">এভারেজ রেটিং</p>
                  </div>
                   <div className="bg-[#131926] p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                      <TrendingUp size={20} />
                      <span className="text-2xl font-bold text-white">৩ বছর</span>
                    </div>
                    <p className="text-xs text-gray-400">অবিরত সেবা</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={() => {
                    const el = document.getElementById('products');
                    el?.scrollIntoView({behavior: 'smooth'});
                  }} className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1">
                    শপিং করুন
                  </button>
                  <button onClick={() => setActiveTab('track')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/10 transition-all">
                    অর্ডার ট্র্যাক করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRODUCTS.map(product => (
                  <div key={product.id} className="group relative bg-[#131926] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]">
                    
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131926] to-transparent z-10 opacity-60"></div>
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                        {product.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative z-20">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-bold text-white">৳{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">৳{product.originalPrice}</span>
                        <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded ml-auto">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="w-full bg-slate-800 hover:bg-primary text-white font-bold py-3 rounded-xl border border-white/5 hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                      >
                        বিস্তারিত ও অর্ডার <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-[#131926] border-t border-white/5 py-20">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-4">সচরাচর জিজ্ঞাসা (FAQ)</h2>
                  <p className="text-gray-400">আপনার মনের প্রশ্নের উত্তর এখানে খুঁজুন</p>
                </div>
                <div className="space-y-4">
                  {FAQS.map((faq, index) => (
                    <div key={index} className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden transition-all">
                      <button 
                        className="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-white/5 transition-colors"
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      >
                        <span>{faq.q}</span>
                        {openFaqIndex === index ? <ChevronUp size={20} className="text-primary"/> : <ChevronDown size={20} className="text-gray-400"/>}
                      </button>
                      {openFaqIndex === index && (
                        <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'track' && (
          <div className="max-w-3xl mx-auto px-4 py-20">
            <div className="bg-[#131926] border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
              <Package className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">অর্ডার ট্র্যাক করুন</h2>
              <p className="text-gray-400 mb-8">আপনার অর্ডার কোড (যেমন: MBD-5829) নিচে দিয়ে স্ট্যাটাস চেক করুন।</p>
              
              <form onSubmit={handleTrackOrder} className="flex gap-2 max-w-md mx-auto mb-10">
                <input 
                  type="text" 
                  value={trackInput}
                  onChange={e => setTrackInput(e.target.value)}
                  placeholder="অর্ডার কোড দিন" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                  চেক করুন
                </button>
              </form>

              {trackedOrder && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-white/5 text-left animate-fade-in-up">
                  <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">অর্ডার #{trackedOrder.id}</h3>
                      <p className="text-sm text-gray-400">{trackedOrder.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${trackedOrder.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {trackedOrder.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {trackedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.title} (x{item.quantity})</span>
                        <span className="text-white font-medium">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 mt-2 border-t border-white/5 font-bold">
                      <span className="text-white">মোট পেমেন্ট</span>
                      <span className="text-primary">৳{trackedOrder.total}</span>
                    </div>
                  </div>
                  {trackedOrder.status === 'Delivered' && (
                     <div className="mt-4 bg-green-900/20 border border-green-500/20 p-3 rounded text-sm text-green-300 flex gap-2 items-center">
                       <CheckCircle size={16}/> বিস্তারিত তথ্য {trackedOrder.email} এ পাঠানো হয়েছে।
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">সাপোর্ট সেন্টার</h2>
                <p className="text-gray-400 mb-8">
                  আমরা সকাল ১০:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত এক্টিভ আছি। <br/>
                  আমাদের AI বট ২৪/৭ সার্ভিস দেয়।
                </p>
                
                <div className="space-y-4">
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer">
                     <div className="bg-[#5865F2]/20 p-3 rounded-lg text-[#5865F2]"><Gamepad2 size={24}/></div>
                     <div>
                       <h4 className="font-bold text-white">Discord</h4>
                       <p className="text-xs text-gray-400">ডিসকর্ড সার্ভারে জয়েন করুন</p>
                     </div>
                  </div>
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer">
                     <div className="bg-[#24A1DE]/20 p-3 rounded-lg text-[#24A1DE]"><Send size={24}/></div>
                     <div>
                       <h4 className="font-bold text-white">Telegram</h4>
                       <p className="text-xs text-gray-400">টেলিগ্রাম চ্যানেলে জয়েন করুন</p>
                     </div>
                  </div>
                  <div className="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                     <div className="bg-pink-500/20 p-3 rounded-lg text-pink-400"><Mail size={24}/></div>
                     <div>
                       <h4 className="font-bold text-white">ইমেইল করুন</h4>
                       <p className="text-xs text-gray-400">support@mohollabd.com</p>
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#131926] p-8 rounded-2xl border border-white/10 shadow-xl">
                 <h3 className="text-xl font-bold text-white mb-6">টিকেট ওপেন করুন</h3>
                 <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">নাম</label>
                      <input 
                        type="text" 
                        required
                        value={ticketForm.name}
                        onChange={e => setTicketForm({...ticketForm, name: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ইমেইল</label>
                      <input 
                        type="email" 
                        required
                        value={ticketForm.email}
                        onChange={e => setTicketForm({...ticketForm, email: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">সমস্যার বিবরণ</label>
                      <textarea 
                        required
                        rows={4}
                        value={ticketForm.issue}
                        onChange={e => setTicketForm({...ticketForm, issue: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none resize-none"
                        placeholder="আপনার অর্ডার আইডি সহ বিস্তারিত লিখুন..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isTicketSubmitting}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                    >
                      {isTicketSubmitting ? 'পাঠানো হচ্ছে...' : 'টিকেট সাবমিট করুন'}
                    </button>
                 </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-[#131926] rounded-2xl border border-white/10 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                <button 
                  onClick={logout}
                  className="absolute top-4 right-4 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                >
                  <LogOut size={14}/> লগআউট
                </button>
              </div>
              <div className="px-8 pb-8 relative">
                <div className="flex flex-col sm:flex-row items-end -mt-12 mb-6 gap-6">
                   <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#131926] bg-slate-800" />
                   <div className="mb-2">
                     <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                     <p className="text-gray-400 text-sm flex items-center gap-2">
                       {user.email} 
                       <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] uppercase tracking-wider">{user.provider}</span>
                     </p>
                   </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">অর্ডার হিস্টোরি</h3>
                <div className="space-y-4">
                  {orders.filter(o => o.userId === user.id).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      কোনো অর্ডার নেই।
                    </div>
                  ) : (
                    orders.filter(o => o.userId === user.id).map(order => (
                      <div key={order.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            #{order.id} 
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {order.items.map(i => i.title).join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">৳{order.total}</div>
                          <div className="text-xs text-gray-500">{order.date}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#05080f] border-t border-white/5 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                MOHOLLA BD SHOP
              </p>
              <p className="text-gray-500 text-sm">বাংলাদেশের সবচেয়ে বিশ্বস্ত ডিজিটাল সেবার প্ল্যাটফর্ম</p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-[#5865F2] hover:text-white text-gray-400 transition-all"><Gamepad2 size={20}/></a>
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-[#24A1DE] hover:text-white text-gray-400 transition-all"><Send size={20}/></a>
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-blue-600 hover:text-white text-gray-400 transition-all"><Facebook size={20}/></a>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-gray-400 text-sm">
              <button onClick={() => setPolicyView('terms')} className="hover:text-white transition-colors">শর্তাবলী</button>
              <button onClick={() => setPolicyView('refund')} className="hover:text-white transition-colors">রিফান্ড পলিসি</button>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-xs mb-1">
                &copy; {new Date().getFullYear()} মহল্লা বিডি শপ। সর্বস্বত্ব সংরক্ষিত।
              </p>
              <p className="text-gray-700 text-[10px] flex items-center justify-center md:justify-end gap-1">
                <Code size={10}/> Developed by <a href="#" className="hover:text-primary transition-colors">YourName</a>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modals */}
      {policyView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPolicyView(null)} />
          <div className="relative bg-[#131926] p-8 rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
             <button onClick={() => setPolicyView(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
               <X size={20} />
             </button>
             
             {policyView === 'refund' && (
               <>
                 <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">রিটার্ন ও রিফান্ড পলিসি</h2>
                 <div className="space-y-4 text-gray-300 leading-relaxed">
                   <p>১. <strong>ডিজিটাল পণ্য:</strong> ডেলিভারি সম্পন্ন হওয়ার পর এবং পণ্য সচল থাকলে ডিজিটাল পণ্যের ক্ষেত্রে সাধারণত কোন রিফান্ড বা রিটার্ন প্রযোজ্য নয়।</p>
                   <p>২. <strong>ত্রুটিপূর্ণ পণ্য:</strong> যদি আমাদের সরবরাহকৃত কোনো পণ্য কাজ না করে, তবে অভিযোগ জানানোর ২৪ ঘন্টার মধ্যে আমরা তা রিপ্লেস করে দিবো। রিপ্লেসমেন্ট সম্ভব না হলে পূর্ণ রিফান্ড দেওয়া হবে।</p>
                   <p>৩. <strong>ভুল অর্ডার:</strong> গ্রাহক যদি ভুল পণ্য অর্ডার করেন এবং ডেলিভারি সম্পন্ন হয়ে যায়, তবে তার দায়ভার আমাদের নয়।</p>
                   <p>৪. <strong>ডেলিভারি সময়:</strong> সার্ভার জটিলতার কারণে ডেলিভারি বিলম্বিত হলে রিফান্ড চাওয়া যাবে না, যতক্ষণ না আমরা অর্ডার বাতিল ঘোষণা করি।</p>
                 </div>
               </>
             )}

             {policyView === 'terms' && (
               <>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">শর্তাবলী (Terms of Service)</h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                   <p>১. মহল্লা বিডি শপ থেকে পণ্য কেনার মাধ্যমে আপনি আমাদের সকল শর্তে রাজি হচ্ছেন।</p>
                   <p>২. আমরা শুধুমাত্র গেমিং এবং সাবস্ক্রিপশন সার্ভিস বিক্রি করি। কোনো প্রকার অবৈধ কাজে পণ্য ব্যবহার করা সম্পূর্ণ নিষিদ্ধ।</p>
                   <p>৩. শেয়ার্ড অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করা যাবে না। পরিবর্তন করলে ওয়ারেন্টি বাতিল বলে গণ্য হবে।</p>
                   <p>৪. আমরা যেকোনো সময় পণ্যের মূল্য পরিবর্তন করার অধিকার রাখি।</p>
                </div>
               </>
             )}
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[#131926] shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="text-primary" size={24} /> কার্ট
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart size={64} className="mb-4 opacity-10" />
                  <p>আপনার কার্ট খালি</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-4 text-primary font-bold text-sm">
                    শপিং করুন
                  </button>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="bg-slate-900/50 p-3 rounded-xl flex gap-4 border border-white/5">
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-primary text-sm font-bold">৳{item.price} x {item.quantity}</span>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-400 hover:bg-red-400/10 rounded">
                            <X size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-white/10 pt-6 mt-4">
                    <div className="flex justify-between text-white font-bold text-xl mb-6">
                      <span>মোট</span>
                      <span>৳{cartTotal}</span>
                    </div>

                    {!isOrdering ? (
                      <form onSubmit={handleCheckout} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">পেমেন্ট মেথড</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('bKash')}
                              className={`p-3 rounded-xl border text-center transition-all font-bold ${paymentMethod === 'bKash' ? 'border-secondary bg-secondary/20 text-white' : 'border-slate-700 bg-slate-900 text-gray-400 hover:border-slate-600'}`}
                            >
                              বিকাশ
                            </button>
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('Nagad')}
                              className={`p-3 rounded-xl border text-center transition-all font-bold ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-500/20 text-white' : 'border-slate-700 bg-slate-900 text-gray-400 hover:border-slate-600'}`}
                            >
                              নগদ
                            </button>
                          </div>
                          <div className="bg-slate-900 p-4 rounded-xl text-sm text-gray-300 border border-white/5 text-center shadow-inner">
                            টাকা পাঠান: <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10 ml-2">01700000000</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <input 
                            type="email" 
                            required 
                            placeholder="আপনার ইমেইল (যেখানে ডেলিভারি যাবে)"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                          />
                          <input 
                            type="text" 
                            required 
                            placeholder="ট্রানজেকশন আইডি (TrxID)"
                            value={trxId}
                            onChange={e => setTrxId(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                          />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
                          <CreditCard size={18} /> অর্ডার কনফার্ম করুন
                        </button>
                      </form>
                    ) : (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
                        <p className="text-white font-bold">পেমেন্ট ভেরিফাই করা হচ্ছে...</p>
                        <p className="text-xs text-gray-500 mt-2">গেটওয়ের সাথে সংযোগ হচ্ছে</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)} />
          <div className="relative bg-[#131926] p-8 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
             <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
               <X size={20} />
             </button>
             <h2 className="text-2xl font-bold text-center text-white mb-6">স্বাগতম</h2>
             
             <div className="space-y-3">
               <button onClick={() => login('google')} className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                  <span className="font-bold text-lg">G</span> Google দিয়ে লগইন
               </button>
               <button onClick={() => login('discord')} className="w-full bg-[#5865F2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#4752C4] transition-colors">
                  <Gamepad2 size={20}/> Discord দিয়ে লগইন
               </button>
               <button onClick={() => login('telegram')} className="w-full bg-[#24A1DE] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#208bbf] transition-colors">
                  <Send size={20}/> Telegram দিয়ে লগইন
               </button>
             </div>
             
             <p className="text-center text-xs text-gray-500 mt-6">
               কন্টিনিউ করার মাধ্যমে আপনি আমাদের শর্তাবলীতে রাজি হচ্ছেন।
             </p>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
           <div className="relative bg-[#131926] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row">
             <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 bg-black/40 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors">
               <X size={20} />
             </button>
             
             {/* Left: Image */}
             <div className="w-full md:w-1/2 bg-black relative">
               <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#131926] via-transparent to-transparent md:bg-gradient-to-r"></div>
             </div>
             
             {/* Right: Info */}
             <div className="flex-1 p-8 flex flex-col overflow-y-auto">
               <div className="mb-auto">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase mb-4">
                    {selectedProduct.category}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{selectedProduct.title}</h2>
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">৳{selectedProduct.price}</span>
                    <span className="text-lg text-gray-600 line-through mb-1">৳{selectedProduct.originalPrice}</span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed mb-8">{selectedProduct.description}</p>
                  
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 mb-8">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <HelpCircle size={14} className="text-primary"/> যেভাবে অর্ডার করবেন:
                    </h4>
                    <ul className="space-y-2">
                      {selectedProduct.instructions.map((inst, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-400">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/10">{i + 1}</span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>

               <button 
                 onClick={() => addToCart(selectedProduct)} 
                 className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
               >
                 <ShoppingCart size={20} /> কার্টে যোগ করুন
               </button>
             </div>
           </div>
        </div>
      )}

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
        {isChatOpen && (
           <div className="w-80 md:w-96 bg-[#131926] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Moholla Support AI</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F19]">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-800 text-gray-200 rounded-bl-none border border-white/5'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleChatSubmit} className="p-3 bg-[#131926] border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="সাহায্য দরকার..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:border-primary outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim()}
                  className="bg-secondary p-2 rounded-full text-white disabled:opacity-50 hover:bg-secondary/90 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
           </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-110"
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
