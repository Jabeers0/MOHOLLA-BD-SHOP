import { GoogleGenAI } from "@google/genai";

// --- Constants & Data ---
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1449608850880593950/j_QHB0X5IxUJ3i9cbYg5xHzemIpbynuwbfws1mUiZPZQlJfK5SzxyChQ3pPSmsIk5-rd";

const SOCIAL_LINKS = {
  discord: "https://discord.com/",
  telegram: "https://telegram.org/"
};

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

// --- State ---
const state = {
  activeTab: 'home',
  user: JSON.parse(localStorage.getItem('moholla_user') || 'null'),
  cart: [],
  orders: JSON.parse(localStorage.getItem('moholla_orders') || '[]'),
  chatOpen: false,
  chatMessages: [{ role: 'model', text: 'আসসালামু আলাইকুম! মহল্লা বিডি শপে আপনাকে স্বাগতম। আমি কিভাবে সাহায্য করতে পারি?' }],
  ticketSubject: '',
  paymentMethod: 'bKash'
};

// --- DOM Elements ---
const mainContent = document.getElementById('main-content');
const desktopMenu = document.getElementById('desktop-menu');
const authSection = document.getElementById('auth-section');
const cartCountEl = document.getElementById('cart-count');
const productModal = document.getElementById('product-modal');
const cartModal = document.getElementById('cart-modal');
const chatWidget = document.getElementById('chat-widget');

// --- Main App Logic ---

function init() {
  renderNavbar();
  renderContent();
  renderChatWidget();
  updateIcons();
}

function saveState() {
  localStorage.setItem('moholla_user', JSON.stringify(state.user));
  localStorage.setItem('moholla_orders', JSON.stringify(state.orders));
}

