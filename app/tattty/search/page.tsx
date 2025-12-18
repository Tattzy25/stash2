"use client";

import { useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const weeklyGenerations = [
	{
		day: "Monday",
		generations: 342,
		successful: 325,
		failed: 17,
		avgTime: 2.4,
	},
	{
		day: "Tuesday",
		generations: 289,
		successful: 278,
		failed: 11,
		avgTime: 2.1,
	},
	{
		day: "Wednesday",
		generations: 415,
		successful: 401,
		failed: 14,
		avgTime: 2.3,
	},
	{
		day: "Thursday",
		generations: 456,
		successful: 438,
		failed: 18,
		avgTime: 2.5,
	},
	{
		day: "Friday",
		generations: 523,
		successful: 501,
		failed: 22,
		avgTime: 2.6,
	},
	{
		day: "Saturday",
		generations: 612,
		successful: 589,
		failed: 23,
		avgTime: 2.8,
	},
	{
		day: "Sunday",
		generations: 498,
		successful: 472,
		failed: 26,
		avgTime: 2.4,
	},
];

const monthlyTrend = [
	{ month: "Week 1", users: 124, revenue: 3400, generations: 2400 },
	{ month: "Week 2", users: 156, revenue: 4200, generations: 3100 },
	{ month: "Week 3", users: 189, revenue: 5100, generations: 3800 },
	{ month: "Week 4", users: 234, revenue: 6200, generations: 4500 },
];

const modelStats = [
	{ name: "Stable Diffusion 3.5", value: 45, color: "#3b82f6" },
	{ name: "FLUX 2.1 Pro", value: 28, color: "#8b5cf6" },
	{ name: "FLUX 1.1", value: 18, color: "#ec4899" },
	{ name: "Other Models", value: 9, color: "#10b981" },
];

const recentGenerations = [
	{
		id: "GEN-10524",
		user: "Alex Chen",
		model: "SD 3.5",
		prompt: "A cyberpunk city at night",
		duration: "2.3s",
		size: "2.4 MB",
		status: "completed",
		time: "2 min ago",
	},
	{
		id: "GEN-10523",
		user: "Sarah Kim",
		model: "FLUX 2.1",
		prompt: "Modern office interior design",
		duration: "3.1s",
		size: "3.2 MB",
		status: "completed",
		time: "5 min ago",
	},
	{
		id: "GEN-10522",
		user: "Mike Johnson",
		model: "SD 3.5",
		prompt: "Fantasy landscape with mountains",
		duration: "2.8s",
		size: "2.8 MB",
		status: "completed",
		time: "12 min ago",
	},
	{
		id: "GEN-10521",
		user: "Emma Davis",
		model: "FLUX 2.1",
		prompt: "Product photography studio setup",
		duration: "3.0s",
		size: "3.1 MB",
		status: "completed",
		time: "18 min ago",
	},
	{
		id: "GEN-10520",
		user: "James Wilson",
		model: "SD 3.5",
		prompt: "Abstract art in blue tones",
		duration: "2.5s",
		size: "2.5 MB",
		status: "completed",
		time: "25 min ago",
	},
	{
		id: "GEN-10519",
		user: "Lisa Anderson",
		model: "FLUX 1.1",
		prompt: "Minimalist logo design",
		duration: "1.9s",
		size: "1.8 MB",
		status: "completed",
		time: "32 min ago",
	},
];

const activeUsers = [
	{
		id: 1,
		username: "alex_chen",
		email: "alex@example.com",
		tier: "Premium",
		joined: "Jan 15, 2025",
		lastActive: "2 min ago",
		generations: 342,
		status: "online",
	},
	{
		id: 2,
		username: "sarah_kim",
		email: "sarah@example.com",
		tier: "Pro",
		joined: "Dec 20, 2024",
		lastActive: "5 min ago",
		generations: 287,
		status: "online",
	},
	{
		id: 3,
		username: "mike_johnson",
		email: "mike@example.com",
		tier: "Free",
		joined: "Nov 10, 2024",
		lastActive: "15 min ago",
		generations: 89,
		status: "online",
	},
	{
		id: 4,
		username: "emma_davis",
		email: "emma@example.com",
		tier: "Pro",
		joined: "Oct 5, 2024",
		lastActive: "1 hour ago",
		generations: 156,
		status: "idle",
	},
	{
		id: 5,
		username: "james_wilson",
		email: "james@example.com",
		tier: "Premium",
		joined: "Sep 12, 2024",
		lastActive: "3 hours ago",
		generations: 521,
		status: "idle",
	},
	{
		id: 6,
		username: "lisa_anderson",
		email: "lisa@example.com",
		tier: "Free",
		joined: "Aug 28, 2024",
		lastActive: "1 day ago",
		generations: 42,
		status: "offline",
	},
];

const systemMetrics = [
	{ name: "API Response Time", value: 245, target: 300, unit: "ms" },
	{ name: "Database CPU", value: 34, target: 80, unit: "%" },
	{ name: "Memory Usage", value: 62, target: 85, unit: "%" },
	{ name: "Disk I/O", value: 18, target: 70, unit: "%" },
	{ name: "Network Bandwidth", value: 42, target: 90, unit: "%" },
	{ name: "Cache Hit Rate", value: 87, target: 80, unit: "%" },
];

const apiEndpoints = [
	{
		endpoint: "POST /api/generate-images",
		calls: 3420,
		errors: 12,
		avgTime: "2.4s",
		status: "healthy",
	},
	{
		endpoint: "POST /api/customize-image",
		calls: 1240,
		errors: 8,
		avgTime: "3.1s",
		status: "healthy",
	},
	{
		endpoint: "POST /api/generate-fonts",
		calls: 856,
		errors: 5,
		avgTime: "1.9s",
		status: "healthy",
	},
	{
		endpoint: "GET /api/gallery",
		calls: 2143,
		errors: 2,
		avgTime: "0.4s",
		status: "healthy",
	},
	{
		endpoint: "POST /api/upload",
		calls: 542,
		errors: 18,
		avgTime: "1.2s",
		status: "warning",
	},
	{
		endpoint: "DELETE /api/cleanup",
		calls: 12,
		errors: 0,
		avgTime: "0.8s",
		status: "healthy",
	},
];

export default function AdminPanel() {
	const [selectedTab, setSelectedTab] = useState("dashboard");
	const [searchUsers, setSearchUsers] = useState("");
	const [filterTier, setFilterTier] = useState("all");

	const totalGenerations = weeklyGenerations.reduce(
		(sum, day) => sum + day.generations,
		0,
	);
	const totalSuccessful = weeklyGenerations.reduce(
		(sum, day) => sum + day.successful,
		0,
	);
	const totalFailed = weeklyGenerations.reduce(
		(sum, day) => sum + day.failed,
		0,
	);
	const successRate = ((totalSuccessful / totalGenerations) * 100).toFixed(1);

	return (
		<div className="flex h-[calc(100svh-var(--header-height))] flex-1 flex-col overflow-hidden md:h-[calc(100svh-var(--header-height)-1rem)]">
			<div className="h-full overflow-y-auto bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
				<div className="px-4 py-4 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-7xl">
						{/* Header */}
						<div className="mb-8 flex items-center justify-between">
							<div>
								<h1 className="mb-1 text-5xl font-bold text-white">
									System Admin Panel
								</h1>
								<p className="text-sm text-gray-400">
									Real-time monitoring and management dashboard
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">Last updated: just now</p>
								<Badge className="mt-2 bg-green-600">
									All Systems Operational
								</Badge>
							</div>
						</div>

						{/* Top Level KPIs */}
						<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
							<Card className="border-zinc-700 bg-zinc-900/50 backdrop-blur">
								<CardHeader className="pb-2">
									<CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Weekly Gens
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-[#39FF14]">
										{totalGenerations}
									</div>
									<p className="mt-1 text-xs text-green-400">
										↑ 12% vs last week
									</p>
								</CardContent>
							</Card>
							<Card className="border-zinc-700 bg-zinc-900/50 backdrop-blur">
								<CardHeader className="pb-2">
									<CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Success Rate
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-blue-400">
										{successRate}%
									</div>
									<p className="mt-1 text-xs text-blue-300">Avg across week</p>
								</CardContent>
							</Card>
							<Card className="border-zinc-700 bg-zinc-900/50 backdrop-blur">
								<CardHeader className="pb-2">
									<CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Active Users
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-purple-400">284</div>
									<p className="mt-1 text-xs text-purple-300">↑ 8% this week</p>
								</CardContent>
							</Card>
							<Card className="border-zinc-700 bg-zinc-900/50 backdrop-blur">
								<CardHeader className="pb-2">
									<CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Storage Used
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-orange-400">
										2.4 GB
									</div>
									<p className="mt-1 text-xs text-orange-300">62% of 3.9 GB</p>
								</CardContent>
							</Card>
							<Card className="border-zinc-700 bg-zinc-900/50 backdrop-blur">
								<CardHeader className="pb-2">
									<CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
										Avg Response
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold text-green-400">245ms</div>
									<p className="mt-1 text-xs text-green-300">Within SLA</p>
								</CardContent>
							</Card>
						</div>

						{/* Main Tabs */}
						<Tabs
							value={selectedTab}
							onValueChange={setSelectedTab}
							className="w-full"
						>
							<TabsList className="mb-6 grid w-full grid-cols-5 bg-zinc-900/50 p-1">
								<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
								<TabsTrigger value="generations">Generations</TabsTrigger>
								<TabsTrigger value="users">Users</TabsTrigger>
								<TabsTrigger value="api">API Health</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
							</TabsList>

							{/* Dashboard Tab */}
							<TabsContent value="dashboard" className="space-y-6">
								<div className="grid gap-6 lg:grid-cols-3">
									{/* Weekly Activity */}
									<Card className="border-zinc-700 bg-zinc-900/50 lg:col-span-2">
										<CardHeader>
											<CardTitle>Weekly Activity</CardTitle>
											<CardDescription>
												Generation metrics over 7 days
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ResponsiveContainer width="100%" height={300}>
												<BarChart
													data={weeklyGenerations}
													margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
												>
													<CartesianGrid
														strokeDasharray="3 3"
														stroke="rgba(255,255,255,0.08)"
													/>
													<XAxis dataKey="day" stroke="#888" fontSize={12} />
													<YAxis stroke="#888" fontSize={12} />
													<Tooltip
														contentStyle={{
															backgroundColor: "#18181b",
															border: "1px solid #3f3f46",
															borderRadius: "8px",
														}}
														cursor={{ fill: "rgba(57,255,20,0.1)" }}
													/>
													<Legend />
													<Bar
														dataKey="successful"
														fill="#39FF14"
														name="Successful"
													/>
													<Bar dataKey="failed" fill="#ef4444" name="Failed" />
												</BarChart>
											</ResponsiveContainer>
										</CardContent>
									</Card>

									{/* Model Distribution */}
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader>
											<CardTitle>Model Usage</CardTitle>
											<CardDescription>Distribution by model</CardDescription>
										</CardHeader>
										<CardContent>
											<ResponsiveContainer width="100%" height={280}>
												<PieChart>
													<Pie
														data={modelStats}
														cx="50%"
														cy="50%"
														innerRadius={40}
														outerRadius={80}
														dataKey="value"
														paddingAngle={2}
													>
														{modelStats.map((entry, index) => (
															<Cell key={`cell-${index}`} fill={entry.color} />
														))}
													</Pie>
													<Tooltip
														contentStyle={{
															backgroundColor: "#18181b",
															border: "1px solid #3f3f46",
														}}
													/>
												</PieChart>
											</ResponsiveContainer>
											<div className="mt-4 space-y-2">
												{modelStats.map((model) => (
													<div
														key={model.name}
														className="flex items-center justify-between text-xs"
													>
														<span className="text-gray-300">{model.name}</span>
														<Badge
															variant="secondary"
															style={{ backgroundColor: model.color + "20" }}
														>
															{model.value}%
														</Badge>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Monthly Trend */}
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<CardTitle>Monthly Trend</CardTitle>
										<CardDescription>
											User growth and revenue progression
										</CardDescription>
									</CardHeader>
									<CardContent>
										<ResponsiveContainer width="100%" height={300}>
											<AreaChart
												data={monthlyTrend}
												margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
											>
												<defs>
													<linearGradient
														id="colorUsers"
														x1="0"
														y1="0"
														x2="0"
														y2="1"
													>
														<stop
															offset="5%"
															stopColor="#39FF14"
															stopOpacity={0.3}
														/>
														<stop
															offset="95%"
															stopColor="#39FF14"
															stopOpacity={0}
														/>
													</linearGradient>
													<linearGradient
														id="colorRevenue"
														x1="0"
														y1="0"
														x2="0"
														y2="1"
													>
														<stop
															offset="5%"
															stopColor="#3b82f6"
															stopOpacity={0.3}
														/>
														<stop
															offset="95%"
															stopColor="#3b82f6"
															stopOpacity={0}
														/>
													</linearGradient>
												</defs>
												<CartesianGrid
													strokeDasharray="3 3"
													stroke="rgba(255,255,255,0.08)"
												/>
												<XAxis dataKey="month" stroke="#888" fontSize={12} />
												<YAxis stroke="#888" fontSize={12} yAxisId="left" />
												<YAxis
													stroke="#888"
													fontSize={12}
													yAxisId="right"
													orientation="right"
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "#18181b",
														border: "1px solid #3f3f46",
													}}
												/>
												<Legend />
												<Area
													yAxisId="left"
													type="monotone"
													dataKey="users"
													stroke="#39FF14"
													fill="url(#colorUsers)"
													name="Active Users"
												/>
												<Area
													yAxisId="right"
													type="monotone"
													dataKey="revenue"
													stroke="#3b82f6"
													fill="url(#colorRevenue)"
													name="Revenue ($)"
												/>
											</AreaChart>
										</ResponsiveContainer>
									</CardContent>
								</Card>

								{/* System Metrics Grid */}
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<CardTitle>System Performance</CardTitle>
										<CardDescription>
											Real-time infrastructure metrics
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
											{systemMetrics.map((metric) => (
												<div key={metric.name}>
													<div className="mb-2 flex items-center justify-between">
														<span className="text-sm font-medium text-gray-300">
															{metric.name}
														</span>
														<span
															className={`text-sm font-bold ${metric.value > metric.target * 0.8 ? "text-yellow-400" : "text-green-400"}`}
														>
															{metric.value}
															{metric.unit}
														</span>
													</div>
													<Progress
														value={Math.min(metric.value, 100)}
														className="h-2 bg-zinc-700"
													/>
													<p className="mt-1 text-xs text-gray-500">
														Target: {metric.target}
														{metric.unit}
													</p>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Generations Tab */}
							<TabsContent value="generations" className="space-y-6">
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<CardTitle>Recent Generations</CardTitle>
										<CardDescription>
											Latest image generation requests
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="border-zinc-700 hover:bg-transparent">
														<TableHead className="text-gray-300">ID</TableHead>
														<TableHead className="text-gray-300">
															User
														</TableHead>
														<TableHead className="text-gray-300">
															Model
														</TableHead>
														<TableHead className="max-w-xs text-gray-300">
															Prompt
														</TableHead>
														<TableHead className="text-gray-300">
															Duration
														</TableHead>
														<TableHead className="text-gray-300">
															Size
														</TableHead>
														<TableHead className="text-gray-300">
															Status
														</TableHead>
														<TableHead className="text-gray-300">
															Time
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{recentGenerations.map((gen) => (
														<TableRow
															key={gen.id}
															className="border-zinc-700 hover:bg-zinc-800/30"
														>
															<TableCell className="font-mono text-xs text-[#39FF14]">
																{gen.id}
															</TableCell>
															<TableCell className="text-sm text-white">
																{gen.user}
															</TableCell>
															<TableCell className="text-sm text-gray-300">
																{gen.model}
															</TableCell>
															<TableCell className="max-w-xs truncate text-xs text-gray-400">
																{gen.prompt}
															</TableCell>
															<TableCell className="text-xs text-gray-300">
																{gen.duration}
															</TableCell>
															<TableCell className="text-xs text-gray-300">
																{gen.size}
															</TableCell>
															<TableCell>
																<Badge className="bg-green-600">
																	{gen.status}
																</Badge>
															</TableCell>
															<TableCell className="text-xs text-gray-500">
																{gen.time}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</CardContent>
								</Card>

								{/* Generation Stats */}
								<div className="grid gap-6 lg:grid-cols-4">
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">
												Total Generations
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-[#39FF14]">
												{totalGenerations}
											</div>
											<p className="mt-1 text-xs text-gray-500">This week</p>
										</CardContent>
									</Card>
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">Successful</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-green-400">
												{totalSuccessful}
											</div>
											<p className="mt-1 text-xs text-gray-500">Completed</p>
										</CardContent>
									</Card>
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">Failed</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-red-400">
												{totalFailed}
											</div>
											<p className="mt-1 text-xs text-gray-500">Errors</p>
										</CardContent>
									</Card>
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader className="pb-2">
											<CardTitle className="text-sm">Avg Time</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold text-blue-400">
												2.51s
											</div>
											<p className="mt-1 text-xs text-gray-500">Per image</p>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Users Tab */}
							<TabsContent value="users" className="space-y-6">
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>User Management</CardTitle>
												<CardDescription>
													Active users and account details
												</CardDescription>
											</div>
											<Button className="bg-[#39FF14] text-black hover:bg-[#2bc910]">
												+ Add User
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex gap-3">
											<Input
												placeholder="Search by username or email..."
												value={searchUsers}
												onChange={(e) => setSearchUsers(e.target.value)}
												className="border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500"
											/>
											<Select value={filterTier} onValueChange={setFilterTier}>
												<SelectTrigger className="w-40 border-zinc-700 bg-zinc-800 text-white">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="border-zinc-700 bg-zinc-800">
													<SelectItem value="all">All Tiers</SelectItem>
													<SelectItem value="premium">Premium</SelectItem>
													<SelectItem value="pro">Pro</SelectItem>
													<SelectItem value="free">Free</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="border-zinc-700 hover:bg-transparent">
														<TableHead className="w-8">
															<Checkbox />
														</TableHead>
														<TableHead className="text-gray-300">
															Username
														</TableHead>
														<TableHead className="text-gray-300">
															Email
														</TableHead>
														<TableHead className="text-gray-300">
															Tier
														</TableHead>
														<TableHead className="text-gray-300">
															Joined
														</TableHead>
														<TableHead className="text-gray-300">
															Generations
														</TableHead>
														<TableHead className="text-gray-300">
															Last Active
														</TableHead>
														<TableHead className="text-gray-300">
															Status
														</TableHead>
														<TableHead className="text-right text-gray-300">
															Actions
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{activeUsers.map((user) => (
														<TableRow
															key={user.id}
															className="border-zinc-700 hover:bg-zinc-800/30"
														>
															<TableCell>
																<Checkbox />
															</TableCell>
															<TableCell className="font-medium text-white">
																{user.username}
															</TableCell>
															<TableCell className="text-sm text-gray-400">
																{user.email}
															</TableCell>
															<TableCell>
																<Badge
																	variant="outline"
																	className={`${
																		user.tier === "Premium"
																			? "border-yellow-600 bg-yellow-950 text-yellow-300"
																			: user.tier === "Pro"
																				? "border-blue-600 bg-blue-950 text-blue-300"
																				: "border-gray-600 bg-gray-950 text-gray-300"
																	}`}
																>
																	{user.tier}
																</Badge>
															</TableCell>
															<TableCell className="text-xs text-gray-400">
																{user.joined}
															</TableCell>
															<TableCell className="text-sm text-gray-300">
																{user.generations}
															</TableCell>
															<TableCell className="text-xs text-gray-400">
																{user.lastActive}
															</TableCell>
															<TableCell>
																<Badge
																	variant={
																		user.status === "online"
																			? "default"
																			: "secondary"
																	}
																	className={
																		user.status === "online"
																			? "bg-green-600"
																			: user.status === "idle"
																				? "bg-yellow-600"
																				: "bg-gray-600"
																	}
																>
																	{user.status}
																</Badge>
															</TableCell>
															<TableCell className="text-right">
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button
																			variant="ghost"
																			size="sm"
																			className="text-gray-400 hover:text-white"
																		>
																			⋯
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent
																		align="end"
																		className="border-zinc-700 bg-zinc-800"
																	>
																		<DropdownMenuLabel>
																			Actions
																		</DropdownMenuLabel>
																		<DropdownMenuSeparator className="bg-zinc-700" />
																		<DropdownMenuItem className="text-gray-200 focus:bg-zinc-700 focus:text-white cursor-pointer">
																			View Profile
																		</DropdownMenuItem>
																		<DropdownMenuItem className="text-gray-200 focus:bg-zinc-700 focus:text-white cursor-pointer">
																			Edit User
																		</DropdownMenuItem>
																		<DropdownMenuItem className="text-gray-200 focus:bg-zinc-700 focus:text-white cursor-pointer">
																			View Activity
																		</DropdownMenuItem>
																		<DropdownMenuSeparator className="bg-zinc-700" />
																		<DropdownMenuItem className="text-red-400 focus:bg-red-950 focus:text-red-300 cursor-pointer">
																			Suspend User
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* API Health Tab */}
							<TabsContent value="api" className="space-y-6">
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<CardTitle>API Endpoints Status</CardTitle>
										<CardDescription>
											Real-time API health monitoring
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto">
											<Table>
												<TableHeader>
													<TableRow className="border-zinc-700 hover:bg-transparent">
														<TableHead className="text-gray-300">
															Endpoint
														</TableHead>
														<TableHead className="text-gray-300">
															Requests
														</TableHead>
														<TableHead className="text-gray-300">
															Errors
														</TableHead>
														<TableHead className="text-gray-300">
															Error Rate
														</TableHead>
														<TableHead className="text-gray-300">
															Avg Response
														</TableHead>
														<TableHead className="text-gray-300">
															Status
														</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{apiEndpoints.map((endpoint) => {
														const errorRate = (
															(endpoint.errors / endpoint.calls) *
															100
														).toFixed(2);
														return (
															<TableRow
																key={endpoint.endpoint}
																className="border-zinc-700 hover:bg-zinc-800/30"
															>
																<TableCell className="font-mono text-xs text-gray-300">
																	{endpoint.endpoint}
																</TableCell>
																<TableCell className="text-sm text-white">
																	{endpoint.calls.toLocaleString()}
																</TableCell>
																<TableCell
																	className={`text-sm font-semibold ${endpoint.errors > 10 ? "text-red-400" : "text-green-400"}`}
																>
																	{endpoint.errors}
																</TableCell>
																<TableCell
																	className={`text-sm ${endpoint.errors > 10 ? "text-red-400" : "text-green-400"}`}
																>
																	{errorRate}%
																</TableCell>
																<TableCell className="text-sm text-gray-300">
																	{endpoint.avgTime}
																</TableCell>
																<TableCell>
																	<Badge
																		className={
																			endpoint.status === "healthy"
																				? "bg-green-600"
																				: "bg-yellow-600"
																		}
																	>
																		{endpoint.status}
																	</Badge>
																</TableCell>
															</TableRow>
														);
													})}
												</TableBody>
											</Table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Settings Tab */}
							<TabsContent value="settings" className="space-y-6">
								<div className="grid gap-6 lg:grid-cols-2">
									{/* Configuration */}
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader>
											<CardTitle>System Configuration</CardTitle>
											<CardDescription>Core system settings</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="space-y-2">
												<Label htmlFor="queue-size">Max Queue Size</Label>
												<Input
													id="queue-size"
													type="number"
													defaultValue="500"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="timeout">
													Request Timeout (seconds)
												</Label>
												<Input
													id="timeout"
													type="number"
													defaultValue="60"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="max-workers">Max Worker Threads</Label>
												<Input
													id="max-workers"
													type="number"
													defaultValue="8"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="rate-limit">Rate Limit (req/min)</Label>
												<Select defaultValue="1000">
													<SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="border-zinc-700 bg-zinc-800">
														<SelectItem value="500">500 req/min</SelectItem>
														<SelectItem value="1000">1000 req/min</SelectItem>
														<SelectItem value="5000">5000 req/min</SelectItem>
														<SelectItem value="unlimited">Unlimited</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<Separator className="bg-zinc-700" />
											<div className="flex gap-3">
												<Button
													variant="outline"
													className="border-zinc-600 text-white hover:bg-zinc-800"
												>
													Reset to Default
												</Button>
												<Button className="bg-[#39FF14] text-black hover:bg-[#2bc910]">
													Save Changes
												</Button>
											</div>
										</CardContent>
									</Card>

									{/* Quick Actions */}
									<Card className="border-zinc-700 bg-zinc-900/50">
										<CardHeader>
											<CardTitle>System Actions</CardTitle>
											<CardDescription>Administrative controls</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3">
											<Button className="w-full justify-start bg-zinc-800 text-white hover:bg-zinc-700">
												🔄 Restart Service
											</Button>
											<Button className="w-full justify-start bg-zinc-800 text-white hover:bg-zinc-700">
												💾 Backup Database
											</Button>
											<Button className="w-full justify-start bg-zinc-800 text-white hover:bg-zinc-700">
												📊 Export Logs
											</Button>
											<Button className="w-full justify-start bg-zinc-800 text-white hover:bg-zinc-700">
												🔍 Run Health Check
											</Button>
											<Separator className="bg-zinc-700" />
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button className="w-full justify-start bg-red-900 text-red-200 hover:bg-red-800">
														🗑️ Clear Cache
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent className="border-zinc-700 bg-zinc-900">
													<AlertDialogTitle>
														Clear System Cache
													</AlertDialogTitle>
													<AlertDialogDescription className="text-gray-400">
														This action will clear all cached data. This cannot
														be undone. System performance may temporarily
														decrease while cache rebuilds.
													</AlertDialogDescription>
													<div className="flex gap-3">
														<AlertDialogCancel className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
															Cancel
														</AlertDialogCancel>
														<AlertDialogAction className="bg-red-600 hover:bg-red-700">
															Clear Cache
														</AlertDialogAction>
													</div>
												</AlertDialogContent>
											</AlertDialog>
										</CardContent>
									</Card>
								</div>

								{/* Advanced Settings */}
								<Card className="border-zinc-700 bg-zinc-900/50">
									<CardHeader>
										<CardTitle>Advanced Settings</CardTitle>
										<CardDescription>
											Fine-tune system parameters
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-6 sm:grid-cols-2">
											<div className="space-y-2">
												<Label htmlFor="cache-ttl">Cache TTL (minutes)</Label>
												<Input
													id="cache-ttl"
													type="number"
													defaultValue="60"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="log-level">Log Level</Label>
												<Select defaultValue="info">
													<SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
														<SelectValue />
													</SelectTrigger>
													<SelectContent className="border-zinc-700 bg-zinc-800">
														<SelectItem value="debug">Debug</SelectItem>
														<SelectItem value="info">Info</SelectItem>
														<SelectItem value="warn">Warn</SelectItem>
														<SelectItem value="error">Error</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="max-retries">Max API Retries</Label>
												<Input
													id="max-retries"
													type="number"
													defaultValue="3"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="storage-threshold">
													Storage Alert Threshold (%)
												</Label>
												<Input
													id="storage-threshold"
													type="number"
													defaultValue="80"
													className="border-zinc-700 bg-zinc-800 text-white"
												/>
											</div>
										</div>
										<Separator className="my-6 bg-zinc-700" />
										<div className="flex justify-end gap-3">
											<Button
												variant="outline"
												className="border-zinc-600 text-white hover:bg-zinc-800"
											>
												Discard
											</Button>
											<Button className="bg-[#39FF14] text-black hover:bg-[#2bc910]">
												Apply Settings
											</Button>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}
