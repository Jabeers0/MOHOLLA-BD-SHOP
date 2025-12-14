import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.33.0";

// --- CONFIGURATION ---
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1449608850880593950/j_QHB0X5IxUJ3i9cbYg5xHzemIpbynuwbfws1mUiZPZQlJfK5SzxyChQ3pPSmsIk5-rd"; // Add your Discord Webhook URL here
const API_KEY = "AIzaSyDdBvu20lZDi94Ln_jOLbXs2PTRGxpxOZw"; // NOTE: In a real vanilla app, don't expose keys. This is for demo.

// --- DATA ---
const PRODUCTS = [
  {
    id: '1',
    title: 'নেটফ্লিক্স প্রিমিয়াম (4K) - ১ স্ক্রিন',
    category: 'স্ট্রিমিং',
    price: 350,
    originalPrice: 450,
    description: 'প্রাইভেট প্রোফাইল, 4K আল্ট্রা এইচডি। ১ মাসের গ্যারান্টি সহ। পিন সেট করা যাবে।',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop',
    instructions: ['"Add to Cart" এ ক্লিক করুন', 'Checkout পেজে যান', 'বিকাশ/নগদ এর মাধ্যমে ৩৫০ টাকা পাঠান', 'আপনার ইমেইল এবং TrxID দিন', 'মেইলে সাথে সাথে লগইন ডিটেইলস পাবেন']
  },
  {
    id: '2',
    title: 'স্পটিফাই প্রিমিয়াম - ইন্ডিভিজুয়াল',
    category: 'মিউজিক',
    price: 150,
    originalPrice: 200,
    description: 'আপনার নিজের ইমেইলে আপগ্রেড। কোনো অ্যাড নেই, অফলাইন ডাউনলোড করা যাবে। ১ মাস মেয়াদ।',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1000&auto=format&fit=crop',
    instructions: ['অর্ডার করার সময় আপনার স্পটিফাই ইমেইল দিন', 'পেমেন্ট কমপ্লিট করুন', 'আমরা আপনার মেইলে ইনভাইট লিংক পাঠাবো', 'লিংকে ক্লিক করে প্রিমিয়াম চালু করুন']
  },
  {
    id: '3',
    title: 'পাবজি মোবাইল - ৬৬০ ইউসি',
    category: 'গেমিং',
    price: 950,
    originalPrice: 1050,
    description: 'প্লেয়ার আইডি দিয়ে সরাসরি টপ-আপ। গ্লোবাল সার্ভার। ৫-১০ মিনিটে ডেলিভারি।',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    instructions: ['আপনার পাবজি প্লেয়ার আইডি কপি করুন', 'চেকআউটে প্লেয়ার আইডি দিন', 'পেমেন্ট সম্পন্ন করুন', 'কিছুক্ষণের মধ্যে অ্যাকাউন্টে ইউসি চলে যাবে']
  },
  {
    id: '4',
    title: 'নর্ড ভিপিএন প্রিমিয়াম - ১ মাস',
    category: 'সিকিউরিটি',
    price: 250,
    originalPrice: 500,
    description: 'হাই স্পিড সিকিউর ইন্টারনেট। শেয়ার্ড অ্যাকাউন্ট। পাসওয়ার্ড পরিবর্তন করা যাবে না।',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop',
    instructions: ['অর্ডার কনফার্ম করুন', 'ইমেইলে ইউজারনেম ও পাসওয়ার্ড পাবেন', 'লগইন করে কানেক্ট করুন', 'কোনো সমস্যা হলে সাপোর্টে জানান']
  },
  {
    id: '5',
    title: 'ক্যানভা প্রো - লাইফটাইম',
    category: 'টুলস',
    price: 99,
    originalPrice: 500,
    description: 'এডুকেশন টিম ইনভাইট। সব প্রো ফিচার আনলকড। আপনার পার্সোনাল ইমেইলে।',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    instructions: ['আপনার ক্যানভা ইমেইলটি দিন', 'আমরা একটি ইনভাইটেশন লিংক পাঠাবো', 'লিংকে ক্লিক করে টিমে জয়েন করুন', 'প্রো ফিচার উপভোগ করুন']
  },
  {
    id: '6',
    title: 'চ্যাটজিপিটি প্লাস (শেয়ার্ড)',
    category: 'এআই',
    price: 450,
    originalPrice: 2200,
    description: 'GPT-4 এক্সেস। শেয়ার্ড লগইন, ব্রাউজার প্রোফাইল সিস্টেমে ব্যবহার করতে হবে।',
    image: 'https://images.unsplash.com/photo-1680411636932-261559f5b244?q=80&w=1000&auto=format&fit=crop',
    instructions: ['কেনার পর লগইন ডিটেইলস পাবেন', 'নির্দিষ্ট ব্রাউজার প্রোফাইল ব্যবহার করুন', 'অন্য কারো চ্যাট ডিলিট করবেন না']
  }
];

