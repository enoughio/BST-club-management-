import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata = {
	title: 'Dashboards',
	description: 'Common dashboard layout',
}

export default async function DashboardLayout({ children }) {
	const cookieStore = await cookies()
	const role = cookieStore.get('x-bst-user-role')?.value || 'guest'

	const navByRole = {
		admin: [
			{ label: 'Overview', href: '/admin/dashboard', icon: '📊' },
			{ label: 'Club Details', href: '/admin/club-details', icon: '🏢' },
			{ label: 'Members', href: '/admin/members', icon: '👥' },
			{ label: 'Add Member', href: '/admin/members/add', icon: '➕' },
			{ label: 'Meetings', href: '/admin/meetings', icon: '🕐' },
			{ label: 'Events', href: '/admin/events', icon: '📅' },
			{ label: 'Projects', href: '/admin/projects', icon: '📈' },
			{ label: 'Requests', href: '/admin/requests', icon: '🚩' },
		],
		member: [
			{ label: 'Overview', href: '/member/dashboard', icon: '📊' },
			{ label: 'My Clubs', href: '/member/club', icon: '🏢' },
			{ label: 'Events', href: '/member/events', icon: '📅' },
			{ label: 'My Projects', href: '/member/projects', icon: '📈' },
			{ label: 'Profile', href: '/member/profile', icon: '👤' },
		],
		superadmin: [
			{ label: 'Overview', href: '/superadmin/dashboard', icon: '📊' },
			{ label: 'Clubs', href: '/superadmin/clubs', icon: '🏢' },
			{ label: 'Club Admins', href: '/superadmin/club-admins', icon: '👥' },
			{ label: 'Members', href: '/superadmin/members', icon: '👨‍💼' },
			{ label: 'Events', href: '/superadmin/events', icon: '📅' },
			{ label: 'Projects', href: '/superadmin/projects', icon: '📈' },
			{ label: 'Requests', href: '/superadmin/requests', icon: '🔔' },
			{ label: 'Settings', href: '/superadmin/settings', icon: '⚙️' },
		],
		guest: [
			{ label: 'Overview', href: '/', icon: '🏠' },
			{ label: 'Find a Club', href: '/findaclub', icon: '🔍' },
		],
	}

	const navItems = navByRole[role] || navByRole.guest
	const roleTitle = role.charAt(0).toUpperCase() + role.slice(1)

	return (
		<html lang="en">
			<head />
			<body style={styles.body}>
				<div style={styles.container}>
					<aside style={styles.sidebar}>
						{/* Brand */}
						<div style={styles.brandSection}>
							<h2 style={styles.brand}>Bharat Storytellers</h2>
						</div>

						{/* User Profile Section */}
						<div style={styles.userSection}>
							<div style={styles.avatarContainer}>
								<div style={styles.avatar}>{roleTitle.charAt(0)}</div>
							</div>
							<div style={styles.userInfo}>
								<p style={styles.userName}>{roleTitle} User</p>
								<p style={styles.userEmail}>user@example.com</p>
							</div>
						</div>

						{/* Navigation */}
						<nav style={styles.navContainer}>
							<ul style={styles.navList}>
								{navItems.map((item) => (
									<li key={item.href} style={styles.navItem}>
										<Link href={item.href} style={styles.navLink}>
											<span style={styles.navIcon}>{item.icon}</span>
											<span>{item.label}</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Logout Button */}
						<div style={styles.logoutSection}>
							<Link href="/login" style={styles.logoutButton}>
								<span>🚪</span> Sign Out
							</Link>
						</div>
					</aside>

					<main style={styles.main}>
						<header style={styles.header}>
							<h1 style={styles.headerTitle}>Dashboard</h1>
						</header>

						<section style={styles.content}>{children}</section>

						<footer style={styles.footer}>© {new Date().getFullYear()} Portal</footer>
					</main>
				</div>
			</body>
		</html>
	)
}

const styles = {
	body: {
		margin: 0,
		fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
		background: '#f5f7fa',
		color: '#0f172a',
	},
	container: {
		display: 'flex',
		minHeight: '100vh',
	},
	sidebar: {
		width: 256,
		background: 'linear-gradient(135deg, #0b1220 0%, #151d2e 100%)',
		color: '#fff',
		padding: '20px 16px',
		position: 'fixed',
		left: 0,
		top: 0,
		height: '100vh',
		overflow: 'auto',
		zIndex: 100,
		boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
	},
	brandSection: {
		marginBottom: 24,
	},
	brand: {
		margin: 0,
		fontSize: 20,
		fontWeight: 700,
		letterSpacing: '0.5px',
	},
	userSection: {
		display: 'flex',
		alignItems: 'center',
		gap: 12,
		marginBottom: 24,
		padding: '12px 8px',
		borderRadius: 8,
		background: 'rgba(255, 255, 255, 0.05)',
	},
	avatarContainer: {
		flexShrink: 0,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: '50%',
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 600,
		fontSize: 16,
	},
	userInfo: {
		flex: 1,
		minWidth: 0,
	},
	userName: {
		margin: '0 0 2px 0',
		fontSize: 14,
		fontWeight: 600,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	userEmail: {
		margin: 0,
		fontSize: 12,
		color: 'rgba(255, 255, 255, 0.7)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	navContainer: {
		marginBottom: 24,
	},
	navList: {
		listStyle: 'none',
		padding: 0,
		margin: 0,
	},
	navItem: {
		marginBottom: 4,
	},
	navLink: {
		display: 'flex',
		alignItems: 'center',
		gap: 10,
		padding: '10px 12px',
		color: 'rgba(255, 255, 255, 0.7)',
		textDecoration: 'none',
		borderRadius: 6,
		transition: 'all 0.2s ease',
		fontSize: 14,
	},
	navIcon: {
		display: 'inline-block',
		fontSize: 18,
		width: 24,
		height: 24,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoutSection: {
		marginTop: 'auto',
		paddingTop: 16,
		borderTop: '1px solid rgba(255, 255, 255, 0.1)',
	},
	logoutButton: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		width: '100%',
		padding: '10px 12px',
		background: 'rgba(255, 59, 48, 0.1)',
		color: '#ff3b30',
		border: '1px solid rgba(255, 59, 48, 0.3)',
		borderRadius: 6,
		textDecoration: 'none',
		fontSize: 14,
		fontWeight: 500,
		cursor: 'pointer',
		transition: 'all 0.2s ease',
	},
	main: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		marginLeft: 256,
		overflow: 'auto',
	},
	header: {
		padding: '20px 24px',
		borderBottom: '1px solid #e6eef8',
		background: '#fff',
		position: 'sticky',
		top: 0,
		zIndex: 50,
	},
	headerTitle: {
		margin: 0,
		fontSize: 24,
		fontWeight: 600,
	},
	content: {
		padding: 24,
		flex: 1,
		overflow: 'auto',
	},
	footer: {
		padding: '12px 24px',
		borderTop: '1px solid #e6eef8',
		background: '#fff',
		textAlign: 'center',
		fontSize: 14,
		color: '#6b7280',
	},
}