function switchTab(tab) {
  state.activeTab = tab;
  renderNavbar();
  renderContent();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTicket(subject = '') {
  state.ticketSubject = subject;
  switchTab('support');
}

// --- Renderers ---

function updateIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderNavbar() {
  const tabs = [
    { id: 'home', label: 'স্টোর' },
    { id: 'track', label: 'অর্ডার ট্র্যাক করুন' },
    { id: 'support', label: 'হেল্প ও টিকেট', icon: 'life-buoy' },
    { id: 'admin', label: 'এডমিন', icon: 'shield-check', color: 'secondary' }
  ];

  desktopMenu.innerHTML = tabs.map(tab => `
    <button 
      onclick="window.app.switchTab('${tab.id}')"
      class="text-sm font-medium transition-all flex items-center gap-2 ${state.activeTab === tab.id 
        ? (tab.color ? 'text-secondary' : 'text-white') 
        : 'text-gray-400 hover:text-white'}"
    >
      ${tab.icon ? `<i data-lucide="${tab.icon}" class="w-4 h-4"></i>` : ''} ${tab.label}
    </button>
  `).join('');

  if (state.user) {
    authSection.innerHTML = `
      <button onclick="window.app.switchTab('profile')" class="flex items-center gap-2 group">
        <img src="${state.user.avatar}" class="w-8 h-8 rounded-full border border-primary/50 group-hover:border-primary transition-colors" />
        <span class="text-sm font-medium hidden sm:block text-gray-300 group-hover:text-white transition-colors">
          ${state.user.name.split(' ')[0]}
        </span>
      </button>
    `;
  } else {
    authSection.innerHTML = `
      <button onclick="window.app.handleLogin('google')" class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition-all flex items-center gap-2">
        <i data-lucide="user" class="w-4 h-4"></i> লগইন
      </button>
    `;
  }

  const count = state.cart.reduce((a, b) => a + b.quantity, 0);
  if (count > 0) {
    cartCountEl.innerText = count;
    cartCountEl.classList.remove('hidden');
  } else {
    cartCountEl.classList.add('hidden');
  }
  updateIcons();
}

function renderContent() {
  mainContent.innerHTML = '';
  switch (state.activeTab) {
    case 'home': renderHome(); break;
    case 'track': renderTrack(); break;
    case 'support': renderSupport(); break;
    case 'admin': renderAdmin(); break;
    case 'profile': renderProfile(); break;
  }
  updateIcons();
}

function renderHome() {
  mainContent.innerHTML = `
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
          <button onclick="document.getElementById('products').scrollIntoView({ behavior: 'smooth' })" class="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-1">
            শপিং করুন
          </button>
          <button onclick="window.app.switchTab('track')" class="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-white/10 transition-all">
            অর্ডার ট্র্যাক করুন
          </button>
        </div>
      </div>
    </div>

    <!-- Products -->
    <div id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        ${PRODUCTS.map((product, idx) => `
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
              <button onclick="window.app.openProductModal('${product.id}')" class="w-full bg-slate-800 hover:bg-primary text-white font-bold py-3 rounded-xl border border-white/5 hover:border-primary transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20">
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
          <h2 className="text-3xl font-bold text-white mb-4">সচরাচর জিজ্ঞাসা (FAQ)</h2>
        </div>
        <div class="space-y-4">
          ${FAQS.map((faq, i) => `
            <div class="bg-slate-900 rounded-xl border border-white/5 overflow-hidden transition-all">
              <button onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180')" class="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:bg-white/5 transition-colors">
                <span>${faq.q}</span>
                <i data-lucide="chevron-down" class="chevron text-gray-400 w-5 h-5 transition-transform"></i>
              </button>
              <div class="hidden p-5 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 animate-fade-in-up">
                ${faq.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderTrack() {
  mainContent.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-20">
      <div class="bg-[#131926] border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
        <i data-lucide="package" class="w-16 h-16 text-primary mx-auto mb-6"></i>
        <h2 class="text-3xl font-bold text-white mb-4">অর্ডার ট্র্যাক করুন</h2>
        <p class="text-gray-400 mb-8">আপনার অর্ডার কোড (যেমন: MBD-5829) নিচে দিয়ে স্ট্যাটাস চেক করুন।</p>
        <form onsubmit="window.app.handleTrack(event)" class="flex gap-2 max-w-md mx-auto mb-10">
          <input type="text" id="track-input" placeholder="অর্ডার কোড দিন" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary outline-none focus:ring-1 focus:ring-primary" />
          <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold transition-colors">চেক করুন</button>
        </form>
        <div id="track-result"></div>
      </div>
    </div>
  `;
}

function handleTrack(e) {
  e.preventDefault();
  const input = document.getElementById('track-input').value.trim();
  const order = state.orders.find(o => o.id === input || o.id === `MBD-${input}`);
  const resultDiv = document.getElementById('track-result');

  if (!order) {
    resultDiv.innerHTML = '<div class="text-red-400">অর্ডার পাওয়া যায়নি</div>';
    return;
  }

  resultDiv.innerHTML = `
    <div class="mt-8 bg-slate-900/50 rounded-xl p-6 border border-white/5 text-left animate-fade-in-up">
      <div class="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
        <div><h3 class="text-xl font-bold text-white">অর্ডার #${order.id}</h3><p class="text-sm text-gray-400">${order.date}</p></div>
        <span class="px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}">${order.status}</span>
      </div>
      <div class="space-y-2 mb-4">
        ${order.items.map(item => `
          <div class="flex justify-between text-sm">
            <span class="text-gray-300">${item.title} (x${item.quantity})</span>
            <span class="text-white font-medium">৳${item.price * item.quantity}</span>
          </div>
        `).join('')}
        <div class="flex justify-between pt-2 mt-2 border-t border-white/5 font-bold">
          <span class="text-white">মোট পেমেন্ট</span>
          <span class="text-primary">৳${order.total}</span>
        </div>
      </div>
      <button onclick="window.app.openTicket('Problem with Order #${order.id}')" class="w-full py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/20 flex items-center justify-center gap-2 transition-colors">
        <i data-lucide="alert-circle" class="w-4 h-4"></i> সমস্যা রিপোর্ট করুন
      </button>
    </div>
  `;
  updateIcons();
}

function renderSupport() {
  mainContent.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h2 class="text-3xl font-bold text-white mb-4">হেল্প ও টিকেট</h2>
          <p class="text-gray-400 mb-8">আমরা সকাল ১০:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত এক্টিভ আছি। আমাদের AI বট ২৪/৭ সার্ভিস দেয়।</p>
          <div class="space-y-4">
            <a href="${SOCIAL_LINKS.discord}" target="_blank" class="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
              <div class="bg-[#5865F2]/20 p-3 rounded-lg text-[#5865F2] group-hover:bg-[#5865F2] group-hover:text-white transition-colors"><i data-lucide="gamepad-2" class="w-6 h-6"></i></div>
              <div><h4 class="font-bold text-white">Discord</h4><p class="text-xs text-gray-400">ডিসকর্ড সার্ভারে জয়েন করুন</p></div>
            </a>
            <a href="${SOCIAL_LINKS.telegram}" target="_blank" class="bg-[#131926] p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
              <div class="bg-[#24A1DE]/20 p-3 rounded-lg text-[#24A1DE] group-hover:bg-[#24A1DE] group-hover:text-white transition-colors"><i data-lucide="send" class="w-6 h-6"></i></div>
              <div><h4 class="font-bold text-white">Telegram</h4><p class="text-xs text-gray-400">টেলিগ্রাম চ্যানেলে জয়েন করুন</p></div>
            </a>
          </div>
        </div>
        <div class="bg-[#131926] p-8 rounded-2xl border border-white/10 shadow-xl">
          <div class="flex items-center gap-2 mb-6 text-white">
            <i data-lucide="ticket" class="w-6 h-6 text-secondary"></i>
            <h3 class="text-xl font-bold">টিকেট ওপেন করুন</h3>
          </div>
          <form onsubmit="window.app.handleSupportSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">নাম</label>
              <input type="text" name="name" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none" value="${state.user?.name || ''}" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">ইমেইল (রিপ্লাই এর জন্য)</label>
              <input type="email" name="email" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none" value="${state.user?.email || ''}" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1">সমস্যার বিবরণ</label>
              <textarea name="issue" required rows="4" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-secondary outline-none resize-none" placeholder="বিস্তারিত লিখুন...">${state.ticketSubject}</textarea>
            </div>
            <button type="submit" class="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
              <i data-lucide="life-buoy" class="w-4 h-4"></i> টিকেট সাবমিট করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

async function handleSupportSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: "New Support Ticket Received!",
        embeds: [{
          title: "🎫 New Support Ticket",
          color: 16711680,
          fields: [
            { name: "User", value: data.name, inline: true },
            { name: "Email", value: data.email, inline: true },
            { name: "Issue", value: data.issue }
          ]
        }]
      })
    });
    alert('টিকেট সাবমিট করা হয়েছে! আমরা আপনার ইমেইলে রিপ্লাই দিবো।');
    state.ticketSubject = '';
    e.target.reset();
  } catch (err) {
    alert('দুঃখিত, টিকেট পাঠানো যায়নি।');
  }
}