const FAQS = [
  { q: "অর্ডার ডেলিভারি হতে কত সময় লাগে?", a: "সাধারণত ৫-১০ মিনিটের মধ্যে ডেলিভারি সম্পন্ন হয়। তবে সার্ভার সমস্যার কারণে সর্বোচ্চ ৩০ মিনিট সময় লাগতে পারে।" },
  { q: "কিভাবে পেমেন্ট করবো?", a: "বিকাশ বা নগদ এর 'Send Money' অপশন ব্যবহার করে আমাদের নাম্বারে টাকা পাঠাতে হবে এবং ট্রানজেকশন আইডি দিতে হবে।" },
  { q: "রিফান্ড পলিসি কি?", a: "যদি পণ্য কাজ না করে বা আমরা ডেলিভারি দিতে ব্যর্থ হই, তবে পূর্ণ রিফান্ড পাবেন। ডিজিটাল পণ্যের ক্ষেত্রে ডেলিভারির পর সাধারণ রিফান্ড হয় না।" },
  { q: "সাপোর্ট কখন পাওয়া যায়?", a: "আমাদের হিউম্যান সাপোর্ট সকাল ১০টা থেকে রাত ১০টা পর্যন্ত একটিভ থাকে। তবে অর্ডার অটোমেটেড সিস্টেমে ২৪/৭ প্রসেস হয়।" }
];

// --- STATE MANAGEMENT ---
const state = {
  user: null,
  cart: [],
  orders: [],
  activeTab: 'home',
  paymentMethod: 'bKash',
  chatMessages: [{ role: 'model', text: 'আসসালামু আলাইকুম! মহল্লা বিডি শপে আপনাকে স্বাগতম। আমি কিভাবে সাহায্য করতে পারি?' }]
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  lucide.createIcons();
  
  // Announcement
  const announcementBar = document.getElementById('announcement-bar');
  const closeAnnouncement = document.getElementById('close-announcement');
  setTimeout(() => announcementBar.classList.remove('hidden'), 500);
  closeAnnouncement.addEventListener('click', () => announcementBar.classList.add('hidden'));
  
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Cart
  document.getElementById('cart-btn').addEventListener('click', openCartModal);

  // Chat
  const chatWindow = document.getElementById('chat-window');
  document.getElementById('toggle-chat').addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      renderChatMessages();
    }
  });
  document.getElementById('chat-form').addEventListener('submit', handleChatSubmit);
});

// --- RENDER FUNCTIONS ---
function renderApp() {
  renderAuth();
  renderMainContent();
  updateCartBadge();
}

