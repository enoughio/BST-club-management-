// import React from 'react'
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'

// import { logout }  from "../actions"

// export const metadata = {
// 	title: 'Dashboards',
// 	description: 'Common dashboard layout',
// }

// export default async function DashboardLayout({ children }) {
// 	const cookieStore = await cookies()
// 	const role = cookieStore.get('x-bst-user-role')?.value

// 	const navByRole = {
// 		admin: [
// 			{ label: 'Overview', href: '/admin/dashboard', icon: '📊' },
// 			{ label: 'Club Details', href: '/admin/club-details', icon: '🏢' },
// 			{ label: 'Members', href: '/admin/members', icon: '👥' },
// 			{ label: 'Add Member', href: '/admin/members/add', icon: '➕' },
// 			{ label: 'Meetings', href: '/admin/meetings', icon: '🕐' },
// 			{ label: 'Events', href: '/admin/events', icon: '📅' },
// 			{ label: 'Projects', href: '/admin/projects', icon: '📈' },
// 			{ label: 'Requests', href: '/admin/requests', icon: '🚩' },
// 		],
// 		member: [
// 			{ label: 'Overview', href: '/member/dashboard', icon: '📊' },
// 			{ label: 'My Clubs', href: '/member/club', icon: '🏢' },
// 			{ label: 'Events', href: '/member/events', icon: '📅' },
// 			{ label: 'My Projects', href: '/member/projects', icon: '📈' },
// 			{ label: 'Profile', href: '/member/profile', icon: '👤' },
// 		],
// 		superadmin: [
// 			{ label: 'Overview', href: '/superadmin/dashboard', icon: '📊' },
// 			{ label: 'Clubs', href: '/superadmin/clubs', icon: '🏢' },
// 			{ label: 'Club Admins', href: '/superadmin/club-admins', icon: '👥' },
// 			{ label: 'Members', href: '/superadmin/members', icon: '👨‍💼' },
// 			{ label: 'Events', href: '/superadmin/events', icon: '📅' },
// 			{ label: 'Projects', href: '/superadmin/projects', icon: '📈' },
// 			{ label: 'Requests', href: '/superadmin/requests', icon: '🔔' },
// 			{ label: 'Settings', href: '/superadmin/settings', icon: '⚙️' },
// 		],

// 	}

// 	// if role is not set, redirect to login
// 	// if (!role) {
// 	// 	redirect('/login')
// 	// }

// 	const navItems = navByRole[role] ?? []
// 	let roleTitle = "User"
// 	if (role === 'admin') roleTitle = "Club Admin"
// 	else if (role === 'member') roleTitle = "Member"
// 	else if (role === 'superadmin') roleTitle = "Super Admin"


// 	return (
// 		<div lang="en">
// 			{/* <head /> */}
// 			<div style={styles.body}>
// 				<div style={styles.container}>
// 					<aside style={styles.sidebar}>
// 						{/* Brand */}
// 						<div style={styles.brandSection}>
// 							<h2 style={styles.brand}>Bharat Storytellers</h2>
// 						</div>

// 						{/* User Profile Section */}
// 						<div style={styles.userSection}>
// 							<div style={styles.avatarContainer}>
// 								<div style={styles.avatar}>{roleTitle.charAt(0)}</div>
// 							</div>
// 							<div style={styles.userInfo}>
								import React from 'react'
								import { cookies } from 'next/headers'
								import { redirect } from 'next/navigation'
								import Link from 'next/link'

								import { logout } from '../actions'

								export const metadata = {
									title: 'Dashboards',
									description: 'Common dashboard layout',
								}

								export default async function DashboardLayout({ children }) {
									const cookieStore = await cookies()
									const role = cookieStore.get('x-bst-user-role')?.value

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
									}

									// if role is not set, redirect to login
									// if (!role) {
									//   redirect('/login')
									// }

									const navItems = navByRole[role] ?? []
									let roleTitle = 'User'
									if (role === 'admin') roleTitle = 'Club Admin'
									else if (role === 'member') roleTitle = 'Member'
									else if (role === 'superadmin') roleTitle = 'Super Admin'

									return (
										<div lang="en" className="min-h-screen bg-white text-slate-900">
											<div className="flex">
												<aside className="w-64 fixed left-0 top-0 h-screen overflow-auto z-40 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 shadow-lg">
													{/* Brand */}
													<div className="mb-6">
														<h2 className="text-lg font-bold tracking-wide">Bharat Storytellers</h2>
													</div>

													{/* User Profile Section */}
													<div className="flex items-center gap-3 mb-6 p-3 rounded bg-white/5">
														<div className="flex-shrink-0">
															<div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-semibold">{roleTitle.charAt(0)}</div>
														</div>
														<div className="min-w-0">
															<p className="m-0 text-sm font-semibold truncate">{roleTitle} User</p>
															<p className="m-0 text-xs text-white/70 truncate">user@example.com</p>
														</div>
													</div>

													{/* Navigation */}
													<nav className="mb-6">
														<ul className="space-y-1">
															{navItems.map((item) => (
																<li key={item.href}>
																	<Link href={item.href} className="flex items-center gap-3 px-3 py-2 rounded text-white/80 hover:bg-white/5">
																		<span className="text-lg w-6 h-6 flex items-center justify-center">{item.icon}</span>
																		<span className="text-sm">{item.label}</span>
																	</Link>
																</li>
															))}
														</ul>
													</nav>

													{/* Logout Button */}
													<div className="mt-auto pt-4 border-t border-white/10">
														<div className="">
															<form action={logout}>
																<button type="submit" className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50/10 text-red-500 border border-red-500/30 rounded font-medium hover:bg-red-50/20">Logout</button>
															</form>
														</div>
													</div>
												</aside>

												<main className="flex-1 ml-64 w-full">
													<header className="sticky top-0 z-30 bg-white border-b border-slate-100">
														<div className="px-6 py-5">
															<h1 className="m-0 text-2xl font-semibold">Dashboard</h1>
														</div>
													</header>

													<section className="p-6 min-h-[calc(100vh-64px)]">{children}</section>

													<footer className="p-3 border-t border-slate-100 bg-white text-center text-sm text-slate-500">© {new Date().getFullYear()} Portal</footer>
												</main>
											</div>
										</div>
									)
								}