function renderAdmin() {
  const content = state.orders.length === 0 
    ? '<div class="text-gray-500 text-center py-10 bg-[#131926] rounded-xl">No orders found.</div>'
    : state.orders.map(order => `
      <div class="bg-[#131926] p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <span class="font-mono font-bold text-lg text-white">#${order.id}</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}">
              ${order.status}
            </span>
          </div>
          <div class="text-sm text-gray-400 mb-1">Customer: <span class="text-white">${order.email}</span></div>
          <div class="text-sm text-gray-400">Total: <span class="text-primary font-bold">৳${order.total}</span> | Method: ${order.paymentMethod} | Trx: ${order.transactionId}</div>
        </div>
        <div class="flex gap-2">
           ${order.status === 'Pending' ? `
              <button onclick="window.app.updateOrderStatus('${order.id}', 'Delivered')" class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"><i data-lucide="check" class="w-4 h-4"></i> Confirm</button>
              <button onclick="window.app.updateOrderStatus('${order.id}', 'Cancelled')" class="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-white/10"><i data-lucide="x" class="w-4 h-4"></i> Cancel</button>
           ` : `
             <div class="flex items-center gap-2 text-green-400 font-bold text-sm bg-green-400/10 px-4 py-2 rounded-lg"><i data-lucide="check-circle" class="w-4 h-4"></i> Completed</div>
           `}
        </div>
      </div>
    `).join('');

  mainContent.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-center gap-3 mb-8">
        <i data-lucide="shield" class="w-8 h-8 text-secondary"></i>
        <h2 class="text-3xl font-bold text-white">Admin Dashboard</h2>
      </div>
      <div class="grid gap-6">${content}</div>
    </div>
  `;
}

function updateOrderStatus(id, status) {
  state.orders = state.orders.map(o => o.id === id ? { ...o, status } : o);
  saveState();
  renderAdmin();
  updateIcons();
}

function renderProfile() {
  if (!state.user) {
    mainContent.innerHTML = '<div class="text-center py-20 text-white">Please login first</div>';
    return;
  }
  const userOrders = state.orders.filter(o => o.userId === state.user.id);
  
  mainContent.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-[#131926] rounded-2xl border border-white/10 overflow-hidden">
        <div class="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
          <button onclick="window.app.handleLogout()" class="absolute top-4 right-4 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
            <i data-lucide="log-out" class="w-3 h-3"></i> লগআউট
          </button>
        </div>
        <div class="px-8 pb-8 relative">
          <div class="flex flex-col sm:flex-row items-end -mt-12 mb-6 gap-6">
            <img src="${state.user.avatar}" class="w-24 h-24 rounded-full border-4 border-[#131926] bg-slate-800" />
            <div class="mb-2">
              <h2 class="text-2xl font-bold text-white">${state.user.name}</h2>
              <p class="text-gray-400 text-sm flex items-center gap-2">${state.user.email} <span class="px-2 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] uppercase tracking-wider">${state.user.provider}</span></p>
            </div>
          </div>
          <h3 class="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">অর্ডার হিস্টোরি</h3>
          <div class="space-y-4">
            ${userOrders.length === 0 ? '<div class="text-center py-8 text-gray-500">কোনো অর্ডার নেই।</div>' : userOrders.map(order => `
              <div class="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div class="font-bold text-white flex items-center gap-2">
                    #${order.id} 
                    <button onclick="navigator.clipboard.writeText('${order.id}'); alert('Copied!')" class="text-primary hover:text-white"><i data-lucide="copy" class="w-3 h-3"></i></button>
                    <span class="text-[10px] px-2 py-0.5 rounded-full ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}">${order.status}</span>
                  </div>
                  <div class="text-sm text-gray-400 mt-1">${order.items.map(i => i.title).join(', ')}</div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <div class="text-right">
                    <div class="font-bold text-primary">৳${order.total}</div>
                    <div class="text-xs text-gray-500">${order.date}</div>
                  </div>
                  <button onclick="window.app.openTicket('Problem with Order #${order.id}')" class="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 transition-colors">
                    <i data-lucide="alert-circle" class="w-3 h-3"></i> সমস্যা রিপোর্ট
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- Modals & Actions ---

function openProductModal(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  
  productModal.innerHTML = `
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="document.getElementById('product-modal').classList.add('hidden')"></div>
    <div class="relative bg-[#131926] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row animate-fade-in-up">
      <button onclick="document.getElementById('product-modal').classList.add('hidden')" class="absolute top-4 right-4 z-10 bg-black/40 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
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
            <h4 class="font-bold text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
              <i data-lucide="check-circle" class="w-4 h-4 text-primary"></i> যেভাবে অর্ডার করবেন:
            </h4>
            <ul class="space-y-2">
              ${product.instructions.map((inst, i) => `<li class="flex gap-3 text-sm text-gray-400"><span class="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-white/10">${i+1}</span><span>${inst}</span></li>`).join('')}
            </ul>
          </div>
        </div>
        <button onclick="window.app.addToCart('${product.id}')" class="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
          <i data-lucide="shopping-cart" class="w-5 h-5"></i> কার্টে যোগ করুন
        </button>
      </div>
    </div>
  `;
  productModal.classList.remove('hidden');
  updateIcons();
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = state.cart.find(p => p.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  productModal.classList.add('hidden');
  renderNavbar();
}

function toggleCart() {
  const isHidden = cartModal.classList.contains('hidden');
  if (isHidden) {
    renderCartModal();
    cartModal.classList.remove('hidden');
  } else {
    cartModal.classList.add('hidden');
  }
}

function renderCartModal() {
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartModal.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="document.getElementById('cart-modal').classList.add('hidden')"></div>
    <div class="absolute inset-y-0 right-0 w-full max-w-md bg-[#131926] shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300 animate-fade-in-up sm:animate-none">
      <div class="flex items-center justify-between p-6 border-b border-white/10">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <i data-lucide="shopping-cart" class="text-primary w-6 h-6"></i> কার্ট
        </h2>
        <button onclick="document.getElementById('cart-modal').classList.add('hidden')" class="text-gray-400 hover:text-white">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        ${state.cart.length === 0 ? `
          <div class="flex flex-col items-center justify-center h-full text-gray-500">
            <i data-lucide="shopping-cart" class="w-16 h-16 mb-4 opacity-10"></i>
            <p>আপনার কার্ট খালি</p>
          </div>
        ` : `
          ${state.cart.map(item => `
            <div class="bg-slate-900/50 p-3 rounded-xl flex gap-4 border border-white/5">
              <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover" />
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm text-white truncate">${item.title}</h4>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-primary text-sm font-bold">৳${item.price} x ${item.quantity}</span>
                  <button onclick="window.app.removeFromCart('${item.id}')" class="p-1 text-red-400 hover:bg-red-400/10 rounded"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
                </div>
              </div>
            </div>
          `).join('')}

          <div class="border-t border-white/10 pt-6 mt-4">
            <div class="flex justify-between text-white font-bold text-xl mb-6"><span>মোট</span><span>৳${total}</span></div>
            <form onsubmit="window.app.handleCheckout(event)" class="space-y-4">
              <div class="space-y-2">
                <label class="text-xs text-gray-400 uppercase font-bold tracking-wider">পেমেন্ট মেথড</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button" onclick="window.app.setPaymentMethod('bKash')" class="p-3 rounded-xl border text-center font-bold ${state.paymentMethod === 'bKash' ? 'border-secondary bg-secondary/20 text-white' : 'border-slate-700 bg-slate-900 text-gray-400'}">বিকাশ</button>
                  <button type="button" onclick="window.app.setPaymentMethod('Nagad')" class="p-3 rounded-xl border text-center font-bold ${state.paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-500/20 text-white' : 'border-slate-700 bg-slate-900 text-gray-400'}">নগদ</button>
                </div>
                <div class="bg-slate-900 p-4 rounded-xl text-sm text-gray-300 border border-white/5 text-center">টাকা পাঠান: <span class="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded ml-2">01757382315</span></div>
              </div>
              <div class="space-y-3">
                <input type="email" name="email" required value="${state.user?.email || ''}" placeholder="আপনার ইমেইল" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none" />
                <input type="text" name="trx" required placeholder="TrxID" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-secondary outline-none" />
              </div>
              <button type="submit" class="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"><i data-lucide="credit-card" class="w-4 h-4"></i> অর্ডার কনফার্ম করুন</button>
            </form>
          </div>
        `}
      </div>
    </div>
  `;
  updateIcons();
}

function setPaymentMethod(method) {
  state.paymentMethod = method;
  renderCartModal();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(p => p.id !== id);
  renderCartModal();
  renderNavbar();
}

async function handleCheckout(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const trx = formData.get('trx');
  const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const newOrder = {
    id: 'MBD-' + Math.floor(1000 + Math.random() * 9000),
    items: [...state.cart],
    total,
    email,
    paymentMethod: state.paymentMethod,
    transactionId: trx,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    userId: state.user ? state.user.id : null
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        embeds: [{
          title: `New Order: #${newOrder.id}`,
          color: 5763719,
          fields: [
            { name: "Customer", value: email, inline: true },
            { name: "Total", value: `৳${total}`, inline: true },
            { name: "Payment", value: `${newOrder.paymentMethod} (TrxID: ${trx})` },
            { name: "Items", value: newOrder.items.map(i => `${i.title} (x${i.quantity})`).join('\n') }
          ]
        }] 
      })
    });
  } catch (err) {}

  state.orders.push(newOrder);
  state.cart = [];
  saveState();
  cartModal.classList.add('hidden');
  renderNavbar();
  alert(`অর্ডার সফল হয়েছে! আপনার অর্ডার কোড: ${newOrder.id}`);
  switchTab('track');
}