function renderAuth() {
  const authContainer = document.getElementById('auth-section');
  if (state.user) {
    authContainer.innerHTML = `
      <button onclick="window.switchTab('profile')" class="flex items-center gap-2 group">
         <img src="${state.user.avatar}" alt="Avatar" class="w-8 h-8 rounded-full border border-primary/50 group-hover:border-primary transition-colors" />
         <span class="text-sm font-medium hidden sm:block group-hover:text-white transition-colors">${state.user.name.split(' ')[0]}</span>
      </button>
    `;
  } else {
    authContainer.innerHTML = `
      <button onclick="openLoginModal()" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-all flex items-center gap-2">
        <i data-lucide="user" class="w-4 h-4"></i> লগইন
      </button>
    `;
    lucide.createIcons();
  }
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const count = state.cart.reduce((a, b) => a + b.quantity, 0);
  if (count > 0) {
    badge.innerText = count;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function renderMainContent() {
  const main = document.getElementById('main-content');
  const tab = state.activeTab;

  // Update Nav Active State
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('text-white');
      btn.classList.remove('text-gray-400');
    } else {
      btn.classList.add('text-gray-400');
      btn.classList.remove('text-white');
    }
  });

  if (tab === 'home') {
    main.innerHTML = `
      <!-- Hero -->
      <div class="relative border-b border-white/5 bg-[#0B0F19]">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-fade-in-up">
            <i data-lucide="star" class="w-3 h-3 fill-current"></i> #১ বিশ্বস্ত ডিজিটাল শপ
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            সেরা দামে <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">প্রিমিয়াম সাবস্ক্রিপশন</span>
          </h1>
          <p class="max-w-2xl mx-auto text-base md:text-lg text-gray-400 mb-10">
            নেটফ্লিক্স, স্পটিফাই, গেমস টপ-আপ এবং প্রিমিয়াম টুলস নিন মুহূর্তেই। অটোমেটেড ডেলিভারি এবং ২৪/৭ সাপোর্ট।
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button onclick="document.getElementById('products-grid').scrollIntoView({behavior: 'smooth'})" class="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1">
              শপিং করুন
            </button>
            <button onclick="switchTab('track')" class="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/10 transition-all">
              অর্ডার ট্র্যাক করুন
            </button>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div id="products-grid" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          ${PRODUCTS.map(product => `
            <div class="group relative bg-[#131926] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.3)]">
              <div class="relative aspect-[16/9] overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-[#131926] to-transparent z-10 opacity-60"></div>
                <img src="${product.image}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <span class="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">${product.category}</span>
              </div>
              <div class="p-6 relative z-20">
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">${product.title}</h3>
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-2xl font-bold text-white">৳${product.price}</span>
                  <span class="text-sm text-gray-500 line-through">৳${product.originalPrice}</span>
                  <span class="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded ml-auto">
                    ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
                <button onclick="openProductModal('${product.id}')" class="w-full bg-slate-800 hover:bg-primary text-white font-bold py-3 rounded-xl border border-white/5 hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
                  বিস্তারিত ও অর্ডার <i data-lucide="chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- FAQ -->
      <div class="bg-[#131926] border-t border-white/5 py-20">
        <div class="max-w-4xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-white mb-4">সচরাচর জিজ্ঞাসা (FAQ)</h2>
          </div>
          <div class="space-y-4">
            ${FAQS.map((faq, i) => `
              <div class="bg-slate-900 rounded-xl border border-white/5 overflow-hidden transition-all">
                <button onclick="toggleFaq(${i})" class="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-white/5 transition-colors">
                  <span>${faq.q}</span>
                  <i data-lucide="chevron-down" id="faq-icon-${i}" class="text-gray-400 w-5 h-5 transition-transform"></i>
                </button>
                <div id="faq-ans-${i}" class="hidden p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                  ${faq.a}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } 
  else if (tab === 'track') {
    main.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-20">
        <div class="bg-[#131926] border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <i data-lucide="package" class="w-16 h-16 text-primary mx-auto mb-6"></i>
          <h2 class="text-3xl font-bold text-white mb-4">অর্ডার ট্র্যাক করুন</h2>
          <p class="text-gray-400 mb-8">আপনার অর্ডার কোড (যেমন: MBD-5829) নিচে দিয়ে স্ট্যাটাস চেক করুন।</p>
          <form onsubmit="handleTrackOrder(event)" class="flex gap-2 max-w-md mx-auto mb-10">
            <input type="text" id="track-input" placeholder="অর্ডার কোড দিন" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary" />
            <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">চেক করুন</button>
          </form>
          <div id="track-result"></div>
        </div>
      </div>
    `;
  }
  else if (tab === 'support') {
    main.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="grid md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-3xl font-bold text-white mb-4">সাপোর্ট সেন্টার</h2>
            <p class="text-gray-400 mb-8">আমরা সকাল ১০:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত এক্টিভ আছি। আমাদের AI বট ২৪/৭ সার্ভিস দেয়।</p>
            <div class="space-y-4">
              <div class="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer">
                 <div class="bg-[#5865F2]/20 p-3 rounded-lg text-[#5865F2]"><i data-lucide="gamepad-2" class="w-6 h-6"></i></div>
                 <div><h4 class="font-bold text-white">Discord</h4><p class="text-xs text-gray-400">ডিসকর্ড সার্ভারে জয়েন করুন</p></div>
              </div>
              <div class="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer">
                 <div class="bg-[#24A1DE]/20 p-3 rounded-lg text-[#24A1DE]"><i data-lucide="send" class="w-6 h-6"></i></div>
                 <div><h4 class="font-bold text-white">Telegram</h4><p class="text-xs text-gray-400">টেলিগ্রাম চ্যানেলে জয়েন করুন</p></div>
              </div>
            </div>
          </div>
          <div class="bg-[#131926] p-8 rounded-2xl border border-white/10 shadow-xl">
             <h3 class="text-xl font-bold text-white mb-6">টিকেট ওপেন করুন</h3>
             <form onsubmit="handleTicketSubmit(event)" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">নাম</label>
                  <input type="text" name="name" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">ইমেইল</label>
                  <input type="email" name="email" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-400 uppercase mb-1">সমস্যার বিবরণ</label>
                  <textarea name="issue" required rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none resize-none" placeholder="বিস্তারিত লিখুন..."></textarea>
                </div>
                <button type="submit" class="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg">টিকেট সাবমিট করুন</button>
             </form>
          </div>
        </div>
      </div>
    `;
  }
  else if (tab === 'profile') {
    if (!state.user) {
      switchTab('home'); 
      return;
    }
    const userOrders = state.orders.filter(o => o.userId === state.user.id);
    main.innerHTML = `
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="bg-[#131926] rounded-2xl border border-white/10 overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
            <button onclick="logout()" class="absolute top-4 right-4 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
              <i data-lucide="log-out" class="w-3 h-3"></i> লগআউট
            </button>
          </div>
          <div class="px-8 pb-8 relative">
            <div class="flex flex-col sm:flex-row items-end -mt-12 mb-6 gap-6">
               <img src="${state.user.avatar}" alt="Profile" class="w-24 h-24 rounded-full border-4 border-[#131926] bg-slate-800" />
               <div class="mb-2">
                 <h2 class="text-2xl font-bold text-white">${state.user.name}</h2>
                 <p class="text-gray-400 text-sm flex items-center gap-2">${state.user.email} <span class="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] uppercase tracking-wider">${state.user.provider}</span></p>
               </div>
            </div>
            <h3 class="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">অর্ডার হিস্টোরি</h3>
            <div class="space-y-4">
              ${userOrders.length === 0 ? '<div class="text-center py-8 text-gray-500">কোনো অর্ডার নেই।</div>' : userOrders.map(order => `
                <div class="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div class="font-bold text-white flex items-center gap-2">
                      #${order.id} 
                      <button onclick="copyToClipboard('${order.id}')" class="text-primary hover:text-white"><i data-lucide="copy" class="w-3 h-3"></i></button>
                      <span class="text-[10px] px-2 py-0.5 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}">${order.status}</span>
                    </div>
                    <div class="text-sm text-gray-400 mt-1">${order.items.map(i => i.title).join(', ')}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-primary">৳${order.total}</div>
                    <div class="text-xs text-gray-500">${order.date}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
  lucide.createIcons();
}

// --- GLOBAL FUNCTIONS (Attached to Window) ---
window.switchTab = (tab) => {
  state.activeTab = tab;
  renderMainContent();
  window.scrollTo(0, 0);
};

window.toggleFaq = (index) => {
  const ans = document.getElementById(`faq-ans-${index}`);
  ans.classList.toggle('hidden');
};

window.openProductModal = (id) => {
  const product = PRODUCTS.find(p => p.id === id);
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in-up";
  modal.innerHTML = `
     <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
     <div class="relative bg-[#131926] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row">
       <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 z-10 bg-black/40 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
       <div class="w-full md:w-1/2 bg-black relative">
         <img src="${product.image}" class="w-full h-full object-cover opacity-80" />
         <div class="absolute inset-0 bg-gradient-to-t from-[#131926] via-transparent to-transparent md:bg-gradient-to-r"></div>
       </div>
       <div class="flex-1 p-8 flex flex-col overflow-y-auto">
         <div class="mb-auto">
            <div class="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase mb-4">${product.category}</div>
            <h2 class="text-3xl font-bold text-white mb-2 leading-tight">${product.title}</h2>
            <div class="flex items-end gap-3 mb-6">
              <span class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">৳${product.price}</span>
              <span class="text-lg text-gray-600 line-through mb-1">৳${product.originalPrice}</span>
            </div>
            <p class="text-gray-300 leading-relaxed mb-8">${product.description}</p>
            <div class="bg-slate-900/50 p-5 rounded-xl border border-white/5 mb-8">
              <h4 class="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider"><i data-lucide="help-circle" class="w-4 h-4 text-primary"></i> যেভাবে অর্ডার করবেন:</h4>
              <ul class="space-y-2">
                ${product.instructions.map((inst, i) => `<li class="flex gap-3 text-sm text-gray-400"><span class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/10">${i + 1}</span><span>${inst}</span></li>`).join('')}
              </ul>
            </div>
         </div>
         <button onclick="addToCart('${product.id}'); this.closest('.fixed').remove()" class="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
           <i data-lucide="shopping-cart" class="w-5 h-5"></i> কার্টে যোগ করুন
         </button>
       </div>
     </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
};

window.addToCart = (id) => {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = state.cart.find(i => i.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  updateCartBadge();
  showNotification(`${product.title} কার্টে যোগ করা হয়েছে!`, 'success');
};

window.removeFromCart = (id) => {
  state.cart = state.cart.filter(item => item.id !== id);
  renderCartContent();
  updateCartBadge();
};

window.openCartModal = () => {
  const modal = document.createElement('div');
  modal.id = 'cart-modal';
  modal.className = "fixed inset-0 z-50 overflow-hidden";
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
    <div class="absolute inset-y-0 right-0 w-full max-w-md bg-[#131926] shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300">
      <div class="flex items-center justify-between p-6 border-b border-white/10">
        <h2 class="text-xl font-bold text-white flex items-center gap-2"><i data-lucide="shopping-cart" class="text-primary w-6 h-6"></i> কার্ট</h2>
        <button onclick="document.getElementById('cart-modal').remove()" class="text-gray-400 hover:text-white"><i data-lucide="x" class="w-6 h-6"></i></button>
      </div>
      <div id="cart-content" class="flex-1 overflow-y-auto p-6 space-y-4"></div>
    </div>
  `;
  document.body.appendChild(modal);
  renderCartContent();
  lucide.createIcons();
};

function renderCartContent() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-gray-500">
        <i data-lucide="shopping-cart" class="w-16 h-16 mb-4 opacity-10"></i>
        <p>আপনার কার্ট খালি</p>
        <button onclick="document.getElementById('cart-modal').remove(); switchTab('home')" class="mt-4 text-primary font-bold text-sm">শপিং করুন</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  container.innerHTML = `
    ${state.cart.map(item => `
      <div class="bg-slate-900/50 p-3 rounded-xl flex gap-4 border border-white/5">
        <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm text-white truncate">${item.title}</h4>
          <div class="flex items-center justify-between mt-2">
            <span class="text-primary text-sm font-bold">৳${item.price} x ${item.quantity}</span>
            <button onclick="removeFromCart('${item.id}')" class="p-1 text-red-400 hover:bg-red-400/10 rounded"><i data-lucide="x" class="w-3 h-3"></i></button>
          </div>
        </div>
      </div>
    `).join('')}
    
    <div class="border-t border-white/10 pt-6 mt-4">
      <div class="flex justify-between text-white font-bold text-xl mb-6"><span>মোট</span><span>৳${total}</span></div>
      <form onsubmit="handleCheckout(event)" class="space-y-4">
         <div class="space-y-2">
           <label class="text-xs text-gray-400 uppercase font-bold tracking-wider">পেমেন্ট মেথড</label>
           <div class="grid grid-cols-2 gap-3">
             <button type="button" onclick="setPayment('bKash')" id="btn-bkash" class="p-3 rounded-xl border text-center transition-all font-bold border-secondary bg-secondary/20 text-white">বিকাশ</button>
             <button type="button" onclick="setPayment('Nagad')" id="btn-nagad" class="p-3 rounded-xl border text-center transition-all font-bold border-slate-700 bg-slate-900 text-gray-400">নগদ</button>
           </div>
           <div class="bg-slate-900 p-4 rounded-xl text-sm text-gray-300 border border-white/5 text-center shadow-inner">
              টাকা পাঠান: <span class="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-white/10 ml-2">01757382315</span>
           </div>
         </div>
         <div class="space-y-3">
            <input type="email" id="checkout-email" required placeholder="আপনার ইমেইল (যেখানে ডেলিভারি যাবে)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none" />
            <input type="text" id="checkout-trx" required placeholder="ট্রানজেকশন আইডি (TrxID)" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none" />
         </div>
         <button type="submit" class="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5">
            <i data-lucide="credit-card" class="w-4 h-4"></i> অর্ডার কনফার্ম করুন
         </button>
      </form>
    </div>
  `;
  lucide.createIcons();
}

window.setPayment = (method) => {
  state.paymentMethod = method;
  const btnBkash = document.getElementById('btn-bkash');
  const btnNagad = document.getElementById('btn-nagad');
  
  if (method === 'bKash') {
    btnBkash.className = "p-3 rounded-xl border text-center transition-all font-bold border-secondary bg-secondary/20 text-white";
    btnNagad.className = "p-3 rounded-xl border text-center transition-all font-bold border-slate-700 bg-slate-900 text-gray-400";
  } else {
    btnNagad.className = "p-3 rounded-xl border text-center transition-all font-bold border-orange-500 bg-orange-500/20 text-white";
    btnBkash.className = "p-3 rounded-xl border text-center transition-all font-bold border-slate-700 bg-slate-900 text-gray-400";
  }
};

window.handleCheckout = async (e) => {
  e.preventDefault();
  const email = document.getElementById('checkout-email').value;
  const trx = document.getElementById('checkout-trx').value;
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder = {
    id: 'MBD-' + Math.floor(1000 + Math.random() * 9000),
    items: [...state.cart],
    total: total,
    email: email,
    paymentMethod: state.paymentMethod,
    transactionId: trx,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    userId: state.user ? state.user.id : null
  };

  // Discord Integration
  if (DISCORD_WEBHOOK_URL) {
      const embed = {
        title: `New Order: #${newOrder.id}`,
        color: 5763719,
        fields: [
          { name: "Customer", value: email, inline: true },
          { name: "Total", value: `৳${total}`, inline: true },
          { name: "Payment", value: `${newOrder.paymentMethod} (TrxID: ${trx})`, inline: false },
          { name: "Items", value: newOrder.items.map(i => `${i.title} (x${i.quantity})`).join('\n'), inline: false }
        ],
        timestamp: new Date().toISOString()
      };
      fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [embed] })
      }).catch(err => console.error(err));
  }

  state.orders.unshift(newOrder);
  state.cart = [];
  updateCartBadge();
  document.getElementById('cart-modal').remove();
  showSuccessModal(newOrder);
};

