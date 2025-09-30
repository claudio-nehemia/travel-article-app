"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, MapPin, Calendar, User, Search, Filter, Heart, Share2, LogOut, Menu, X, Plus, Edit, Trash2, Eye, ChevronDown, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { validateEmail, validatePassword, validateUsername, validateTitle, validateDescription } from '../lib/validation/validators';
import { AuthState, ArticleState, FilterOptions, Article } from '../lib/types';
import { apiService } from '../lib/api/apiServices';

// ============================================
// UI COMPONENTS
// ============================================

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, type = 'button', variant = 'primary', disabled, className = '' }) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
}> = ({ type = 'text', placeholder, value, onChange, error, icon }) => {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 ${icon ? 'pl-12' : ''} py-3 rounded-xl border-2 ${
            error ? 'border-red-500' : 'border-gray-200'
          } focus:border-purple-500 focus:outline-none transition-colors`}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

const Textarea: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
}> = ({ placeholder, value, onChange, error, rows = 4 }) => {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 rounded-xl border-2 ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:border-purple-500 focus:outline-none transition-colors resize-none`}
      />
      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
};

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg ${hover ? 'hover:shadow-2xl transition-shadow duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <Card className="p-6 animate-pulse">
    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
    <div className="bg-gray-200 h-6 rounded mb-2"></div>
    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
  </Card>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const TravelArticleApp: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    jwt: null,
    isAuthenticated: false
  });
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'articles' | 'article-detail' | 'create-article' | 'edit-article'>('landing');
  const [articleState, setArticleState] = useState<ArticleState>({
    articles: [],
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null
  });

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sort: 'createdAt:desc',
    page: 1
  });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load auth from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuthState(parsed);
      if (parsed.isAuthenticated) {
        setCurrentPage('articles');
      }
    }
  }, []);

  // Save auth to storage
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState]);

  // Fetch articles
  const fetchArticles = useCallback(async (reset = false) => {
    if (articleState.isLoading) return;

    setArticleState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apiService.getArticles(
        reset ? 1 : filters.page,
        filters.search,
        filters.sort
      );

      setArticleState(prev => ({
        ...prev,
        articles: reset ? response.data : [...prev.articles, ...response.data],
        totalPages: response.meta.pagination.pageCount,
        currentPage: response.meta.pagination.page,
        isLoading: false
      }));
    } catch (error) {
      setArticleState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch articles'
      }));
      showToast('Failed to load articles');
    }
  }, [filters, articleState.isLoading]);

  // Initial fetch and filter changes
  useEffect(() => {
    if (currentPage === 'articles' && authState.isAuthenticated) {
      fetchArticles(true);
    }
  }, [filters.search, filters.sort, currentPage, authState.isAuthenticated]);

  // Infinite scroll
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && 
            !articleState.isLoading && 
            articleState.currentPage < articleState.totalPages) {
          setFilters(prev => ({ ...prev, page: prev.page + 1 }));
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [articleState.isLoading, articleState.currentPage, articleState.totalPages]);

  // Load more articles
  useEffect(() => {
    if (filters.page > 1 && currentPage === 'articles') {
      fetchArticles(false);
    }
  }, [filters.page]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = async (identifier: string, password: string) => {
    try {
      const response = await apiService.login(identifier, password);
      setAuthState({
        user: response.user,
        jwt: response.jwt,
        isAuthenticated: true
      });
      setCurrentPage('articles');
      showToast('Login successful!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      const response = await apiService.register(username, email, password);
      setAuthState({
        user: response.user,
        jwt: response.jwt,
        isAuthenticated: true
      });
      setCurrentPage('articles');
      showToast('Registration successful!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    }
  };

  const handleLogout = () => {
    setAuthState({
      user: null,
      jwt: null,
      isAuthenticated: false
    });
    setCurrentPage('landing');
    showToast('Logged out successfully');
  };

  const handleViewArticle = async (article: Article) => {
    try {
      const response = await apiService.getArticleById(article.documentId);
      setSelectedArticle(response.data);
      setCurrentPage('article-detail');
    } catch (error) {
      showToast('Failed to load article details');
    }
  };

  const handleCreateArticle = async (title: string, description: string) => {
    try {
      await apiService.createArticle({ title, description });
      showToast('Article created successfully!');
      setCurrentPage('articles');
      fetchArticles(true);
    } catch (error) {
      showToast('Failed to create article');
      throw error;
    }
  };

  const handleUpdateArticle = async (id: string, title: string, description: string) => {
    try {
      await apiService.updateArticle(id, { title, description });
      showToast('Article updated successfully!');
      setCurrentPage('articles');
      setEditingArticle(null);
      fetchArticles(true);
    } catch (error) {
      showToast('Failed to update article');
      throw error;
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await apiService.deleteArticle(id);
      showToast('Article deleted successfully!');
      fetchArticles(true);
    } catch (error) {
      showToast('Failed to delete article');
    }
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderNavbar = () => (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage(authState.isAuthenticated ? 'articles' : 'landing')}>
            <Camera className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TravelExplore
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {authState.isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => setCurrentPage('articles')}>
                  <MapPin className="w-4 h-4" />
                  Destinations
                </Button>
                <Button variant="ghost" onClick={() => setCurrentPage('create-article')}>
                  <Plus className="w-4 h-4" />
                  Create Article
                </Button>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{authState.user?.username}</p>
                    <p className="text-xs text-gray-500">{authState.user?.email}</p>
                  </div>
                  <Button variant="danger" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setCurrentPage('login')}>Login</Button>
                <Button variant="primary" onClick={() => setCurrentPage('register')}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {authState.isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => { setCurrentPage('articles'); setMobileMenuOpen(false); }} className="w-full mb-2">
                  Destinations
                </Button>
                <Button variant="ghost" onClick={() => { setCurrentPage('create-article'); setMobileMenuOpen(false); }} className="w-full mb-2">
                  Create Article
                </Button>
                <div className="p-4 bg-gray-50 rounded-xl mb-2">
                  <p className="font-semibold">{authState.user?.username}</p>
                  <p className="text-sm text-gray-500">{authState.user?.email}</p>
                </div>
                <Button variant="danger" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="w-full mb-2">
                  Login
                </Button>
                <Button variant="primary" onClick={() => { setCurrentPage('register'); setMobileMenuOpen(false); }} className="w-full">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );

  const renderLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {renderNavbar()}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Explore breathtaking destinations, share your travel stories, and inspire others to embark on unforgettable journeys
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" onClick={() => setCurrentPage('register')} className="text-lg px-8 py-4">
              Start Exploring
              <MapPin className="w-5 h-5" />
            </Button>
            <Button variant="secondary" onClick={() => setCurrentPage('login')} className="text-lg px-8 py-4">
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose TravelExplore?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <MapPin className="w-12 h-12" />, title: 'Curated Destinations', desc: 'Discover handpicked travel destinations from around the world' },
              { icon: <Camera className="w-12 h-12" />, title: 'Visual Stories', desc: 'Immerse yourself in stunning photography and compelling narratives' },
              { icon: <Heart className="w-12 h-12" />, title: 'Community Driven', desc: 'Share your experiences and connect with fellow travelers' }
            ].map((feature, idx) => (
              <Card key={idx} className="p-8 text-center hover:scale-105 transition-transform">
                <div className="text-purple-600 flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join thousands of travelers sharing their stories</p>
          <Button variant="secondary" onClick={() => setCurrentPage('register')} className="text-lg px-8 py-4">
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );

  const renderLoginPage = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errors, setErrors] = useState({ identifier: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const identifierError = !formData.identifier ? 'Email or username is required' : null;
      const passwordError = validatePassword(formData.password);

      if (identifierError || passwordError) {
        setErrors({
          identifier: identifierError || '',
          password: passwordError || ''
        });
        return;
      }

      setIsLoading(true);
      try {
        await handleLogin(formData.identifier, formData.password);
      } catch (error) {
        setErrors({ identifier: '', password: 'Invalid credentials' });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        <div className="flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Login to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Email or Username"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                error={errors.identifier}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <span onClick={() => setCurrentPage('register')} className="text-purple-600 font-semibold cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </Card>
        </div>
      </div>
    );
  };

  const renderRegisterPage = () => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const usernameError = validateUsername(formData.username);
      const emailError = validateEmail(formData.email);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = formData.password !== formData.confirmPassword ? 'Passwords do not match' : null;

      if (usernameError || emailError || passwordError || confirmPasswordError) {
        setErrors({
          username: usernameError || '',
          email: emailError || '',
          password: passwordError || '',
          confirmPassword: confirmPasswordError || ''
        });
        return;
      }

      setIsLoading(true);
      try {
        await handleRegister(formData.username, formData.email, formData.password);
      } catch (error) {
        setErrors({ username: '', email: 'Email or username already exists', password: '', confirmPassword: '' });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        <div className="flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-2">Join our travel community today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                error={errors.username}
                icon={<User className="w-5 h-5" />}
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
              />
              <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <span onClick={() => setCurrentPage('login')} className="text-purple-600 font-semibold cursor-pointer hover:underline">
                Login
              </span>
            </p>
          </Card>
        </div>
      </div>
    );
  };

  const renderArticlesPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Travel Destinations
            </h1>
            <p className="text-gray-600 text-lg">Explore amazing places around the world</p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="createdAt:desc">Newest First</option>
                  <option value="createdAt:asc">Oldest First</option>
                  <option value="title:asc">Title A-Z</option>
                  <option value="title:desc">Title Z-A</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* Error State */}
          {articleState.error && (
            <Card className="p-6 mb-8 bg-red-50 border-2 border-red-200">
              <p className="text-red-600 text-center">{articleState.error}</p>
            </Card>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articleState.articles.map((article) => (
              <Card key={article.id} hover className="overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden">
                  {article.image?.url ? (
                    <img 
                      src={`${article.image.url}`} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-16 h-16 text-purple-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Destination
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                    {article.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author.username}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" onClick={() => handleViewArticle(article)} className="flex-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="ghost" onClick={() => { setEditingArticle(article); setCurrentPage('edit-article'); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteArticle(article.documentId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Loading Skeleton */}
          {articleState.isLoading && articleState.articles.length === 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Infinite Scroll Loading */}
          {articleState.isLoading && articleState.articles.length > 0 && (
            <LoadingSpinner />
          )}

          {/* Intersection Observer Target */}
          <div ref={observerTarget} className="h-4" />

          {/* No Results */}
          {!articleState.isLoading && articleState.articles.length === 0 && (
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button variant="primary" onClick={() => setCurrentPage('create-article')}>
                <Plus className="w-4 h-4" />
                Create First Article
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderArticleDetail = () => {
    if (!selectedArticle) return null;

    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShare = (platform: string) => {
      const url = encodeURIComponent(shareUrl);
      const text = encodeURIComponent(selectedArticle.title);
      
      const shareUrls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      };

      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast('Link copied to clipboard!');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setCurrentPage('articles')} className="mb-6">
            ← Back to Destinations
          </Button>

          <Card className="overflow-hidden">
            {/* Hero Image */}
            <div className="relative h-96 bg-gradient-to-br from-purple-200 to-pink-200">
              {selectedArticle.image?.url ? (
                <img 
                  src={`${selectedArticle.image.url}`} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-32 h-32 text-purple-400" />
                </div>
              )}
            </div>

            <div className="p-8">
              {/* Title and Meta */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{selectedArticle.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {new Date(selectedArticle.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                {selectedArticle.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {selectedArticle.author.username}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Travel Destination
                </div>
              </div>

              {/* Share Buttons */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share this destination
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost" onClick={() => handleShare('facebook')} className="flex-1 min-w-[120px]">
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </Button>
                  <Button variant="ghost" onClick={() => handleShare('twitter')} className="flex-1 min-w-[120px]">
                    <Twitter className="w-5 h-5" />
                    Twitter
                  </Button>
                  <Button variant="ghost" onClick={() => handleShare('linkedin')} className="flex-1 min-w-[120px]">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </Button>
                  <Button variant="ghost" onClick={handleCopyLink} className="flex-1 min-w-[120px]">
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About this destination</h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{selectedArticle.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t">
                <Button 
                  variant="secondary" 
                  onClick={() => { setEditingArticle(selectedArticle); setCurrentPage('edit-article'); }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit Article
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => {
                    handleDeleteArticle(selectedArticle.documentId);
                    setCurrentPage('articles');
                  }}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Article
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderCreateArticle = () => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [errors, setErrors] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const titleError = validateTitle(formData.title);
      const descriptionError = validateDescription(formData.description);

      if (titleError || descriptionError) {
        setErrors({
          title: titleError || '',
          description: descriptionError || ''
        });
        return;
      }

      setIsLoading(true);
      try {
        await handleCreateArticle(formData.title, formData.description);
      } catch (error) {
        showToast('Failed to create article');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setCurrentPage('articles')} className="mb-6">
            ← Back to Destinations
          </Button>

          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Create New Article</h2>
              <p className="text-gray-600 mt-2">Share your travel experience with the world</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Title</label>
                <Input
                  type="text"
                  placeholder="Enter an engaging title for your destination..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <Textarea
                  placeholder="Describe your travel experience, what makes this destination special, tips for visitors..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={errors.description}
                  rows={8}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Creating...' : 'Create Article'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setCurrentPage('articles')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  };

  const renderEditArticle = () => {
    if (!editingArticle) return null;

    const [formData, setFormData] = useState({ 
      title: editingArticle.title, 
      description: editingArticle.description 
    });
    const [errors, setErrors] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault;
      
      const titleError = validateTitle(formData.title);
      const descriptionError = validateDescription(formData.description);

      if (titleError || descriptionError) {
        setErrors({
          title: titleError || '',
          description: descriptionError || ''
        });
        return;
      }

      setIsLoading(true);
      try {
        await handleUpdateArticle(editingArticle.documentId, formData.title, formData.description);
      } catch (error) {
        showToast('Failed to update article');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {renderNavbar()}
        
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => { setCurrentPage('articles'); setEditingArticle(null); }} className="mb-6">
            ← Back to Destinations
          </Button>

          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <Edit className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Edit Article</h2>
              <p className="text-gray-600 mt-2">Update your travel story</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Title</label>
                <Input
                  type="text"
                  placeholder="Enter article title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  error={errors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <Textarea
                  placeholder="Enter article description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  error={errors.description}
                  rows={8}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="primary" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Updating...' : 'Update Article'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => { setCurrentPage('articles'); setEditingArticle(null); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <Card className="p-4 bg-gray-800 text-white shadow-2xl">
            <p className="font-semibold">{toastMessage}</p>
          </Card>
        </div>
      )}

      {/* Page Routing */}
      {currentPage === 'landing' && renderLandingPage()}
      {currentPage === 'login' && renderLoginPage()}
      {currentPage === 'register' && renderRegisterPage()}
      {currentPage === 'articles' && renderArticlesPage()}
      {currentPage === 'article-detail' && renderArticleDetail()}
      {currentPage === 'create-article' && renderCreateArticle()}
      {currentPage === 'edit-article' && renderEditArticle()}
    </div>
  );
};

export default TravelArticleApp;