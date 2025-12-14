import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ShoppingCart, User as UserIcon, LogOut, Gamepad2, Send, Facebook, Code, 
  MessageSquare, X, Bot, HelpCircle, ChevronRight, ChevronDown, CreditCard, 
  UserCheck, Star, Package, Ticket as TicketIcon, Loader2, MessageCircleQuestion, Copy, 
  CheckCircle, Clock, Megaphone 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  instructions: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'discord' | 'email';
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  email: string;
  paymentMethod: 'bKash' | 'Nagad';
  transactionId: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
  userId: string | null;
}

export interface Ticket {
  id: string;
  name: string;
  email: string;
  department: string;
  priority: string;
  issue: string;
  status: 'Open' | 'Resolved';
  date: string;
  userId?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export type Tab = 'home' | 'track' | 'support' | 'profile';

// --- CONSTANTS ---
export const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1449608850880593950/j_QHB0X5IxUJ3i9cbYg5xHzemIpbynuwbfws1mUiZPZQlJfK5SzxyChQ3pPSmsIk5-rd";

export const SOCIAL_LINKS = {
  discord: "https://discord.gg/moholla",
  telegram: "https://t.me/moholla_bd",
  facebook: "https://www.facebook.com/moholla.bd"
};

export const PRODUCTS = [
  {
    id: '1',
    title: 'Netflix Premium (4K) - 1 Screen',
    category: 'Streaming',
    price: 350,
    originalPrice: 450,
    description: 'Private profile, 4K Ultra HD. 1 Month Guarantee. PIN lock available.',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Click "Add to Cart"', 'Go to Checkout', 'Send 350 BDT via bKash/Nagad', 'Provide Email & TrxID', 'Receive login details instantly via email']
  },
  {
    id: '2',
    title: 'Spotify Premium - Individual',
    category: 'Music',
    price: 150,
    originalPrice: 200,
    description: 'Upgrade your own email. No ads, offline download. 1 Month validity.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Provide your Spotify Email', 'Complete Payment', 'Accept the invite link sent to your email', 'Enjoy Premium']
  },
  {
    id: '3',
    title: 'PUBG Mobile - 660 UC',
    category: 'Gaming',
    price: 950,
    originalPrice: 1050,
    description: 'Direct top-up via Player ID. Global Server. 5-10 min delivery.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Copy your PUBG Player ID', 'Enter ID at checkout', 'Complete Payment', 'UC will be added shortly']
  },
  {
    id: '4',
    title: 'NordVPN Premium - 1 Month',
    category: 'Security',
    price: 250,
    originalPrice: 500,
    description: 'High-speed secure internet. Shared account. Do not change password.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Confirm Order', 'Receive Username & Password via Email', 'Login and Connect', 'Contact support for issues']
  },
  {
    id: '5',
    title: 'Canva Pro - Lifetime',
    category: 'Tools',
    price: 99,
    originalPrice: 500,
    description: 'Education Team Invite. All Pro features unlocked. On your personal email.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Provide your Canva Email', 'We send an invitation link', 'Join the team via link', 'Enjoy Pro features']
  },
  {
    id: '6',
    title: 'ChatGPT Plus (Shared)',
    category: 'AI',
    price: 450,
    originalPrice: 2200,
    description: 'GPT-4 Access. Shared login, must use specific browser profile system.',
    image: 'https://images.unsplash.com/photo-1680411636932-261559f5b244?q=80&w=1000&auto=format&fit=crop',
    instructions: ['Receive login details after purchase', 'Use specific browser profile', 'Do not delete others\' chats']
  }
];

export const FAQS = [
  { q: "How long does delivery take?", a: "Usually 5-10 minutes. Maximum 30 minutes if there are server issues." },
  { q: "How do I pay?", a: "Use 'Send Money' on bKash or Nagad to our number and provide the TrxID." },
  { q: "What is the refund policy?", a: "Full refund if the product doesn't work or we fail to deliver. No refunds for 'change of mind' on digital goods." },
  { q: "When is support available?", a: "Human support is active 10 AM - 10 PM. Automated orders process 24/7." }
];