function showSuccessModal(order) {
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-[60] flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
    <div class="relative bg-[#131926] p-8 rounded-2xl w-full max-w-md border border-primary/50 shadow-[0_0_50px_-12px_rgba(124,58,237,0.5)] text-center animate-fade-in-up">
       <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
       <div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400"><i data-lucide="check-circle" class="w-8 h-8"></i></div>
       <h2 class="text-2xl font-bold text-white mb-2">অর্ডার সফল হয়েছে!</h2>
       <p class="text-gray-400 mb-6 text-sm">আপনার অর্ডারের বিস্তারিত তথ্য ইমেইলে পাঠানো হয়েছে।</p>
       <div class="bg-slate-900 rounded-xl p-4 border border-white/10 mb-6">
         <p class="text-xs text-gray-500 uppercase font-bold mb-1">অর্ডার কোড</p>
         <div class="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2 border border-white/5">
           <span class="font-mono text-xl text-primary font-bold tracking-wider">${order.id}</span>
           <button onclick="copyToClipboard('${order.id}')" class="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><i data-lucide="copy" class="w-5 h-5"></i></button>
         </div>
       </div>
       <div class="space-y-3">
         <button onclick="this.parentElement.parentElement.remove(); switchTab('track')" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl border border-white/10 transition-colors">অর্ডার ট্র্যাক করুন</button>
         <button onclick="this.parentElement.parentElement.remove()" class="w-full text-gray-500 hover:text-white py-2 text-sm">বন্ধ করুন</button>
       </div>
    </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
}