// --- Chat ---

function renderChatWidget() {
  chatWidget.innerHTML = state.chatOpen ? `
    <div class="w-80 md:w-96 bg-[#131926] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in-up">
      <div class="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white/20 p-2 rounded-full"><i data-lucide="bot" class="text-white w-5 h-5"></i></div>
          <div><h3 class="font-bold text-white text-sm">Moholla Support AI</h3><p class="text-xs text-white/80 flex items-center gap-1"><span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</p></div>
        </div>
        <button onclick="window.app.toggleChat()" class="text-white/80 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F19]" id="chat-messages">
        ${state.chatMessages.map(msg => `
          <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}">
            <div class="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-slate-800 text-gray-200 rounded-bl-none border border-white/5'}">
              ${msg.text}
            </div>
          </div>
        `).join('')}
      </div>
      <form onsubmit="window.app.handleChatSubmit(event)" class="p-3 bg-[#131926] border-t border-white/10 flex gap-2">
        <input type="text" name="msg" placeholder="সাহায্য দরকার..." class="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:border-primary outline-none" />
        <button type="submit" class="bg-secondary p-2 rounded-full text-white hover:bg-secondary/90 transition-colors"><i data-lucide="send" class="w-5 h-5"></i></button>
      </form>
    </div>
  ` : `
    <button onclick="window.app.toggleChat()" class="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-110">
      <i data-lucide="message-square" class="w-6 h-6"></i>
    </button>
  `;
  updateIcons();
  if (state.chatOpen) {
    const el = document.getElementById('chat-messages');
    if(el) el.scrollTop = el.scrollHeight;
  }
}