// --- SERVICES ---
const SYSTEM_INSTRUCTION = `You are the friendly AI Support Agent for 'Moholla BD Shop'. 
We sell digital goods like Netflix, Spotify, PUBG UC, etc.
Your goal is to help customers with:
1. Product information (prices, validity).
2. How to order (add to cart, pay via bKash/Nagad).
3. Order tracking guidance (tell them to go to the 'Track Order' tab).
4. General inquiries.

Keep your responses short, helpful, and polite. 
If asked about specific real-time order status, say you can't check real-time database but they can use the 'Track Order' page.
Language: English or Bengali (Banglish is okay).
`;

export const getGeminiResponse = async (
  message,
  history
) => {
  if (!process.env.API_KEY) {
    return "I'm sorry, my AI brain is missing an API Key. Please configure it.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    // Construct chat history format
    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};

// --- COMPONENTS ---

// Navbar
const Navbar = ({ 
  activeTab, setActiveTab, cartCount, openCart, user, openLogin, logout 
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center transform group-hover:rotate-0 rotate-3 transition-all duration-300">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent block leading-tight">
                MOHOLLA
              </span>
              <span className="text-xs text-primary font-semibold tracking-widest">
                BD SHOP
              </span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {['home', 'track', 'support'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-medium transition-all ${
                  activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'home' ? 'Store' : tab === 'track' ? 'Track Order' : 'Support'}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={openCart} 
              className="relative p-2 hover:bg-white/5 rounded-full transition-colors group"
            >
              <ShoppingCart className="text-gray-400 group-hover:text-primary transition-colors w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#0B0F19]">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              {user ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="flex items-center gap-2 group"
                  >
                     <img 
                       src={user.avatar} 
                       alt="Avatar" 
                       className="w-8 h-8 rounded-full border border-primary/50 group-hover:border-primary transition-colors object-cover" 
                     />
                     <span className="text-sm font-medium hidden sm:block text-gray-300 group-hover:text-white transition-colors">
                       {user.name.split(' ')[0]}
                     </span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={openLogin} 
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4" /> Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#05080f] border-t border-white/5 pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              MOHOLLA BD SHOP
            </p>
            <p className="text-gray-500 text-sm">Most trusted digital service platform in Bangladesh</p>
          </div>
          
          <div className="flex gap-4">
            <a 
              href={SOCIAL_LINKS.discord} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 p-3 rounded-full hover:bg-[#5865F2] hover:text-white text-gray-400 transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
            </a>
            <a 
              href={SOCIAL_LINKS.telegram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 p-3 rounded-full hover:bg-[#24A1DE] hover:text-white text-gray-400 transition-all"
            >
              <Send className="w-5 h-5" />
            </a>
            <a 
              href={SOCIAL_LINKS.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 p-3 rounded-full hover:bg-blue-600 hover:text-white text-gray-400 transition-all"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-gray-400 text-sm">
            <button className="hover:text-white transition-colors">Terms & Conditions</button>
            <button className="hover:text-white transition-colors">Refund Policy</button>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 text-xs mb-1">
              &copy; {new Date().getFullYear()} Moholla BD Shop. All rights reserved.
            </p>
            <p className="text-gray-700 text-[10px] flex items-center justify-center md:justify-end gap-1">
              <Code className="w-3 h-3" /> Developed by <span className="text-primary">Gemini Engineer</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ChatWidget
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Assalamu Alaikum! Welcome to Moholla BD Shop. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    const reply = await getGeminiResponse(userText, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-[#131926] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Moholla Support AI</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F19]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-slate-800 text-gray-200 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-[#131926] border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for help..." 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:border-primary outline-none transition-colors"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-secondary p-2 rounded-full text-white hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-110"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

// ProductModal
const ProductModal = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#131926] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row animate-fade-in-up">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 bg-black/40 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-1/2 bg-black relative">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131926] via-transparent to-transparent md:bg-gradient-to-r"></div>
        </div>

        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          <div className="mb-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase mb-4">
              {product.category}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{product.title}</h2>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                ৳{product.price}
              </span>
              <span className="text-lg text-gray-600 line-through mb-1">
                ৳{product.originalPrice}
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8">
              {product.description}
            </p>
            <div className="bg-slate-900/50 p-5 rounded-xl border border-white/5 mb-8">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-primary" /> How to Order:
              </h4>
              <ul className="space-y-2">
                {product.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-400">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/10">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button 
            onClick={() => {
              onAddToCart(product);
              onClose();
            }} 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// CartModal
const CartModal = ({ cart, onClose, onRemove, onClear, user, addOrder, notify }) => {
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [email, setEmail] = useState(user?.email || '');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    const newOrder = {
      id: 'MBD-' + Math.floor(1000 + Math.random() * 9000),
      items: [...cart],
      total,
      email,
      paymentMethod,
      transactionId: trxId,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      userId: user ? user.id : null
    };

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Discord Notification
    try {
      const embed = {
        title: `New Order: #${newOrder.id}`,
        color: 5763719,
        fields: [
          { name: "Customer", value: email, inline: true },
          { name: "Total", value: `৳${total}`, inline: true },
          { name: "Payment", value: `${paymentMethod} (TrxID: ${trxId})`, inline: false },
          { name: "Items", value: newOrder.items.map(i => `${i.title} (x${i.quantity})`).join('\n'), inline: false }
        ],
        timestamp: new Date().toISOString()
      };
      
      await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [embed] })
      });
    } catch (err) {
      console.error("Webhook failed", err);
    }

    addOrder(newOrder);
    onClear();
    notify(`Order #${newOrder.id} placed successfully!`, 'success');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[#131926] shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-primary w-6 h-6" /> Your Cart
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
              <p>Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-primary font-bold text-sm">Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-slate-900/50 p-3 rounded-xl flex gap-4 border border-white/5">
                <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-white truncate">{item.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary text-sm font-bold">৳{item.price} x {item.quantity}</span>
                    <button 
                      onClick={() => onRemove(item.id)} 
                      className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="border-t border-white/10 pt-6 mt-4 pb-20">
              <div className="flex justify-between text-white font-bold text-xl mb-6">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('bKash')}
                      className={`p-3 rounded-xl border text-center transition-all font-bold ${
                        paymentMethod === 'bKash' 
                        ? 'border-secondary bg-secondary/20 text-white' 
                        : 'border-slate-700 bg-slate-900 text-gray-400'
                      }`}
                    >
                      bKash
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPaymentMethod('Nagad')}
                      className={`p-3 rounded-xl border text-center transition-all font-bold ${
                        paymentMethod === 'Nagad' 
                        ? 'border-orange-500 bg-orange-500/20 text-white' 
                        : 'border-slate-700 bg-slate-900 text-gray-400'
                      }`}
                    >
                      Nagad
                    </button>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl text-sm text-gray-300 border border-white/5 text-center shadow-inner">
                    Send Money to: <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10 ml-2 select-all">01757382315</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Delivery Email" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                  />
                  <input 
                    type="text" 
                    required 
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Transaction ID (TrxID)" 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none transition-colors"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isSubmitting ? <span className="animate-spin-slow h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : <CreditCard className="w-4 h-4" />}
                  {isSubmitting ? 'Processing...' : 'Confirm Order'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// LoginModal
const LoginModal = ({ onClose, onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    
    const mockUser = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      provider: 'email'
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#131926] p-8 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl animate-fade-in-up">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <p className="text-gray-400 text-sm mt-2">Enter your details to access your profile</p>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="Ex: Rahim Ahmed" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              placeholder="Ex: rahim@example.com" 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white font-bold py-3 rounded-xl text-sm transition-all transform hover:-translate-y-0.5"
          >
            Access Account
          </button>
        </form>
      </div>
    </div>
  );
};

// --- VIEWS ---

// Home
const Home = ({ onViewProduct, onSwitchTab }) => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative border-b border-white/5 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-fade-in-up">
            <Star className="w-3 h-3 fill-current" /> #1 Trusted Digital Shop
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight animate-fade-in-up">
            Best Prices for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Premium Subscriptions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-400 mb-10 animate-fade-in-up delay-100">
            Get Netflix, Spotify, Game Top-ups, and Premium Tools instantly. Automated delivery and 24/7 support.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-200">
            <button 
              onClick={() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1"
            >
              Shop Now
            </button>
            <button 
              onClick={() => onSwitchTab('track')}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/10 transition-all"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map(product => (
            <div key={product.id} className="group relative bg-[#131926] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#131926] to-transparent z-10 opacity-60"></div>
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <span className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  {product.category}
                </span>
              </div>
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
                  onClick={() => onViewProduct(product)}
                  className="w-full bg-slate-800 hover:bg-primary text-white font-bold py-3 rounded-xl border border-white/5 hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  View Details & Order <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#131926] border-t border-white/5 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-900 rounded-xl border border-white/5 overflow-hidden transition-all">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`text-gray-400 w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// OrderTracking
const OrderTracking = ({ orders }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    const found = orders.find(o => o.id === code.trim() || o.id === `MBD-${code.trim()}`);
    setResult(found || 'not-found');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 min-h-[60vh]">
      <div className="bg-[#131926] border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl animate-fade-in-up">
        <Package className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Track Your Order</h2>
        <p className="text-gray-400 mb-8">Enter your Order Code (e.g., MBD-5829) below to check status.</p>
        
        <form onSubmit={handleTrack} className="flex gap-2 max-w-md mx-auto mb-10">
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Order Code" 
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary" 
          />
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            Check
          </button>
        </form>

        {result === 'not-found' && (
          <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
            Order not found. Please check the code and try again.
          </div>
        )}

        {result && result !== 'not-found' && (
          <div className="mt-8 bg-slate-900/50 rounded-xl p-6 border border-white/5 text-left animate-fade-in-up">
            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Order #{result.id}</h3>
                <p className="text-sm text-gray-400">{result.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {result.status}
              </span>
            </div>
            <div className="space-y-2">
              {result.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.title} (x{item.quantity})</span>
                  <span className="text-white font-medium">৳{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-2 border-t border-white/5 font-bold">
                <span className="text-white">Total Payment</span>
                <span className="text-primary">৳{result.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Support
const Support = ({ notify, addTicket, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const ticket = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      name: formData.get('name'),
      email: formData.get('email'),
      department: formData.get('department'),
      priority: formData.get('priority'),
      issue: formData.get('issue'),
      status: 'Open',
      date: new Date().toLocaleDateString(),
      userId: user?.id
    };

    // Color coding for Discord Embed
    const priorityColors = {
      'Low': 5025616, // Green
      'Medium': 16753920, // Orange
      'High': 15548997 // Red
    };

    // Discord Support Webhook Payload
    try {
      const embed = {
        title: `🎫 New Ticket #${ticket.id}`,
        description: ticket.issue,
        color: priorityColors[ticket.priority] || 5025616,
        fields: [
          { name: "👤 Customer", value: `**${ticket.name}**\n${ticket.email}`, inline: true },
          { name: "📂 Department", value: ticket.department, inline: true },
          { name: "⚡ Priority", value: ticket.priority, inline: true },
        ],
        footer: {
          text: "Moholla BD Shop • Automated Support System",
        },
        timestamp: new Date().toISOString()
      };

      await fetch(DISCORD_WEBHOOK_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ embeds: [embed] }) 
      });

      // Save to local app state
      addTicket(ticket);

      notify(`Ticket #${ticket.id} submitted! Check your profile or Discord for updates.`, 'success');
      form.reset();
    } catch (error) {
       console.error(error);
       notify('Connection failed. Please use our Discord server directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Support Center</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Need assistance? Submit a ticket below or reach out via our social channels.
          Our team is active from 10:00 AM to 10:00 PM daily.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Ticket Form Section - Placed First (Top/Left) */}
        <div className="lg:col-span-2 bg-[#131926] p-6 md:p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden order-1 animate-fade-in-up delay-100">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>

           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                  <TicketIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Open a Support Ticket</h3>
                  <p className="text-xs text-gray-400">We usually respond within 30 minutes during work hours.</p>
                </div>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Name</label>
                    <input type="text" name="name" defaultValue={user?.name || ''} required className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-secondary outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Email</label>
                    <input type="email" name="email" defaultValue={user?.email || ''} required className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-secondary outline-none transition-colors" placeholder="email@example.com" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Department</label>
                    <div className="relative">
                      <select name="department" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-secondary outline-none appearance-none transition-colors cursor-pointer">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Order Support">Order Support</option>
                        <option value="Product Issue">Product Issue</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Priority</label>
                    <div className="relative">
                      <select name="priority" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-secondary outline-none appearance-none transition-colors cursor-pointer">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Issue Details</label>
                  <textarea name="issue" required rows={5} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:border-secondary outline-none resize-none transition-colors" placeholder="Please describe your issue in detail so we can help you faster..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <TicketIcon className="w-5 h-5" />}
                  {isSubmitting ? 'Submitting Ticket...' : 'Create Ticket'}
                </button>
             </form>
           </div>
        </div>

        {/* Social Links Section - Placed Second (Sidebar/Bottom) */}
        <div className="lg:col-span-1 space-y-6 order-2 animate-fade-in-up delay-200">
           <div className="bg-[#131926] p-6 rounded-2xl border border-white/10 shadow-lg">
             <h3 className="text-lg font-bold text-white mb-4">Quick Connect</h3>
             <div className="space-y-3">
               <a 
                  href={SOCIAL_LINKS.discord}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#5865F2]/10 p-4 rounded-xl border border-[#5865F2]/20 flex items-center gap-4 hover:bg-[#5865F2] hover:text-white group transition-all"
               >
                  <Gamepad2 className="w-6 h-6 text-[#5865F2] group-hover:text-white transition-colors" />
                  <div>
                    <h4 className="font-bold text-white">Discord</h4>
                    <p className="text-xs text-gray-400 group-hover:text-white/80">Join Community</p>
                  </div>
               </a>
               <a 
                  href={SOCIAL_LINKS.telegram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#24A1DE]/10 p-4 rounded-xl border border-[#24A1DE]/20 flex items-center gap-4 hover:bg-[#24A1DE] hover:text-white group transition-all"
               >
                  <Send className="w-6 h-6 text-[#24A1DE] group-hover:text-white transition-colors" />
                  <div>
                    <h4 className="font-bold text-white">Telegram</h4>
                    <p className="text-xs text-gray-400 group-hover:text-white/80">Get Updates</p>
                  </div>
               </a>
             </div>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 mb-3">
               <MessageCircleQuestion className="w-5 h-5 text-primary" />
               <h3 className="text-sm font-bold text-white">Common Questions</h3>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed mb-4">
               Before creating a ticket, check our FAQ section for instant answers about payments, delivery time, and refunds.
             </p>
             <button className="text-xs font-bold text-primary hover:text-white transition-colors flex items-center gap-1">
               Read FAQs
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Profile
const Profile = ({ user, orders, tickets, onLogout, notify }) => {
  const userOrders = orders.filter(o => o.userId === user.id);
  const userTickets = tickets.filter(t => t.userId === user.id);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify('Copied to clipboard!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-[#131926] rounded-2xl border border-white/10 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
          <button 
            onClick={onLogout} 
            className="absolute top-4 right-4 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-end -mt-12 mb-12 gap-6">
             <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#131926] bg-slate-800 object-cover" />
             <div className="mb-2">
               <h2 className="text-2xl font-bold text-white">{user.name}</h2>
               <p className="text-gray-400 text-sm flex items-center gap-2">
                 {user.email} 
                 <span className="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] uppercase tracking-wider">
                   {user.provider}
                 </span>
               </p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Orders Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" /> Order History
              </h3>
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-slate-900/30 rounded-xl border border-white/5 border-dashed">
                    No orders found.
                  </div>
                ) : (
                  userOrders.map(order => (
                    <div key={order.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col justify-between items-start gap-2 hover:border-white/10 transition-colors">
                      <div className="w-full flex justify-between items-start">
                        <div className="font-bold text-white flex items-center gap-2">
                          #{order.id} 
                          <button 
                            onClick={() => copyToClipboard(order.id)} 
                            className="text-primary hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 w-full truncate">
                        {order.items.map(i => i.title).join(', ')}
                      </div>
                      <div className="w-full flex justify-between items-end border-t border-white/5 pt-2 mt-1">
                        <span className="text-xs text-gray-500">{order.date}</span>
                        <span className="font-bold text-primary">৳{order.total}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Support Tickets Section */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-secondary" /> Support Tickets
              </h3>
              <div className="space-y-4">
                {userTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-slate-900/30 rounded-xl border border-white/5 border-dashed">
                    No active tickets.
                  </div>
                ) : (
                  userTickets.map(ticket => (
                    <div key={ticket.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-2 hover:border-white/10 transition-colors group">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500 font-mono">#{ticket.id}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ticket.status === 'Open' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-sm truncate pr-2" title={ticket.issue}>
                        {ticket.issue}
                      </h4>
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/5">{ticket.department}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ticket.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP ---

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  // UI State
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Show announcement after mount
    const timer = setTimeout(() => setShowAnnouncement(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const notify = (msg, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    notify(`${product.title} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const addOrder = (order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addTicket = (ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleLogin = (newUser) => {
    setUser(newUser);
    notify(`Welcome, ${newUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
    notify('Logged out successfully.');
  };

  // Render view based on activeTab
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Home onViewProduct={setActiveProduct} onSwitchTab={(tab) => setActiveTab(tab)} />;
      case 'track':
        return <OrderTracking orders={orders} />;
      case 'support':
        return <Support notify={notify} addTicket={addTicket} user={user} />;
      case 'profile':
        if (!user) {
          setActiveTab('home');
          return null;
        }
        return <Profile user={user} orders={orders} tickets={tickets} onLogout={handleLogout} notify={notify} />;
      default:
        return <Home onViewProduct={setActiveProduct} onSwitchTab={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 border backdrop-blur-md text-white flex items-center gap-2 animate-fade-in-up pointer-events-auto ${
              n.type === 'success' ? 'bg-green-600/90 border-green-400' : 'bg-red-600/90 border-red-400'
            }`}
          >
            {n.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{n.msg}</span>
          </div>
        ))}
      </div>

      {/* Announcement Bar - Transparent/Transmission Style */}
      {showAnnouncement && (
        <div className="relative z-50 bg-black/30 backdrop-blur-xl border-x border-b border-white/10 text-white text-xs sm:text-sm py-2 px-4 text-center font-bold shadow-2xl flex justify-between items-center max-w-7xl mx-auto rounded-b-xl animate-fade-in-up">
          <div className="flex-1 flex justify-center items-center gap-2">
            <Megaphone className="w-4 h-4 animate-pulse text-secondary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Special Offer! 10% Cashback on Netflix Premium. Limited time only.
            </span>
          </div>
          <button 
            onClick={() => setShowAnnouncement(false)} 
            className="ml-4 hover:bg-white/10 rounded-full p-1 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        openCart={() => setIsCartOpen(true)}
        user={user}
        openLogin={() => setIsLoginOpen(true)}
        logout={handleLogout}
      />

      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer />
      
      <ChatWidget />

      {/* Modals */}
      <ProductModal 
        product={activeProduct} 
        onClose={() => setActiveProduct(null)} 
        onAddToCart={addToCart} 
      />
      
      {isCartOpen && (
        <CartModal 
          cart={cart} 
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart} 
          onClear={clearCart}
          user={user}
          addOrder={addOrder}
          notify={notify}
        />
      )}

      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
}

// --- INDEX ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);