// --- UTILS ---
window.copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  showNotification('কপি করা হয়েছে!', 'success');
};

window.showNotification = (msg, type) => {
  const container = document.getElementById('notification-container');
  const el = document.createElement('div');
  el.className = `fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 border ${type === 'success' ? 'bg-green-600/90 border-green-400' : 'bg-red-600/90 border-red-400'} backdrop-blur-md text-white flex items-center gap-2 animate-fade-in-up`;
  el.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'x'}" class="w-5 h-5"></i><span class="font-medium">${msg}</span>`;
  container.appendChild(el);
  lucide.createIcons();
  setTimeout(() => el.remove(), 3000);
};

// --- AUTH ---
window.openLoginModal = () => {
  const modal = document.createElement('div');
  modal.id = 'login-modal';
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
    <div class="relative bg-[#131926] p-8 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
       <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
       <h2 class="text-2xl font-bold text-center text-white mb-6">স্বাগতম</h2>
       <div class="space-y-3">
         <button onclick="login('google')" class="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
            <!-- Google SVG -->
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google দিয়ে লগইন
         </button>
         <button onclick="login('discord')" class="w-full bg-[#5865F2] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-[#4752C4] transition-colors"><i data-lucide="gamepad-2" class="w-5 h-5"></i> Discord দিয়ে লগইন</button>
       </div>
       <div class="relative my-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div><div class="relative flex justify-center text-xs"><span class="bg-[#131926] px-2 text-gray-500">অথবা ম্যানুয়াল লগইন</span></div></div>
       <form onsubmit="handleManualLogin(event)" class="space-y-3">
          <input type="text" id="login-name" required placeholder="আপনার নাম" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-secondary outline-none" />
          <input type="email" id="login-email" required placeholder="আপনার ইমেইল" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-secondary outline-none" />
          <button type="submit" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-sm transition-colors border border-white/10">একাউন্টে প্রবেশ করুন</button>
       </form>
    </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
};

window.login = (provider) => {
  const mockUser = {
    id: 'u-' + Math.random().toString(36).substr(2, 9),
    name: provider === 'google' ? 'Google User' : 'Discord User',
    email: `user@${provider}.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
    provider: provider
  };
  state.user = mockUser;
  document.getElementById('login-modal').remove();
  renderAuth();
  if (state.activeTab === 'profile') renderMainContent();
  showNotification('লগইন সফল হয়েছে!', 'success');
};

window.handleManualLogin = (e) => {
  e.preventDefault();
  const name = document.getElementById('login-name').value;
  const email = document.getElementById('login-email').value;
  state.user = {
    id: 'u-' + Math.random().toString(36).substr(2, 9),
    name,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    provider: 'email'
  };
  document.getElementById('login-modal').remove();
  renderAuth();
  if (state.activeTab === 'profile') renderMainContent();
  showNotification(`স্বাগতম, ${name}!`, 'success');
};

window.logout = () => {
  state.user = null;
  switchTab('home');
  renderAuth();
  showNotification('লগআউট সফল হয়েছে', 'success');
};

// --- SUPPORT & TRACKING ---
window.handleTicketSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const ticket = {
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    name: form.name.value,
    email: form.email.value,
    issue: form.issue.value
  };
  
  // Discord Support
  if (DISCORD_WEBHOOK_URL) {
    const embed = {
      title: `Support Ticket: #${ticket.id}`,
      color: 15548997,
      fields: [{ name: "User", value: `${ticket.name} (${ticket.email})`, inline: true }, { name: "Issue", value: ticket.issue, inline: false }]
    };
    fetch(DISCORD_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ embeds: [embed] }) }).catch(console.error);
  }

  showNotification('সাপোর্ট টিকেট পাঠানো হয়েছে!', 'success');
  form.reset();
};

