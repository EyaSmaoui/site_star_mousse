import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
	{
		id: 'dashboard',
		label: 'Tableau de bord',
		path: '/client-dashboard',
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
				<polyline points="9 22 9 12 15 12 15 22" />
			</svg>
		),
	},
	{
		id: 'orders',
		label: 'Mes commandes',
		path: '/client-orders',
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M4 4h16v4H4z" />
				<path d="M4 10h16v10H4z" />
				<path d="M8 14h8" />
			</svg>
		),
	},
	{
		id: 'reviews',
		label: 'Mes avis',
		path: '/client-reviews',
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M5 12h14" />
				<path d="M5 6h14" />
				<path d="M5 18h10" />
			</svg>
		),
	},
	{
		id: 'recommendations',
		label: 'Recommandations',
		path: '/client-recommendations',
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2l3 8h8l-6.5 5 2.5 8L12 18l-6 5 2.5-8L2 10h8z" />
			</svg>
		),
	},
	{
		id: 'profile',
		label: 'Profil',
		path: '/client-dashboard?section=profile',
		icon: (
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		),
	},
];

export default function ClientSidebar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 900);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		navigate('/');
	};

	const fullPath = location.pathname + location.search;

	return (
		<>
			{!isMobile && (
				<aside className="client-sidebar" style={S.sidebar}>
					<div
						style={S.logoArea}
						onClick={() => navigate('/')}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => { if (e.key === 'Enter') navigate('/'); }}
					>
						<div style={S.logoIconWrap}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
								<line x1="4" y1="6" x2="20" y2="6" />
								<line x1="4" y1="12" x2="20" y2="12" />
								<line x1="4" y1="18" x2="20" y2="18" />
							</svg>
						</div>
						<span style={S.logoText}>Star Mousse</span>
					</div>

					<nav className="sidebar-nav" style={S.nav}>
						{NAV_ITEMS.map((item) => {
							const isActive = fullPath === item.path;
							return (
								<button
									key={item.id}
									onClick={() => navigate(item.path)}
									style={{ ...S.navItem, ...(isActive ? S.navItemActive : {}) }}
								>
									<span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
									<span>{item.label}</span>
								</button>
							);
						})}
					</nav>

					<button onClick={handleLogout} style={S.logoutBtn}>
						<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
						<span>Déconnexion</span>
					</button>
				</aside>
			)}

			{isMobile && (
				<div className="client-mobile-bar" style={SM.mobileTopBar}>
					<button style={SM.hamburger} onClick={() => setMenuOpen((s) => !s)} aria-label="Ouvrir le menu">☰</button>
					<div style={SM.mobileLogo} onClick={() => navigate('/')}>Star Mousse</div>
					<div style={{ width: 36 }} />

					{menuOpen && (
						<div style={SM.mobileOverlay} role="dialog">
							<div style={SM.mobileMenu}>
								<div style={SM.mobileMenuHeader}>
									<strong>Menu</strong>
									<button onClick={() => setMenuOpen(false)} style={SM.mobileClose} aria-label="Fermer">✕</button>
								</div>
								<nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
									{NAV_ITEMS.map((item) => (
										<button key={item.id} onClick={() => { navigate(item.path); setMenuOpen(false); }} style={SM.mobileNavItem}>
											<span style={{ marginRight: 10 }}>{item.icon}</span>
											<span>{item.label}</span>
										</button>
									))}
									<button onClick={() => { handleLogout(); setMenuOpen(false); }} style={SM.mobileLogout}>Déconnexion</button>
								</nav>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}

const S = {
	sidebar: {
		width: 240,
		minHeight: '100vh',
		background: 'linear-gradient(180deg, #ffffff, #fcfaf7)',
		display: 'flex',
		flexDirection: 'column',
		position: 'fixed',
		top: 0,
		left: 0,
		borderRight: '1px solid rgba(229, 231, 235, 0.9)',
		boxShadow: '2px 0 28px rgba(15, 23, 42, 0.06)',
		padding: '24px 0',
		fontFamily: "'Segoe UI', system-ui, sans-serif",
	},
	logoArea: {
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		padding: '0 22px 22px',
		cursor: 'pointer',
	},
	logoIconWrap: {
		width: 36,
		height: 36,
		borderRadius: 10,
		background: 'linear-gradient(135deg, #f97316, #ea580c)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
	},
	logoText: {
		fontSize: 16,
		fontWeight: 700,
		color: '#1f2937',
		letterSpacing: '-0.02em',
	},
	nav: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
		padding: '0 0',
		overflowY: 'auto',
	},
	navItem: {
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		width: '100%',
		padding: '12px 20px',
		background: 'transparent',
		border: 'none',
		borderRadius: 16,
		textAlign: 'left',
		fontSize: 14,
		color: '#475569',
		cursor: 'pointer',
		fontFamily: 'inherit',
		transition: 'background .18s ease, color .18s ease, transform .18s ease',
	},
	navItemActive: {
		background: '#fff7ed',
		color: '#f97316',
		margin: '0 12px',
		width: 'calc(100% - 24px)',
		borderRadius: 16,
		padding: '12px 14px',
		boxShadow: '0 12px 24px rgba(249, 115, 22, 0.08)',
	},
	logoutBtn: {
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		padding: '12px 22px',
		background: '#fffbf5',
		border: '1px solid #f5e7d8',
		borderRadius: 18,
		cursor: 'pointer',
		fontSize: 14,
		color: '#f97316',
		fontFamily: 'inherit',
		marginTop: 14,
		width: 'calc(100% - 24px)',
		marginLeft: 12,
	},
};

const SM = {
	mobileTopBar: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		height: 64,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0 12px',
		background: '#fff',
		borderBottom: '1px solid #eee',
		zIndex: 2600,
	},
	hamburger: {
		width: 38,
		height: 38,
		borderRadius: 10,
		border: 'none',
		background: '#f97316',
		color: '#fff',
		fontSize: 18,
		cursor: 'pointer',
	},
	mobileLogo: {
		fontWeight: 700,
		color: '#111827',
	},
	mobileOverlay: {
		position: 'fixed',
		inset: 0,
		background: 'rgba(0,0,0,0.35)',
		zIndex: 2700,
		display: 'flex',
		justifyContent: 'flex-start',
	},
	mobileMenu: {
		width: 280,
		background: '#fff',
		padding: 18,
		height: '100vh',
		boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
		overflowY: 'auto',
	},
	mobileMenuHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	mobileClose: {
		border: 'none',
		background: 'transparent',
		fontSize: 18,
		cursor: 'pointer',
	},
	mobileNavItem: {
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		padding: '12px 10px',
		borderRadius: 10,
		border: 'none',
		textAlign: 'left',
		background: 'transparent',
		cursor: 'pointer',
	},
	mobileLogout: {
		marginTop: 8,
		padding: '10px 12px',
		background: '#fffbf5',
		border: '1px solid #f5e7d8',
		borderRadius: 10,
		cursor: 'pointer',
	}
};