function toggleChat() {
  state.chatOpen = !state.chatOpen;
  renderChatWidget();
}

async function handleChatSubmit(e) {
  e.preventDefault();
  const input = e.target.msg.value.trim();
  if (!input) return;
  
  state.chatMessages.push({ role: 'user', text: input });
  renderChatWidget();
  e.target.reset();

  try {
    const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY_HERE" }); // User should replace or Env
    // Since this is client side static, we mock response to be safe or use simple logic
    // Using a timeout mock for safety in this static demo
    setTimeout(() => {
        state.chatMessages.push({ role: 'model', text: "দুঃখিত, আমি এখন অফলাইনে আছি। দয়া করে টিকেট ওপেন করুন।" });
        renderChatWidget();
    }, 1000);
  } catch (err) {
     state.chatMessages.push({ role: 'model', text: "Error connecting to AI." });
     renderChatWidget();
  }
}

// --- Auth ---

function handleLogin(provider) {
  state.user = {
    id: 'u-' + Math.random().toString(36).substr(2, 9),
    name: provider === 'google' ? 'Google User' : 'Discord User',
    email: `user@${provider}.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
    provider: provider
  };
  saveState();
  renderNavbar();
  renderContent();
}

function handleLogout() {
  state.user = null;
  saveState();
  switchTab('home');
}

// --- Expose to Window for Inline Handlers ---
window.app = {
  switchTab,
  toggleCart,
  openProductModal,
  addToCart,
  removeFromCart,
  setPaymentMethod,
  handleCheckout,
  handleTrack,
  handleSupportSubmit,
  handleLogin,
  handleLogout,
  updateOrderStatus,
  openTicket,
  toggleChat,
  handleChatSubmit
};

// --- Init ---
init();