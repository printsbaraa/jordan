import { useState, useRef, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { destinations as initialDestinations, type Destination } from '@/data/destinations'
import { JordanFlag } from '@/components/JordanFlag'
import {
  MapPin,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Star,
  ExternalLink,
  Search,
  TrendingUp,
  Clock,
  X,
  Save,
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [destinationsList, setDestinationsList] = useState<Destination[]>(initialDestinations)
  const [activeTab, setActiveTab] = useState<'destinations' | 'stats' | 'messages'>('destinations')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Destination modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)
  const [imageUploadType, setImageUploadType] = useState<'file' | 'url'>('file')
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    region: '',
    category: 'ancient' as Destination['category'],
    description: '',
    imageUrl: '',
    featured: false,
    lat: 31.95,
    lng: 35.91,
  })

  // Handle local JPG / JPEG / PNG image selection
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageError(null)
    const file = e.target.files?.[0]
    if (!file) return

    // Verify format - specifically checking for jpg/jpeg/png
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const isJpg = file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')

    if (!validTypes.includes(file.type) && !isJpg) {
      setImageError('يرجى اختيار صورة بصيغة JPG أو JPEG صالحة (.jpg)')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميغابايت')
      return
    }

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string
      if (result) {
        setFormData(prev => ({ ...prev, imageUrl: result }))
      }
    }
    reader.onerror = () => {
      setImageError('حدث خطأ أثناء قراءة ملف الصورة')
    }
    reader.readAsDataURL(file)
  }

  // Filtered destinations
  const filteredDestinations = destinationsList.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.arabicName.includes(searchQuery) ||
      d.region.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const openAddModal = () => {
    setEditingDestination(null)
    setImageError(null)
    setImageUploadType('file')
    setFormData({
      name: '',
      arabicName: '',
      region: '',
      category: 'ancient',
      description: '',
      imageUrl: '',
      featured: false,
      lat: 31.9539,
      lng: 35.9106,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (d: Destination) => {
    setEditingDestination(d)
    setImageError(null)
    setImageUploadType(d.imageUrl.startsWith('data:') ? 'file' : 'url')
    setFormData({
      name: d.name,
      arabicName: d.arabicName,
      region: d.region,
      category: d.category,
      description: d.description,
      imageUrl: d.imageUrl,
      featured: !!d.featured,
      lat: d.coordinates.lat,
      lng: d.coordinates.lng,
    })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.imageUrl) {
      setImageError('يرجى اختيار صورة JPG أو وضع رابط للصورة')
      return
    }

    if (editingDestination) {
      // Update
      setDestinationsList(prev => prev.map(item => {
        if (item.id === editingDestination.id) {
          return {
            ...item,
            name: formData.name,
            arabicName: formData.arabicName,
            region: formData.region,
            category: formData.category,
            description: formData.description,
            imageUrl: formData.imageUrl,
            featured: formData.featured,
            coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) }
          }
        }
        return item
      }))
    } else {
      // Add new
      const newDest: Destination = {
        id: `dest-${Date.now()}`,
        name: formData.name,
        arabicName: formData.arabicName,
        region: formData.region,
        category: formData.category,
        description: formData.description,
        longDescription: formData.description,
        imageUrl: formData.imageUrl,
        imageAlt: formData.name,
        coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) },
        highlights: ['معلم مميز', 'جولات إرشادية'],
        featured: formData.featured,
      }
      setDestinationsList(prev => [newDest, ...prev])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الوجهة السياحية؟')) {
      setDestinationsList(prev => prev.filter(d => d.id !== id))
    }
  }

  const toggleFeatured = (id: string) => {
    setDestinationsList(prev => prev.map(d => {
      if (d.id === id) return { ...d, featured: !d.featured }
      return d
    }))
  }

  return (
    <div className="min-h-screen bg-desert-950 text-stone-100 flex flex-col md:flex-row">
      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-desert-900 border-b md:border-b-0 md:border-r border-sandstone-500/15 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <JordanFlag variant="full" height={28} className="rounded" />
            <div>
              <h1 className="font-cinematic text-lg tracking-wider text-white">JORDAN ADMIN</h1>
              <p className="text-[10px] text-sandstone-400 font-sans tracking-widest uppercase">
                لوحة إدارة السياحة
              </p>
            </div>
          </div>

          {/* User badge */}
          <div className="my-6 p-3 bg-desert-800/80 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sandstone-600/20 text-sandstone-400 flex items-center justify-center font-bold">
              JA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'مدير النظام'}</p>
              <p className="text-[11px] text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="لوحة التحكم">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                activeTab === 'destinations'
                  ? 'bg-sandstone-600 text-white shadow-lg shadow-sandstone-900/50'
                  : 'text-stone-400 hover:text-white hover:bg-desert-800'
              }`}
            >
              <MapPin size={18} />
              <span>إدارة الوجهات ({destinationsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                activeTab === 'stats'
                  ? 'bg-sandstone-600 text-white shadow-lg shadow-sandstone-900/50'
                  : 'text-stone-400 hover:text-white hover:bg-desert-800'
              }`}
            >
              <TrendingUp size={18} />
              <span>إحصائيات الزوار</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-sans transition-colors ${
                activeTab === 'messages'
                  ? 'bg-sandstone-600 text-white shadow-lg shadow-sandstone-900/50'
                  : 'text-stone-400 hover:text-white hover:bg-desert-800'
              }`}
            >
              <Users size={18} />
              <span>طلبات واستفسارات السياح</span>
            </button>

            <div className="pt-4 border-t border-white/5 mt-4">
              <Link
                to="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-sandstone-300 hover:bg-desert-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe size={15} />
                  عرض الموقع المباشر
                </span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </nav>
        </div>

        {/* Logout action */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-sans text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-red-900/30 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Header bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-cinematic text-sandstone-200">
              {activeTab === 'destinations' && 'إدارة الوجهات السياحية في الأردن'}
              {activeTab === 'stats' && 'إحصائيات المنصة ونمو الزوار'}
              {activeTab === 'messages' && 'صندوق استفسارات وحجوزات السياح'}
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              أهلاً بك في نظام الإدارة الموحد لمنصة مرحباً بكم في الأردن
            </p>
          </div>

          {activeTab === 'destinations' && (
            <button
              onClick={openAddModal}
              className="btn-primary self-start sm:self-auto py-2.5 px-5 rounded-lg text-xs flex items-center gap-2"
            >
              <Plus size={16} />
              <span>إضافة وجهة سياحية جديدة</span>
            </button>
          )}
        </header>

        {/* ── Tab: Destinations ── */}
        {activeTab === 'destinations' && (
          <div className="mt-8 space-y-6">
            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-desert-900/90 border border-white/5 p-4 rounded-xl">
                <span className="text-stone-500 text-xs uppercase tracking-wider block">إجمالي الوجهات</span>
                <span className="font-cinematic text-2xl sm:text-3xl text-sandstone-300">{destinationsList.length}</span>
              </div>
              <div className="bg-desert-900/90 border border-white/5 p-4 rounded-xl">
                <span className="text-stone-500 text-xs uppercase tracking-wider block">الوجهات المميزة</span>
                <span className="font-cinematic text-2xl sm:text-3xl text-sandstone-400">
                  {destinationsList.filter(d => d.featured).length}
                </span>
              </div>
              <div className="bg-desert-900/90 border border-white/5 p-4 rounded-xl">
                <span className="text-stone-500 text-xs uppercase tracking-wider block">مواقع يونيسكو</span>
                <span className="font-cinematic text-2xl sm:text-3xl text-jordan-green">3</span>
              </div>
              <div className="bg-desert-900/90 border border-white/5 p-4 rounded-xl">
                <span className="text-stone-500 text-xs uppercase tracking-wider block">المحافظات المغطاة</span>
                <span className="font-cinematic text-2xl sm:text-3xl text-stone-200">12</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between bg-desert-900/60 p-4 rounded-xl border border-white/5">
              <div className="relative flex-1">
                <Search size={16} className="absolute right-3.5 top-3 text-stone-500" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم العربي أو الإنجليزي أو المحافظة..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-desert-950 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-sm text-stone-200 focus:outline-none focus:border-sandstone-500"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {['all', 'ancient', 'nature', 'city', 'heritage', 'coastal'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-sans shrink-0 transition-colors ${
                      categoryFilter === cat
                        ? 'bg-sandstone-600 text-white'
                        : 'bg-desert-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' && 'الكل'}
                    {cat === 'ancient' && 'أثرية'}
                    {cat === 'nature' && 'طبيعية'}
                    {cat === 'city' && 'مدن'}
                    {cat === 'heritage' && 'تراثية'}
                    {cat === 'coastal' && 'ساحلية'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table / Grid of destinations */}
            <div className="bg-desert-900/70 border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-desert-800/80 text-stone-400 text-xs uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="py-3.5 px-4">الصورة والاسم</th>
                      <th className="py-3.5 px-4">الاسم العربي</th>
                      <th className="py-3.5 px-4">المحافظة</th>
                      <th className="py-3.5 px-4">التصنيف</th>
                      <th className="py-3.5 px-4">مميز (Hero)</th>
                      <th className="py-3.5 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDestinations.map(d => (
                      <tr key={d.id} className="hover:bg-desert-800/40 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={d.imageUrl}
                            alt={d.name}
                            className="w-12 h-10 object-cover rounded-md border border-white/10"
                          />
                          <div>
                            <span className="font-semibold text-white block">{d.name}</span>
                            <span className="text-[11px] text-stone-500 line-clamp-1">{d.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-sans text-sandstone-300">{d.arabicName}</td>
                        <td className="py-3 px-4 text-stone-400 text-xs">{d.region}</td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded bg-desert-800 border border-white/10 text-stone-300">
                            {d.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleFeatured(d.id)}
                            className={`p-1.5 rounded transition-colors ${
                              d.featured
                                ? 'text-sandstone-400 bg-sandstone-950/80 border border-sandstone-700/50'
                                : 'text-stone-600 hover:text-stone-400'
                            }`}
                            title={d.featured ? 'وجهة مميزة في الواجهة' : 'تحديد كوجهة مميزة'}
                          >
                            <Star size={16} fill={d.featured ? 'currentColor' : 'none'} />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(d)}
                              className="p-1.5 rounded-lg bg-desert-800 text-stone-300 hover:text-white hover:bg-desert-700 transition-colors"
                              title="تعديل الوجهة"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/30 text-red-400 hover:text-red-300 hover:bg-red-900/60 transition-colors"
                              title="حذف الوجهة"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Stats ── */}
        {activeTab === 'stats' && (
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-desert-900/80 p-6 rounded-2xl border border-white/5 space-y-2">
                <span className="text-stone-400 text-xs uppercase tracking-wider">زيارات المنصة الشهرية</span>
                <p className="text-4xl font-cinematic text-sandstone-300">142,850</p>
                <span className="text-xs text-jordan-green flex items-center gap-1">
                  <TrendingUp size={14} /> +24.5% مقارنة بالشهر السابق
                </span>
              </div>
              <div className="bg-desert-900/80 p-6 rounded-2xl border border-white/5 space-y-2">
                <span className="text-stone-400 text-xs uppercase tracking-wider">نقرات استكشاف البتراء ووادي رم</span>
                <p className="text-4xl font-cinematic text-sandstone-400">89,200</p>
                <span className="text-xs text-stone-400">أعلى الوجهات اهتماماً</span>
              </div>
              <div className="bg-desert-900/80 p-6 rounded-2xl border border-white/5 space-y-2">
                <span className="text-stone-400 text-xs uppercase tracking-wider">معدل البقاء في الموقع</span>
                <p className="text-4xl font-cinematic text-white">4:18 دقيقة</p>
                <span className="text-xs text-stone-400">تفاعل ممتاز بفضل البارالاكس</span>
              </div>
            </div>

            <div className="bg-desert-900/60 p-6 rounded-2xl border border-white/5">
              <h3 className="font-cinematic text-xl text-white mb-4">أهم الدول المهتمة بالسياحة في الأردن</h3>
              <div className="space-y-3">
                {[
                  { country: 'الولايات المتحدة الأمريكية', pct: 28 },
                  { country: 'المملكة المتحدة وفرنسا', pct: 24 },
                  { country: 'دول الخليج العربي', pct: 22 },
                  { country: 'ألمانيا وإيطاليا', pct: 15 },
                  { country: 'دول أخرى', pct: 11 },
                ].map(item => (
                  <div key={item.country} className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-300">
                      <span>{item.country}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div className="w-full bg-desert-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sandstone-600 h-full rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Messages ── */}
        {activeTab === 'messages' && (
          <div className="mt-8 space-y-4">
            {[
              {
                id: 1,
                name: 'Elena Rostova',
                email: 'elena@travel-europe.com',
                country: 'Germany',
                message: 'نود تنظيم رحلة تخييم جماعية في وادي رم وزيارة البتراء لـ 15 شخصاً، كيف ننسق مع مرشد محلي معتمد؟',
                date: 'منذ ساعتين'
              },
              {
                id: 2,
                name: 'خالد المنصوري',
                email: 'khalid@uae-tours.ae',
                country: 'UAE',
                message: 'هل هناك باقة Jordan Pass تغطي زيارة البتراء والمدرج الروماني معاً في عطلة نهاية الأسبوع؟',
                date: 'منذ 5 ساعات'
              },
              {
                id: 3,
                name: 'Sarah Jenkins',
                email: 'sarah.j@adventure.org',
                country: 'UK',
                message: 'Looking for best diving centers in Aqaba and eco-lodges near Ajloun reserve. Stunning website!',
                date: 'أمس'
              }
            ].map(msg => (
              <div key={msg.id} className="bg-desert-900/80 p-5 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{msg.name}</span>
                    <span className="text-xs text-stone-500">({msg.country})</span>
                  </div>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Clock size={12} /> {msg.date}
                  </span>
                </div>
                <p className="text-stone-300 text-sm">{msg.message}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-sandstone-400 font-mono">{msg.email}</span>
                  <button className="text-sandstone-400 hover:text-white underline transition-colors cursor-pointer">
                    الرد على السائح
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add / Edit Destination Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-desert-900 border border-sandstone-500/20 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-cinematic text-xl text-white">
                {editingDestination ? 'تعديل الوجهة السياحية' : 'إضافة وجهة سياحية جديدة'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-right">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                    placeholder="e.g. Petra"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">الاسم بالعربي</label>
                  <input
                    type="text"
                    required
                    value={formData.arabicName}
                    onChange={e => setFormData({ ...formData, arabicName: e.target.value })}
                    className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                    placeholder="مثال: البتراء"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-300 mb-1">المحافظة</label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                    placeholder="e.g. Ma'an Governorate"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-300 mb-1">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Destination['category'] })}
                    className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                  >
                    <option value="ancient">مواقع أثرية (Ancient)</option>
                    <option value="nature">طبيعة ومغامرة (Nature)</option>
                    <option value="city">مدن رئيسية (City)</option>
                    <option value="heritage">تراث وحضارة (Heritage)</option>
                    <option value="coastal">سياحة بحرية (Coastal)</option>
                  </select>
                </div>
              </div>

              {/* ── Image Selector: Local JPG Upload vs Direct URL ── */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs text-stone-300">
                    صورة الوجهة (JPG Image)
                  </label>
                  <div className="flex items-center gap-1 bg-desert-950 p-0.5 rounded-md border border-white/10 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('file')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        imageUploadType === 'file'
                          ? 'bg-sandstone-600 text-white font-medium'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      رفع ملف JPG
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        imageUploadType === 'url'
                          ? 'bg-sandstone-600 text-white font-medium'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      رابط صورة (URL)
                    </button>
                  </div>
                </div>

                {imageUploadType === 'file' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".jpg,.jpeg,image/jpeg,image/jpg"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="jpg-upload-input"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-sandstone-500/30 hover:border-sandstone-500/70 bg-desert-950/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
                    >
                      <div className="p-2.5 rounded-full bg-sandstone-600/10 text-sandstone-400 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-sandstone-300 block">
                          اضغط لاختيار صورة بصيغة JPG أو JPEG
                        </span>
                        <span className="text-[11px] text-stone-500 mt-0.5 block">
                          يدعم ملفات JPG عالية الدقة حتى 8MB
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                      placeholder="https://.../photo.jpg"
                    />
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      يمكنك وضع رابط صورة مباشر ينتهي بـ .jpg أو رابط Unsplash
                    </span>
                  </div>
                )}

                {imageError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-900/30">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* Instant Image Preview */}
                {formData.imageUrl && (
                  <div className="mt-2 p-2.5 bg-desert-950 rounded-xl border border-white/10 flex items-center gap-3">
                    <img
                      src={formData.imageUrl}
                      alt="معاينة الصورة"
                      className="w-16 h-12 object-cover rounded-lg border border-sandstone-500/30"
                    />
                    <div className="overflow-hidden flex-1">
                      <span className="text-xs text-sandstone-300 font-medium flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-jordan-green" />
                        تم تحديد صورة JPG بنجاح
                      </span>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {formData.imageUrl.startsWith('data:') ? 'ملف محلي تم تحويله وتجهيزه' : formData.imageUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="p-1 rounded text-stone-500 hover:text-red-400 transition-colors"
                      title="إزالة الصورة"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">الوصف المختصر</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-desert-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-sandstone-500"
                  placeholder="اكتب وصفاً جذاباً للوجهة..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-desert-950 border-white/20 text-sandstone-600 focus:ring-0"
                />
                <label htmlFor="featuredCheckbox" className="text-xs text-stone-300 cursor-pointer">
                  عرض كوجهة مميزة ذات نجمة (Featured)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-desert-800 text-stone-300 hover:text-white text-xs transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 rounded-lg text-xs flex items-center gap-2"
                >
                  <Save size={14} />
                  <span>حفظ الوجهة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