window.handleTrackOrder = (e) => {
  e.preventDefault();
  const code = document.getElementById('track-input').value.trim();
  const order = state.orders.find(o => o.id === code || o.id === `MBD-${code}`);
  const resultDiv = document.getElementById('track-result');
  
  if (order) {
    resultDiv.innerHTML = `
      <div class="mt-8 bg-slate-900/50 rounded-xl p-6 border border-white/5 text-left animate-fade-in-up">
        <div class="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
          <div><h3 class="text-xl font-bold text-white">অর্ডার #${order.id}</h3><p class="text-sm text-gray-400">${order.date}</p></div>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">${order.status}</span>
        </div>
        <div class="space-y-2">
          ${order.items.map(item => `<div class="flex justify-between text-sm"><span class="text-gray-300">${item.title} (x${item.quantity})</span><span class="text-white font-medium">৳${item.price * item.quantity}</span></div>`).join('')}
          <div class="flex justify-between pt-2 mt-2 border-t border-white/5 font-bold"><span class="text-white">মোট পেমেন্ট</span><span class="text-primary">৳${order.total}</span></div>
        </div>
      </div>
    `;
  } else {
    showNotification('অর্ডার পাওয়া যায়নি', 'error');
    resultDiv.innerHTML = '';
  }
};

// --- CHAT & AI ---
window.handleChatSubmit = async (e) => {
  e.preventDefault();
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  state.chatMessages.push({ role: 'user', text });
  input.value = '';
  renderChatMessages();

  // Call Gemini
  if (API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const model = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: text,
        config: { systemInstruction: "You are the AI Support Agent for MOHOLLA BD SHOP. Help customers with orders, tracking, and product info. Keep it short and friendly." }
      });
      const response = await model;
      state.chatMessages.push({ role: 'model', text: response.text });
    } catch (err) {
      console.error(err);
      state.chatMessages.push({ role: 'model', text: "দুঃখিত, বর্তমানে সার্ভার ব্যস্ত আছে।" });
    }
  } else {
    // Fake response if no key
    setTimeout(() => {
       state.chatMessages.push({ role: 'model', text: "API Key সংযুক্ত করা হয়নি, তাই আমি উত্তর দিতে পারছি না।" });
       renderChatMessages();
    }, 1000);
  }
  renderChatMessages();
};

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = state.chatMessages.map(msg => `
    <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-800 text-gray-200 rounded-bl-none border border-white/5'}">
        ${msg.text}
      </div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

window.openPolicy = (type) => {
  // Simple alerts or small modals for policy. Implemented briefly for space.
  const titles = { terms: "শর্তাবলী", refund: "রিফান্ড পলিসি" };
  const texts = { 
    terms: "১. শেয়ার্ড অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন নিষেধ। ২. অবৈধ কাজে ব্যবহার নিষেধ।",
    refund: "১. ডিজিটাল পণ্যে রিফান্ড নেই যদি না পণ্যটি অকার্যকর হয়।"
  };
  
  const modal = document.createElement('div');
  modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
     <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
     <div class="relative bg-[#131926] p-8 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
       <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
       <h2 class="text-2xl font-bold text-white mb-4">${titles[type]}</h2>
       <p class="text-gray-300 leading-relaxed">${texts[type]}</p>
     </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
};
